# Histórico de versões

## 0.1.0 — primeiro MVP independente — 20/10/2026

### Painel

- Interface do WaterMyPlants dentro do repositório, com HTML, CSS e JavaScript separados.
- Cadastro/edição de plantas, busca, filtros, detalhes e marcação de observação.
- Linha do tempo, anotação de regas manuais e exportação JSON, com persistência no navegador.
- QR Code por planta e etiqueta SVG, usando o domínio/subpasta da instalação atual.
- Interface responsiva e estados de integração pendente para câmera, sensores e cuidados por IA.

### Execução e independência

- `npm start` na raiz, sem dependências npm de execução.
- Servidor local com HOST/PORT configuráveis, servindo somente a pasta pública.
- Removido o endereço fixo da plataforma anterior da geração de QR Codes e removidas mensagens de login do serviço anterior.
- Arquivos estáticos prontos para hospedagem própria, sem publicação automática atrelada a um fornecedor.
- Testes automatizados para URLs e servidor HTTP.

### Firmware e limites

O firmware com leitura do sensor e página local no ESP32 foi preservado. O painel MVP ainda usa exemplos e não recebe telemetria: banco, API autenticada, sincronização entre aparelhos, câmera e análise por IA são etapas futuras. O produto completo de irrigação automática não está concluído nesta versão.
