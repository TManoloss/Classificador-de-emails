/**
 * Gerenciador de estado da aplicação
 */
import { StorageManager } from './storage.js';
import { CONFIG } from './config.js';

export class AppState {
  constructor() {
    this.processingStartTime = 0;
    this.emailsProcessed = StorageManager.get(CONFIG.STORAGE_KEYS.EMAILS_PROCESSED, 0);
    this.totalProcessingTime = StorageManager.get(CONFIG.STORAGE_KEYS.TOTAL_TIME, 0);
  }

  startProcessing() {
    this.processingStartTime = Date.now();
  }

  updateProcessingStats(processingTime) {
    this.emailsProcessed++;
    this.totalProcessingTime += processingTime;
    
    StorageManager.set(CONFIG.STORAGE_KEYS.EMAILS_PROCESSED, this.emailsProcessed);
    StorageManager.set(CONFIG.STORAGE_KEYS.TOTAL_TIME, this.totalProcessingTime);
  }

  getProcessingTime() {
    return Date.now() - this.processingStartTime;
  }

  getAverageTime() {
    return this.emailsProcessed > 0 ? 
      (this.totalProcessingTime / this.emailsProcessed / 1000).toFixed(1) : '0';
  }

  reset() {
    this.processingStartTime = 0;
  }
}
