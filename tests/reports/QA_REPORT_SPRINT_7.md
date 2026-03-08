# Relatório de QA: Sprint 7

## Escopo testado
- desbloqueio do `Strawberry Knowledge`
- reset opcional de prestígio
- persistência do nível de prestígio
- bônus permanente nas vendas
- pacing econômico após o primeiro prestígio
- confiabilidade de save/load
- clareza da UI de prestígio

## Cenários executados
- HUD inicial com prestígio em nível `0`
- progresso até o requisito de `120` moedas
- feedback visual quando o prestígio fica disponível
- confirmação e execução do reset de prestígio
- reinício correto da fazenda mantendo o bônus permanente
- persistência do nível e do bônus após reload
- venda pós-prestígio com bônus aplicado
- reconstrução da run após prestígio
- reset total limpando também o conhecimento permanente

## Problemas encontrados durante o QA
- não houve bug funcional bloqueante no sistema de prestígio após a implementação final

## Ajustes feitos durante o QA
- a asserção das metas pós-prestígio foi ajustada para refletir corretamente que a run reinicia e precisa reconstruir expansão e melhorias

## Resultado final
- o prestígio ficou opcional, legível e fácil de entender
- o bônus permanente melhorou a sensação de progressão sem quebrar o loop
- save/load permaneceu consistente
- o helper, o mercado e os upgrades continuaram compatíveis com o novo sistema

## Evidência
- teste Playwright executado em `file://`
- screenshot final: `tests/artifacts/strawberry-farm-test-20260308-090243-614.png`
