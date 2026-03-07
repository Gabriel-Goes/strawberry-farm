# Fazenda de Morangos MVP+

## Visão geral
Este projeto é um jogo pequeno de navegador sobre plantar, colher e vender morangos.

O projeto foi implementado com:
- HTML puro
- CSS puro
- JavaScript puro
- uma única tela
- salvamento local com `localStorage`

Loop principal:
Comprar sementes -> Plantar -> Esperar -> Colher -> Vender -> Reinvestir

## Estado atual
O jogo já está funcional nos arquivos:
- `index.html`
- `style.css`
- `game.js`
- `config.js`

Recursos implementados:
- grade 3x3 de canteiros
- morango como única cultura
- plantio ao clicar em terreno vazio
- temporizador simples de crescimento
- colheita ao clicar em planta pronta
- venda de todos os morangos colhidos
- compra de sementes
- sistema de moedas
- salvamento e carregamento com `localStorage`
- salvamento automático com status visível
- retomada do crescimento após recarregar a página
- botão de reinício
- confirmação antes de apagar progresso
- melhoria visual dos estados dos canteiros
- upgrade de adubo para reduzir o tempo de crescimento
- upgrade de venda para aumentar o valor do morango
- interface em português
- meta de progressão de `20` moedas
- mensagem de vitória na mesma tela

## Regras atuais
- O jogador começa com `6` moedas.
- O jogador começa com `3` sementes.
- O jogador começa com `0` morangos.
- Cada semente custa `2` moedas.
- Cada morango vendido vale `3` moedas.
- Com upgrade de venda, cada morango vendido vale `5` moedas.
- Cada plantio consome `1` semente.
- Cada colheita gera `1` morango.
- O tempo de crescimento é de `10` segundos.
- Com upgrade de adubo, novos plantios levam `8` segundos.
- Cada canteiro pode estar em um de três estados:
  - vazio
  - crescendo
  - pronto para colher

## Interface atual
Tela única com:
- título do jogo
- contador de moedas
- contador de sementes
- contador de morangos
- mensagem de status
- status de autosave
- legenda visual dos estados dos canteiros
- grade 3x3 da fazenda
- barra de progresso durante o crescimento
- destaque visual quando o morango está pronto
- card de upgrade `Adubo rápido`
- card de upgrade `Caixa premium`
- botão `Comprar semente`
- botão `Vender morangos`
- botão `Reiniciar jogo`

## Arquitetura dos arquivos
- `index.html`: estrutura da tela única
- `style.css`: layout, cores e responsividade
- `config.js`: constantes do jogo e valores da economia
- `game.js`: estado, renderização, lógica do jogo e persistência
- `tests/playwright/strawberry-farm.e2e.js`: teste end-to-end principal com Playwright

## Checklist de implementação
- [x] Criar layout de tela única
- [x] Exibir título, moedas, sementes e morangos
- [x] Renderizar grade 3x3
- [x] Representar canteiros vazios, crescendo e prontos
- [x] Permitir plantio em canteiros vazios
- [x] Iniciar temporizador ao plantar
- [x] Liberar colheita ao final do tempo
- [x] Permitir colher com clique
- [x] Comprar sementes com moedas
- [x] Vender morangos colhidos
- [x] Reiniciar progresso
- [x] Exibir confirmação antes do reset
- [x] Salvar estado com `localStorage`
- [x] Carregar estado salvo ao abrir
- [x] Continuar crescimento após recarga usando timestamps
- [x] Exibir status de autosave
- [x] Melhorar feedback visual dos canteiros
- [x] Adicionar upgrade de crescimento
- [x] Adicionar upgrade de venda
- [x] Exibir mensagem de vitória ao chegar em `20` moedas
- [x] Manter constantes separadas em `config.js`
- [x] Traduzir a interface para português

## Testes
O projeto possui um teste principal de interface e fluxo em:

- `tests/playwright/strawberry-farm.e2e.js`

Esse teste valida:
- renderização inicial
- compra de sementes
- plantio
- persistência
- autosave
- crescimento e colheita
- venda
- upgrade de crescimento
- upgrade de venda
- condição de vitória
- cancelamento de reset
- reset do jogo

## Agentes
O projeto também mantém agentes especializados em [AGENTS.md](/Users/wiser/projects/strawberry-farm/AGENTS.md) e no diretório [agents](/Users/wiser/projects/strawberry-farm/agents), cobrindo produto, design, economia, gameplay, UI/UX e QA/playtest.

Exemplo de execução com o `playwright-skill`:

```bash
cd <caminho-do-playwright-skill>
TARGET_URL="file://$(pwd)/index.html" node run.js "$(pwd)/tests/playwright/strawberry-farm.e2e.js"
```

Se quiser apontar para outra URL:

```bash
cd <caminho-do-playwright-skill>
TARGET_URL='http://localhost:4173' node run.js <caminho-absoluto-do-projeto>/tests/playwright/strawberry-farm.e2e.js
```

## Fora de escopo
- multiplayer
- arte complexa
- NPCs
- estações do ano
- áudio
- autenticação
