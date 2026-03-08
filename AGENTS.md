# Fazenda de Morangos MVP+

## Objetivo do produto
Construir um jogo pequeno, mas polido, sobre plantar, colher e vender morangos no navegador.

## Restrições técnicas
- HTML, CSS e JavaScript puros
- sem frameworks
- sem backend
- `localStorage` para persistência
- jogo em uma única página
- código legível e modular

## Restrições de design
- sessões curtas
- uma cultura apenas: morango
- progressão recompensadora rapidamente
- sistemas simples e óbvios
- nenhuma feature deve exigir infraestrutura complexa

## Papéis do time
- Diretor Geral do Jogo
- Diretor de Produto
- Designer de Jogo
- Designer de Economia e Balanceamento
- Desenvolvedor de Gameplay
- Desenvolvedor de UI/UX
- Agente de QA e Playtest

## Estado atual do jogo
- plantio, crescimento, colheita e venda
- combo de colheita
- mercado dinâmico simples
- eventos aleatórios simples
- expansão `3x3` para `4x4`
- upgrades
- `Farm Helper`
- prestígio `Strawberry Knowledge`
- save/load com `localStorage`
- HUD single-page com feedback compacto

## Organização do repositório
- runtime do jogo em `public/` e `src/`
- prompts em `agents/prompts/`
- planejamento e reviews em `agents/planning/`
- documentação de apoio em `agents/docs/` e `docs/`
- testes e evidências em `tests/`

## Fora de escopo
- multiplayer
- backend
- contas de usuário
- múltiplas culturas
- estações
- NPCs complexos
- crafting complexo
- simulação complexa de mercado
