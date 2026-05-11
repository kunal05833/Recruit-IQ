// vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  define: {
    global: "globalThis",
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@redux": path.resolve(__dirname, "./src/redux"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },

  build: {
    target: "es2015",
    minify: "esbuild",
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {

          if (id.includes("node_modules")) {

            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "vendor-react";
            }

            if (
              id.includes("@reduxjs/toolkit") ||
              id.includes("react-redux")
            ) {
              return "vendor-redux";
            }

            if (
              id.includes("chart.js") ||
              id.includes("react-chartjs-2")
            ) {
              return "vendor-charts";
            }

            if (
              id.includes("lucide-react") ||
              id.includes("clsx") ||
              id.includes("@headlessui/react")
            ) {
              return "vendor-ui";
            }

            if (
              id.includes("axios") ||
              id.includes("date-fns") ||
              id.includes("react-hot-toast")
            ) {
              return "vendor-utils";
            }

            return "vendor";
          }
        },
      },
    },
  },

  server: {
    port: 3000,
    open: true,

    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  preview: {
    port: 4173,
  },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@reduxjs/toolkit",
      "react-redux",
      "axios",
      "chart.js",
      "react-chartjs-2",
      "lucide-react",
      "clsx",
      "date-fns",
    ],
  },
});