# T004 — Wi-Fi e leitura pelo celular

Estado: firmware preparado; teste físico pendente. Nesta etapa não há API na nuvem, banco, histórico persistente ou bomba conectada.

## Verificação de desenvolvimento — 19/10/2026

- Compilação concluída com sucesso em `esp32dev`, plataforma Espressif32 7.1.3, framework `4.20017.260907+sha.dcc1105b`, WiFi e WebServer 2.0.0.
- RAM estática: 37.552 bytes (11,5%); flash do programa: 480.785 bytes (36,7%). Esses valores são do build, não medições de consumo elétrico nem de memória durante uso.
- Lógica JavaScript verificada com respostas simuladas: leitura válida, perda de contato com retenção identificada, espera da primeira leitura, recuperação de conexão e amostra atrasada.
- Arquivo `include/secrets.h` confirmado como ignorado pelo Git; credenciais não configuradas no teste de desenvolvimento. Nenhum upload ou teste de rede no ESP32 foi realizado pelo assistente.

## Preparar e gravar

1. Manter as mesmas três ligações do sensor, com o ESP32 alimentado pelo USB do PC.
2. Abrir `firmware/esp32` como projeto no PlatformIO.
3. Copiar `include/secrets.example.h` para `include/secrets.h` se esse arquivo local ainda não existir.
4. No arquivo **secrets.h**, preencher `WIFI_SSID` com o nome exato da rede de 2,4 GHz e `WIFI_PASSWORD` com a senha, entre aspas. Se houver aspas ou barra invertida na senha, escapá-las como string C++. Não enviar esse arquivo para o Git ou para a conversa.
5. Compilar, fazer Upload e abrir Monitor Serial em 115200. Se perder as primeiras mensagens, pressionar EN para reiniciar a placa.
6. Aguardar a mensagem `Wi-Fi conectado! Abra no celular, na mesma rede: http://...`.
7. Conectar o celular ao mesmo roteador, sem isolamento entre clientes/rede de convidados, e digitar **http://** seguido do IP exibido. O celular pode estar em 5 GHz se o roteador permitir comunicação com a rede de 2,4 GHz do ESP32.

O IP não é fixo e pode mudar após reinicialização/reconexão. Usar o endereço exibido no Serial. A página funciona apenas na rede local, enquanto o ESP32 estiver ligado. HTTP local, sem login, apenas leitura: não abrir portas do roteador nem usar como serviço público. A autenticação do painel futuro será uma etapa separada.

Sem SSID configurado, o firmware informa a falta de configuração e mantém a leitura no Serial. O exemplo versionado contém strings vazias; o arquivo local é ignorado pelo Git. Não é necessária biblioteca adicional às fornecidas pelo Arduino-ESP32.

## O que observar

- Leitura serial próxima à versão anterior, atualizada aproximadamente a cada segundo.
- Página mostrando valor bruto, índice relativo, idade da amostra, sinal Wi-Fi e tempo ligado.
- Endpoint local `GET /api/leitura` retornando JSON com identificação e versão da calibração. Tempo ligado não é data/hora de calendário; `sample_age_ms` indica idade da amostra e lida com a virada de `millis()` por subtração sem sinal.
- Atualização sem recarregar a página. Em perda de contato, valores antigos ficam identificados e a idade continua aumentando enquanto a página estiver ativa.

## Testes físicos a executar pelo autor

| Caso | Resultado esperado | Observado |
|---|---|---|
| Rede e senha corretas | IP no Serial; página acessível no celular | Pendente |
| Alterar condição do sensor | Serial e página acompanham os valores | Pendente |
| Roteador indisponível ao ligar | Leituras locais continuam; novas tentativas de conexão | Pendente |
| Wi-Fi cai e volta | Leituras locais continuam; reconecta e informa IP | Pendente |
| ESP32 desligado com página aberta | Página indica sem contato e mantém valor antigo identificado | Pendente |

As 20 amostras agora são coletadas em passos de 10 ms sem um laço de espera de 200 ms, permitindo atender a rede entre amostras. A publicação continua aproximadamente uma vez por segundo. Não há `while` aguardando conexão. O servidor HTTP síncrono é destinado a este teste local; não é garantia de execução em tempo real nem a arquitetura definitiva do controle da bomba.

## Resultado a enviar

Mensagem de conexão e IP exibidos no Serial (sem credenciais), captura da página e resultado dos testes acima. Registrar versão/commit, data e observações antes de marcar o teste como concluído.

## Referências

- [Wi-Fi no Arduino-ESP32](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/wifi.html)
- [Servidor HTTP de exemplo da Espressif](https://github.com/espressif/arduino-esp32/blob/master/libraries/WebServer/examples/HelloServer/HelloServer.ino)
