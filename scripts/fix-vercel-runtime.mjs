import fs from 'node:fs';
import path from 'node:path';

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
        console.log(`[scripts/fix-vercel-runtime] Set runtime to nodejs22.x in ${entry.name}/.vc-config.json`);
      }
    }
  }
}
