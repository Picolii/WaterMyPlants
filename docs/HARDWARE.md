# Hardware e montagem atual

## Inventário

| Item | Disponível | Situação |
|---|---|---|
| Placa ESP32S microUSB, inscrição XX5R69 | 1 informada | Sensor lido no D34; perfil PlatformIO `esp32dev` usado no teste |
| Sensor capacitivo v2.0.0 | 1 informado | VCC/3V3, GND/GND, AOUT/D34 testados pelo autor |
| Módulo de relé 5 V, dois canais, SRD-05VDC-SL-C | 1 informado | GND/IN1/IN2/VCC; circuito de entrada não validado |
| Mini bomba brushless 3–5 V | 1 informada | Corrente, partida, vazão real e uso submerso pendentes |
| Mangueira PVC | Informada | Comprimento e diâmetro interno a medir |
| USB do computador | Em uso | Alimenta o ESP32 no teste inicial |
| Carregador microUSB, rótulo 4–12 V, máx. 800 mA | Informado | Saída fixa de 5 V não confirmada; não usado no circuito testado |
| Câmera | Futura | Modelo não escolhido |

Sensor: alimentação declarada de 3,3–5,5 V e saída de 0–3,0 V. Corrente deste exemplar não medida. Conector descrito como PH2.54-3P, a confirmar fisicamente.

Bomba: saída externa 7,5 mm, saída interna 4,5 mm e entrada 5 mm, conforme anúncio fornecido. Vida declarada de 300 horas, não verificada. Mangueira anunciada como 39,37 polegadas / 400 cm, medidas incompatíveis entre si. Não deduzir encaixe sem medir diâmetro interno.

## Ligação validada no primeiro teste

| Fio | Origem | Destino |
|---|---|---|
| Alimentação | ESP32 3V3 | Sensor VCC |
| Retorno | ESP32 GND | Sensor GND |
| Sinal | Sensor AOUT | ESP32 D34/GPIO34 |

Na foto enviada, com o USB à esquerda, D34 está na fileira superior, entre D35 e VN. O 3V3 fica na fileira inferior, perto do USB, com GND ao lado. Seguir sempre a serigrafia. O código usa `34`, sem a letra D.

## Montagem de potência futura

O [estudo inicial](../PROJETO.md) contém a proposta COM/NO para a bomba e a interface de comando a definir. Essas ligações não foram testadas. Antes de fechar o circuito, identificar nível ativo de IN1, compatibilidade com lógica de 3,3 V e consumo da bomba. Não utilizar a capacidade de corrente escrita no relé como consumo real.

O retorno de potência da bomba deve ser planejado para não passar pelo ESP32. Dimensionar fonte, cabos, conectores, proteção e supressão de transientes conforme os componentes reais. O carregador informado ainda não foi validado para essa função.

## Projeto físico e evidências

O modelo atual é conceitual, sem escala e sem posições mecânicas finais dos pinos. Para CAD imprimível, registrar largura/comprimento das placas, furos, alturas, conectores e raio de curvatura dos cabos. Prever módulos removíveis, identificação de cada fio, alívio de tração e separação da água.

Fotos físicas adicionais serão incorporadas com legenda e referência ao teste/versão correspondente. Uma foto do ESP32 já foi enviada na conversa; a inclusão no repositório de imagens será feita junto da organização dos arquivos originais.
