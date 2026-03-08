# Architecture Proposal — Strawberry Farm

## Objective

Refactor the current project into a clearer and more maintainable structure, without overengineering.

This proposal aims to:

- keep the project simple
- preserve the current gameplay behavior
- improve code discoverability
- reduce the size and responsibility concentration of the current main game file
- clearly separate game runtime code from agent workflow artifacts
- keep deployment simple

---

## Current Problems

### 1. Runtime logic is too concentrated
The current game logic has grown enough that keeping everything in a single main file now increases maintenance cost.

### 2. Repository root is too noisy
Gameplay files, planning artifacts, reports, and agent-related materials feel mixed together.

### 3. Runtime code and agent workflow are conceptually different
The browser game is the product.  
Prompts, sprint plans, QA reports, and design artifacts are development workflow assets.

These should not live mixed together as the project grows.

---

## Refactor Principles

### Keep it simple
Do not introduce frameworks, bundlers, or complex abstractions.

### Prefer functional modules
Use small plain JavaScript modules grouped by responsibility.

### Preserve behavior
This refactor is architectural, not product expansion.

### Separate runtime from process
Everything that runs in the browser should be easy to find immediately.  
Everything related to agents, sprint planning, and internal process should live in its own area.

### Optimize for the current stage
This is still a small browser game, not a large production system.

---

## Proposed Folder Structure

```text
strawberry-farm/
│
├── public/
│   ├── index.html
│   └── style.css
│
├── src/
│   ├── main.js
│   │
│   ├── config/
│   │   └── gameConfig.js
│   │
│   ├── state/
│   │   ├── createGameState.js
│   │   └── persistence.js
│   │
│   ├── systems/
│   │   ├── plots.js
│   │   ├── market.js
│   │   ├── events.js
│   │   ├── combo.js
│   │   ├── helper.js
│   │   ├── prestige.js
│   │   ├── progression.js
│   │   └── upgrades.js
│   │
│   ├── ui/
│   │   ├── render.js
│   │   ├── hud.js
│   │   ├── farmGrid.js
│   │   ├── panels.js
│   │   └── actions.js
│   │
│   └── utils/
│       ├── dom.js
│       ├── format.js
│       └── time.js
│
├── tests/
│   ├── manual/
│   └── reports/
│
├── agents/
│   ├── prompts/
│   │   ├── full-game-director.md
│   │   ├── product-director.md
│   │   ├── game-designer.md
│   │   ├── economy-balance-designer.md
│   │   ├── gameplay-developer.md
│   │   ├── ui-ux-developer.md
│   │   └── qa-playtest-agent.md
│   │
│   ├── planning/
│   │   ├── sprint-plans/
│   │   ├── analyses/
│   │   ├── reviews/
│   │   └── acceptance/
│   │
│   └── docs/
│       ├── systems/
│       ├── economy/
│       └── ui/
│
├── docs/
│   ├── architecture.md
│   ├── game-overview.md
│   ├── technical-decisions.md
│   └── changelog.md
│
├── README.md
└── AGENTS.md
```
