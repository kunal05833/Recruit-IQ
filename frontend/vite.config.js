// vite.config.js
import { defineConfig } from "vite";
import react            from "@vitejs/plugin-react";
import path             from "path";

export default defineConfig({
  plugins: [react()],
   define: {
    global: 'globalThis',  // ✅ FIX: sockjs-client needs this
  },

  resolve: {
    alias: {
      "@":           path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@features":   path.resolve(__dirname, "./src/features"),
      "@hooks":      path.resolve(__dirname, "./src/hooks"),
      "@utils":      path.resolve(__dirname, "./src/utils"),
      "@redux":      path.resolve(__dirname, "./src/redux"),
      "@services":   path.resolve(__dirname, "./src/services"),
      "@config":     path.resolve(__dirname, "./src/config"),
      "@assets":     path.resolve(__dirname, "./src/assets"),
    },
  },

  build: {
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor splits
          "vendor-react": [
            "react",
            "react-dom",
            "react-router-dom",
          ],
          "vendor-redux": [
            "@reduxjs/toolkit",
            "react-redux",
          ],
          "vendor-charts": [
            "chart.js",
            "react-chartjs-2",
          ],
          "vendor-ui": [
            "lucide-react",
            "clsx",
            "@headlessui/react",
          ],
          "vendor-utils": [
            "axios",
            "date-fns",
            "react-hot-toast",
          ],
        },
      },
    },

    // Build optimizations
    target:        "es2015",
    minify:        "esbuild",
    cssMinify:     true,
    sourcemap:     false,
    chunkSizeWarningLimit: 1000,
  },

  // Dev server
  server: {
    port:   3000,
    open:   true,
    proxy: {
      "/api": {
        target:      "http://localhost:8080",
        changeOrigin: true,
        secure:      false,
      },
    },
  },

  // Preview
  preview: {
    port: 4173,
  },

  // Performance
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