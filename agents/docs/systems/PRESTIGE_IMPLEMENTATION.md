# Prestige Implementation

## Arquivos afetados
- `config.js`
- `index.html`
- `style.css`
- `game.js`
- `README.md`
- `tests/playwright/strawberry-farm.e2e.js`

## Estratégia
- manter prestígio como um único multiplicador permanente
- preservar o sistema dentro de `state.prestige`
- usar uma rotina dedicada de reset de prestígio
- reaproveitar o save/load atual, sem infraestrutura nova

## Estrutura proposta
- `state.prestige.level`
- `state.prestige.sellBonusMultiplier`
- `state.systems.prestige.unlockShownForLevel`

## Mudanças técnicas
- adicionar config de prestígio
- criar helpers:
  - requisito atual
  - disponibilidade de prestígio
  - bônus atual
  - bônus aplicado na venda
- integrar prestígio na venda final
- criar `prestigeFarm()` com confirmação
- manter `resetGame()` como wipe completo, incluindo prestígio

## Critérios técnicos
- save/load confiável
- botão só habilita quando o requisito é atingido
- prestígio não quebra upgrades, helper, mercado ou eventos
- bônus permanente continua fácil de rastrear na UI
