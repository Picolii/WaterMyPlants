// Preserve the installation path and discard temporary URL parameters.
export function buildPlantUrl(baseUrl, plantId) {
  if (typeof plantId !== 'string' || !plantId.trim()) {
    throw new TypeError('A planta precisa de um identificador.');
  }
  const url = new URL(baseUrl);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new TypeError('Abra o painel por um endereço HTTP ou HTTPS.');
  }
  url.search = '';
  url.hash = 'planta/' + encodeURIComponent(plantId);
  return url.href;
}
