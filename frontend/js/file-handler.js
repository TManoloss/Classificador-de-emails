/**
 * Gerenciador de arquivos e drag & drop
 */
import { CONFIG, TOAST_TYPES } from './config.js';

export class FileHandler {
  constructor(domManager, uiManager) {
    this.dom = domManager;
    this.ui = uiManager;
    this.setupEventListeners();
  }

  setupEventListeners() {
    const fileInput = this.dom.get('fileInput');
    const fileUploadArea = this.dom.get('fileUploadArea');
    const removeFileBtn = this.dom.get('removeFileBtn');

    // File input change
    fileInput?.addEventListener("change", (e) => this.handleFileSelect(e));
    
    // Remove file button
    removeFileBtn?.addEventListener("click", () => this.clearFileSelection());

    // Drag & Drop events
    if (fileUploadArea) {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        fileUploadArea.addEventListener(eventName, this.preventDefaults, false);
      });

      ["dragenter", "dragover"].forEach((eventName) => {
        fileUploadArea.addEventListener(eventName, () => this.highlight(), false);
      });

      ["dragleave", "drop"].forEach((eventName) => {
        fileUploadArea.addEventListener(eventName, () => this.unhighlight(), false);
      });

      fileUploadArea.addEventListener("drop", (e) => this.handleDrop(e), false);
    }
  }

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
      this.clearFileSelection();
      return;
    }

    this.processFile(file);
  }

  processFile(file) {
    const fileInfo = this.dom.get('fileInfo');
    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(1);

    // Validar tamanho do arquivo
    if (file.size > CONFIG.MAX_FILE_SIZE) {
      this.ui.showToast("Arquivo muito grande. Máximo 10MB permitido.", TOAST_TYPES.ERROR);
      this.clearFileSelection();
      return;
    }

    // Validar tipo de arquivo
    const allowedTypes = ['.txt', '.pdf'];
    const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    
    if (!allowedTypes.includes(fileExtension)) {
      this.ui.showToast("Tipo de arquivo não suportado. Use .txt ou .pdf", TOAST_TYPES.ERROR);
      this.clearFileSelection();
      return;
    }

    // Atualizar UI
    if (fileInfo) {
      fileInfo.querySelector(".file-name").textContent = fileName;
      fileInfo.querySelector(".file-size").textContent = `${fileSize} KB`;
      this.dom.show(fileInfo);
    }

    this.ui.showToast(`Arquivo "${fileName}" selecionado`, TOAST_TYPES.SUCCESS);
  }

  clearFileSelection() {
    const fileInput = this.dom.get('fileInput');
    const fileInfo = this.dom.get('fileInfo');
    
    if (fileInput) fileInput.value = "";
    if (fileInfo) this.dom.hide(fileInfo);
  }

  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  highlight() {
    const fileUploadArea = this.dom.get('fileUploadArea');
    if (fileUploadArea) {
      fileUploadArea.classList.add('border-primary-500', 'bg-primary-50');
      fileUploadArea.classList.remove('border-gray-200');
    }
  }

  unhighlight() {
    const fileUploadArea = this.dom.get('fileUploadArea');
    if (fileUploadArea) {
      fileUploadArea.classList.remove('border-primary-500', 'bg-primary-50');
      fileUploadArea.classList.add('border-gray-200');
    }
  }

  handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
      const fileInput = this.dom.get('fileInput');
      if (fileInput) {
        fileInput.files = files;
        const event = new Event("change", { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    }
  }

  getSelectedFile() {
    const fileInput = this.dom.get('fileInput');
    return fileInput?.files[0] || null;
  }
}
