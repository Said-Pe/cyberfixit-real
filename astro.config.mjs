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