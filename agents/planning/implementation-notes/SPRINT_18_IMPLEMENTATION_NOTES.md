# Implementation Notes

## Summary of actual code changes

- `src/config/gameConfig.js`
  - adicionou `crop.spoilTimeMs`
  - adicionou o novo estado de canteiro `rotten`

- `src/systems/plots.js`
  - mudou o ciclo do lote para `growing -> ready -> rotten`
  - adicionou `rottenAt` aos canteiros
  - criou `clearRottenPlot()` para limpeza manual sem recompensa
  - ajustou textos, labels, badge, emoji e dicas do canteiro estragado
  - adicionou normalização para plots `ready` sem `rottenAt`, evitando quebra em saves/debug states antigos

- `src/main.js`
  - passou a tratar clique em canteiro `rotten` como limpeza manual

- `src/systems/runtime.js`
  - deixou o ticker diferenciar `becameReady` de `becameRotten`
  - passou a emitir mensagem específica quando um morango estraga

- `src/state/createGameState.js`
  - adicionou `rottenAt` ao shape inicial dos canteiros

- `src/state/persistence.js`
  - passou a hidratar `rottenAt`

- `src/ui/farmGrid.js`
  - passou a destacar também canteiros estragados como estados que exigem atenção

- `public/index.html`
  - adicionou o estado `Estraga` na legenda da fazenda

- `public/style.css`
  - adicionou cor e visual próprios para o estado `plot--rotten`

- `tests/playwright/strawberry-farm.smoke.js`
  - adicionou cenário curto de apodrecimento e limpeza manual
  - passou a carregar `rottenAt` em materialização de save legado quando presente

- `tests/playwright/strawberry-farm.e2e.js`
  - adicionou cenário completo de apodrecimento, limpeza manual e replantio
  - ajustou cenários com plots `ready` para usar `rottenAt` explícito quando necessário

- `tests/fixtures/legacy-save-v1.json`
  - adicionou `rottenInMs` ao plot pronto da fixture para compatibilidade do materializador repo-native

## Notes

- a sprint manteve o escopo propositalmente curto: a punição é apenas perder o morango daquele lote
- nenhuma regra de venda, upgrade, helper, combo ou prestígio foi rebalanceada
- a limpeza continua manual de propósito para preservar a tensão curta desejada pelo sprint
