# QA Report

## Results of tests performed

### structural validation
- `node --check` passou em `src/main.js`, `src/ui/render.js`, `src/state/persistence.js`, `src/utils/dom.js` e `src/state/createGameState.js`
- revisão estrutural confirmou que a HUD desktop voltou a operar dentro de um contêiner fixo com overflow controlado
- revisão estrutural confirmou que a coluna direita ganhou altura fixa e `overflow:auto` efetivo no desktop

### repo-native execution
- em **10 de março de 2026**, `npm run test:smoke` passou com sucesso
- evidência smoke: `tests/artifacts/strawberry-farm-smoke-20260310-172517-868.png`
- em **10 de março de 2026**, `npm run test:e2e` passou com sucesso
- a suíte principal validou HUD inicial, ajuda, mercado, save/load, save legado, combo, expansão, eventos, upgrades, helper, prestígio, reset e layout mobile
- evidência principal: `tests/artifacts/strawberry-farm-test-20260310-172952-601.png`

### targeted scroll validation
- um diagnóstico Playwright dedicado foi executado contra `public/index.html`
- no estado final, o documento desktop ficou sem scroll global: `bodyScrollHeight = 768` e `bodyClientHeight = 768`
- a coluna direita ficou com overflow interno funcional: `rightScrollHeight = 1114`, `rightClientHeight = 598` e `rightScrollTop` mudou de `0` para `516`
- conclusão: o scroll da área de apoio está operacional e o conteúdo extra de melhorias pode ser alcançado sem esconder o tabuleiro principal

### compatibility validation
- a regressão e2e expôs uma incompatibilidade inicial com saves legados que usavam `helpOpen`
- a hidratação foi ajustada para priorizar `helpOpen` quando necessário
- após a correção, o cenário de save legado passou novamente na suíte completa

## Issues found during QA

1. a primeira versão da sprint escondia upgrades atrás de uma aba e quebrava o contrato dos testes repo-native
   - impacto: médio
   - mitigação: melhorias voltaram a ficar sempre acessíveis e metas/guia permaneceram compactados

2. a primeira versão da hidratação de UI não respeitava corretamente saves legados com `helpOpen = true`
   - impacto: médio
   - mitigação: a persistência passou a priorizar o estado legado de ajuda ao derivar a aba ativa

## Final status

- objetivo de compactação visual: atingido
- scroll da área de apoio: validado
- regressão repo-native completa: executada com sucesso em 10 de março de 2026
- status final: aprovado
