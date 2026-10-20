# Arquitetura proposta

Estado: desenho de evolução. Nenhum backend, banco, painel ou serviço de câmera foi implantado. Stack e hospedagem ainda serão escolhidas.

## Entidades independentes

| Entidade | Responsabilidade |
|---|---|
| Espécie | Identificação botânica e referências de cuidados |
| Planta | Identidade permanente, apelido e vínculo com vaso/perfil |
| Vaso/instalação | Substrato, posição, profundidade do sensor e contexto físico |
| Controlador | ESP32, versão do firmware, estado e configuração |
| Sensor | Canal/pino, vínculo atual com instalação e histórico de calibração |
| Leitura | Valor bruto, índice derivado, referência de calibração e horários |
| Zona | Circuito hidráulico e saída de acionamento; uma ou mais plantas |
| Rega | Origem manual/automática, início/fim, duração, resultado e configuração |
| Câmera | Dispositivo independente e plantas enquadradas |
| Foto | Arquivo, horário de captura, câmera e plantas associadas |
| Análise assistida | Foto/contexto usados, hipóteses, fontes e versão do modelo |

Separar espécie de planta evita perder histórico ao corrigir o nome botânico. Separar sensor de planta permite substituir hardware sem criar outra identidade para o vaso. Registrar os vínculos por período evita atribuir leituras antigas ao vaso errado.

## Caminhos dos dados

1. ESP32 lê sensores, aplica calibração local e envia telemetria autenticada à API por HTTPS.
2. API valida dispositivo e dados e persiste leituras. Configurações têm versão e confirmação de aplicação pelo controlador.
3. Painel autenticado consulta histórico e altera cadastros/regras. A tela distingue valor antigo de valor atual.
4. ESP32 mantém última configuração válida e executa a rega localmente, com limites e desligamento em falhas. Estratégia de armazenamento de leituras offline será definida antes de prometer histórico contínuo.
5. Comandos remotos têm identificador, prazo de validade e confirmação; reenvio não deve repetir uma rega.

## QR Code

Usar URL permanente no formato conceitual `/plantas/<id-estavel>`. O domínio será definido antes de imprimir etiquetas definitivas. O QR não carrega senha, token nem comando de acionamento. A câmera é acessada pela página autorizada, sem expor endereço/credenciais da câmera na etiqueta. Na primeira versão, páginas e câmera serão privadas; compartilhamento público exige recurso específico posterior.

## Pesquisa por espécie

Pesquisar ao cadastrar/atualizar o perfil e reutilizar recomendações armazenadas. Guardar fonte, data, contexto e se foi sugestão de IA ou edição humana. Sem recomendação numérica confiável, apresentar preferência de secagem em linguagem clara em vez de inventar porcentagens.

O índice atual é relativo a duas medições locais; não equivale à umidade relativa do ar nem ao teor volumétrico de água. Configuração de limiar depende da calibração e da observação do vaso. Um perfil por espécie não substitui esse vínculo.

## Imagem e IA

Câmera independente evita competir com o controlador de rega. Foto diária e vídeo ao vivo são fluxos distintos: a foto é armazenada; a live é aberta sob demanda e não implica gravação contínua. Hardware e tecnologia de streaming ainda serão selecionados, inclusive requisitos de acesso fora da rede local.

Guardar arquivos em armazenamento de objetos; banco contém metadados e referências. Usar acesso autenticado e URLs temporárias quando apropriado, com limites de tamanho e retenção definidos na implementação.

A análise de uma planta com sinais de declínio combina foto, espécie informada, leituras, regas e condições disponíveis. O resultado lista indícios e hipóteses, com o que precisa ser observado para diferenciá-las. Não se presume que uma foto identifique com certeza falta de água, excesso de água, doença ou deficiência nutricional. Ajustes de rega propostos são revisáveis e respeitam limites locais.

## Crescimento

Começar com um controlador e um sensor. O cadastro não fica limitado a dois canais: cada saída pertence a um controlador e a uma zona. Novos módulos de relé não resolvem sozinhos distribuição de água ou quantidade de entradas; a expansão elétrica e hidráulica será dimensionada em conjunto.

## Decisões ainda abertas

Hospedagem, banco, autenticação, protocolo de configuração, orçamento de serviços, hardware da câmera, transporte de vídeo e política de retenção. Nenhum serviço pago foi contratado. Credenciais futuras ficam fora do Git e chaves de IA permanecem no servidor.
