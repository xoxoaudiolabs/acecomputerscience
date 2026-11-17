// Tiny static file server for Ace Computer Science. No dependencies: `node server.js`
// It listens on this computer only (127.0.0.1) and refuses hidden files such as .git.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5173;
const HOST = '127.0.0.1';
const ROOT = __dirname;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
};

function send(res, status, text) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(text);
}

http
  .createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
    let urlPath;
    try {
      urlPath = decodeURIComponent(req.url.split('?')[0]);
    } catch (e) {
      return send(res, 400, 'Bad request');
    }
    if (urlPath === '/') urlPath = '/index.html';
    const file = path.normalize(path.join(ROOT, urlPath));
    const relative = path.relative(ROOT, file);
    const outside = relative.startsWith('..') || path.isAbsolute(relative);
    const hidden = relative.split(path.sep).some((part) => part.startsWith('.'));
    if (outside || hidden) return send(res, 404, 'Not found');
    fs.readFile(file, (err, data) => {
      if (err) return send(res, 404, 'Not found');
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(req.method === 'HEAD' ? undefined : data);
    });
  })
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Ace Computer Science is already running at http://localhost:${PORT}`);
      setTimeout(() => process.exit(0), 2500);
    } else {
      throw err;
    }
  })
  .listen(PORT, HOST, () => console.log(`Ace Computer Science running at http://localhost:${PORT}`));
