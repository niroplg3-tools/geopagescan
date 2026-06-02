import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev, /api/* is proxied to the Node backend so the browser never talks to
// api.anthropic.com directly (which is blocked from browser sandboxes) and we
// avoid CORS. In production set VITE_API_URL to the deployed Railway backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
});
