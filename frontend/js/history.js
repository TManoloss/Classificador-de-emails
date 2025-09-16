/**
 * Gerenciador de histórico de classificações
 */
import { StorageManager } from './storage.js';
import { CONFIG, PRIORITY_CONFIG } from './config.js';

export class HistoryManager {
  constructor(domManager) {
    this.dom = domManager;
  }

  addToHistory(item) {
    let history = StorageManager.get(CONFIG.STORAGE_KEYS.HISTORY, []);
    
    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleString("pt-BR"),
      text: item.text.length > 50 ? item.text.substring(0, 50) + "..." : item.text,
      categoria: item.categoria,
      prioridade: item.prioridade,
      processingTime: item.processingTime,
    };
    
    history.unshift(historyItem);
    history = history.slice(0, CONFIG.HISTORY_LIMIT);
    
    StorageManager.set(CONFIG.STORAGE_KEYS.HISTORY, history);
    this.updateHistoryDisplay();
  }

  updateHistoryDisplay() {
    const history = StorageManager.get(CONFIG.STORAGE_KEYS.HISTORY, []);
    const historySection = this.dom.get('historySection');
    const historyList = this.dom.get('historyList');
    
    if (history.length === 0) {
      this.dom.hide(historySection);
      return;
    }
    
    this.dom.show(historySection);
    historyList.innerHTML = "";
    
    history.forEach((item) => {
      const historyItem = this.dom.createElement('div', 'history-item');
      const categoryClass = item.categoria === "Produtivo" ? "productive" : "unproductive";
      const priority = PRIORITY_CONFIG[item.prioridade] || { icon: "⚪", color: "#666" };
      
      historyItem.innerHTML = `
        <div class="history-content">
          <div class="history-text">${item.text}</div>
          <div class="history-meta">
            <span class="history-category ${categoryClass}">${item.categoria}</span>
            <span class="history-priority" style="color: ${priority.color};">${priority.icon} ${item.prioridade}</span>
            <span class="history-time">${item.processingTime}ms</span>
            <span class="history-timestamp">${item.timestamp}</span>
          </div>
        </div>
      `;
      
      historyList.appendChild(historyItem);
    });
  }

  clearHistory() {
    StorageManager.remove(CONFIG.STORAGE_KEYS.HISTORY);
    this.updateHistoryDisplay();
  }

  getHistory() {
    return StorageManager.get(CONFIG.STORAGE_KEYS.HISTORY, []);
  }
}
