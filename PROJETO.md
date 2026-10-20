# Irrigação automática — estudo inicial

Estado: proposta elétrica e visual conceitual. Sem escala física e sem pinagem mecânica validada. Não energizar seguindo posições desenhadas: conferir nomes impressos nas placas. Nenhuma corrente foi medida.

## Alimentação disponível — atualização

O ESP32 está conectado ao computador por microUSB. O usuário também dispõe de carregador microUSB com rótulo transcrito: entrada AC 100–255 V, 125 mA, 50/60 Hz; saída DC 4–12 V, máximo 800 mA.

Esse rótulo não confirma uma saída fixa/regulada de 5 V nem a corrente disponível especificamente em 5 V. Identificação por foto do rótulo e modelo permanece pendente. Não conectar esse carregador ao relé, à bomba ou ao ESP32 com base apenas nessa transcrição. A proposta de fonte externa regulada de 5 V ainda não está atendida por uma fonte validada. Os 125 mA são da entrada AC e não representam a corrente disponível para o projeto. Os 800 mA são um limite declarado de saída, não uma corrente que será obrigatoriamente aplicada aos componentes.

Ainda faltam corrente de operação e partida da bomba e consumo do módulo de relés para avaliar se essa capacidade seria suficiente mesmo com 5 V confirmados.

## Componentes informados

- ESP32S com microUSB; código XX5R69 não identifica com segurança o modelo da placa.
- Módulo de dois relés de 5 V, com GND, IN1, IN2 e VCC. SRD-05VDC-SL-C identifica o relé, não o circuito de entrada do módulo.
- Sensor capacitivo v2.0.0, VCC/GND/AOUT, alimentação declarada de 3,3–5,5 V e saída de 0–3,0 V.
- Bomba brushless de 3–5 V. Correntes nominal e de partida desconhecidas; uso submerso não confirmado.
- Mangueira PVC. Anúncio contraditório: 39,37 polegadas equivalem a aproximadamente 100 cm, enquanto 400 cm equivalem a aproximadamente 157,5 polegadas. Confirmar comprimento real e diâmetro interno. Saída da bomba informada: 7,5 mm externo / 4,5 mm interno; a mangueira precisa encaixar pelo seu diâmetro interno, com retenção adequada.

## Ligações propostas

ESP32 inicialmente por microUSB. Fonte externa regulada de 5 V proposta para relé e bomba; confirmar disponibilidade e capacidade. Não unir o +5 V externo ao USB/5V da placa sem verificar seu circuito de alimentação.

| Fio | Origem | Destino | Função / tensão | Corrente |
|---|---|---|---|---|
| F01 | ESP32 3V3 | Sensor VCC | Alimentação, 3,3 V | Consumo do sensor, desconhecido |
| F02 | ESP32 GND | Sensor GND | Retorno / referência | Consumo do sensor |
| F03 | Sensor AOUT | ESP32 GPIO34 | Leitura analógica, 0–3,0 V declarado | Sinal, não medida |
| F04 | Fonte +5 V | Relé VCC | Alimentação do módulo | Consumo do módulo, desconhecido |
| F05 | Fonte negativo | Relé GND | Retorno do módulo | Consumo do módulo |
| F06 | ESP32 GND | Fonte negativo | Referência comum do controle | Não dimensionado como retorno da bomba |
| F07 | Fonte +5 V | COM do canal 1 | Potência para a bomba | Corrente da bomba quando acionada |
| F08 | NO do canal 1 | Bomba positivo | Potência comutada | Corrente da bomba |
| F09 | Bomba negativo | Fonte negativo | Retorno direto da bomba | Corrente da bomba |
| F10 | GPIO26 | Interface SIG | Comando 0/3,3 V, pendente | Depende da interface |
| F11 | Interface OUT | IN1 | Comando adaptado, pendente | Depende do módulo |
| F12 | Interface GND | Fonte negativo | Retorno, se interface necessária | Depende da interface |

NC1 e contatos do canal 2 ficam livres. O estado de IN2 deve ser definido como inativo depois de identificar o módulo; não presumir que entrada flutuante mantém o canal desligado. Não unir os contatos de potência a GPIOs.

Os pinos GPIO34 e GPIO26 são propostas para o ESP32 clássico; confirmar disponibilidade na placa. GPIO34 é entrada ADC1_CH6. Configurar faixa/atenuação apropriada e calibrar a leitura; a faixa efetiva do ADC não deve ser tratada como linear e exata até 3,3 V. Não aplicar 5 V aos GPIOs.

A interface do relé depende de fotos/esquema e do nível ativo de IN1. Alguns módulos aceitam 3,3 V; outros requerem transistor/driver. O modelo reserva espaço para essa interface, sem definir circuito nem afirmar que ela já existe.

## Corrente, potência e dimensionamento

Tensão é medida entre dois pontos; corrente circula pelo circuito fechado. A corrente não pode ser deduzida apenas de "bomba 3–5 V". A marcação de capacidade dos contatos do relé é um limite, não o consumo do módulo ou da bomba.

Para a fonte externa: considerar consumo do módulo de relés, da interface e da bomba, incluindo partida e margem. O ESP32 está em alimentação USB separada nesta proposta. Potência elétrica P = V × I; queda nos fios depende de corrente, material, seção e comprimento de ida e volta. Sem esses dados não há valor confiável de carga, bitola, fusível ou queda de tensão.

Medições futuras: tensão de cada ramo; corrente do sensor; corrente do módulo com relé desligado/ligado; corrente da bomba em operação e partida; tensão mínima durante partida. Amperímetro entra em série, nunca diretamente entre os polos da fonte. Usar instrumento/faixa adequados; uma leitura lenta pode não capturar a partida.

Proteção contra transientes e interferência será definida conforme a bomba brushless e o módulo. Não presumir que um diodo no módulo protege os contatos ou resolve a eletrônica interna da bomba. Priorizar retorno de potência separado, fios da bomba afastados do sinal analógico e desacoplamento a dimensionar.

## Montagem modular futura

1. Controle: ESP32 e sensor em conectores identificados.
2. Acionamento: relé, eventual interface e bornes de potência.
3. Alimentação: distribuição DC, proteção e conectores dimensionados.
4. Hidráulica: reservatório, bomba, mangueira e vaso; eletrônica seca, acima de vazamentos, com alívio de tração e laço de gotejamento nos cabos.

Escolher conectores com polarização e travamento; validar passo real e ordem dos pinos do sensor. PH2.54 declarado no anúncio precisa de confirmação física. Para o 3D mecânico e peças imprimíveis: medir placas, furos, altura dos componentes, terminais, cabos e dimensões do vaso/reservatório. A visualização atual não é CAD para fabricação.

## Lógica de controle prevista

Calibrar seco/úmido no substrato real; não apresentar a leitura como percentual absoluto sem calibração. Depois implementar filtragem, histerese, regas curtas, espera para infiltração, tempo máximo por acionamento e limite acumulado. Inicializar desligado e permanecer desligado em falha do sensor. Identificar comportamento do relé durante boot/reset antes de operar sem supervisão. Proteção contra reservatório vazio exige medição/sensor adicional; o sensor de solo não detecta isso de forma confiável.

## Pendências para fechar o projeto

- Fotos nítidas da frente e verso do ESP32, relé e sensor, incluindo todas as inscrições e terminais COM/NO/NC.
- Fonte: tensão, corrente, conectores e rótulo; bomba: rótulo/link/manual, corrente e indicação de uso submerso.
- Medidas das placas e furos; comprimento e seção dos cabos; diâmetro interno real da mangueira.
- Quantidade de vasos, dimensões/posição do reservatório, diferença de altura e local de instalação.

## Painel para várias plantas — direção definida pelo usuário

Objetivo: painel web acessível pelo celular, cadastro por planta/espécie e histórico, com pesquisa de recomendações de cultivo na web ou via IA. Preparar expansão além dos dois canais atuais.

Modelo proposto: espécie → perfil de cuidados com fontes; planta/vaso → substrato, posição e perfil; sensor → calibração própria e leituras brutas; zona de irrigação → bomba/válvula, canal do relé e plantas atendidas; controlador ESP32 → sensores, saídas e configuração local. Identificadores e relações independentes permitem trocar hardware sem perder o histórico da planta.

Não converter automaticamente porcentagens de umidade relativa do ar ou recomendações de teor volumétrico de água para o índice relativo atual. A pesquisa por espécie orienta preferência de secagem e cuidados; limites do sensor exigem associação à calibração do vaso. Recomendações devem manter fonte, data e condição de aplicação, sem inventar porcentagens quando não existirem. IA propõe perfil na configuração; o ESP32 executa regras locais com tempo máximo, intervalo e tratamento de falhas, inclusive sem internet.

Hardware atual: um sensor e uma bomba permitem acompanhar e acionar uma zona. Dois canais de relé permitem duas saídas elétricas independentes, mas não criam dois caminhos hidráulicos; zonas independentes exigem bombas ou válvulas apropriadas e sensores adicionais. Capacidade elétrica e alimentação ainda pendentes. Expansão poderá usar mais controladores ou interfaces de expansão a dimensionar.

Primeira etapa sugerida: cadastro de plantas, identificação de sensores/canais, telemetria Wi-Fi para API autenticada, histórico com leitura bruta/índice/versão de calibração e status de conexão. Depois pesquisa assistida por espécie e acionamento com proteções locais. Nenhum painel, banco ou integração com IA foi implantado nesta etapa de definição.

### Fontes

- Espressif, documentação oficial do ESP32: https://documentation.espressif.com/esp32_datasheet_en.html
- Espressif, GPIO e funções: https://documentation.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/gpio.html
- DFRobot SEN0193, referência de sensor semelhante: https://wiki.dfrobot.com/sen0193 — não comprova corrente, conector ou circuito do exemplar v2.0.0 informado. Não transferir seus 5 mA para este projeto como valor confirmado.

Dados elétricos específicos dos componentes do usuário são os fornecidos na conversa; itens não identificados permanecem pendentes.
