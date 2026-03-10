# Sprint Review

## Evaluation of the sprint outcome

### what worked
- a sprint adicionou um novo desafio sem aumentar demais a complexidade sistêmica
- o jogador agora precisa prestar atenção no timing da colheita sem introduzir punições excessivas
- o novo estado `rotten` ficou simples de ler e simples de resolver
- o loop principal permaneceu curto: colher rápido, ou limpar e replantar
- a regressão completa passou sem quebrar helper, combo, eventos, expansão, prestígio ou save/load

### what did not fully close
- o helper ainda não reage a canteiros estragados, o que é coerente com o escopo desta sprint, mas pode virar ponto de UX no futuro

### remaining risks
- se futuros eventos ou upgrades alterarem muito o tempo de crescimento, o tempo de apodrecimento pode precisar de ajuste fino para não ficar punitivo demais
- saves externos ou debug states que definam `ready` de forma manual continuam dependendo da normalização automática para ganhar `rottenAt`

### next priorities
- observar se `spoilTimeMs` de 6 segundos está adequado ao ritmo real da partida
- considerar feedback extra de HUD para quantidade de lotes estragados se isso virar fricção recorrente
- manter novas mecânicas de risco sempre simples e resolvidas por uma única ação clara
