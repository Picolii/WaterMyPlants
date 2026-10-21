import assert from 'node:assert/strict';
import { once } from 'node:events';
import { request } from 'node:http';
import { after, before, test } from 'node:test';
import { buildPlantUrl } from '../dist/plant-url.js';
import { createDashboardServer } from '../serve.mjs';
import { createId } from '../dist/ids.js';

let server;
let port;
before(async () => {
  server = createDashboardServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  port = server.address().port;
});
after(async () => {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

function get(pathname, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = request({ hostname: '127.0.0.1', port, path: pathname, method }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }));
    });
    req.on('error', reject);
    req.end();
  });
}

test('QR acompanha o domínio atual e descarta parâmetros temporários', () => {
  assert.equal(buildPlantUrl('https://jardim.example/?token=temporario#jardim', 'vaso-1'), 'https://jardim.example/#planta/vaso-1');
});
test('QR preserva a subpasta da instalação e codifica o identificador', () => {
  assert.equal(buildPlantUrl('https://example.org/WaterMyPlants/index.html#configuracoes', 'vaso A/ç'), 'https://example.org/WaterMyPlants/index.html#planta/vaso%20A%2F%C3%A7');
});
test('localhost continua local, sem redirecionar para outro serviço', () => {
  assert.equal(buildPlantUrl('http://localhost:4178/', 'teste'), 'http://localhost:4178/#planta/teste');
});
test('QR recusa protocolo inválido e identificador vazio', () => {
  assert.throws(() => buildPlantUrl('javascript:alert(1)', 'teste'), TypeError);
  assert.throws(() => buildPlantUrl('https://example.org', ''), TypeError);
});
test('cadastro e eventos têm IDs mesmo em HTTP local sem randomUUID', () => {
  const cryptoWithoutRandomUUID = { getRandomValues: bytes => bytes.fill(255) };
  assert.equal(createId(cryptoWithoutRandomUUID), 'ffffffff-ffff-4fff-bfff-ffffffffffff');
});
test('servidor entrega painel, módulos e biblioteca local sem login', async () => {
  const page = await get('/');
  assert.equal(page.status, 200);
  assert.match(page.body, /MVP 0\.1\.0/);
  assert.match(page.body, /type="module" src="app\.js"/);
  for (const resource of ['/app.js', '/plant-url.js', '/ids.js', '/styles.css', '/vendor/qrcode.js']) {
    const result = await get(resource);
    assert.equal(result.status, 200, resource);
    assert.doesNotMatch(result.body, /chatgpt\.site|signin-with-chatgpt/);
  }
});
test('HEAD mantém os metadados e não envia corpo', async () => {
  const page = await get('/', 'HEAD');
  assert.equal(page.status, 200);
  assert.equal(page.body, '');
  assert.ok(Number(page.headers['content-length']) > 0);
});
test('servidor não publica fontes, credenciais ou arquivos fora de dist', async () => {
  for (const file of ['/serve.mjs', '/package.json', '/.env', '/firmware/esp32/include/secrets.h']) {
    assert.equal((await get(file)).status, 404, file);
  }
  assert.equal((await get('/%2e%2e%2fREADME.md')).status, 403);
  assert.equal((await get('/%2e%2e%2fdist-extra/arquivo')).status, 403);
});
test('requisições malformadas e métodos de escrita são recusados', async () => {
  assert.equal((await get('/%ZZ')).status, 400);
  assert.equal((await get('/%00')).status, 400);
  const result = await get('/', 'POST');
  assert.equal(result.status, 405);
  assert.equal(result.headers.allow, 'GET, HEAD');
});
