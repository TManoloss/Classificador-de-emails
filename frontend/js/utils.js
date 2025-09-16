/**
 * Funções utilitárias
 */
export class Utils {
  static createParticles() {
    const particlesBg = document.getElementById("particles-bg");
    if (!particlesBg) return;

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.width = particle.style.height =
        Math.random() * 4 + 2 + "px";
      particle.style.animationDelay = Math.random() * 6 + "s";
      particlesBg.appendChild(particle);
    }
  }

  static validateEmail(text, file) {
    if (!text && !file) {
      return {
        valid: false,
        message: "Por favor, insira o texto do email ou selecione um arquivo.",
      };
    }

    // Verificar se o texto é muito pequeno
    if (text && text.trim().length < 10) {
      return {
        valid: false,
        message:
          "O texto do email é muito curto. Por favor, insira pelo menos 10 caracteres para uma classificação mais precisa.",
      };
    }

    return { valid: true };
  }

  static formatFileSize(bytes) {
    return (bytes / 1024).toFixed(1);
  }

  static truncateText(text, maxLength = 50) {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }

  static formatTimestamp() {
    return new Date().toLocaleString("pt-BR");
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}
