/**
 * Gerenciador de interface e feedback visual
 */
import { PRIORITY_CONFIG, CONFIG, TOAST_TYPES } from "./config.js";

export class UIManager {
  constructor(domManager, appState) {
    this.dom = domManager;
    this.state = appState;
  }

  showLoading() {
    const resultDiv = this.dom.get("resultDiv");
    const submitBtn = this.dom.get("submitBtn");
    const progressBar = this.dom.get("progressBar");

    this.dom.show(resultDiv);
    resultDiv.innerHTML = `
      <div class="card p-6 text-center">
        <div class="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-700">Classificando email...</p>
      </div>
    `;

    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-text").textContent = "Classificando...";
    submitBtn.querySelector(".btn-icon i").className = "fas fa-spinner fa-spin";

    progressBar.style.width = "30%";
    this.state.startProcessing();
  }

  showSuccess(data) {
    const resultDiv = this.dom.get("resultDiv");
    const isProductive = data.categoria === "Produtivo";
    const cssClass = isProductive ? "result-success" : "result-warning";
    const icon = isProductive ? "✅" : "⚠️";

    const priority = PRIORITY_CONFIG[data.prioridade] || {
      icon: "⚪",
      color: "#666",
      label: "Sem Prioridade",
    };

    let resultHTML = `
      <div class="card p-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="text-3xl">${icon}</div>
          <h3 class="text-xl font-semibold">Classificação: ${
            data.categoria
          }</h3>
        </div>
        <div class="p-4 mb-4 rounded-lg ${
          isProductive ? "bg-green-50" : "bg-yellow-50"
        } border-l-4 border-${isProductive ? "green" : "yellow"}-500">
          <p class="font-medium text-${
            isProductive ? "green" : "yellow"
          }-800">${priority.icon} ${priority.label}</p>
        </div>
    `;

    if (data.categoria === "Produtivo") {
      resultHTML += `<p><strong>Este email requer ação ou resposta.</strong></p>`;
    } else if (data.categoria === "Improdutivo") {
      resultHTML += `<p><strong>Este email não requer ação imediata.</strong></p>`;
    }
    // Adiciona a resposta sugerida se existir

    if (data.reply) {
      resultHTML += `
        <div class="mt-5 pt-5 border-t border-gray-200">
          <div class="flex justify-between items-center mb-3">
            <h4 class="text-lg font-medium">💬 Resposta Sugerida</h4>
            <button onclick="this.closest('div').querySelector('pre').classList.toggle('max-h-96')" 
                    class="text-sm text-blue-600 hover:text-blue-800">
              Expandir/Recolher
            </button>
          </div>
          <pre class="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap font-sans overflow-y-auto max-h-32 transition-all duration-300">${data.reply}</pre>
        </div>
      `;
    }
    // Adiciona a análise detalhada se existir
    if (data.detailed_analysis) {
      resultHTML += `
        <div class="mt-5 pt-5 border-t border-gray-200">
          <h4 class="text-lg font-medium mb-3">🔍 Análise Detalhada</h4>
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            ${data.detailed_analysis}
          </div>
        </div>
      `;
    }

    // Adiciona a resposta sugerida se existir

    resultHTML += `</div>`;
    resultDiv.innerHTML = resultHTML;
  }

  showError(message) {
    const resultDiv = this.dom.get("resultDiv");
    this.dom.show(resultDiv);
    resultDiv.innerHTML = `
      <div class="result-content result-error">
        <h3>❌ Erro</h3>
        <p>${message}</p>
      </div>
    `;
    this.resetButton();
  }

  resetButton() {
    const submitBtn = this.dom.get("submitBtn");
    const progressBar = this.dom.get("progressBar");

    submitBtn.disabled = false;
    submitBtn.querySelector(".btn-text").textContent = "Classificar Email";
    submitBtn.querySelector(".btn-icon i").className = "fas fa-paper-plane";
    progressBar.style.width = "0%";
    this.state.reset();
  }

  showToast(message, type = TOAST_TYPES.INFO) {
    const toastContainer = this.dom.get("toastContainer");

    // Mapeia os tipos para classes do Tailwind
    const typeClasses = {
      [TOAST_TYPES.SUCCESS]: "bg-green-100 text-green-800 border-green-300",
      [TOAST_TYPES.ERROR]: "bg-red-100 text-red-800 border-red-300",
      [TOAST_TYPES.WARNING]: "bg-yellow-100 text-yellow-800 border-yellow-300",
      [TOAST_TYPES.INFO]: "bg-blue-100 text-blue-800 border-blue-300",
    };

    const iconClasses = {
      [TOAST_TYPES.SUCCESS]: "fas fa-check-circle text-green-500",
      [TOAST_TYPES.ERROR]: "fas fa-exclamation-circle text-red-500",
      [TOAST_TYPES.WARNING]: "fas fa-exclamation-triangle text-yellow-500",
      [TOAST_TYPES.INFO]: "fas fa-info-circle text-blue-500",
    };

    const toast = this.dom.createElement(
      "div",
      `
      fixed bottom-4 right-4 p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 translate-x-full opacity-0
      ${typeClasses[type] || typeClasses[TOAST_TYPES.INFO]}
    `
    );

    const icon = iconClasses[type] || iconClasses[TOAST_TYPES.INFO];

    toast.innerHTML = `
      <div class="flex items-start">
        <i class="${icon} mt-0.5 mr-3 text-xl"></i>
        <span class="flex-1">${message}</span>
        <button class="ml-4 text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Força o navegador a reconhecer a mudança de estado
    setTimeout(() => {
      toast.classList.remove("translate-x-full", "opacity-0");
      toast.classList.add("translate-x-0", "opacity-100");
    }, 10);

    // Remove o toast após o tempo definido
    setTimeout(() => {
      toast.classList.add("translate-x-full", "opacity-0");
      setTimeout(() => toast.remove(), 300);
    }, CONFIG.TOAST_DURATION);
  }

  updateStats() {
    const emailsProcessedEl = this.dom.get("emailsProcessedEl");
    const avgTimeEl = this.dom.get("avgTimeEl");

    if (emailsProcessedEl)
      emailsProcessedEl.textContent = this.state.emailsProcessed;
    if (avgTimeEl) avgTimeEl.textContent = this.state.getAverageTime() + "s";
  }

  updateProgressBar(percentage) {
    const progressBar = this.dom.get("progressBar");
    progressBar.style.width = `${percentage}%`;
  }
}
