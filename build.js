const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Clean & create dist folder
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy root static files
const rootFiles = ['index.html', 'styles.css', 'script.js'];
rootFiles.forEach((file) => {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});

// Copy assets directory recursively
const assetsDir = path.join(__dirname, 'assets');
const assetsDest = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  fs.cpSync(assetsDir, assetsDest, { recursive: true });
}

console.log('✅ Build successful: all static assets prepared in dist/ directory.');
