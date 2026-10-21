# T005 — Painel personalizado do WaterMyPlants

Data de desenvolvimento: 20/10/2026, America/Sao_Paulo.

## Objetivo

Experimentar o visual e os fluxos de uma interface próxima ao produto final, antes da integração com API e banco. O pedido foi construir um painel mais customizado, acessível também pelo celular. O firmware do ESP32 não foi alterado nesta etapa.

## Entrega

Fonte em [`web/painel`](../../web/painel/README.md). HTML, CSS e JavaScript separados, sem framework ou processo de build. Identidade em verde e creme, tipografia com títulos em serifada e ilustrações botânicas próprias. O painel fornece:

- Cadastro e edição de plantas, espécie, local, substrato e anotações.
- Busca e filtro por local.
- Detalhe da planta com abas de visão geral, cuidados, câmera/fotos e QR Code.
- Índices e gráficos identificados como demonstração.
- Cadastro novo sem leitura fictícia.
- Marcação para observar e anotação de regas manuais.
- Linha do tempo local e exportação JSON.
- QR Code real com download da etiqueta SVG.
- Preparação de contexto em texto para consulta futura, sem integração com IA.
- Dispositivos com estado real de integração pendente.

## Testes executados no navegador

| Caso | Resultado observado |
|---|---|
| Página inicial | Carregamento HTTP 200, ilustrações e controles presentes |
| Nova planta | Nome, espécie, local e substrato salvos; contador atualizado |
| Planta cadastrada | Estado sem sensor, sem valor numérico inventado |
| QR Code | Código renderizado com URL da planta e aviso sobre sincronização |
| Regar manualmente | Ação somente de anotação; evento exibido na linha do tempo |
| Layout | Inspeção na largura desktop disponível e quadros de 390/320 px |
| Sintaxe JavaScript | `node --check` passou em `app.js` e `serve.mjs` |

Uma correção foi feita após inspeção visual: o desenho da folha superior da zamioculca tinha coordenadas concatenadas incorretamente. Também foram ajustadas a composição em quatro colunas e a legibilidade dos textos secundários.

## Limites e interpretação

As quatro plantas iniciais e os gráficos são exemplos; não representam os vasos do autor nem dados recebidos do ESP32. Os exemplos não sugerem limiares de rega por espécie. A fonte dos registros é o navegador, sem sincronização ou histórico na nuvem.

Um QR Code de planta criada localmente não consegue recuperar esse cadastro em outro navegador até existir backend. Os quatro IDs de exemplo são estáveis e demonstram a navegação por URL. O acesso ao site hospedado é privado.

Não há câmera, análise de imagem, pesquisa botânica, acionamento de bomba ou diagnóstico conectado. Preparar contexto só produz texto revisável; não faz chamada a serviço externo. Anotar rega não modifica o estado do sensor.

## Publicação privada

- URL: https://watermyplants-picolii.picoli-b.chatgpt.site
- Deploy confirmado pelo serviço como `succeeded`.
- Fonte publicada no Sites: `47d729ee4a3330ff57fc0298d3d9441692bb5753`.
- ID do projeto: `appgprj_6ad81df7de688191ac1ed5e687a4ad08`.
- A abertura no navegador interno chegou ao login ChatGPT, mas a seleção da conta retornou erro HTTP 400 de tipo de conteúdo. O acesso autenticado à versão hospedada não foi confirmado nesta sessão. A verificação funcional foi feita na prévia local.
- Checkout de publicação separado: pasta `watermyplants-site` no diretório de visualizações desta conversa. O código em `web/painel` é uma cópia dos fontes verificados, sem credenciais de publicação ou metadados Git aninhados.

## Próximo passo

Avaliação do visual pelo autor, seguida da escolha de API/banco e integração de leituras reais. Migrar cadastro e eventos para persistência autenticada antes de tratar QR Codes como etiquetas de produção.
