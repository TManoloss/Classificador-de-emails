/**
 * Gerenciador de comunicação com API
 */
import { CONFIG } from './config.js';

export class APIManager {
  constructor() {
    this.baseURL = CONFIG.API_URL;
  }

  async classifyEmail(formData) {
    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Erro de conexão. Verifique se o servidor está rodando.");
      }
      throw error;
    }
  }

  createFormData(textContent, file, generateReply, detailedAnalysis) {
    const formData = new FormData();
    
    if (textContent) formData.append("text", textContent);
    if (file) formData.append("file", file);
    formData.append("gen_reply", generateReply);
    formData.append("detailed_analysis", detailedAnalysis);
    
    return formData;
  }
}
