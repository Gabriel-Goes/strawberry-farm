# Relatório de QA V2

## 1. Bugs críticos
- nenhum bug crítico encontrado após a rodada atual do Sprint 4

## 2. Bugs médios
- nenhum bug médio reproduzido no fluxo principal

## 3. Problemas de design
- o jogo ainda depende de texto em vários painéis; novos sistemas devem substituir UI existente em vez de acumular novas caixas
- o combo funciona bem como bônus curto, mas não deve ganhar mais camadas sem antes simplificar a HUD atual

## 4. Melhorias de polimento aplicadas
- combo de colheita com bônus leve e temporizador visível
- persistência do combo ativo em save/load curto
- banner de evento com tags de impacto prático
- destaque visual nas ações afetadas por eventos
- estágios de crescimento mais legíveis nos canteiros
- flash visual curto ao colher para reforçar resposta da ação
- autosave reforçado ao ocultar ou sair da página
- organização melhor dos sistemas temporizados dentro do estado

## Escopo verificado
- onboarding e ajuda
- economia base e rebalanceada
- expansão da fazenda
- combo de colheita
- eventos e feedback visual
- timing de crescimento com evento
- save/load de estado completo
- progresso e metas
- reset completo

## Cenários executados
- renderização inicial e HUD
- ocultar/reabrir ajuda com persistência
- plantio e retomada após reload
- combo `x3` com bônus de moeda
- persistência curta do combo após reload
- expansão para `4x4`
- evento `Feira local` com desconto de semente
- evento `Chuva leve` com aceleração de crescimento
- evento `Sol forte` com bônus de venda
- progressão final até `35` moedas
- reset e restauração completa

## Resultado final
- o fluxo principal permaneceu estável
- a economia continuou rápida e o combo adicionou recompensa sem quebrar a progressão
- o feedback de evento ficou mais explícito no banner e nas ações afetadas
- a interface ficou mais responsiva durante timers e eventos
- save/load permaneceu consistente com ajuda, expansão, eventos, upgrades, combo e metas

## Evidência
- teste Playwright executado em `file://`
- screenshot final: `tests/artifacts/strawberry-farm-test.png`
