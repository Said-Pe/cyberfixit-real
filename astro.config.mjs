// Ensure Vercel Serverless Function runtime is nodejs20.x even if building with Node 22/24+
if (!process.version.startsWith('v20')) {
  Object.defineProperty(process, 'version', {
    value: 'v20.18.0',
    writable: true,
    configurable: true,
  });
}

import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  // 'hybrid' = todo es estático por defecto;
  // los endpoints con `export const prerender = false` se convierten en funciones SSR.
  output: 'hybrid',
  adapter: vercel(),
  site: 'https://cyberfixit.com',
  image: {
    // Usa el servicio de imágenes de Vercel para evitar conflicto con Sharp
    service: {
      entrypoint: 'astro/assets/services/noop',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'always',
  },
});