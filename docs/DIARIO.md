# Diário de desenvolvimento

Os resultados abaixo foram relatados pelo autor durante os testes físicos em 19/10/2026. Não são medições executadas pelo assistente. Horários exatos de cada amostra não foram registrados. As espécies, o substrato e a profundidade de inserção ainda não foram identificados.

## T001 — Primeira leitura analógica

**Objetivo:** confirmar alimentação, leitura e comunicação serial.

**Montagem:** sensor em 3V3, GND e D34; ESP32 alimentado pelo USB do PC. PlatformIO com `esp32dev`, framework Arduino e Monitor Serial em 115200. Código preservado em [`primeira-leitura.cpp`](../firmware/exemplos/primeira-leitura.cpp).

**Leituras enviadas, na ordem:** 3195, 3195, 1232, 1219, 1237, 3216, 3151, 3161, 3151, 3153, 3138, 3153, 3138, 3133, 3269.

**Contexto informado depois:** a haste foi colocada na palma da mão. As leituras baixas não representam uma referência de solo úmido.

**Conclusão:** comunicação serial e resposta do sensor observadas. Ainda sem calibração válida de solo nesse teste.

## T002 — Referências iniciais no substrato

**Objetivo:** obter referências locais seca/úmida.

**Código:** primeira leitura, uma amostra por segundo. [Dados completos](testes/2026-10-19-calibracao.csv).

| Condição | Amostras consideradas | Média | Referência adotada |
|---|---:|---:|---:|
| Terra seca, trecho estável | 12 | 3059,6667 | 3060 |
| Terra úmida, após inserir | 17 | 2107,2353 | 2107 |

**Exclusões:** 1296 e 1687, primeiras leituras da sequência seca, anteriores ao trecho estável; causa dessa transição não confirmada. Na sequência úmida, 3203 e 3206 foram excluídos por antecederem a inserção na terra; o segundo foi explicitamente marcado como fora da terra.

**Conclusão:** adotadas referências experimentais locais. Não representam extremos universais, umidade volumétrica, ponto de murcha ou limiares definitivos de rega.

## T003 — Índice relativo e mudança de posição

**Código:** média de 20 amostras espaçadas por 10 ms, intervalo final de 800 ms; `indice = 100 × (3060 − leitura) / (3060 − 2107)`, limitado a 0–100%. Versão desse experimento preservada em [`indice-relativo.cpp`](../firmware/exemplos/indice-relativo.cpp). O `main.cpp` atual evolui para o teste de Wi-Fi.

| Contexto informado | Leituras enviadas |
|---|---|
| Sequência no ponto úmido original | 2097, 2097, 2087, 2093, 2130 |
| Fora da terra | 3183, 3178 |
| Inserção em ponto lateral e estabilização | 2915, 2458, 2471, 2474, 2472, 2476, 2475 |

**Resultados exibidos:** ponto original 100% nas primeiras leituras e 97,6% em 2130; fora da terra 0%; ponto lateral estabilizado entre 61,3% e 63,2%.

**Reteste informado:** recolocado no ponto original, voltou a 100%; não foi enviada nova sequência bruta desse retorno.

**Conclusão:** o índice segue a fórmula e a resposta se repete no ponto original. Não há evidência suficiente para separar distribuição de água, profundidade e contato com a terra como causas da diferença lateral. Fixar posição antes de avaliar tendência de secagem. O sistema não distingue automaticamente sensor fora da terra de solo muito seco.

## Decisões de escopo

- Plataforma: WaterMyPlants, painel web por planta acessível pelo celular.
- Histórico deve preservar leitura bruta e calibração usada.
- Cadastro por espécie, com pesquisa de cuidados e possibilidade de IA.
- QR Code por planta para abrir sua página.
- Câmera futura: foto diária e live sob demanda.
- Análise futura de fotos e histórico para sugerir hipóteses sobre problemas.
- Arquitetura expansível além do relé de dois canais atual.

## T004 — Retorno do autor

O autor informou que o teste funcionou: "Deu certo subiu tudo". Esse retorno confirma o funcionamento geral da versão com Wi-Fi e página local; não foram enviados logs de conexão nem resultados separados dos casos de queda de rede. A reconexão e os demais cenários de falha continuam pendentes.

## T005 — Primeiro painel personalizado

Em 20/10/2026 foi criado um painel de demonstração próximo à visão final, com identidade do WaterMyPlants, cadastro de plantas, filtros, detalhes, QR Code e registro local de regas. Dados ilustrativos separados dos dados físicos. Código em `web/painel` e procedimento/resultados em [T005-painel-demo.md](testes/T005-painel-demo.md). Interface verificada no navegador; avaliação do autor e conexão a backend ainda pendentes.

## Próximo experimento

Definir e integrar API/banco com o ESP32 e o painel. Registrar configurações sem credenciais, amostras persistidas e testes de dados antigos/offline. Finalizar os cenários de falha do [T004](testes/T004-wifi-local.md).
