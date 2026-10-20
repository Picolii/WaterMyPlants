# Como manter o projeto documentado

Para cada mudança, guardar o código correspondente, o motivo, a montagem usada e a evidência do resultado. Separar planejado, implementado, compilado e testado no hardware. Não marcar testes como executados por inferência.

## Registro de experimento

Copiar este modelo para uma nova seção do diário ou arquivo em `docs/testes/`:

```md
## TXXX — Nome do teste
Data/fuso:
Objetivo:
Versão/commit do código:
Hardware e ligações:
Planta/substrato/posição do sensor:
Procedimento:
Resultado esperado:
Resultado observado:
Dados e fotos:
Conclusão e limitações:
Próximo passo:
```

Fotos podem ficar em `docs/fotos/AAAA-MM-DD/`, com nomes descritivos e legenda explicando o enquadramento e a versão da montagem. Logs extensos ficam em CSV/TXT com unidades, sequência e contexto; não inventar horários ausentes. Se uma leitura for excluída do cálculo, preservar o valor original e registrar o motivo.

## Ao receber novos resultados

1. Registrar o que foi enviado e as condições informadas.
2. Relacionar ao código e à montagem daquela etapa.
3. Calcular métricas apenas sobre amostras identificadas e justificar exclusões.
4. Atualizar conclusão e pendências do diário.
5. Atualizar README/roteiro se uma etapa realmente estiver concluída.
6. Publicar um commit descritivo quando solicitado/autorizado na sessão.

O histórico Git preserva evolução dos códigos e modelos. Mudanças na calibração recebem identificação própria; dados antigos não são silenciosamente reinterpretados como medições novas. Nunca publicar senhas de Wi-Fi, tokens, chaves de API ou fotos com informações privadas sem revisão.

A atualização ocorre durante as sessões de trabalho; este documento não cria monitoramento automático de mensagens ou do hardware.
