# QA Report

## Relatório vigente

O QA vigente do projeto é:

- `tests/reports/QA_REPORT_SPRINT_17.md`

Resumo:
- status: aprovado, com compactacao de HUD desktop, aba de gestao enxuta e scroll interno validado em 10 de marco de 2026
- foco mais recente: reduzir excesso de conteudo vertical e corrigir acesso aos blocos de apoio sem quebrar o loop atual
- evidência: `npm run test:smoke`, `npm run test:e2e` e diagnostico Playwright de scroll com `rightScrollTop` indo de `0` para `516`
