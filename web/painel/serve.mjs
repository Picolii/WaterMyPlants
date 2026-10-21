import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DEFAULT_ROOT = fileURLToPath(new URL('./dist/', import.meta.url));
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

export function createDashboardServer({ root = DEFAULT_ROOT } = {}) {
  const publicRoot = path.resolve(root);
  return http.createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'no-store');

    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end('Método não permitido');
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname.includes('\0')) throw new Error('Caminho inválido');
    } catch {
      response.writeHead(400).end('Endereço inválido');
      return;
    }

    const file = path.resolve(publicRoot, '.' + (pathname === '/' ? '/index.html' : pathname));
    const relative = path.relative(publicRoot, file);
    if (relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
      response.writeHead(403).end('Acesso negado');
      return;
    }

    try {
      const data = await readFile(file);
      response.writeHead(200, {
        'Content-Type': MIME_TYPES[path.extname(file)] || 'application/octet-stream',
        'Content-Length': data.length,
      });
      response.end(request.method === 'HEAD' ? undefined : data);
    } catch {
      response.writeHead(404).end('Arquivo não encontrado');
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT || 4178);
  const host = process.env.HOST || '127.0.0.1';
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    console.error('PORT deve ser um número entre 0 e 65535.');
    process.exitCode = 1;
  } else {
    const server = createDashboardServer();
    server.on('error', error => {
      console.error(error.code === 'EADDRINUSE'
        ? `A porta ${port} já está em uso. Defina outra em PORT.`
        : `Não foi possível iniciar o painel: ${error.code || error.message}`);
      process.exitCode = 1;
    });
    server.listen(port, host, () => {
      const address = server.address();
      const displayHost = host === '0.0.0.0' ? 'localhost' : host === '::' ? '[::1]' : host;
      console.log(`WaterMyPlants MVP 0.1.0 — http://${displayHost}:${address.port}`);
      if (host === '0.0.0.0' || host === '::') {
        console.log(`Celular na mesma rede: http://<IP-do-computador>:${address.port}`);
      }
    });
    for (const signal of ['SIGINT', 'SIGTERM']) {
      process.on(signal, () => server.close(() => process.exit(0)));
    }
  }
}
