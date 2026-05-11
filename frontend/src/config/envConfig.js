// src/config/envConfig.js
const envConfig = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  APP_NAME:     import.meta.env.VITE_APP_NAME     || "TalentAI",
  ENV:          import.meta.env.VITE_ENV           || "development",
  isDev:        import.meta.env.DEV,
  isProd:       import.meta.env.PROD,
};

export default envConfig;
