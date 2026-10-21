import { buildPlantUrl } from './plant-url.js';
import { createId } from './ids.js';

const STORAGE_KEY = 'watermyplants.dashboard.v1';
const icons = {
  leaf:'<path d="M20 4C9 1 3 7 6 14c3 6 13 4 14-10Z"/><path d="M4 21 15 9"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  chart:'<path d="M4 3v17h17M7 14l4-5 4 3 5-7"/>',
  chip:'<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3"/>',
  settings:'<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h5l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3Z"/><circle cx="11.5" cy="12" r="3"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  camera:'<path d="M8 6 9.5 3h5L16 6h4a1 1 0 0 1 1 1v12H3V7a1 1 0 0 1 1-1Z"/><circle cx="12" cy="12" r="4"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  flask:'<path d="M9 3h6M10 3v6L4 19a1.4 1.4 0 0 0 1.2 2h13.6a1.4 1.4 0 0 0 1.2-2L14 9V3M7 14h10"/>',
  pin:'<path d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  drop:'<path d="M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12Z"/>',
  arrow:'<path d="M4 12h15m-5-5 5 5-5 5"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  qr:'<path d="M3 3h6v6H3Zm12 0h6v6h-6ZM3 15h6v6H3Zm12 0h3v3h3v3h-6v-3h-3v-6h3m3 0h3"/>',
  download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
  spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4"/>',
  edit:'<path d="m14 5 5 5M4 20l5-1L21 7l-5-5L4 14Zm0 0 5-1"/>'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.leaf}</svg>`;
function hydrateIcons(scope = document) { scope.querySelectorAll('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon)); }
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const initialPlants = [
  {id:'monstera-demo',name:'Costela-de-adão',species:'Monstera deliciosa',location:'Sala',soil:'Exemplo de substrato',art:'monstera',demo:true,relative:72,raw:2374,review:false,notes:'Planta de exemplo para explorar o painel. Não está vinculada ao sensor físico.'},
  {id:'samambaia-demo',name:'Samambaia',species:'Nephrolepis exaltata',location:'Varanda',soil:'Exemplo de substrato',art:'fern',demo:true,relative:38,raw:2698,review:true,notes:'Marcada para observação apenas para demonstrar o estado visual. Não representa uma recomendação de rega.'},
  {id:'zamioculca-demo',name:'Zamioculca',species:'Zamioculcas zamiifolia',location:'Escritório',soil:'Exemplo de substrato',art:'zz',demo:true,relative:61,raw:2479,review:false,notes:'Índice ilustrativo; não há faixa ideal definida para esta espécie.'},
  {id:'jiboia-demo',name:'Jiboia',species:'Epipremnum aureum',location:'Sala',soil:'Exemplo de substrato',art:'pothos',demo:true,relative:84,raw:2259,review:false,notes:'Ilustração botânica, não foto da sua planta.'}
];
function freshState() { return {version:1,name:'Meu jardim',plants:structuredClone(initialPlants),events:[]}; }
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!s || s.version !== 1 || !Array.isArray(s.plants) || !s.plants.every(p => typeof p.id === 'string' && typeof p.name === 'string' && typeof p.location === 'string')) return freshState();
    return {version:1,name:typeof s.name === 'string' ? s.name.slice(0,60) : 'Meu jardim',plants:s.plants.slice(0,100),events:Array.isArray(s.events) ? s.events.slice(0,200) : []};
  } catch { return freshState(); }
}
let state = loadState();
let locationFilter = 'Todas';
let query = '';
let chartPlantId = state.plants[0]?.id;
let period = '24';
let selectedId = null;
let detailTab = 'visao';
let currentView = 'jardim';
let artSerial = 0;
let toastTimer;
function toast(message) { $('toast').textContent = message; $('toast').hidden = false;clearTimeout(toastTimer);toastTimer = setTimeout(() => $('toast').hidden = true, 4000); }
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
  catch { toast('O navegador não permitiu salvar. Exporte os registros antes de sair.'); return false; }
}
function logEvent(title,description) { state.events.unshift({id:createId(),title,description,at:new Date().toISOString()});state.events = state.events.slice(0,200);persist(); }

// Ilustrações vetoriais próprias: não são fotografias ou evidência de uma câmera.
function plantArt(type = 'monstera') {
  const id = 'botanical-' + (++artSerial);
  const common = `<defs><linearGradient id="${id}-pot" x1="0" x2="1"><stop stop-color="#c6a88a"/><stop offset=".45" stop-color="#decaad"/><stop offset="1" stop-color="#bda184"/></linearGradient><linearGradient id="${id}-leaf" x1="0" x2="1" y2="1"><stop stop-color="#61834d"/><stop offset="1" stop-color="#264e32"/></linearGradient></defs><ellipse cx="122" cy="196" rx="57" ry="6" fill="#3f5432" opacity=".09"/>`;
  const leaf = `url(#${id}-leaf)`;
  let foliage = '';
  let pot = `<path d="M86 148h72l-9 43q-26 9-54 0Z" fill="url(#${id}-pot)"/><ellipse cx="122" cy="148" rx="36" ry="6" fill="#bba083"/><ellipse cx="122" cy="148" rx="31" ry="4" fill="#786d4c"/><path d="M94 156h55" stroke="#eadcc8" opacity=".45"/>`;
  if (type === 'monstera') {
    foliage += '<path d="M119 150q-4-57-29-83m30 82q6-62 41-79m-41 78q-2-65 1-111" stroke="#526c3d" stroke-width="2.7" fill="none"/>';
    for (const [x,y,r,s] of [[91,71,-38,.9],[157,78,34,1],[121,43,0,.93],[73,101,-62,.73],[167,112,64,.72]]) {
      foliage += `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 33C-36 16-40-18-24-29-13-39-4-28 0-18 7-35 24-36 34-20 47 3 22 26 0 33Z" fill="${leaf}"/><path d="M0 32V-20m0 39-20-16m20 4 22-18m-22 8-17-17m17 6 18-17" fill="none" stroke="#a4bb78" stroke-width="1" opacity=".6"/><path d="m-33-7 13 11m-11 7 15 7m47-16-15 10m12-24-12 10" stroke="#dfe5d2" stroke-width="4" stroke-linecap="round"/></g>`;
    }
  } else if (type === 'fern') {
    pot = `<path d="M88 146h68l-9 39q-25 7-50 0Z" fill="#c2c6ac"/><ellipse cx="122" cy="146" rx="34" ry="5" fill="#a4af92"/>`;
    for (let j = 0; j < 9; j++) {
      const a = (j - 4) * 19;
      foliage += `<g transform="translate(122 150) rotate(${a})"><path d="M0 0Q-9-51 0-112" stroke="#68824b" stroke-width="1.7" fill="none"/>`;
      for (let k = 1; k < 11; k++) {
        const y = -k * 10; const len = 23 * Math.sin(k / 11 * Math.PI) + 3;
        foliage += `<path d="M-2 ${y+5}Q-${len+8} ${y-7} -${len} ${y-13}Q-8 ${y-10}-2 ${y}M-2 ${y+5}Q${len+3} ${y-5} ${len-3} ${y-13}Q6 ${y-9}-2 ${y}" fill="${k%2 ? '#678b4d' : '#83a25d'}"/>`;
      }
      foliage += '</g>';
    }
  } else if (type === 'zz') {
    pot = `<path d="M88 144h68l-6 46q-26 8-55 0Z" fill="#d9d9ce"/><ellipse cx="122" cy="144" rx="34" ry="5" fill="#c5c8b4"/><ellipse cx="122" cy="144" rx="29" ry="3" fill="#7e8062"/>`;
    for (const [x,a,height] of [[109,-21,100],[122,3,128],[136,24,111],[119,-43,70]]) {
      foliage += `<g transform="translate(${x} 148) rotate(${a})"><path d="M0 0V-${height}" stroke="#638044" stroke-width="3"/>`;
      for (let k = 1; k < 6; k++) {const y = -k * (height/6);foliage += `<path d="M0 ${y} C-25 ${y+5} -35 ${y-15} -26 ${y-22} C-13 ${y-30} -2 ${y-9} 0 ${y} Z M0 ${y} C24 ${y+4} 31 ${y-17} 22 ${y-22} C10 ${y-28} 2 ${y-10} 0 ${y} Z" fill="${leaf}"/>`;}
      foliage += `<path d="M0 ${-height-4} C-16 ${-height+5} -12 ${-height+19} 0 ${-height+22} C12 ${-height+9} 12 ${-height} 0 ${-height-4}Z" fill="${leaf}"/></g>`;
    }
  } else {
    foliage += '<path d="M121 150Q81 100 75 56m48 97q37-80 20-113m-17 109q62-16 51 32m-54-31q-60 7-57 42" stroke="#6b824b" stroke-width="2.5" fill="none"/>';
    for (const [x,y,a,s] of [[79,64,-35,.9],[98,94,-20,1],[140,52,23,.85],[140,92,37,1],[162,131,50,.85],[171,169,120,.8],[88,151,-40,.75],[69,175,-85,.8],[116,124,0,1]]) {
      foliage += `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 24C-32 5-22-28 0-14 18-33 34-7 0 24Z" fill="${leaf}"/><path d="M0 22V-12m0 23L-13-2m13 8L13-6" stroke="#b4c78c" stroke-width="1" opacity=".7"/><path d="M-9-13Q-1-4-5 8l7-11 3 14Q17-8 8-13" fill="#a9b771" opacity=".65"/></g>`;
    }
  }
  return `<svg class="plant-art" viewBox="0 0 240 210" aria-hidden="true">${common}${foliage}${pot}</svg>`;
}
const plantBg = art => ({monstera:'#e7ebde',fern:'#e9eddf',zz:'#efeee5',pothos:'#e8ebdd'}[art] || '#e7ebde');
function plantCard(p) {
  const value = p.demo ? Number(p.relative).toFixed(0) : '—';
  return `<article class="plant-card"><div class="plant-image" style="--plant-bg:${plantBg(p.art)}">${plantArt(p.art)}<span class="tag ${p.review?'amber':p.demo?'':'neutral'}">${p.review?'Observar':p.demo?'Exemplo':'Sem sensor'}</span><button class="icon-button" data-action="qr" data-id="${esc(p.id)}" aria-label="QR Code de ${esc(p.name)}">${icon('qr')}</button></div><div class="plant-info"><button class="plant-title-button" data-action="detail" data-id="${esc(p.id)}"><h3>${esc(p.name)}</h3></button><p class="species">${esc(p.species || 'Espécie não informada')}</p><div class="location-line">${icon('pin')}${esc(p.location)}</div><div class="reading-row"><span class="label">${icon('drop')}Índice relativo</span><span class="reading-number">${value}<small>${p.demo?'%':''}</small></span></div><div class="reading-track ${p.review?'amber':''}"><div style="width:${p.demo?Math.max(0,Math.min(100,Number(p.relative)||0)):0}%"></div></div><div class="card-footer"><span>${p.demo?'Dado ilustrativo · sem conexão':'Aguardando vincular sensor'}</span><button data-action="detail" data-id="${esc(p.id)}" aria-label="Ver detalhes de ${esc(p.name)}">Ver planta ↗</button></div></div></article>`;
}
function renderGarden() {
  const locations = ['Todas',...new Set(state.plants.map(p=>p.location))];
  if (!locations.includes(locationFilter)) locationFilter = 'Todas';
  $('location-filters').innerHTML = locations.map(l=>`<button data-location="${esc(l)}" aria-pressed="${l===locationFilter}">${esc(l)}</button>`).join('');
  const needle = query.toLocaleLowerCase('pt-BR');
  const plants = state.plants.filter(p=>(locationFilter==='Todas'||p.location===locationFilter) && (p.name+' '+p.species).toLocaleLowerCase('pt-BR').includes(needle));
  $('plant-grid').innerHTML = plants.length ? plants.map(plantCard).join('') : '<div class="empty-grid"><h3>Nenhuma planta por aqui.</h3><p>Experimente outro nome ou local, ou cadastre uma nova planta.</p><button class="button" data-action="add">Cadastrar planta</button></div>';
  $('total-plants').textContent = state.plants.length;
  $('plant-count').textContent = String(plants.length).padStart(2,'0');
  $('nav-count').textContent = state.plants.length;
  $('review-count').textContent = state.plants.filter(p=>p.review).length;
  if (!state.plants.some(p=>p.id===chartPlantId)) chartPlantId = state.plants[0]?.id;
  $('chart-plant').innerHTML = state.plants.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('');
  $('chart-plant').value = chartPlantId || '';
  drawChart();
}
function drawChart() {
  const holder = $('history-chart');
  if (currentView !== 'jardim' || !holder.clientWidth) return;
  const p = state.plants.find(p=>p.id===chartPlantId);
  if (!p?.demo) {holder.innerHTML='<div class="unavailable"><p>Sem histórico. Vincule um sensor quando a integração estiver disponível.</p></div>';return;}
  const w = holder.clientWidth, h = 177, left = 30, right = 8, top = 16, bottom = 24;
  const n = period==='24'?25:15;
  const values = Array.from({length:n},(_,i)=>Math.max(8,Math.min(97,Number(p.relative)+8*Math.sin(i*.55)+5*Math.cos(i*.91)-(i>n*.45&&i<n*.6?14:0))));
  const x = i=>left+i/(n-1)*(w-left-right), y = v=>top+(100-v)/100*(h-top-bottom);
  const d = values.map((v,i)=>(i?'L':'M')+x(i).toFixed(1)+','+y(v).toFixed(1)).join(' ');
  const area = d+` L${x(n-1)},${y(0)} L${x(0)},${y(0)} Z`;
  const ticks = [0,25,50,75,100];
  const labels = period==='24'?['00h','06h','12h','18h','24h']:['14 out','16 out','18 out','20 out'];
  holder.innerHTML = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Histórico ilustrativo do índice relativo de ${esc(p.name)}, de 0 a 100 por cento. Não são dados medidos."><defs><linearGradient id="history-fill" x1="0" x2="0" y2="1"><stop stop-color="#9bb480" stop-opacity=".19"/><stop offset="1" stop-color="#9bb480" stop-opacity=".015"/></linearGradient></defs>${ticks.map(v=>`<path d="M${left} ${y(v)}H${w-right}" stroke="#edf0e6" stroke-width="1" ${v?'stroke-dasharray="3 4"':''}/><text x="${left-8}" y="${y(v)+3}" text-anchor="end" fill="#a4ad99" font-family="system-ui" font-size="8">${v}</text>`).join('')}<path d="${area}" fill="url(#history-fill)"/><path d="${d}" fill="none" stroke="#94ab7d" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>${labels.map((l,i)=>`<text x="${left+i/(labels.length-1)*(w-left-right)}" y="${h-4}" text-anchor="${i===0?'start':i===labels.length-1?'end':'middle'}" fill="#a4ad99" font-family="system-ui" font-size="8">${l}</text>`).join('')}<text x="${left}" y="9" fill="#a4ad99" font-size="7" font-family="system-ui">ÍNDICE (%)</text></svg>`;
}
function renderEvents() {
  $('events-list').innerHTML = state.events.length ? state.events.map(e=>`<article class="event"><span>${icon('leaf')}</span><div><small>${esc(new Date(e.at).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'}))} · registro local</small><h3>${esc(e.title)}</h3><p>${esc(e.description)}</p></div></article>`).join('') : '<div class="panel unavailable"><span>'+icon('chart')+'</span><h3>A história começa aqui.</h3><p>Cadastre uma planta ou anote uma rega nos detalhes dela. Seus registros aparecerão nesta linha do tempo.</p></div>';
}
function renderAll() {renderGarden();renderEvents();$('space-name').value=state.name;}
function setView(view) {
  currentView = ['jardim','historico','dispositivos','configuracoes'].includes(view)?view:'jardim';
  const ids = {jardim:'garden-view',historico:'history-view',dispositivos:'devices-view',configuracoes:'settings-view'};
  for (const [key,id] of Object.entries(ids)) $(id).hidden=key!==currentView;
  document.querySelectorAll('[data-nav]').forEach(a=>{a.classList.toggle('active',a.dataset.nav===currentView);if(a.dataset.nav===currentView)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  $('breadcrumb').textContent = {jardim:state.name,historico:'Linha do tempo',dispositivos:'Dispositivos',configuracoes:'Configurações'}[currentView];
  if(currentView==='jardim')drawChart();if(currentView==='historico')renderEvents();
}
function route() {
  const hash=location.hash.slice(1);
  if(hash.startsWith('planta/')) {setView('jardim');let id;try{id=decodeURIComponent(hash.slice(7));}catch{id='';}if(state.plants.some(p=>p.id===id))openPlant(id);else showInfo('Planta não encontrada','<p>Este cadastro não existe neste navegador. Nesta demonstração, QR Codes de plantas criadas por você só encontram os dados no navegador onde foram cadastradas. O compartilhamento entre dispositivos dependerá do banco de dados.</p>');}
  else {if($('plant-dialog').open)$('plant-dialog').close();setView(hash||'jardim');}
}
function openPlant(id,tab='visao') {
  selectedId=id;detailTab=tab;renderDetail();if(!$('plant-dialog').open)$('plant-dialog').showModal();
}
function renderDetail() {
  const p=state.plants.find(p=>p.id===selectedId);if(!p)return;
  const tabs=[['visao','Visão geral'],['cuidados','Cuidados'],['camera','Câmera e fotos'],['qr','QR Code']];
  let content='';
  if(detailTab==='visao')content=`<div class="detail-metrics"><div><span>Índice relativo ${p.demo?'· exemplo':''}</span><strong>${p.demo?Number(p.relative).toFixed(1)+'%':'—'}</strong><small>${p.demo?'Simulado; não é uma recomendação':'Nenhum sensor vinculado'}</small></div><div><span>Leitura bruta ${p.demo?'· exemplo':''}</span><strong>${p.demo?esc(p.raw):'—'}</strong><small>Sem conexão com hardware</small></div></div><div class="detail-section"><h3>Um pouco sobre ela</h3><p>Substrato: ${esc(p.soil||'Ainda não informado')}</p><p class="detail-notes">${esc(p.notes||'Adicione suas primeiras observações ao editar esta planta.')}</p></div><div class="detail-notice">${p.demo?'Este cadastro e seus valores são exemplos visuais. A leitura real do seu ESP32 continua disponível apenas na página local da placa.':'Este cadastro é local. Leituras reais estarão disponíveis depois da integração com sensores e banco.'}</div><div class="detail-actions"><button class="button primary" data-action="water-note" data-id="${esc(p.id)}">${icon('drop')}Anotar rega manual</button><button class="button" data-action="edit" data-id="${esc(p.id)}">${icon('edit')}Editar planta</button><button class="button" data-action="review" data-id="${esc(p.id)}">${icon('eye')}${p.review?'Retirar marcação':'Marcar para observar'}</button></div><p class="field-note" style="margin-top:12px">Anotar uma rega não liga a bomba nem altera a leitura.</p>`;
  if(detailTab==='cuidados')content=`<div class="detail-section"><h3>Cuidar começa por conhecer.</h3><span class="tag neutral">Perfil ainda não definido</span><p>Espécie cadastrada: <strong>${esc(p.species||'não informada')}</strong>. Ainda não há pesquisa botânica ou IA conectada neste teste.</p><p>As recomendações futuras considerarão espécie, substrato e histórico. Nenhum percentual ideal foi atribuído automaticamente.</p><label for="ai-context">Observações para uma consulta</label><textarea id="ai-context" class="prompt-output" rows="3" placeholder="Ex.: folhas amareladas há três dias, local com pouca luz…"></textarea><div class="detail-actions"><button class="button" data-action="prepare-ai">${icon('spark')}Preparar contexto para consulta</button></div><div id="prepared-context"></div><p class="detail-notice">Esta ação prepara um texto para você revisar e copiar. Não envia dados a um serviço de IA e não faz diagnóstico.</p></div>`;
  if(detailTab==='camera')content=`<div class="unavailable"><span>${icon('camera')}</span><h3>Vamos acompanhar cada nova folha.</h3><p>Nenhuma câmera está vinculada a esta planta. As ilustrações do painel não são fotos capturadas.</p><p>No módulo futuro: uma foto por dia, galeria de evolução, visualização ao vivo e análise assistida das imagens.</p><span class="tag neutral">Hardware e integração pendentes</span></div>`;
  if(detailTab==='qr')content=`<div class="qr-layout"><div id="qr-code" class="qr-code"></div><div class="detail-section"><h3>A página dela, em um toque.</h3><p>O QR Code abre o endereço desta planta. Ele não contém senha nem comando de rega.</p><p class="qr-url" id="qr-url"></p><button class="button" data-action="download-qr">${icon('download')}Baixar etiqueta SVG</button></div></div><p class="detail-notice">O endereço usa a instalação que você abriu. Se estiver usando localhost, abra pelo IP do computador ou por um domínio acessível antes de gerar uma etiqueta para outro aparelho. Plantas cadastradas ficam neste navegador; a sincronização entre dispositivos dependerá do banco de dados.</p>`;
  $('plant-detail').innerHTML=`<div class="detail-header"><div class="detail-art" style="--plant-bg:${plantBg(p.art)}">${plantArt(p.art)}</div><div><span class="tag ${p.demo?'':'neutral'}">${p.demo?'Planta de demonstração':'Cadastro local'}</span><h2 id="detail-name">${esc(p.name)}</h2><p class="species">${esc(p.species||'Espécie não informada')}</p><div class="location-line">${icon('pin')}${esc(p.location)}</div></div></div><div class="detail-tabs" role="tablist" aria-label="Detalhes da planta">${tabs.map(([key,label])=>`<button role="tab" id="detail-tab-${key}" aria-controls="detail-content" data-detail-tab="${key}" aria-selected="${detailTab===key}">${label}</button>`).join('')}</div><section id="detail-content" role="tabpanel" aria-labelledby="detail-tab-${detailTab}">${content}</section>`;
  if(detailTab==='qr')renderQr(p);
}
function plantUrl(p) { return buildPlantUrl(location.href, p.id); }
function renderQr(p) {
  const url=plantUrl(p);$('qr-url').textContent=url;
  if(typeof qrcode!=='function'){$('qr-code').textContent='QR indisponível. O endereço da planta está ao lado.';return;}
  const code=qrcode(0,'M');code.addData(url);code.make();$('qr-code').innerHTML=code.createSvgTag({cellSize:4,margin:4,scalable:true});
}
function showInfo(title,html) {$('info-content').innerHTML=`<h2 id="info-title">${esc(title)}</h2>${html}`;if(!$('info-dialog').open)$('info-dialog').showModal();}
function openForm(p=null) {
  if($('plant-dialog').open)$('plant-dialog').close();
  $('plant-form').reset();$('edit-id').value=p?.id||'';
  $('form-title').textContent=p?'Cada detalhe importa.':'Quem vai entrar no jardim?';
  for(const key of ['name','species','location','soil','notes'])$('field-'+key).value=p?.[key]||'';
  $('add-dialog').showModal();
}
function download(name,content,type) {const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
document.addEventListener('click',async e=>{
  const close=e.target.closest('[data-close]');if(close){$(close.dataset.close).close();return;}
  const filter=e.target.closest('[data-location]');if(filter){locationFilter=filter.dataset.location;renderGarden();return;}
  const periodButton=e.target.closest('[data-period]');if(periodButton){period=periodButton.dataset.period;document.querySelectorAll('[data-period]').forEach(b=>b.setAttribute('aria-pressed',b===periodButton));drawChart();return;}
  const tab=e.target.closest('[data-detail-tab]');if(tab){detailTab=tab.dataset.detailTab;renderDetail();document.getElementById('detail-tab-'+detailTab)?.focus();return;}
  const button=e.target.closest('[data-action]');if(!button)return;
  const action=button.dataset.action,p=state.plants.find(p=>p.id===(button.dataset.id||selectedId));
  if(action==='add')openForm();
  if(action==='detail'&&p)openPlant(p.id);
  if(action==='qr'&&p)openPlant(p.id,'qr');
  if(action==='edit'&&p)openForm(p);
  if(action==='review'&&p){p.review=!p.review;persist();renderGarden();renderDetail();toast(p.review?'Planta marcada para observar.':'Marcação retirada.');}
  if(action==='water-note'&&p){logEvent('Rega manual anotada',p.name+' · anotação do usuário; sem acionamento de bomba.');toast('Rega anotada na linha do tempo. Nenhuma bomba foi acionada.');}
  if(action==='about')showInfo('Um ensaio do seu futuro jardim.','<p>Este painel é uma demonstração de interface. Os quatro vasos iniciais, leituras e gráficos são exemplos. Nenhum índice aqui representa o estado atual de uma planta real.</p><p>Você pode cadastrar e editar plantas, filtrar por local, anotar regas e gerar QR Codes. Tudo fica salvo somente neste navegador.</p><p>Wi-Fi e leitura local já foram testados no seu ESP32. A próxima integração é a API e o banco para trazer essas leituras ao painel.</p>');
  if(action==='camera')showInfo('Mais perto, mesmo de longe.','<p>O módulo de câmera está planejado, mas ainda não conectado.</p><ol><li>Uma foto por dia, em horário configurável.</li><li>Galeria por planta para acompanhar o crescimento.</li><li>Visualização ao vivo sob demanda, com acesso privado.</li><li>Consulta assistida com foto, espécie e histórico para investigar possíveis problemas.</li></ol><p>O funcionamento da câmera será independente do controle de irrigação.</p>');
  if(action==='test-guide')showInfo('Do protótipo ao jardim conectado.','<p>O teste local do ESP32 funcionou, conforme seu relato. Para trazer leituras reais a este painel, precisamos implementar:</p><ol><li>API autenticada para receber as leituras.</li><li>Banco com histórico e calibração de cada sensor.</li><li>Associação entre sensor, vaso e controlador.</li><li>Estados de conexão e tratamento de dados antigos.</li></ol><p>O painel atual não procura nem acessa dispositivos da sua rede.</p>');
  if(action==='export')download('watermyplants-registros.json',JSON.stringify({...state,exportedAt:new Date().toISOString(),source:'prototipo-local-sem-telemetria'},null,2),'application/json');
  if(action==='download-qr'&&p){const svg=$('qr-code')?.querySelector('svg');if(!svg){toast('O QR Code não pôde ser gerado.');return;}const qr=svg.outerHTML;const label=esc(p.name);const output=`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="375" viewBox="0 0 320 375"><rect width="320" height="375" rx="18" fill="white"/><svg x="20" y="15" width="280" height="280" viewBox="${svg.getAttribute('viewBox')}">${svg.innerHTML}</svg><text x="160" y="320" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#244b39">${label.length>70?label.slice(0,65)+'…':label}</text><text x="160" y="345" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#7b847b">WaterMyPlants · Abrir a página da planta</text></svg>`;download('watermyplants-'+p.id+'.svg',output,'image/svg+xml');toast('Etiqueta gerada. Sincronização entre dispositivos ainda é futura.');}
  if(action==='prepare-ai'&&p){const note=$('ai-context').value.trim();const text=`Quero investigar a saúde desta planta, sem tratar hipóteses como diagnóstico certo.\nNome: ${p.name}\nEspécie informada: ${p.species||'não identificada'}\nLocal: ${p.location}\nSubstrato: ${p.soil||'não informado'}\nObservações: ${note||'ainda não informadas'}\nNão há foto nem leitura real de sensor anexada; os números do painel são demonstrativos.\nQuais informações e fotos devo coletar para diferenciar possíveis causas? Considere também excesso de rega e peça detalhes quando necessário. Cite fontes ao pesquisar recomendações para a espécie.`;$('prepared-context').innerHTML='<label for="prepared-prompt">Contexto preparado para revisão</label><textarea id="prepared-prompt" class="prompt-output" readonly></textarea><button class="button" data-action="copy-ai">Copiar contexto</button>';$('prepared-prompt').value=text;}
  if(action==='copy-ai'){try{await navigator.clipboard.writeText($('prepared-prompt').value);toast('Contexto copiado. Nenhuma consulta foi enviada.');}catch{$('prepared-prompt').select();toast('Selecione e copie o texto. O navegador bloqueou a cópia automática.');}}
});
$('plant-form').addEventListener('submit',e=>{
  e.preventDefault();const id=$('edit-id').value;const existing=state.plants.find(p=>p.id===id);
  const data={name:$('field-name').value.trim(),species:$('field-species').value.trim(),location:$('field-location').value.trim(),soil:$('field-soil').value.trim(),notes:$('field-notes').value.trim()};
  if(!data.name||!data.location){toast('Preencha o nome e o local da planta.');return;}
  if(existing)Object.assign(existing,data);else state.plants.push({id:createId(),...data,demo:false,art:'monstera',review:false});
  logEvent(existing?'Cadastro atualizado':'Uma nova planta chegou',data.name+' · '+data.location+' · cadastro local.');$('add-dialog').close();renderAll();toast(existing?'Cadastro atualizado.':'Planta adicionada. Ela ainda não tem um sensor vinculado.');
});
$('settings-form').addEventListener('submit',e=>{e.preventDefault();const name=$('space-name').value.trim();if(!name)return;state.name=name;persist();setView('configuracoes');toast('Nome do espaço salvo neste navegador.');});
$('plant-search').addEventListener('input',e=>{query=e.target.value;renderGarden();});
$('chart-plant').addEventListener('change',e=>{chartPlantId=e.target.value;drawChart();});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
window.addEventListener('hashchange',route);
new ResizeObserver(drawChart).observe($('history-chart'));
hydrateIcons();$('camera-art').innerHTML=plantArt('monstera');renderAll();route();
