const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5500;
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  
  // Security: prevent directory traversal
  if (!path.relative(__dirname, filePath).startsWith('..')) {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
        return;
      }
      
      let contentType = 'text/html';
      if (filePath.endsWith('.css')) contentType = 'text/css';
      if (filePath.endsWith('.js')) contentType = 'application/javascript';
      if (filePath.endsWith('.json')) contentType = 'application/json';
      if (filePath.endsWith('.png')) contentType = 'image/png';
      if (filePath.endsWith('.jpg')) contentType = 'image/jpeg';
      if (filePath.endsWith('.gif')) contentType = 'image/gif';
      if (filePath.endsWith('.svg')) contentType = 'image/svg+xml';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data, 'utf-8');
    });
  } else {
    res.writeHead(403);
    res.end('Forbidden');
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`🌐 Frontend Server running at http://${HOSTNAME}:${PORT}`);
  console.log(`📂 Serving files from: ${__dirname}`);
});
