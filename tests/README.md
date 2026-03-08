# Testes

## Estrutura
- `playwright/strawberry-farm.e2e.js`: fluxo automatizado principal do jogo
- `docs/TEST_SCENARIOS.md`: cenários manuais e base para automação
- `docs/QA_REPORT.md`: relatório de QA do ciclo de polimento
- `docs/QA_REPORT_V2.md`: relatório de QA após o sprint de estabilidade

## Objetivo
Centralizar automação, cenários e relatórios de QA em um único lugar do projeto.

## Execução
Exemplo com `playwright-skill`:

```bash
cd <caminho-do-playwright-skill>
PROJECT_ROOT="<caminho-absoluto-do-projeto>"
TARGET_URL="file://$PROJECT_ROOT/index.html" node run.js "$PROJECT_ROOT/tests/playwright/strawberry-farm.e2e.js"
```
