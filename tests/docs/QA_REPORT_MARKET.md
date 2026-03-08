# Relatório de QA: Sistema de Mercado

## Escopo testado
- variação de preço ao longo do tempo
- persistência do preço após reload
- integração entre mercado, upgrade de venda e evento
- cálculo final da venda
- clareza do preço atual para o jogador

## Cenários executados
- renderização inicial do banner de mercado
- virada automática de preço com timer curto controlado no teste
- persistência do preço de mercado após reload
- convivência entre mercado, combo e expansão
- interação entre mercado e evento `Feira local`
- interação entre mercado, upgrade `Caixa premium` e evento `Sol forte`
- cálculo de venda final com preço base + upgrade + bônus de evento

## Problemas encontrados
- havia um `id` duplicado de `marketDescription` na UI, causando ambiguidade no QA automatizado e risco de leitura incorreta para automação e acessibilidade

## Correções aplicadas
- o texto do banner de mercado passou a usar `#marketSummary`
- o estado do mercado foi centralizado em `systems.market`
- o ticker agora atualiza preço de mercado em intervalos curtos
- o HUD exibe preço atual, direção da última mudança e tempo para a próxima virada
- o cálculo de venda passou a usar mercado + upgrade + evento de forma explícita

## Resultado final
- o preço varia dentro do intervalo definido de forma legível
- o sistema continua simples e entendível em poucos segundos
- save/load permaneceu consistente com o mercado ativo
- a decisão de vender ou esperar ficou mais clara sem quebrar o loop rápido

## Evidência
- teste Playwright executado em `file://`
- screenshot final: `tests/artifacts/strawberry-farm-test.png`
