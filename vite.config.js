import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';   // ← add this import

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // ← add this
  ],
  base: './'   // this is fine for GitHub Pages / subdirectory deploys
});