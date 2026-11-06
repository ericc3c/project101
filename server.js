// Save as: Project102/sumiro/server.js
// Run in Code App terminal: node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav'
};

http.createServer((req, res) => {
  // Strip query string and "/sumiro" prefix if present so hardcoded GitHub paths still work locally
  let reqPath = req.url.split('?')[0];
  if (reqPath.startsWith('/sumiro/')) {
    reqPath = reqPath.replace(/^\/sumiro/, '');
  }
  if (reqPath === '/' || reqPath === '/sumiro') {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(decodeURIComponent(reqPath)).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(ROOT, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${reqPath}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
    });

    fs.createReadStream(filePath).pipe(res);
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Sumiro Local Dev Server running at http://127.0.0.1:${PORT}`);
});
