# QA Report

## Results of tests performed

### structural validation
- `node --check` passou em `src/config/gameConfig.js`, `src/state/createGameState.js`, `src/state/persistence.js`, `src/systems/plots.js`, `src/systems/runtime.js`, `src/ui/farmGrid.js`, `src/main.js`, `tests/playwright/strawberry-farm.smoke.js` e `tests/playwright/strawberry-farm.e2e.js`
- revisão estrutural confirmou que o canteiro agora persiste `rottenAt` e suporta o novo estado `rotten`
- revisão estrutural confirmou que o ticker distingue plots que ficaram prontos dos que apodreceram

### repo-native execution
- em **10 de março de 2026**, `npm run test:smoke` passou com sucesso
- o smoke validou HUD inicial, plantio/reload, combo expirado, apodrecimento com limpeza manual, save legado e prestígio/reset
- evidência smoke: `tests/artifacts/strawberry-farm-smoke-20260310-174151-313.png`

- em **10 de março de 2026**, `npm run test:e2e` passou com sucesso
- a suíte principal validou HUD, ajuda, mercado, save/load, save legado, combo, novo fluxo de apodrecimento, expansão, eventos, upgrades, helper, prestígio, reset e layout mobile
- evidência principal: `tests/artifacts/strawberry-farm-test-20260310-174151-346.png`

### gameplay validation for rotten strawberries
- um plot `ready` com `rottenAt` curto mudou para o estado visual `Estragado`
- o `aria-label` do lote estragado passou a orientar `Clique para limpar`
- limpar o lote estragado não incrementou `berryCount`
- após a limpeza, o mesmo lote voltou a aceitar plantio e retornou ao estado `Crescendo`
- helper continuou operando apenas sobre lotes `ready` ou `empty`, sem colher ou limpar lotes estragados

## Issues found during QA

1. estados `ready` criados por saves/debug sem `rottenAt` poderiam nunca apodrecer
   - impacto: médio
   - mitigação: `plots.updatePlotsByTime()` agora normaliza `ready` sem timer e cria `rottenAt` automaticamente

## Final status

- nova mecânica de gameplay: implementada
- limpeza manual após apodrecimento: validada
- regressão repo-native completa: executada com sucesso em 10 de março de 2026
- status final: aprovado
