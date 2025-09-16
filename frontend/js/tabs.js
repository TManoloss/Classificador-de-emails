/**
 * Gerenciador de abas e opções avançadas
 */
export class TabManager {
  constructor(domManager, fileHandler) {
    this.dom = domManager;
    this.fileHandler = fileHandler;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Event listeners para abas
    this.dom.getAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.dataset.tab;
        this.switchTab(targetTab);
      });
    });

    // Event listener para opções avançadas
    const optionsToggle = this.dom.get('optionsToggle');
    if (optionsToggle) {
      optionsToggle.addEventListener("click", () => this.toggleAdvancedOptions());
    }

    // Event listener para contador de caracteres
    const textArea = this.dom.get('textArea');
    const charCount = this.dom.get('charCount');
    
    if (textArea && charCount) {
      textArea.addEventListener("input", () => {
        const count = textArea.value.length;
        charCount.textContent = `${count}/5000`;

        charCount.className = 'text-sm';
        if (count > 4500) {
          charCount.classList.add('text-red-600');
        } else if (count > 4000) {
          charCount.classList.add('text-yellow-500');
        } else {
          charCount.classList.add('text-gray-500');
        }
      });
    }

    // Limpar arquivo quando texto é digitado
    if (textArea) {
      textArea.addEventListener("input", () => {
        if (textArea.value.trim() && this.fileHandler.getSelectedFile()) {
          this.fileHandler.clearFileSelection();
        }
      });
    }
  }

  switchTab(tabName) {
    // Atualizar botões
    this.dom.getAll(".tab-btn").forEach((btn) => {
      this.dom.toggle(btn, "active");
      if (btn.dataset.tab === tabName) {
        this.dom.addClass(btn, "active");
      } else {
        this.dom.removeClass(btn, "active");
      }
    });

    // Atualizar conteúdo
    this.dom.getAll(".tab-content").forEach((content) => {
      this.dom.toggle(content, "active");
      if (content.id === `${tabName}-tab`) {
        this.dom.addClass(content, "active");
      } else {
        this.dom.removeClass(content, "active");
      }
    });

    // Limpar campos ao trocar aba
    if (tabName === "text") {
      this.fileHandler.clearFileSelection();
    } else {
      const textArea = this.dom.get('textArea');
      const charCount = this.dom.get('charCount');
      if (textArea) textArea.value = "";
      if (charCount) charCount.textContent = "0/5000";
    }
  }

  toggleAdvancedOptions() {
    const optionsContent = this.dom.get('optionsContent');
    const optionsToggle = this.dom.get('optionsToggle');
    
    if (!optionsContent || !optionsToggle) return;

    const isExpanded = optionsContent.classList.contains("expanded");

    if (isExpanded) {
      this.dom.removeClass(optionsContent, "expanded");
      const toggleIcon = optionsToggle.querySelector(".toggle-icon");
      if (toggleIcon) {
        toggleIcon.className = "fas fa-chevron-down toggle-icon";
      }
    } else {
      this.dom.addClass(optionsContent, "expanded");
      const toggleIcon = optionsToggle.querySelector(".toggle-icon");
      if (toggleIcon) {
        toggleIcon.className = "fas fa-chevron-up toggle-icon";
      }
    }
  }

  getFormOptions() {
    const genReply = document.getElementById("gen_reply")?.checked || false;
    const detailedAnalysis = document.getElementById("detailed_analysis")?.checked || false;
    
    return {
      generateReply: genReply,
      detailedAnalysis: detailedAnalysis
    };
  }

  getTextContent() {
    const textArea = this.dom.get('textArea');
    return textArea?.value.trim() || '';
  }
}
