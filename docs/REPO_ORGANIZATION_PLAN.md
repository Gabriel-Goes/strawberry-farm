# Repo Organization Plan

## Onde o runtime do jogo vive
- `public/`
  - `index.html`
  - `style.css`
- `src/`
  - runtime JavaScript do jogo

## Onde a UI vive
- `public/index.html`
- `public/style.css`
- `src/ui/*`

## Onde a configuração vive
- `src/config/gameConfig.js`

## Onde os prompts dos agentes vivem
- `agents/prompts/*`

## Onde os artefatos de sprint vivem
- `agents/planning/analyses/*`
- `agents/planning/sprint-plans/*`
- `agents/planning/reviews/*`
- `agents/planning/acceptance/*`

## Onde a documentação do processo vive
- `agents/docs/systems/*`
- `agents/docs/economy/*`
- `agents/docs/ui/*`

## Onde a documentação estável vive
- `docs/*`

## Onde os testes vivem
- `tests/playwright/*`
- `tests/manual/*`
- `tests/reports/*`
- `tests/artifacts/*`

## Regra de separação
- produto jogável: `public/` + `src/`
- processo de agentes: `agents/`
- documentação estável: `docs/`
- testes e evidências: `tests/`
