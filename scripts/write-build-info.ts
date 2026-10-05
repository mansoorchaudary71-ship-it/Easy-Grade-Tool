/**
 * Writes dist/build-info.json so the live site can prove which build it is serving.
 * `npm run check:live` compares this with the live /build-info.json to catch stale deploys.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.resolve(rootDir, 'dist');

function gitSha(): string {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 12);
  try {
    return execSync('git rev-parse --short=12 HEAD', { cwd: rootDir, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'unknown';
  }
}

const info = {
  site: 'https://www.easygradetool.com',
  commit: gitSha(),
  builtAt: new Date().toISOString(),
};

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'build-info.json'), JSON.stringify(info, null, 2) + '\n');
console.log(`🧾 build-info.json written (commit ${info.commit})`);
