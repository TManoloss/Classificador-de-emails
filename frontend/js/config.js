/**
 * Configurações da aplicação
 */
// Configurações base
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const apiBaseUrl = isProduction ? 'https://classificador-de-emails-hxkx.onrender.com' : 'http://127.0.0.1:8000';

export const CONFIG = {
  API_URL: `${apiBaseUrl}/api/classify`,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_CHARS: 5000,
  TOAST_DURATION: 3000,
  HISTORY_LIMIT: 10,
  STORAGE_KEYS: {
    EMAILS_PROCESSED: 'emailsProcessed',
    TOTAL_TIME: 'totalProcessingTime',
    HISTORY: 'emailHistory'
  }
};

export const PRIORITY_CONFIG = {
  "Alta": { icon: "🔴", color: "#ff4444", label: "Alta Prioridade" },
  "Média": { icon: "🟡", color: "#ffaa00", label: "Média Prioridade" },
  "Baixa": { icon: "🟢", color: "#44aa44", label: "Baixa Prioridade" }
};

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};
