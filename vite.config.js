import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // multi-page routes need absolute asset paths
  build: { chunkSizeWarningLimit: 800 },
});
