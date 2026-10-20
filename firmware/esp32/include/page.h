#pragma once
#include <Arduino.h>

const char PAGINA[] PROGMEM = R"HTML(
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>WaterMyPlants · Sensor</title>
<style>
:root{color-scheme:light dark;--bg:#f4f7f2;--ink:#1e3025;--card:#fff;--line:#d5dfd3;--soft:#4d6353;--leaf:#24673c}
@media(prefers-color-scheme:dark){:root{--bg:#142019;--ink:#e3eee5;--card:#1d2d23;--line:#3a5140;--soft:#b4cbb9;--leaf:#92d5a7}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,sans-serif}
main{max-width:620px;margin:auto;padding:32px 20px}header{margin-bottom:28px}h1{font-size:26px;margin:0}h2{font-size:18px;margin:0 0 8px}p{margin:8px 0;color:var(--soft)}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:24px;margin-bottom:16px}.value{font-size:52px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--leaf)}
dl{margin:16px 0 0}dl div{display:flex;justify-content:space-between;gap:16px;padding:8px 0;border-top:1px solid var(--line)}dt{color:var(--soft)}dd{margin:0;font-variant-numeric:tabular-nums;text-align:right}small{color:var(--soft)}#connection{font-weight:600;color:var(--ink)}
</style>
</head>
<body><main>
<header><h1>WaterMyPlants</h1><p>Primeiro sensor · teste pela rede local</p></header>
<section class="card" aria-labelledby="sensor-title">
<h2 id="sensor-title">Índice relativo do solo</h2>
<div class="value" id="percent">—</div>
<p id="connection" role="status" aria-live="polite">Buscando leitura…</p>
<dl>
<div><dt>Leitura bruta</dt><dd id="raw">—</dd></div>
<div><dt>Idade da leitura</dt><dd id="age">—</dd></div>
<div><dt>Sinal Wi-Fi</dt><dd id="signal">—</dd></div>
<div><dt>Tempo ligado</dt><dd id="uptime">—</dd></div>
</dl>
</section>
<p>0% = referência seca (3060). 100% = referência úmida (2107). Esta escala não representa o percentual real de água no solo.</p>
<p>O sensor fora da terra também pode indicar 0%. Este teste não aciona bomba e ainda não salva histórico.</p>
<small>Atualização automática a cada segundo enquanto a página está aberta.</small>
</main>
<script>
const byId = id => document.getElementById(id);
let lastSample = null;
let lastResponseAt = 0;
function showAge() {
  if (lastSample !== null) {
    byId('age').textContent = ((lastSample.sample_age_ms + performance.now() - lastResponseAt) / 1000).toFixed(1) + ' s';
  }
}
async function refresh() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch('/api/leitura', {cache:'no-store', signal:controller.signal});
    if (!response.ok) throw new Error('Falha HTTP');
    const data = await response.json();
    if (!data.ready) {
      lastSample = null;
      for (const id of ['percent','raw','age','signal','uptime']) byId(id).textContent = '—';
      byId('connection').textContent = 'Aguardando a primeira leitura do sensor…';
      return;
    }
    if (![data.raw,data.relative_percent,data.sample_age_ms,data.uptime_ms,data.wifi_rssi_dbm].every(Number.isFinite)) throw new Error('Dados inválidos');
    lastSample = data;
    lastResponseAt = performance.now();
    byId('percent').textContent = data.relative_percent.toFixed(1) + '%';
    byId('raw').textContent = String(data.raw);
    byId('signal').textContent = data.wifi_rssi_dbm + ' dBm';
    byId('uptime').textContent = Math.floor(data.uptime_ms / 1000) + ' s';
    byId('connection').textContent = data.sample_age_ms > 5000 ? 'Leitura atrasada: confira o dispositivo.' : 'Conectado · recebendo leituras';
  } catch (error) {
    byId('connection').textContent = lastSample === null ? 'Sem contato com o ESP32. Confira a rede e o endereço.' : 'Sem contato com o ESP32. Valores abaixo são os últimos recebidos.';
  } finally {
    clearTimeout(timeout);
    showAge();
    setTimeout(refresh, 1000);
  }
}
setInterval(showAge, 1000);
refresh();
</script>
</body></html>
)HTML";
