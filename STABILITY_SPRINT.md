# Sprint 4: Estabilidade e Responsividade

## 1. Foco do sprint
Melhorar estabilidade, sensação de jogo e clareza de feedback sem aumentar o escopo sistêmico do MVP+.

## 2. Escopo confirmado pelo time
- manter o loop comprar -> plantar -> esperar -> colher -> vender
- não adicionar backend, multiplayer ou sistemas complexos
- tratar este sprint como melhoria de experiência e robustez
- preservar sessões curtas e leitura imediata da interface

## 3. Melhorias por papel

### Product Director
- manter o sprint restrito a estabilidade, ritmo e feedback
- evitar novas mecânicas longas além de um combo de colheita simples

### Game Designer
- adicionar combo de colheita curto e fácil de entender
- melhorar sensação dos estados da planta com estágios visuais claros
- reforçar feedback de evento e de ação bem-sucedida

### Economy & Balance Designer
- manter a economia rápida e recompensadora
- usar o combo como bônus leve, sem quebrar a progressão
- preservar upgrades e expansão como objetivos de curto prazo

### Gameplay Developer
- refatorar o estado dos sistemas temporizados para ficar mais previsível
- tornar o autosave mais confiável
- implementar feedback visual de colheita e combo
- deixar eventos mais explícitos e legíveis

### UI/UX Developer
- clarificar etapas de crescimento
- melhorar leitura do banner de evento
- destacar ações afetadas por eventos
- exibir combo ativo com temporizador e barra curta

### QA / Playtest Agent
- validar save/load com combo e evento ativo
- testar gatilhos de evento
- revisar pacing econômico com bônus de combo
- verificar responsividade da colheita em sequência

## Objetivos do sprint
- corrigir bugs de estabilidade e consistência
- melhorar o ritmo da economia sem inflar números
- melhorar o feedback visual dos eventos
- adicionar combo de colheita simples e legível
- melhorar a responsividade do gameplay
- refatorar o estado do jogo para mais estabilidade

## Restrições
- manter HTML, CSS e JavaScript puros
- manter o jogo pequeno
- evitar novos sistemas complexos

## Escopo
- organizar melhor o estado dos sistemas ativos e temporizados
- reforçar leitura de estágio das plantas e feedback de colheita
- melhorar a leitura do evento ativo, seus efeitos e ações impactadas
- separar atualizações rápidas de feedback do restante do render
- aumentar a confiabilidade do autosave ao sair ou ocultar a página
- validar tudo com QA focado em economia, timing, save/load, combo e responsividade

## Critérios de aceitação
- nenhuma regressão crítica no loop principal
- expansão, upgrades, eventos e metas continuam persistindo corretamente
- evento ativo comunica efeito, duração e impacto com clareza
- o combo de colheita gera bônus leve e feedback visível
- a interface responde melhor durante crescimento e eventos
- o código de estado/renderização fica mais previsível e modular
