# Roteiro do WaterMyPlants

Versão inicial: 19/10/2026. Etapas futuras são propostas, sem promessa de prazo. Novos testes e decisões devem atualizar este roteiro e o diário.

## 1. Sensor e documentação — concluído no protótipo

- [x] Identificar D34/GPIO34 na placa fotografada.
- [x] Conectar VCC/3V3, GND/GND e AOUT/D34.
- [x] Ler pelo PlatformIO e Monitor Serial.
- [x] Registrar referências seca/úmida e exibir índice relativo.
- [x] Guardar código e resultados iniciais.

Evidência: leituras enviadas pelo autor no diário. Limite: apenas um sensor/vaso; nenhum acionamento automático testado.

## 2. Wi-Fi e telemetria — próximo marco

- [ ] Selecionar hospedagem, API e banco.
- [ ] Conectar o ESP32 à rede e reconectar após falha.
- [ ] Identificar controlador e sensor de forma estável.
- [ ] Enviar leitura bruta, índice e versão de calibração, inicialmente uma vez por minuto.
- [ ] Registrar horário de recebimento e, se sincronizado, de amostragem; tratar duplicatas e dados atrasados.
- [ ] Autenticar dispositivo e manter credenciais fora do Git.

Concluído quando leituras reais persistirem no banco e o dispositivo voltar a enviar após perda/restauração de Wi-Fi, sem travar a leitura local.

## 3. Painel por planta — primeira versão web

- [ ] Acesso pelo celular e computador, com autenticação.
- [ ] Cadastrar nome, espécie, localização, vaso e substrato.
- [ ] Associar sensor e exibir última leitura, horário e estado de conexão.
- [ ] Histórico em gráfico, registro de regas manuais e edição da calibração.
- [ ] Distinguir leitura atual, antiga, inválida e sensor desconectado.

Concluído quando o celular mostrar dados reais da planta e alterações de cadastro persistirem.

## 4. QR Code por planta

- [ ] Gerar um identificador permanente por planta, independente de nome e sensor.
- [ ] Gerar etiqueta com QR Code e nome legível.
- [ ] Abrir a página da planta após leitura do QR; manter destino após troca de nome/sensor.
- [ ] Preservar autorização: o QR contém uma URL, não credenciais nem autorização de rega.

Concluído quando escanear a etiqueta abrir a planta correta e o acesso respeitar a sessão do usuário.

## 5. Perfis por espécie e pesquisa assistida

- [ ] Pesquisar cuidados por nome científico, com fontes e data.
- [ ] Distinguir umidade do ar, teor de água no solo e índice do sensor.
- [ ] Sugerir preferência de secagem e perfil inicial considerando vaso/substrato.
- [ ] Manter recomendação separada da calibração de cada sensor.
- [ ] Registrar aceitação/edição do perfil; permitir ajuste manual.

Concluído quando uma planta tiver perfil rastreável e não houver conversão de recomendações genéricas em porcentagens de sensor sem fundamento experimental.

## 6. Bomba e automação local

- [ ] Confirmar fonte de 5 V, consumo/partida da bomba e entrada do relé.
- [ ] Montar e registrar circuito validado, proteções e alimentação.
- [ ] Medir vazão na altura real e registrar volume por duração de acionamento.
- [ ] Definir limiar experimental, histerese, pulsos curtos e espera de infiltração.
- [ ] Limitar duração e volume estimado acumulado; interromper em falha.
- [ ] Verificar estados na partida/reset e comportamento sem internet.
- [ ] Definir proteção para reservatório vazio antes de operação autônoma prolongada.
- [ ] Testar comando manual remoto com expiração e limite local obrigatório.

Concluído quando o desligamento e os limites funcionarem também em falhas e os testes de rega estiverem registrados. IA e painel não podem contornar esses limites.

## 7. Múltiplas plantas e módulos físicos

- [ ] Adicionar sensores e bombas/válvulas por zona necessária.
- [ ] Expandir canais/controladores conforme pinos, corrente e instalação.
- [ ] Testar isolamento entre zonas: regar uma não deve acionar outra indevidamente.
- [ ] Criar CAD com medidas reais, fixação, conectores e alívio de tração.
- [ ] Guardar arquivos editáveis, exportações, fotos e versões da montagem.

Concluído quando duas zonas puderem ser monitoradas e acionadas independentemente e a montagem estiver documentada.

## 8. Câmera, fotos diárias e acesso ao vivo

- [ ] Selecionar câmera conforme qualidade, energia e acesso remoto.
- [ ] Associar uma câmera a uma ou várias plantas.
- [ ] Capturar uma foto por dia em horário configurável, com data/fuso.
- [ ] Guardar fotos em armazenamento de arquivos, metadados no banco.
- [ ] Implementar galeria e visualização ao vivo autenticada sob demanda.
- [ ] Tratar câmera offline e falha de captura sem interromper a irrigação.
- [ ] Definir retenção e exclusão de fotos; timelapse como extensão.

Concluído quando houver sequência diária real e abertura de imagem ao vivo pelo celular fora da rede local, com acesso autorizado.

## 9. Análise visual assistida por IA

- [ ] Enviar foto selecionada, espécie, histórico de leitura e regas para análise.
- [ ] Retornar observações, hipóteses, incertezas e ações de verificação.
- [ ] Buscar referências quando necessário e mostrar as fontes.
- [ ] Pedir informações adicionais quando a foto não permitir concluir.
- [ ] Salvar foto/contexto/data e versão do modelo usados na análise.
- [ ] Manter ações propostas separadas do acionamento automático.

Concluído quando uma análise puder ser revisada com seu contexto, sem tratar causas visualmente parecidas como diagnóstico certo.

## 10. Consolidação

- [ ] Reproduzir montagem a partir da documentação em ambiente limpo.
- [ ] Registrar versões de dependências efetivamente utilizadas e testadas.
- [ ] Testar falhas de energia, rede, sensor, câmera e envio duplicado de comandos.
- [ ] Publicar guia final com lista de peças, fotos, diagramas, firmware e operação.
- [ ] Escolher licença e registrar versão estável, limitações e manutenção.

O repositório acompanha todas as etapas. Encerrar a primeira versão não impede módulos futuros.
