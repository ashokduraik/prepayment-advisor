const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  const projectRoot = path.resolve(__dirname, '..');
  const browserDir = path.join(projectRoot, 'www', 'browser');
  const outDir = path.join(projectRoot, 'www');
  if (!fs.existsSync(browserDir)) {
    console.log('No www/browser directory found; skipping move.');
    process.exit(0);
  }
  console.log('Copying files from', browserDir, 'to', outDir);
  for (const item of fs.readdirSync(browserDir)) {
    copyRecursive(path.join(browserDir, item), path.join(outDir, item));
  }
  console.log('Copy complete.');
} catch (e) {
  console.error('Error during postbuild file move:', e);
  process.exit(1);
}
