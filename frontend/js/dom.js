/**
 * Gerenciador de elementos DOM
 */
export class DOMManager {
  constructor() {
    this.elements = this.initializeElements();
  }

  initializeElements() {
    return {
      form: document.getElementById("form"),
      resultDiv: document.getElementById("result"),
      submitBtn: document.getElementById("submit-btn"),
      textArea: document.getElementById("text"),
      fileInput: document.getElementById("file"),
      progressBar: document.getElementById("progress-bar"),
      charCount: document.getElementById("char-count"),
      fileInfo: document.getElementById("file-info"),
      removeFileBtn: document.getElementById("remove-file"),
      optionsToggle: document.getElementById("options-toggle"),
      optionsContent: document.getElementById("options-content"),
      historySection: document.getElementById("history-section"),
      historyList: document.getElementById("history-list"),
      clearHistoryBtn: document.getElementById("clear-history"),
      toastContainer: document.getElementById("toast-container"),
      emailsProcessedEl: document.getElementById("emails-processed"),
      avgTimeEl: document.getElementById("avg-time"),
      fileUploadArea: document.querySelector(".file-upload-label"),
      particlesBg: document.getElementById("particles-bg")
    };
  }

  get(elementName) {
    return this.elements[elementName];
  }

  getAll(selector) {
    return document.querySelectorAll(selector);
  }

  createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  show(element) {
    if (element) element.style.display = 'block';
  }

  hide(element) {
    if (element) element.style.display = 'none';
  }

  toggle(element, className) {
    if (element) element.classList.toggle(className);
  }

  addClass(element, className) {
    if (element) element.classList.add(className);
  }

  removeClass(element, className) {
    if (element) element.classList.remove(className);
  }
}
