import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  css: {
    // Ensure index.css is processed
    preprocessorOptions: {
      css: {
        additionalData: `@import "./src/index.css";`,
      },
    },
  },
});