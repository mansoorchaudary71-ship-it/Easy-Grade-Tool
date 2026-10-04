import fs from 'fs';
import path from 'path';

async function main() {
  const css = fs.readFileSync('/tmp/fonts.css', 'utf-8');
  const fontDir = path.resolve('public/fonts');
  if (!fs.existsSync(fontDir)) fs.mkdirSync(fontDir, { recursive: true });

  const urlRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
  let match;
  const urls = new Set();
  while ((match = urlRegex.exec(css)) !== null) {
    urls.add(match[1]);
  }

  console.log(`Downloading ${urls.size} font files...`);
  const urlToLocal = new Map();
  for (const url of urls) {
    const filename = path.basename(url);
    const localPath = path.join(fontDir, filename);
    if (!fs.existsSync(localPath)) {
      const res = await fetch(url);
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(localPath, buffer);
    }
    urlToLocal.set(url, '/fonts/' + filename);
  }

  let localCss = css;
  for (const [remote, local] of urlToLocal.entries()) {
    localCss = localCss.split(remote).join(local);
  }

  fs.writeFileSync('src/fonts.css', localCss);
  console.log('Saved src/fonts.css and downloaded all fonts to public/fonts/');
}
main().catch(err => {
  console.error(err);
  process.exit(1);
});
