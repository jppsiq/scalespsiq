import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * npm run build         -> dist/ com arquivos separados (deploy comum)
 * npm run build:single  -> dist-single/index.html único, com JS e CSS embutidos.
 *                          Abre com duplo clique, sem servidor: útil para levar em pendrive ou rede interna.
 */
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  base: './',
  build: { outDir: mode === 'single' ? 'dist-single' : 'dist', chunkSizeWarningLimit: 1200 },
}));
