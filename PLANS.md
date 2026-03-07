# Milestone MVP+

## 1. Milestone goal
Evoluir o MVP atual para um MVP+ com progressão mais clara, HUD mais legível e persistência completa, sem mudar o loop principal nem aumentar demais a complexidade.

## 2. In-scope features
- manter o loop comprar -> plantar -> esperar -> colher -> vender -> reinvestir
- consolidar os 2 upgrades atuais como parte do marco
- adicionar metas de progressão em tela única
- melhorar o HUD com indicadores mais claros de economia e ritmo
- salvar e carregar upgrades, metas e estatísticas relevantes
- validar o fluxo com QA e Playwright

## 3. Out-of-scope features
- backend
- multiplayer
- novos cultivos
- expansão da fazenda
- eventos aleatórios
- inventário complexo

## 4. Acceptance criteria
- o jogo continua rodando em HTML/CSS/JS puros
- o loop principal permanece intacto
- existem 2 upgrades com impacto visível
- existem metas de progressão visíveis na interface
- o HUD mostra informação suficiente para reduzir confusão do jogador
- save/load restaura todas as novas informações do marco
- o fluxo principal continua validado por teste

## 5. Risks
- excesso de informação no HUD pode deixar a tela poluída
- metas com recompensa muito alta podem quebrar a economia
- novos campos de save podem introduzir incompatibilidade com saves antigos
- testes podem ficar frágeis se dependerem demais de textos exatos
