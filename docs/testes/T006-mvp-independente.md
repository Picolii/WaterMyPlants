# T006 — Primeiro MVP independente

Data: 20/10/2026. Pedido: manter o painel aprovado como código no próprio projeto e subir a primeira versão MVP no GitHub, independente da hospedagem anterior.

## Mudanças

- Mantido o visual aprovado, com identificação de versão MVP 0.1.0.
- Ponto de entrada `npm start` na raiz; documentação de execução local, rede local e hospedagem estática.
- Geração de QR Code extraída para módulo testável, usando a URL atual sem domínio fixo, parâmetros temporários ou rota antiga.
- Removidas do painel as mensagens de autenticação do serviço anterior.
- Servidor com entrega de módulos JavaScript, suporte a HEAD, recusa de métodos de escrita e contenção de arquivos à pasta pública.
- Identificadores de plantas/eventos funcionam também em HTTP pela rede local, quando `crypto.randomUUID` não está disponível. Referências: [randomUUID](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) e [getRandomValues](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues).
- Documentos atuais apontam para o código do repositório. O T005 permanece como registro histórico da experimentação anterior.

## Verificação

Executar na raiz:

```sh
npm run check
npm test
npm start
```

Os testes verificam QR em domínio próprio/subpasta/local, entrega da interface sem login e bloqueio de acesso a caminhos fora de `dist`. A conferência no navegador deve mostrar os quatro exemplos, sem pedido de conta, e gerar QR com o endereço da instalação atual.

Resultados desta sessão: `npm run check` passou; `npm test` passou com **9 testes e zero falhas**; `npm start` iniciou em `127.0.0.1:4178`. No navegador, o MVP abriu sem login, preservou os registros locais existentes e gerou o endereço `http://127.0.0.1:4178/#planta/monstera-demo` no QR Code. A opção de acesso via IP pela rede foi documentada, mas não foi realizado novo teste físico em celular nesta sessão.

## Limites da primeira versão

Persistência local por navegador; dados demonstrativos; sem sincronização, hardware, banco, autenticação, câmera ou chamadas de IA. O firmware existente não foi alterado. Hospedagem externa própria ainda não escolhida. Nenhum dado/credencial de rede deve entrar no commit.
