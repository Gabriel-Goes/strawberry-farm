const config = window.STRAWBERRY_CONFIG;

const elements = {
  moneyCount: document.querySelector("#moneyCount"),
  seedCount: document.querySelector("#seedCount"),
  berryCount: document.querySelector("#berryCount"),
  sellPriceValue: document.querySelector("#sellPriceValue"),
  growthTimeValue: document.querySelector("#growthTimeValue"),
  goalStatus: document.querySelector("#goalStatus"),
  statusMessage: document.querySelector("#statusMessage"),
  saveStatus: document.querySelector("#saveStatus"),
  progressSummary: document.querySelector("#progressSummary"),
  goalList: document.querySelector("#goalList"),
  farmGrid: document.querySelector("#farmGrid"),
  buySeedButton: document.querySelector("#buySeedButton"),
  sellButton: document.querySelector("#sellButton"),
  resetButton: document.querySelector("#resetButton"),
  fertilizerButton: document.querySelector("#fertilizerButton"),
  marketButton: document.querySelector("#marketButton"),
  fertilizerDescription: document.querySelector("#fertilizerDescription"),
  marketDescription: document.querySelector("#marketDescription"),
};

const storage = createStorageAdapter();
const plotElements = [];
let state = loadState();
let autosaveIntervalId = null;
let dirty = false;

render();
startTicker();
startAutosave();

elements.buySeedButton.addEventListener("click", buySeed);
elements.sellButton.addEventListener("click", sellStrawberries);
elements.resetButton.addEventListener("click", resetGame);
elements.fertilizerButton.addEventListener("click", buyFertilizerUpgrade);
elements.marketButton.addEventListener("click", buyMarketUpgrade);
window.addEventListener("pagehide", flushAutosave);
window.addEventListener("beforeunload", flushAutosave);

function createInitialState() {
  return {
    money: config.startingState.money,
    seeds: config.startingState.seeds,
    strawberries: config.startingState.strawberries,
    upgrades: {
      fertilizer: false,
      market: false,
    },
    progression: {
      completedGoalIds: [],
    },
    stats: {
      harvestedTotal: 0,
      soldTotal: 0,
      upgradesPurchased: 0,
    },
    lastSavedAt: null,
    message: "Plante seus primeiros morangos.",
    plots: Array.from({ length: config.gridSize }, (_, index) => ({
      id: index,
      state: config.plotStates.empty,
      plantedAt: null,
      readyAt: null,
      growthDurationMs: null,
    })),
  };
}

function loadState() {
  const saved = storage.getItem(config.storageKey);

  if (!saved) {
    const initialState = createInitialState();

    if (!storage.isPersistent) {
      initialState.message =
        "Seu navegador bloqueou o salvamento local neste arquivo. O jogo funciona, mas sem salvar progresso.";
    }

    return initialState;
  }

  try {
    return hydrateState(JSON.parse(saved));
  } catch {
    return createInitialState();
  }
}

function hydrateState(savedState) {
  const nextState = createInitialState();

  nextState.money = Number.isFinite(savedState.money) ? savedState.money : nextState.money;
  nextState.seeds = Number.isFinite(savedState.seeds) ? savedState.seeds : nextState.seeds;
  nextState.strawberries = Number.isFinite(savedState.strawberries)
    ? savedState.strawberries
    : nextState.strawberries;
  nextState.message = typeof savedState.message === "string" ? savedState.message : nextState.message;
  nextState.lastSavedAt = Number.isFinite(savedState.lastSavedAt) ? savedState.lastSavedAt : null;

  if (savedState.upgrades && typeof savedState.upgrades === "object") {
    nextState.upgrades.fertilizer = Boolean(savedState.upgrades.fertilizer);
    nextState.upgrades.market = Boolean(savedState.upgrades.market);
  }

  if (savedState.progression && Array.isArray(savedState.progression.completedGoalIds)) {
    nextState.progression.completedGoalIds = savedState.progression.completedGoalIds.filter((goalId) =>
      config.progressionGoals.some((goal) => goal.id === goalId),
    );
  }

  if (savedState.stats && typeof savedState.stats === "object") {
    nextState.stats.harvestedTotal = Number.isFinite(savedState.stats.harvestedTotal)
      ? savedState.stats.harvestedTotal
      : nextState.stats.harvestedTotal;
    nextState.stats.soldTotal = Number.isFinite(savedState.stats.soldTotal)
      ? savedState.stats.soldTotal
      : nextState.stats.soldTotal;
    nextState.stats.upgradesPurchased = Number.isFinite(savedState.stats.upgradesPurchased)
      ? savedState.stats.upgradesPurchased
      : nextState.stats.upgradesPurchased;
  }

  if (Array.isArray(savedState.plots)) {
    nextState.plots = nextState.plots.map((plot, index) => {
      const savedPlot = savedState.plots[index];

      if (!savedPlot) {
        return plot;
      }

      const plotState = Object.values(config.plotStates).includes(savedPlot.state)
        ? savedPlot.state
        : config.plotStates.empty;

      return {
        ...plot,
        state: plotState,
        plantedAt: Number.isFinite(savedPlot.plantedAt) ? savedPlot.plantedAt : null,
        readyAt: Number.isFinite(savedPlot.readyAt) ? savedPlot.readyAt : null,
        growthDurationMs: Number.isFinite(savedPlot.growthDurationMs) ? savedPlot.growthDurationMs : null,
      };
    });
  }

  updatePlotsByTime(nextState);
  return nextState;
}

function saveState() {
  state.lastSavedAt = Date.now();
  storage.setItem(config.storageKey, JSON.stringify(state));
  dirty = false;
}

function createStorageAdapter() {
  try {
    const testKey = `${config.storageKey}-test`;
    window.localStorage.setItem(testKey, "ok");
    window.localStorage.removeItem(testKey);

    return {
      isPersistent: true,
      getItem(key) {
        return window.localStorage.getItem(key);
      },
      setItem(key, value) {
        window.localStorage.setItem(key, value);
      },
    };
  } catch {
    const memoryStorage = new Map();

    return {
      isPersistent: false,
      getItem(key) {
        return memoryStorage.has(key) ? memoryStorage.get(key) : null;
      },
      setItem(key, value) {
        memoryStorage.set(key, value);
      },
    };
  }
}

function getGrowthTimeMs() {
  if (state.upgrades.fertilizer) {
    return Math.floor(config.crop.growthTimeMs * config.upgrades.fertilizer.growthMultiplier);
  }

  return config.crop.growthTimeMs;
}

function getSellPrice() {
  if (state.upgrades.market) {
    return config.crop.sellPrice + config.upgrades.market.sellPriceBonus;
  }

  return config.crop.sellPrice;
}

function buySeed() {
  if (state.money < config.crop.seedPrice) {
    setMessage("Você não tem moedas suficientes para comprar uma semente.");
    render();
    return;
  }

  state.money -= config.crop.seedPrice;
  state.seeds += 1;
  setMessage("Você comprou 1 semente.");
  commit();
}

function sellStrawberries() {
  if (state.strawberries <= 0) {
    setMessage("Você não tem morangos para vender.");
    render();
    return;
  }

  const sellPrice = getSellPrice();
  const quantity = state.strawberries;
  const earnedMoney = quantity * sellPrice;
  state.money += earnedMoney;
  state.strawberries = 0;
  state.stats.soldTotal += quantity;
  setMessage(`Você vendeu morangos por ${earnedMoney} moedas.`);
  commit();
}

function buyFertilizerUpgrade() {
  const upgrade = config.upgrades.fertilizer;

  if (state.upgrades.fertilizer) {
    setMessage("O adubo rápido já está ativo.");
    render();
    return;
  }

  if (state.money < upgrade.cost) {
    setMessage("Você ainda não tem moedas suficientes para comprar o adubo rápido.");
    render();
    return;
  }

  state.money -= upgrade.cost;
  state.upgrades.fertilizer = true;
  state.stats.upgradesPurchased += 1;
  setMessage("Adubo rápido comprado. Novos plantios crescem mais rápido.");
  commit();
}

function buyMarketUpgrade() {
  const upgrade = config.upgrades.market;

  if (state.upgrades.market) {
    setMessage("A caixa premium já está ativa.");
    render();
    return;
  }

  if (state.money < upgrade.cost) {
    setMessage("Você ainda não tem moedas suficientes para melhorar a venda.");
    render();
    return;
  }

  state.money -= upgrade.cost;
  state.upgrades.market = true;
  state.stats.upgradesPurchased += 1;
  setMessage("Caixa premium comprada. Cada morango vendido vale mais.");
  commit();
}

function resetGame() {
  const shouldReset = window.confirm(
    "Reiniciar todo o progresso?\n\nIsso apaga moedas, sementes, upgrades, metas e plantações salvas.",
  );

  if (!shouldReset) {
    setMessage("O progresso foi mantido.");
    render();
    return;
  }

  state = createInitialState();
  saveState();
  render();
}

function handlePlotClick(plotIndex) {
  const plot = state.plots[plotIndex];

  if (!plot) {
    return;
  }

  if (plot.state === config.plotStates.empty) {
    plantPlot(plot);
    return;
  }

  if (plot.state === config.plotStates.ready) {
    harvestPlot(plot);
    return;
  }

  setMessage("Esse morango ainda está crescendo.");
  render();
}

function plantPlot(plot) {
  if (state.seeds <= 0) {
    setMessage("Você precisa de sementes para plantar.");
    render();
    return;
  }

  const now = Date.now();
  const growthDurationMs = getGrowthTimeMs();
  plot.state = config.plotStates.growing;
  plot.plantedAt = now;
  plot.readyAt = now + growthDurationMs;
  plot.growthDurationMs = growthDurationMs;
  state.seeds -= 1;
  setMessage("Semente plantada. Volte em alguns segundos.");
  commit();
}

function harvestPlot(plot) {
  plot.state = config.plotStates.empty;
  plot.plantedAt = null;
  plot.readyAt = null;
  plot.growthDurationMs = null;
  state.strawberries += config.crop.harvestYield;
  state.stats.harvestedTotal += config.crop.harvestYield;
  setMessage("Você colheu 1 morango.");
  commit();
}

function updatePlotsByTime(targetState = state) {
  const now = Date.now();
  let changed = false;

  targetState.plots.forEach((plot) => {
    if (plot.state === config.plotStates.growing && Number.isFinite(plot.readyAt) && now >= plot.readyAt) {
      plot.state = config.plotStates.ready;
      plot.plantedAt = null;
      plot.readyAt = null;
      plot.growthDurationMs = null;
      changed = true;
    }
  });

  return changed;
}

function startTicker() {
  window.setInterval(() => {
    const changed = updatePlotsByTime();

    if (changed) {
      setMessage("Um morango está pronto para colher.");
      dirty = true;
    }

    render();
  }, 250);
}

function startAutosave() {
  autosaveIntervalId = window.setInterval(() => {
    if (!dirty) {
      return;
    }

    saveState();
    render();
  }, config.autosaveIntervalMs);
}

function flushAutosave() {
  if (!dirty) {
    return;
  }

  saveState();
}

function commit() {
  updatePlotsByTime();
  const goalRewards = applyProgressionGoals();

  if (goalRewards.length > 0) {
    setMessage(goalRewards.join(" "));
  }

  dirty = true;
  saveState();
  render();
}

function applyProgressionGoals() {
  const unlockedMessages = [];

  config.progressionGoals.forEach((goal) => {
    if (state.progression.completedGoalIds.includes(goal.id)) {
      return;
    }

    if (!hasReachedGoal(goal)) {
      return;
    }

    state.progression.completedGoalIds.push(goal.id);
    const rewardMessage = grantGoalReward(goal.reward);
    unlockedMessages.push(
      rewardMessage
        ? `Meta concluída: ${goal.title}. ${rewardMessage}`
        : `Meta concluída: ${goal.title}.`,
    );
  });

  return unlockedMessages;
}

function hasReachedGoal(goal) {
  if (goal.targetType === "harvestedTotal") {
    return state.stats.harvestedTotal >= goal.targetValue;
  }

  if (goal.targetType === "upgradesPurchased") {
    return state.stats.upgradesPurchased >= goal.targetValue;
  }

  if (goal.targetType === "money") {
    return state.money >= goal.targetValue;
  }

  return false;
}

function grantGoalReward(reward) {
  if (!reward) {
    return "";
  }

  const rewardParts = [];

  if (Number.isFinite(reward.money) && reward.money > 0) {
    state.money += reward.money;
    rewardParts.push(`Recompensa: +${reward.money} moedas.`);
  }

  if (Number.isFinite(reward.seeds) && reward.seeds > 0) {
    state.seeds += reward.seeds;
    rewardParts.push(`Recompensa: +${reward.seeds} sementes.`);
  }

  return rewardParts.join(" ");
}

function setMessage(message) {
  state.message = message;
}

function render() {
  updatePlotsByTime();

  document.title = config.title;
  elements.moneyCount.textContent = String(state.money);
  elements.seedCount.textContent = String(state.seeds);
  elements.berryCount.textContent = String(state.strawberries);
  elements.sellPriceValue.textContent = `${getSellPrice()} moedas`;
  elements.growthTimeValue.textContent = formatSeconds(getGrowthTimeMs());
  elements.statusMessage.textContent = state.message;
  elements.saveStatus.textContent = getSaveStatusText();

  const hasWon = state.progression.completedGoalIds.includes("reach-20");
  elements.goalStatus.textContent = hasWon
    ? "Você construiu uma pequena fazenda de morangos!"
    : `Meta: alcançar ${config.winMoney} moedas`;
  elements.goalStatus.classList.toggle("goal--won", hasWon);

  elements.buySeedButton.disabled = state.money < config.crop.seedPrice;
  elements.sellButton.disabled = state.strawberries <= 0;
  elements.fertilizerButton.disabled =
    state.upgrades.fertilizer || state.money < config.upgrades.fertilizer.cost;
  elements.marketButton.disabled = state.upgrades.market || state.money < config.upgrades.market.cost;

  elements.fertilizerButton.textContent = state.upgrades.fertilizer
    ? "Adubo ativo"
    : `Comprar adubo (${config.upgrades.fertilizer.cost})`;
  elements.marketButton.textContent = state.upgrades.market
    ? "Venda melhorada"
    : `Melhorar venda (${config.upgrades.market.cost})`;

  elements.fertilizerDescription.textContent = state.upgrades.fertilizer
    ? `Ativo: novos plantios levam ${formatSeconds(getGrowthTimeMs())}.`
    : config.upgrades.fertilizer.description;
  elements.marketDescription.textContent = state.upgrades.market
    ? `Ativo: cada morango vendido vale ${getSellPrice()} moedas.`
    : config.upgrades.market.description;

  renderFarmGrid();
  renderProgression();
}

function renderFarmGrid() {
  if (plotElements.length !== state.plots.length) {
    createFarmGrid();
  }

  state.plots.forEach((plot, index) => {
    const plotElement = plotElements[index];

    if (!plotElement) {
      return;
    }

    const progress = getPlotProgress(plot);
    plotElement.button.className = `plot plot--${plot.state}`;
    plotElement.button.setAttribute("aria-label", getPlotLabel(plot, index));
    plotElement.emoji.textContent = getPlotEmoji(plot);
    plotElement.name.textContent = getPlotName(plot);
    plotElement.timer.textContent = getPlotTimerText(plot);
    plotElement.hint.textContent = getPlotHint(plot);
    plotElement.progressFill.style.width = `${progress}%`;
    plotElement.progressTrack.hidden = plot.state !== config.plotStates.growing;
  });
}

function createFarmGrid() {
  elements.farmGrid.innerHTML = "";
  plotElements.length = 0;

  state.plots.forEach((_, index) => {
    const plotButton = document.createElement("button");
    plotButton.type = "button";
    plotButton.className = "plot";
    plotButton.addEventListener("click", () => handlePlotClick(index));

    const emoji = document.createElement("div");
    emoji.className = "plot__emoji";

    const name = document.createElement("div");
    name.className = "plot__name";

    const timer = document.createElement("div");
    timer.className = "plot__timer";

    const progressTrack = document.createElement("div");
    progressTrack.className = "plot__progress";

    const progressFill = document.createElement("div");
    progressFill.className = "plot__progress-fill";
    progressTrack.append(progressFill);

    const hint = document.createElement("div");
    hint.className = "plot__hint";

    plotButton.append(emoji, name, timer, progressTrack, hint);
    elements.farmGrid.append(plotButton);
    plotElements.push({
      button: plotButton,
      emoji,
      name,
      timer,
      progressTrack,
      progressFill,
      hint,
    });
  });
}

function renderProgression() {
  const completedCount = state.progression.completedGoalIds.length;
  elements.progressSummary.textContent = `${completedCount} de ${config.progressionGoals.length} metas concluídas`;

  elements.goalList.innerHTML = "";

  config.progressionGoals.forEach((goal) => {
    const item = document.createElement("li");
    const isDone = state.progression.completedGoalIds.includes(goal.id);
    item.className = `goal-item${isDone ? " goal-item--done" : ""}`;

    const title = document.createElement("div");
    title.className = "goal-item__title";
    title.textContent = goal.title;

    const description = document.createElement("div");
    description.className = "goal-item__description";
    description.textContent = goal.description;

    const meta = document.createElement("div");
    meta.className = "goal-item__meta";
    meta.textContent = isDone ? "Concluída" : getGoalProgressText(goal);

    item.append(title, description, meta);
    elements.goalList.append(item);
  });
}

function getGoalProgressText(goal) {
  const currentValue = getGoalCurrentValue(goal);

  if (goal.targetType === "money") {
    return `${currentValue}/${goal.targetValue} moedas`;
  }

  if (goal.targetType === "harvestedTotal") {
    return `${currentValue}/${goal.targetValue} morangos colhidos`;
  }

  if (goal.targetType === "upgradesPurchased") {
    return `${currentValue}/${goal.targetValue} melhorias`;
  }

  return `${currentValue}/${goal.targetValue}`;
}

function getGoalCurrentValue(goal) {
  if (goal.targetType === "harvestedTotal") {
    return state.stats.harvestedTotal;
  }

  if (goal.targetType === "upgradesPurchased") {
    return state.stats.upgradesPurchased;
  }

  if (goal.targetType === "money") {
    return state.money;
  }

  return 0;
}

function getPlotEmoji(plot) {
  if (plot.state === config.plotStates.growing) {
    return "🌱";
  }

  if (plot.state === config.plotStates.ready) {
    return "🍓";
  }

  return "🟫";
}

function getPlotName(plot) {
  if (plot.state === config.plotStates.growing) {
    return "Crescendo";
  }

  if (plot.state === config.plotStates.ready) {
    return "Pronto para colher";
  }

  return "Terreno vazio";
}

function getPlotTimerText(plot) {
  if (plot.state === config.plotStates.growing && Number.isFinite(plot.readyAt)) {
    const remainingMs = Math.max(0, plot.readyAt - Date.now());
    return `Faltam ${formatSeconds(remainingMs)}`;
  }

  if (plot.state === config.plotStates.ready) {
    return "Clique para colher";
  }

  return "Clique para plantar";
}

function getPlotHint(plot) {
  if (plot.state === config.plotStates.growing) {
    return `${Math.round(getPlotProgress(plot))}% concluído`;
  }

  if (plot.state === config.plotStates.ready) {
    return "Colheita disponível";
  }

  return "Aguardando semente";
}

function getPlotProgress(plot) {
  if (
    plot.state !== config.plotStates.growing ||
    !Number.isFinite(plot.readyAt) ||
    !Number.isFinite(plot.plantedAt) ||
    !Number.isFinite(plot.growthDurationMs) ||
    plot.growthDurationMs <= 0
  ) {
    return plot.state === config.plotStates.ready ? 100 : 0;
  }

  const elapsed = Date.now() - plot.plantedAt;
  return Math.max(0, Math.min(100, (elapsed / plot.growthDurationMs) * 100));
}

function formatSeconds(durationMs) {
  const seconds = Math.ceil(durationMs / 1000);
  return `${seconds}s`;
}

function getPlotLabel(plot, index) {
  return `Canteiro ${index + 1}: ${getPlotName(plot)}. ${getPlotTimerText(plot)}. ${getPlotHint(plot)}`;
}

function getSaveStatusText() {
  if (!storage.isPersistent) {
    return "Salvamento local indisponível neste arquivo.";
  }

  if (dirty) {
    return "Salvando automaticamente...";
  }

  if (Number.isFinite(state.lastSavedAt)) {
    return `Salvo automaticamente às ${formatClock(state.lastSavedAt)}.`;
  }

  return "Salvamento automático ativo.";
}

function formatClock(timestamp) {
  return new Date(timestamp).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
