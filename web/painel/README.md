# WaterMyPlants — MVP 0.1.0

Primeira versão independente do painel, em HTML, CSS e JavaScript. O código pertence ao projeto e pode ser executado ou hospedado em um servidor estático de sua escolha. Não exige login ou serviço externo para abrir a interface.

## Executar localmente

Com Node.js 20 ou superior, execute `npm start` na **raiz do repositório**, ou `node serve.mjs` nesta pasta. Abra o endereço exibido, normalmente http://127.0.0.1:4178. Não há instalação de dependências necessária para executar esta versão. O servidor publica somente `dist/`, sem expor fontes do servidor, firmware ou credenciais do ESP32.

### Testar pelo celular na mesma rede

No PowerShell, na raiz do repositório:

```powershell
$env:HOST = '0.0.0.0'
npm start
```

No celular, abra `http://IP-DO-COMPUTADOR:4178` usando o IPv4 da rede local do PC. O computador deve estar ligado e o roteador/firewall precisa permitir a conexão. O painel MVP não tem autenticação própria; use essa opção somente em rede confiável, sem encaminhar portas para a internet. Para voltar a executar apenas no computador, remova a variável com `Remove-Item Env:HOST` antes de iniciar novamente. A porta pode ser alterada com a variável `PORT`.

### Hospedar fora do computador

Publique apenas o conteúdo de `web/painel/dist/` em hospedagem estática HTTP/HTTPS. Não é preciso build, função de servidor, conta de IA ou SDK. As rotas de plantas usam `#planta/<id>`, dispensando regras de fallback do servidor. Mantenha todos os arquivos da pasta e seus caminhos relativos; os módulos JavaScript precisam ser servidos com MIME apropriado. Abrir `index.html` diretamente por `file://` não é suportado.

Os QR Codes usam o domínio e a subpasta da instalação atual. Em localhost, eles continuam apontando para o próprio computador: abra primeiro o painel pelo IP da rede ou domínio final para gerar uma etiqueta acessível a outro aparelho. A sincronização de cadastros ainda depende da futura API/banco.

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

As quatro plantas iniciais, os índices e as curvas são dados de demonstração. Uma planta criada começa sem leitura. Anotar rega não aciona bomba. Não há conta interna, banco, sincronização entre navegadores, câmera, análise automática por IA ou vínculo com o ESP32. Qualquer pessoa com acesso ao endereço da instalação pode abrir a interface; os cadastros continuam locais ao navegador.

O armazenamento é `localStorage`, separado por origem/navegador; limpar os dados do site remove os registros locais. Em outro aparelho, plantas personalizadas não estarão disponíveis via QR até existir sincronização no backend. Os IDs das quatro plantas de exemplo são fixos, permitindo demonstrar a navegação por URL.

Nenhuma faixa botânica de umidade foi criada. O índice ilustrativo não é teor volumétrico de água ou percentual de umidade do ar. A integração futura deve manter leitura bruta, calibração e qualidade/idade dos dados.

## Arquivos e dependências

- `dist/index.html`: estrutura e diálogos.
- `dist/styles.css`: identidade e layout responsivo.
- `dist/app.js`: estado local, navegação, gráficos e interações.
- `dist/plant-url.js`: endereços permanentes por planta, relativos à instalação atual.
- `dist/ids.js`: identificação das plantas e eventos, inclusive em HTTP na rede local.
- `dist/vendor/qrcode.js`: qrcode-generator 1.4.4, MIT; atribuição e licença em `LICENSE.qrcode.txt`.
- Fonte DM Sans por Google Fonts, com fonte local de reserva. As ilustrações vetoriais são próprias, geradas no navegador e não representam fotografias.
- `serve.mjs`: servidor de desenvolvimento, sem dependências adicionais.
- `tests/dashboard.test.mjs`: testes de geração de URLs e comportamento HTTP.

## Verificação

Na raiz, execute `npm run check` e `npm test`. Os testes exercitam domínio/subpasta do QR Code, descarte de parâmetros temporários, entrega do painel e recursos, requisições HEAD, bloqueio de arquivos externos à pasta pública e tratamento de métodos/caminhos inválidos.

O [T005](../../docs/testes/T005-painel-demo.md) preserva o histórico do primeiro protótipo visual. A migração para o MVP independente está documentada em [T006](../../docs/testes/T006-mvp-independente.md).
