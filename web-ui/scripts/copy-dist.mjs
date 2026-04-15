import { cpSync, rmSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, '..', 'dist');
const target = resolve(__dirname, '..', '..', 'src', 'resources', 'web');

if (!existsSync(dist)) {
  console.error('dist/ not found. Run "npm run build" first.');
  process.exit(1);
}

// Clean target
if (existsSync(target)) {
  rmSync(target, { recursive: true });
}

// Copy
cpSync(dist, target, { recursive: true });
console.log(`Copied dist/ -> src/resources/web/`);
