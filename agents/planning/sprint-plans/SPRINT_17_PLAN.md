# Sprint 17 — Compactação de HUD e Scroll Operacional

## Sprint Goal
Corrigir o problema de UI/UX em que a interface desktop acumulava conteúdo vertical demais e escondia blocos por causa de uma composição frágil de `100vh` com overflow interno. A sprint deve reduzir a densidade visual, manter os botões críticos acessíveis e validar que a rolagem dos conteúdos de apoio funciona quando necessária.

---

## In Scope

- reduzir a altura visual da HUD desktop
- reorganizar a coluna direita para diminuir ruído e agrupar conteúdo secundário
- manter ações e upgrades críticos acessíveis sem abrir múltiplos painéis
- preservar o loop atual de plantio, colheita, venda, helper, prestígio e progressão
- validar layout desktop, mobile e o comportamento de scroll na área de apoio
- preservar compatibilidade com saves legados e com o fluxo existente de ajuda rápida

---

## Out of Scope

- rebalanceamento econômico
- novas mecânicas de gameplay
- refactor amplo do runtime
- mudança na persistência além do necessário para compatibilidade da nova UI
- introdução de framework, backend ou múltiplas páginas

---

## Team Guidance

- `Diretor de Produto`: priorizar legibilidade, acesso rápido e redução de fricção de navegação
- `Designer de Jogo`: manter as informações de suporte sem competir com o tabuleiro principal
- `Designer de Economia e Balanceamento`: não alterar custos, pacing ou recompensas
- `Desenvolvedor de Gameplay`: manter contratos dos botões e compatibilidade dos fluxos já testados
- `Desenvolvedor de UI/UX`: compactar os cards, reduzir altura do tabuleiro e organizar a coluna de apoio
- `Agente de QA e Playtest`: exigir evidência de layout desktop compacto, regressão completa e validação explícita do scroll

---

## Acceptance Criteria

- a tela desktop inicial cabe acima da dobra dentro do contrato do QA repo-native
- a coluna de apoio deixa de empurrar o documento inteiro e passa a rolar internamente quando o conteúdo excede a altura disponível
- metas e guia passam a ocupar menos espaço vertical por meio de navegação compacta
- melhorias continuam diretamente acessíveis para não quebrar o fluxo do jogador nem os contratos dos testes
- o save legado que depende de `helpOpen` continua hidratando corretamente
- `npm run test:smoke` e `npm run test:e2e` passam após a mudança
- existe evidência objetiva de que a coluna de apoio responde ao scroll

---

## QA Focus

- métricas de layout desktop do cenário inicial
- acessibilidade dos botões de melhoria ao longo da regressão
- hidratação do painel de ajuda em save legado
- comportamento da coluna direita com overflow ativo
- regressão de helper, combo, mercado, eventos, prestígio e reset
