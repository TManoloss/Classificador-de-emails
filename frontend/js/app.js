/**
 * Aplicação principal - Email Classifier
 * Orquestra todos os módulos da aplicação
 */
import { DOMManager } from "./dom.js";
import { AppState } from "./state.js";
import { UIManager } from "./ui.js";
import { HistoryManager } from "./history.js";
import { APIManager } from "./api.js";
import { FileHandler } from "./file-handler.js";
import { TabManager } from "./tabs.js";
import { Utils } from "./utils.js";
import { TOAST_TYPES } from "./config.js";

class EmailClassifierApp {
  constructor() {
    this.dom = new DOMManager();
    this.state = new AppState();
    this.ui = new UIManager(this.dom, this.state);
    this.history = new HistoryManager(this.dom);
    this.api = new APIManager();
    this.fileHandler = new FileHandler(this.dom, this.ui);
    this.tabManager = new TabManager(this.dom, this.fileHandler);

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeUI();
  }

  setupEventListeners() {
    // Form submission
    const form = this.dom.get("form");
    if (form) {
      form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    }

    // Clear history button
    const clearHistoryBtn = this.dom.get("clearHistoryBtn");
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener("click", () => this.clearHistory());
    }
  }

  initializeUI() {
    // Criar partículas de fundo
    Utils.createParticles();

    // Carregar histórico
    this.history.updateHistoryDisplay();

    // Atualizar estatísticas
    this.ui.updateStats();
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const textContent = this.tabManager.getTextContent();
    const file = this.fileHandler.getSelectedFile();
    const options = this.tabManager.getFormOptions();

    // Validação
    console.log("🔍 Iniciando validação...");
    console.log("📝 Texto para validar:", textContent);
    console.log("📁 Arquivo para validar:", file ? file.name : "Nenhum");

    const validation = Utils.validateEmail(textContent, file);
    console.log("✅ Resultado da validação:", validation);

    if (!validation.valid) {
      console.log("❌ Validação falhou:", validation.message);
      this.ui.showError(validation.message);
      return;
    }

    console.log("✅ Validação passou, prosseguindo...");

    // Mostrar loading
    this.ui.showLoading();

    try {
      // Preparar dados
      const formData = this.api.createFormData(
        textContent,
        file,
        options.generateReply,
        options.detailedAnalysis
      );

      // Atualizar progresso
      this.ui.updateProgressBar(60);

      // Fazer requisição
      const data = await this.api.classifyEmail(formData);

      // Log detalhado da resposta da API
      console.log("🤖 Resposta completa da API:", data);
      console.log("📊 Categoria retornada:", data.categoria);
      console.log("🎯 Prioridade retornada:", data.prioridade);
      console.log("📝 Texto enviado:", textContent);
      console.log(
        "📏 Tamanho do texto:",
        textContent ? textContent.length : "N/A"
      );

      // Atualizar progresso
      this.ui.updateProgressBar(90);

      // Processar resultado
      await this.processResult(data, textContent, file);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.ui.resetButton();
    }
  }

  async processResult(data, textContent, file) {
    // Calcular tempo de processamento
    const processingTime = this.state.getProcessingTime();

    // Log detalhado do processamento
    console.log("⚙️ Processando resultado...");
    console.log("🔍 Verificando categoria:", data.categoria);
    console.log("❓ Categoria é null?", data.categoria === null);
    console.log("❓ Categoria é undefined?", data.categoria === undefined);
    console.log("❓ Categoria é string vazia?", data.categoria === "");

    // Atualizar estatísticas
    this.state.updateProcessingStats(processingTime);
    this.ui.updateStats();

    // Finalizar progresso
    this.ui.updateProgressBar(100);

    if (data.error) {
      console.log("❌ Erro detectado:", data.error);
      this.ui.showError(data.error);
      this.ui.showToast("Erro ao classificar email", TOAST_TYPES.ERROR);
    } else if (
      data.categoria === null ||
      data.categoria === undefined ||
      data.categoria === ""
    ) {
      console.log("⚠️ Categoria nula/indefinida detectada");
      console.log("📋 Dados recebidos:", JSON.stringify(data, null, 2));
      this.ui.showError(
        "Não foi possível classificar este email com confiança suficiente. Isso pode acontecer com textos muito curtos ou ambíguos. Tente adicionar mais contexto ou reformular o conteúdo."
      );
      this.ui.showToast("Classificação inconclusiva", TOAST_TYPES.WARNING);
    } else {
      console.log("✅ Classificação bem-sucedida!");
      console.log("📊 Categoria final:", data.categoria);
      console.log("🎯 Prioridade final:", data.prioridade);

      // Mostrar resultado
      this.ui.showSuccess(data);

      // Adicionar ao histórico
      this.history.addToHistory({
        text: textContent || "Arquivo enviado",
        categoria: data.categoria,
        prioridade: data.prioridade,
        processingTime: processingTime,
      });

      // Mostrar toast de sucesso
      const toastType =
        data.categoria === "Produtivo"
          ? TOAST_TYPES.SUCCESS
          : TOAST_TYPES.WARNING;
      this.ui.showToast(`Email classificado como ${data.categoria}`, toastType);
    }
  }

  handleError(error) {
    console.error("❌ Erro capturado:", error);
    console.error("📋 Detalhes do erro:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    if (error.message.includes("conexão")) {
      console.log("🔌 Erro de conexão detectado");
      this.ui.showError(
        "Erro de conexão. Verifique se o servidor está rodando."
      );
      this.ui.showToast("Erro de conexão com o servidor", TOAST_TYPES.ERROR);
    } else {
      console.log("⚠️ Erro genérico detectado");
      this.ui.showError(error.message || "Erro inesperado. Tente novamente.");
      this.ui.showToast("Erro inesperado", TOAST_TYPES.ERROR);
    }
  }

  clearHistory() {
    this.history.clearHistory();
    this.ui.showToast("Histórico limpo com sucesso", TOAST_TYPES.SUCCESS);
  }
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  new EmailClassifierApp();
});
