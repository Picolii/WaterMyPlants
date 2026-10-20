# 🌱 WaterMyPlants

**Irrigação e acompanhamento de plantas com ESP32, painel web e histórico por vaso.**

Projeto em construção, documentado desde o primeiro sensor conectado: componentes, ligações, firmware, experimentos, resultados e modelos físicos. A proposta é acompanhar várias plantas pelo celular e automatizar a rega conforme as condições de cada vaso.

## O que já funciona

- [x] ESP32 conectado ao computador por microUSB.
- [x] Sensor capacitivo alimentado em 3,3 V e lido pelo D34/GPIO34.
- [x] Leituras no Monitor Serial usando PlatformIO e framework Arduino.
- [x] Calibração inicial: **3060 para terra seca** e **2107 para terra úmida**.
- [x] Média de 20 amostras e exibição de índice relativo entre 0 e 100%.
- [x] Resultados dos primeiros testes registrados.

**Ainda não implementados:** Wi-Fi, API, banco, painel, QR Codes, câmera, análise por IA e acionamento da bomba. O teste atual foi executado pelo autor no hardware; não há validação de irrigação automática.

## Visão do projeto

Cada planta terá uma página com nome, espécie, vaso, substrato, sensor associado, últimas leituras e histórico. Um **QR Code na planta** abrirá essa página no celular. A identificação da espécie poderá ajudar a pesquisar cuidados com fontes e propor um perfil de rega.

Mais adiante, câmeras registrarão **uma foto por dia**, com galeria de evolução e visualização ao vivo sob demanda. A análise por IA combinará fotos, espécie e histórico para sugerir possíveis causas de problemas e próximos passos de observação. Essa análise será uma hipótese assistida, não um diagnóstico garantido nem uma autorização direta para acionar a bomba.

As regras de rega ficarão no controlador, com limites de tempo e tratamento de falhas, para que a operação não dependa de uma conexão permanente com a nuvem.

```mermaid
flowchart LR
    S[Sensor de solo] --> E[ESP32]
    E --> R[Relé e bomba ou válvula]
    E <-->|Wi-Fi e HTTPS — planejado| A[API]
    A <--> B[Banco de dados]
    P[Painel web no celular] <--> A
    Q[QR Code por planta] --> P
    C[Câmera futura] --> F[Fotos e transmissão]
    F --> P
    A <--> I[Pesquisa e análise por IA — futuro]
```

## Primeiro teste: sensor de solo

Desconecte o USB para montar os fios. Use os nomes impressos nas placas; a posição e as cores dos cabos podem variar.

| Sensor | ESP32 | Função |
|---|---|---|
| VCC | 3V3 | Alimentação de 3,3 V |
| GND | GND | Referência e retorno |
| AOUT, também transcrito como AUOT | D34 / GPIO34 | Saída analógica |

Neste teste, o ESP32 recebe energia pelo USB do computador. Relé, bomba e carregador externo ficam fora do circuito.

1. Abra a pasta [`firmware/esp32`](firmware/esp32) como projeto no PlatformIO.
2. O perfil usado é **Espressif ESP32 Dev Module** (`esp32dev`), com framework **Arduino**.
3. Compile com **Build** e grave com **Upload**.
4. Abra o **Monitor Serial em 115200 baud**.
5. Compare leituras na terra seca e úmida, mantendo a mesma profundidade e sem tocar na haste.

Com a CLI do PlatformIO instalada, na pasta do firmware:

```sh
pio run
pio run --target upload
pio device monitor --baud 115200
```

Saída observada no teste do autor:

```text
Leitura: 2097 | Indice relativo: 100.0%
Leitura: 2474 | Indice relativo: 61.5%
```

**O índice não é o percentual real de água no solo.** É uma escala entre duas referências experimentais. Fora da terra também pode indicar 0%; portanto, 0% sozinho não comprova que o sensor esteja corretamente instalado. Limites de rega ainda não foram definidos.

## Documentação

| Conteúdo | Arquivo |
|---|---|
| Etapas e critérios de conclusão | [Roteiro](docs/ROTEIRO.md) |
| Componentes, alimentação e ligações | [Hardware](docs/HARDWARE.md) |
| Entidades, painel, QR Code, câmera e IA | [Arquitetura](docs/ARQUITETURA.md) |
| Testes realizados e resultados | [Diário de desenvolvimento](docs/DIARIO.md) |
| Como registrar os próximos testes | [Procedimento de documentação](docs/COMO-DOCUMENTAR.md) |
| Amostras de calibração | [Dados em CSV](docs/testes/2026-10-19-calibracao.csv) |
| Estudo elétrico inicial e pendências | [Projeto inicial](PROJETO.md) |
| Modelos e referências visuais | [Modelos](models/README.md) |

## Expansão

O módulo atual tem dois canais de relé, mas há apenas um sensor e uma bomba disponíveis. Para controlar vasos independentemente, será necessário definir sensores e caminhos hidráulicos próprios, com bombas ou válvulas adequadas. A arquitetura separará plantas, sensores, controladores e zonas de irrigação para permitir novos canais e novos ESP32.

## Próxima etapa

Conectar o ESP32 ao Wi-Fi e definir a API e o armazenamento das leituras. Em seguida, construir o painel por planta, com histórico e estado de conexão. O controle da bomba será testado depois de confirmar alimentação, corrente e compatibilidade do relé.

## Referências técnicas

- [ADC no Arduino-ESP32](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/adc.html)
- [Perfil esp32dev no PlatformIO](https://docs.platformio.org/en/stable/boards/espressif32/esp32dev.html)
- [Irrigação orientada por sensores — University of Minnesota Extension](https://extension.umn.edu/natural-resources/conservation/agricultural-soil-and-water/irrigation/soil-moisture-sensors-for-irrigation-scheduling)

Credenciais de Wi-Fi, tokens e chaves de API não devem entrar no repositório. A licença do projeto ainda será escolhida pelo autor.
