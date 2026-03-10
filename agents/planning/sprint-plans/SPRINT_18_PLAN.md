# Sprint 18 — Morango Estragado

## Sprint Goal
Adicionar um novo risco curto ao loop principal: depois de ficar pronto por tempo demais, o morango estraga. O jogador perde a colheita daquele lote, precisa clicar para limpar o canteiro e só então pode plantar novamente.

---

## In Scope

- introduzir o estado de canteiro `rotten`
- fazer o ciclo temporal virar `growing -> ready -> rotten`
- exigir limpeza manual do canteiro estragado antes de novo plantio
- atualizar mensagens, labels e apresentação visual do canteiro
- preservar helper, combo, prestígio, save/load e upgrades
- validar a nova mecânica em smoke e e2e

---

## Out of Scope

- rebalanceamento econômico amplo
- punição adicional em moedas ou sementes
- automação para limpar canteiros estragados
- novo tipo de upgrade, evento ou cultura
- mudanças de layout além do necessário para comunicar o novo estado

---

## Team Guidance

- `Diretor de Produto`: manter a punição clara, curta e fácil de entender
- `Designer de Jogo`: garantir que o desafio aumente atenção sem destruir o ritmo rápido
- `Designer de Economia e Balanceamento`: a perda deve ser apenas do morango daquele lote, sem snowball excessivo
- `Desenvolvedor de Gameplay`: implementar a transição temporal e a limpeza manual com persistência
- `Desenvolvedor de UI/UX`: comunicar visualmente o canteiro estragado e a ação necessária
- `Agente de QA e Playtest`: validar apodrecimento, limpeza, replantio e compatibilidade com saves e helper

---

## Acceptance Criteria

- um canteiro pronto passa para `rotten` depois de um tempo fixo curto
- colher depois de estragar não é permitido; o jogador deve limpar primeiro
- limpar um canteiro estragado não concede morango
- após a limpeza, o mesmo lote volta a aceitar plantio normalmente
- helper continua colhendo apenas canteiros `ready` e não remove canteiros estragados
- saves antigos e atuais continuam hidratando sem quebra
- `npm run test:smoke` e `npm run test:e2e` passam com cobertura do novo comportamento

---

## QA Focus

- transição temporal `ready -> rotten`
- clique manual de limpeza e retorno para `empty`
- ausência de recompensa ao limpar
- helper ignorando canteiros estragados
- persistência de `rottenAt` e compatibilidade de saves legados
- não regressão de economia, combo, eventos, expansão e prestígio
