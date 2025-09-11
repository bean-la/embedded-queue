const fs = require('fs');
const path = require('path');

const cjsDir = './dist/cjs';

// Rename all .js files to .cjs
fs.readdirSync(cjsDir).forEach(file => {
  if (file.endsWith('.js')) {
    const oldPath = path.join(cjsDir, file);
    const newPath = path.join(cjsDir, file.replace('.js', '.cjs'));
    fs.renameSync(oldPath, newPath);
  }
});

// Update require statements in .cjs files to use .cjs extensions
fs.readdirSync(cjsDir).forEach(file => {
  if (file.endsWith('.cjs')) {
    const filePath = path.join(cjsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace require('./filename.js') with require('./filename.cjs')
    content = content.replace(/require\(['"`]\.\/([^'"`]+)\.js['"`]\)/g, "require('./$1.cjs')");

    fs.writeFileSync(filePath, content);
  }
});

console.log('Renamed CommonJS files and updated require statements');