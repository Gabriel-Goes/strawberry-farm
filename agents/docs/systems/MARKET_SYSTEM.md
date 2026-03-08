# Sprint 5: Sistema de Mercado

## Objetivo
Adicionar decisão simples de venda ao loop atual sem transformar o jogo em uma simulação de trading.

## Escopo do Produto
- o mercado afeta apenas o preço do morango
- o preço muda sozinho em intervalos curtos
- o jogador continua jogando no mesmo loop de plantar, colher e vender
- a leitura do sistema precisa acontecer em poucos segundos

## Decisão de Design
- o preço base do morango varia entre `2` e `5` moedas
- o preço começa em `3` moedas
- o mercado muda a cada `12` segundos
- cada atualização muda o preço em `-1`, `0` ou `+1`
- upgrades e eventos continuam somando por cima do preço base do mercado

## Intenção de Gameplay
- incentivar o jogador a decidir entre vender agora ou esperar uma virada melhor
- manter sessões rápidas, com oportunidade de decisão a cada poucos segundos
- evitar planilhas, estoque complexo ou ordens de compra e venda

## Valores de Economia
- preço mínimo: `2`
- preço máximo: `5`
- preço inicial: `3`
- intervalo de atualização: `12s`
- modificadores de evento no preço final:
  - `Sol forte`: `+1` moeda por morango vendido
  - `Chuva leve`: sem efeito direto no preço, mas acelera produção
  - `Feira local`: sem efeito direto no preço, mas reduz custo de semente

## Feedback de UI
- card de venda mostra o preço final atual
- hint curto informa se o mercado subiu, caiu ou estabilizou
- banner do mercado mostra:
  - preço base atual
  - direção da última mudança
  - tempo até a próxima atualização
  - recomendação curta quando o preço está alto ou baixo

## Implementação
- estado do mercado salvo em `systems.market`
- venda calcula `preço de mercado + upgrade + bônus de evento`
- ticker atualiza o preço quando `nextUpdateAt` expira
- save/load preserva preço atual, preço anterior, direção e próxima atualização

## Critérios de QA
- o preço varia com o tempo dentro do intervalo definido
- o preço salvo persiste após reload
- o cálculo de venda respeita preço base, upgrade e evento
- o jogador consegue entender rapidamente se vale vender ou esperar
