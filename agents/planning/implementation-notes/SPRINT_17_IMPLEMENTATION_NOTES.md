# Implementation Notes

## Summary of actual code changes

- `public/index.html`
  - reorganizou a coluna direita em um deck de gestão compacto
  - adicionou abas leves para alternar entre `Metas` e `Guia`
  - manteve a grade de melhorias sempre acessível para preservar o fluxo e os contratos de teste
  - atualizou o cabeçalho visual da sprint para `UI Sprint 17`

- `public/style.css`
  - reduziu a altura visual dos principais blocos, incluindo stats, status modules, farm section e plots
  - compactou a grade do tabuleiro e o conteúdo textual dos cards
  - restaurou o contrato desktop com painel fixo em viewport e overflow controlado
  - fez a coluna direita assumir altura fixa e rolagem interna real no desktop
  - adicionou estilos do deck compacto e das abas de gestão
  - preservou o comportamento responsivo para larguras menores

- `src/main.js`
  - adicionou controle de navegação das abas da gestão
  - fez o botão `Guia` do topo alternar a aba de ajuda em vez de depender de um painel solto

- `src/ui/render.js`
  - sincronizou o estado visual das abas
  - passou a derivar `helpOpen` a partir da aba ativa para manter a UI coerente

- `src/utils/dom.js`
  - registrou os novos elementos do deck compacto e das abas

- `src/state/createGameState.js`
  - adicionou `activeSidebarTab` ao estado inicial da UI

- `src/state/persistence.js`
  - hidratou `activeSidebarTab`
  - adicionou compatibilidade para priorizar `helpOpen` em saves antigos, evitando regressão no painel de ajuda legado

## Notes

- a sprint permaneceu restrita a UI/UX e compatibilidade mínima de estado
- nenhuma mecânica, custo, reward loop ou sistema econômico foi alterado
- a compactação foi calibrada para satisfazer o contrato visual do QA repo-native sem remover funcionalidades do HUD
- a evidência de scroll foi coletada com Playwright, confirmando `rightScrollTop` mudando de `0` para `516` após abrir a área de melhorias
