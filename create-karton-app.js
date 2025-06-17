#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const appName = process.argv[2];

if (!appName) {
  console.error('Usage: npx create-karton-app <app-name>');
  process.exit(1);
}

const appPath = path.resolve(process.cwd(), appName);

if (existsSync(appPath)) {
  console.error(`Directory ${appName} already exists.`);
  process.exit(1);
}

console.log(`Creating new KartonJS app in ${appPath}...`);

// Create app dir
mkdirSync(appPath);

// Create src dir
mkdirSync(path.join(appPath, 'src'));

// Create a package.json
writeFileSync(
  path.join(appPath, 'package.json'),
  JSON.stringify({
    name: appName,
    version: "0.1.0",
    type: "module",
    scripts: {
      start: "vite",
      build: "vite build"
    },
    dependencies: {
      "kartonjs": "^1.0.3",
      "uhtml": "^1.0.0"
    },
    devDependencies: {
      "vite": "^4.0.0"
    }
  }, null, 2)
);

// Create a .gitignore
writeFileSync(
  path.join(appPath, '.gitignore'),
  `node_modules/
dist/
.vite/
`
);

// Create index.html
writeFileSync(
  path.join(appPath, 'index.html'),
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${appName}</title>
  <link rel="icon" type="image/svg+xml" href="https://cdn.jsdelivr.net/npm/kartoncss/karton-element.svg" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/kartoncss/karton.css" type="text/css">
  <script type="module" src="/src/index.js"></script>
</head>
<body>
  <karton-app></karton-app>
</body>
</html>`
);

// Create index.js
writeFileSync(
  path.join(appPath, 'src', 'index.js'),
  `import { KartonElement, html } from 'kartonjs';

export class KartonApp extends KartonElement {
  template() {
    return html\`
      <h1>Hello KartonJS!</h1>
      <p>Welcome to your new Karton app.</p>
    \`;
  }
}

customElements.define('karton-app', KartonApp);
`
);

console.log('Installing dependencies...');
execSync('npm install', { cwd: appPath, stdio: 'inherit' });

console.log('Done! Run "npm start" inside your new app directory.');

