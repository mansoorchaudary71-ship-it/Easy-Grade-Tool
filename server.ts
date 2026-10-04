/**
 * Easy Grade Tool — Full-Stack Server Entry Point
 * 
 * Supports all execution environments:
 * 1. Direct Node.js (`node server.ts` or `npm start`): transparently launches with tsx ESM loader
 * 2. TSX CLI (`tsx server.ts` or `npm run dev`)
 * 3. Container runtimes (Cloud Run, Docker, Heroku, Render, etc.)
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const isTsx = Boolean(
  process.env.__TSX_BOOTSTRAPPED__ ||
  process.execArgv.some((a) => a.includes('tsx')) ||
  typeof (globalThis as any).TSX !== 'undefined'
);

if (!isTsx) {
  const child = spawn(
    process.execPath,
    ['--import', 'tsx', fileURLToPath(import.meta.url), ...process.argv.slice(2)],
    {
      stdio: 'inherit',
      env: { ...process.env, __TSX_BOOTSTRAPPED__: '1' },
    }
  );

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
    }
    process.exit(code ?? 0);
  });
} else {
  // Active TSX runtime — launch full Express backend
  await import('./src/server/serverApp.ts');
}
