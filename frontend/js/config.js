/**
 * Configurações da aplicação
 */
// Configurações base
const isProduction =
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";

// ALTERE para a URL real do seu backend no Render
const RENDER_BACKEND = "https://classificador-de-emails-hxkx.onrender.com";

const apiBaseUrl = isProduction ? RENDER_BACKEND : "http://127.0.0.1:8000";

export const APP_CONFIG = {
  API_URL: `${apiBaseUrl}/classify`, // certifique-se que seu backend usa /classify
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  MAX_CHARS: 5000,
  TOAST_DURATION: 3000,
  HISTORY_LIMIT: 10,
  STORAGE_KEYS: {
    EMAILS_PROCESSED: "emailsProcessed",
    TOTAL_TIME: "totalProcessingTime",
    HISTORY: "emailHistory",
  },
};

export const PRIORITY_CONFIG = {
  Alta: { icon: "🔴", color: "#ff4444", label: "Alta Prioridade" },
  Média: { icon: "🟡", color: "#ffaa00", label: "Média Prioridade" },
  Baixa: { icon: "🟢", color: "#44aa44", label: "Baixa Prioridade" },
};

export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};
