# WaterMyPlants — painel de demonstração

Protótipo de interface estática com HTML, CSS e JavaScript, criado em 20/10/2026 para explorar o painel final do projeto. A versão publicada é privada.

Endereço: https://watermyplants-picolii.picoli-b.chatgpt.site — requer login do proprietário. A publicação foi confirmada; o login no navegador interno apresentou erro na verificação desta sessão. Veja [registro T005](../../docs/testes/T005-painel-demo.md).

## Executar localmente

Com Node.js instalado, execute `node serve.mjs` nesta pasta e abra o endereço exibido. O servidor serve somente `dist/`, na interface local `127.0.0.1`. Não serve firmware ou credenciais do ESP32.

## Funcional neste teste

- Cadastro e edição de plantas, busca por nome/espécie e filtro por local.
- Detalhes por planta, marcação de observação e anotação de rega manual.
- Linha do tempo das ações do usuário, salva no navegador.
- Gráficos ilustrativos por planta e período, sem telemetria real.
- QR Code com URL por planta e exportação de etiqueta SVG.
- Preparação de contexto em texto para uma consulta futura, sem chamada a IA.
- Nome do espaço configurável e exportação dos registros locais em JSON.
- Layout para desktop e celular, com estados de hardware não conectado.

## Limites

As quatro plantas iniciais, os índices e as curvas são dados de demonstração. Uma planta criada começa sem leitura. Anotar rega não aciona bomba. Não há conta interna, banco, sincronização entre navegadores, câmera, análise automática por IA ou vínculo com o ESP32. A privacidade da versão hospedada é controlada pelo Sites.

O armazenamento é `localStorage`, separado por origem/navegador; limpar os dados do site remove os registros locais. Em outro aparelho, plantas personalizadas não estarão disponíveis via QR até existir sincronização no backend. Os IDs das quatro plantas de exemplo são fixos, permitindo demonstrar a navegação por URL.

Nenhuma faixa botânica de umidade foi criada. O índice ilustrativo não é teor volumétrico de água ou percentual de umidade do ar. A integração futura deve manter leitura bruta, calibração e qualidade/idade dos dados.

## Arquivos e dependências

- `dist/index.html`: estrutura e diálogos.
- `dist/styles.css`: identidade e layout responsivo.
- `dist/app.js`: estado local, navegação, gráficos e interações.
- `dist/vendor/qrcode.js`: qrcode-generator 1.4.4, MIT; atribuição e licença em `LICENSE.qrcode.txt`.
- Fonte DM Sans por Google Fonts, com fonte local de reserva. As ilustrações vetoriais são próprias, geradas no navegador e não representam fotografias.
- `serve.mjs`: servidor de desenvolvimento, sem dependências adicionais.

## Verificação

Sintaxe JavaScript conferida com `node --check`; resposta HTTP 200; cadastro com nome/espécie/local/substrato, estado sem sensor, QR Code e anotação de rega/linha do tempo verificados no navegador. Layout inspecionado na largura desktop disponível e em quadros de 390 e 320 px. Os dados de QA ficam somente na origem local de desenvolvimento, sem serem incluídos nos arquivos publicados.
