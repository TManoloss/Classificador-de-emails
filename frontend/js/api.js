// js/api.js
import { CONFIG } from "./config.js";

export class APIManager {
  constructor() {
    // usa CONFIG importado ou fallback para /classify
    this.baseURL = (CONFIG && CONFIG.API_URL) || "/classify";
    console.log("[APIManager] baseURL =", this.baseURL);
  }

  async classifyEmail(formData) {
    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        body: formData,
      });

      // tenta parse JSON com fallback para texto
      const text = await response.text().catch(() => null);

      if (!response.ok) {
        let errorMsg = `Erro HTTP: ${response.status}`;
        try {
          const json = text ? JSON.parse(text) : null;
          errorMsg = (json && (json.error || json.message)) || errorMsg;
        } catch (e) {
          // text não é JSON
          errorMsg = text || errorMsg;
        }
        throw new Error(errorMsg);
      }

      // se veio texto, tenta parse; caso contrário retorna objeto vazio
      try {
        return text ? JSON.parse(text) : {};
      } catch (e) {
        // resposta não era JSON, mas devolve texto em campo message
        return { message: text };
      }
    } catch (error) {
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Erro de conexão. Verifique se o servidor está rodando."
        );
      }
      throw error;
    }
  }

  // normalize booleans como strings para garantir compatibilidade no backend
  createFormData(textContent, file, generateReply, detailedAnalysis) {
    const formData = new FormData();
    if (textContent) formData.append("text", textContent);
    if (file) formData.append("file", file);
    formData.append("gen_reply", generateReply ? "true" : "false");
    formData.append("detailed_analysis", detailedAnalysis ? "true" : "false");
    return formData;
  }
}
