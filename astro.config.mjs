import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel/serverless';

function vercelNode22(options) {
  const adapter = vercel(options);
  const origBuildDone = adapter.hooks['astro:build:done'];
  adapter.hooks['astro:build:done'] = async (args) => {
    if (origBuildDone) {
      await origBuildDone(args);
    }
    const functionsDir = path.resolve('./.vercel/output/functions');
    if (fs.existsSync(functionsDir)) {
      const entries = fs.readdirSync(functionsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name.endsWith('.func')) {
          const vcConfigPath = path.join(functionsDir, entry.name, '.vc-config.json');
          if (fs.existsSync(vcConfigPath)) {
            const config = JSON.parse(fs.readFileSync(vcConfigPath, 'utf8'));
            config.runtime = 'nodejs22.x';
            fs.writeFileSync(vcConfigPath, JSON.stringify(config, null, '\t') + '\n');
            console.log(`[fix-vercel-runtime] Set runtime to nodejs22.x in ${entry.name}/.vc-config.json`);
          }
        }
      }
    }
  };
  return adapter;
}

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: vercelNode22(),
  site: 'https://cyberfixit.com',
  image: {
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