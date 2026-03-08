(function (SF) {
  SF.render = SF.render || {};

  function render(game) {
    SF.events.updateActiveEvent(game);
    SF.combo.updateComboState(game);
    SF.plots.updatePlotsByTime(game);
    SF.plots.syncHarvestEffects(game);
    syncMilestoneToast(game);

    const farmMetrics = SF.plots.getFarmMetrics(game);
    renderStaticState(game, farmMetrics);
    renderLiveState(game, farmMetrics);
  }

  function renderStaticState(game) {
    const { elements, state } = game;

    document.title = SF.config.title;
    elements.moneyCount.textContent = String(state.money);
    elements.seedCount.textContent = String(state.seeds);
    elements.berryCount.textContent = String(state.strawberries);
    elements.sellPriceValue.textContent = `${SF.market.getSellPrice(game)} moedas`;
    elements.sellPriceHint.textContent = SF.market.getSellPriceHint(game);
    elements.growthTimeValue.textContent = SF.utils.formatSeconds(SF.plots.getGrowthTimeMs(game));
    elements.plotCountValue.textContent = `${state.unlockedPlotCount}/${SF.config.maxPlotCount}`;
    elements.statusMessage.textContent = state.message;
    renderSaveStatus(game);
    renderGoalStatus(game);
    renderStatHighlights(game);
    renderPrimaryActions(game);
    renderHelperCard(game);
    renderPrestigeCard(game);
    renderPrestigePanel(game);
    renderHelpPanel(game);
    renderUpgradeCards(game);
    renderProgression(game);
  }

  function renderLiveState(game, farmMetrics = SF.plots.getFarmMetrics(game)) {
    SF.plots.syncHarvestEffects(game);
    syncMilestoneToast(game);
    renderHelperCard(game);
    renderProgressIndicators(game, farmMetrics);
    renderComboStrip(game);
    renderHelperStrip(game);
    renderMilestoneToast(game);
    renderEventBanner(game);
    renderMarketBanner(game);
    SF.ui.renderFarmGrid(game, farmMetrics);
  }

  function renderGoalStatus(game) {
    const hasWon = game.state.progression.completedGoalIds.includes("reach-35");
    game.elements.goalStatus.textContent = hasWon
      ? "Você construiu uma pequena fazenda de morangos!"
      : `Meta: alcançar ${SF.config.winMoney} moedas`;
    game.elements.goalStatus.classList.toggle("goal--won", hasWon);
  }

  function renderSaveStatus(game) {
    game.elements.saveStatus.textContent = getSaveStatusText(game);
  }

  function renderPrimaryActions(game) {
    const { elements, state } = game;
    const seedPrice = SF.plots.getSeedPrice(game);
    const activeEvent = SF.events.getActiveEventDefinition(game);
    const marketBasePrice = SF.market.getMarketBasePrice(game);

    elements.buySeedButton.disabled = state.money < seedPrice;
    elements.buySeedButton.textContent = `Comprar semente (${seedPrice})`;
    elements.sellButton.disabled = state.strawberries <= 0;
    elements.fertilizerButton.disabled = state.upgrades.fertilizer || state.money < SF.config.upgrades.fertilizer.cost;
    elements.marketButton.disabled = state.upgrades.market || state.money < SF.config.upgrades.market.cost;
    elements.expandFarmButton.disabled = state.hasExpandedFarm || state.money < SF.config.expansion.cost;
    elements.helperButton.disabled = state.upgrades.helper || state.money < SF.config.upgrades.helper.cost;

    elements.fertilizerButton.textContent = state.upgrades.fertilizer
      ? "Adubo ativo"
      : `Comprar adubo (${SF.config.upgrades.fertilizer.cost})`;
    elements.marketButton.textContent = state.upgrades.market
      ? "Venda melhorada"
      : `Melhorar venda (${SF.config.upgrades.market.cost})`;
    elements.expandFarmButton.textContent = state.hasExpandedFarm
      ? "Fazenda expandida"
      : `Expandir fazenda (${SF.config.expansion.cost})`;
    elements.helperButton.textContent = state.upgrades.helper
      ? "Farm Helper ativo"
      : `Comprar helper (${SF.config.upgrades.helper.cost})`;

    elements.buySeedButton.classList.toggle("action-btn--highlight", Boolean(activeEvent?.seedPriceDiscount));
    elements.sellButton.classList.toggle(
      "action-btn--highlight",
      Boolean(activeEvent?.sellPriceBonus) || marketBasePrice >= SF.config.market.maxPrice,
    );
    elements.fertilizerButton.classList.toggle("action-btn--highlight", Boolean(activeEvent?.growthMultiplier));
    elements.helperButton.classList.toggle("action-btn--highlight", state.upgrades.helper);
  }

  function renderUpgradeCards(game) {
    const activeEvent = SF.events.getActiveEventDefinition(game);
    game.elements.fertilizerDescription.textContent = game.state.upgrades.fertilizer
      ? `Ativo: novos plantios levam ${SF.utils.formatSeconds(SF.plots.getGrowthTimeMs(game))}.`
      : SF.config.upgrades.fertilizer.description;
    game.elements.marketDescription.textContent = game.state.upgrades.market
      ? `Ativo: cada morango vendido vale ${SF.market.getSellPrice(game)} moedas${game.state.prestige.level > 0 ? ` antes do bônus permanente de +${SF.prestige.getPrestigeBonusPercent(game)}%.` : activeEvent?.sellPriceBonus ? " durante o evento." : "."}`
      : SF.config.upgrades.market.description;
    game.elements.expansionDescription.textContent = game.state.hasExpandedFarm
      ? "Ativo: todos os 16 canteiros estão liberados."
      : SF.config.expansion.description;
    game.elements.helperDescription.textContent = game.state.upgrades.helper
      ? `Ativo: colhe 1 canteiro pronto a cada ${SF.utils.formatSeconds(SF.config.upgrades.helper.harvestIntervalMs)} sem usar combo.`
      : SF.config.upgrades.helper.description;
  }

  function renderEventBanner(game) {
    const activeEvent = SF.events.getActiveEventDefinition(game);

    if (!activeEvent || !game.state.systems.activeEvent) {
      game.elements.eventBanner.className = "event-banner event-banner--idle";
      game.elements.eventTitle.textContent = "Nenhum evento ativo";
      game.elements.eventDescription.textContent = "Venda morangos para ter chance de ativar um evento curto.";
      game.elements.eventEffect.textContent = "Sem bônus ativo no momento.";
      game.elements.eventTags.hidden = true;
      game.elements.eventTags.innerHTML = "";
      game.elements.eventTimer.textContent = "Aguardando";
      game.elements.eventProgressBar.style.width = "0%";
      return;
    }

    const remainingMs = Math.max(0, game.state.systems.activeEvent.endsAt - Date.now());
    const totalDurationMs = SF.events.getEventDurationMs(game, activeEvent);
    const progressPercent = totalDurationMs > 0 ? (remainingMs / totalDurationMs) * 100 : 0;
    game.elements.eventBanner.className = `event-banner ${activeEvent.accentClass}`;
    game.elements.eventTitle.textContent = activeEvent.title;
    game.elements.eventDescription.textContent = activeEvent.description;
    game.elements.eventEffect.textContent = SF.events.getEventEffectText(game, activeEvent);
    renderEventTags(game, activeEvent);
    game.elements.eventTimer.textContent = `Termina em ${SF.utils.formatSeconds(remainingMs)}`;
    game.elements.eventProgressBar.style.width = `${Math.max(0, Math.min(100, progressPercent))}%`;
  }

  function renderMarketBanner(game) {
    const market = game.state.systems.market;
    const marketBasePrice = SF.market.getMarketBasePrice(game);
    const finalSellPrice = SF.market.getSellPrice(game);
    const remainingMs = Math.max(0, market.nextUpdateAt - Date.now());
    const activeEvent = SF.events.getActiveEventDefinition(game);

    game.elements.marketBanner.className = `market-banner market-banner--${market.direction}`;
    game.elements.marketHeadline.textContent = SF.market.getMarketHeadline(game);
    game.elements.marketSummary.textContent = SF.market.getMarketDescription(game);
    game.elements.marketEffect.textContent = activeEvent?.sellPriceBonus
      ? `Preço base: ${marketBasePrice} moedas. Com bônus ativos, você vende por ${finalSellPrice}${game.state.prestige.level > 0 ? ` e ainda recebe +${SF.prestige.getPrestigeBonusPercent(game)}% no total.` : "."}`
      : game.state.prestige.level > 0
        ? `Preço base atual: ${marketBasePrice} moedas por morango. Strawberry Knowledge: +${SF.prestige.getPrestigeBonusPercent(game)}% no total vendido.`
        : `Preço base atual: ${marketBasePrice} moedas por morango.`;
    game.elements.marketPriceValue.textContent = `${marketBasePrice} moedas`;
    game.elements.marketChangeIndicator.textContent = SF.market.getMarketChangeText(game);
    game.elements.marketTimer.textContent = `Atualiza em ${SF.utils.formatSeconds(remainingMs)}`;
  }

  function renderComboStrip(game) {
    const combo = game.state.systems.combo;
    const isActive = combo.count >= 2 && Number.isFinite(combo.expiresAt) && Date.now() < combo.expiresAt;

    game.elements.comboStrip.hidden = !isActive;
    if (!isActive) {
      return;
    }

    const remainingMs = Math.max(0, combo.expiresAt - Date.now());
    const progressPercent = (remainingMs / SF.config.combo.windowMs) * 100;
    const nextThreshold = SF.combo.getNextComboThreshold(combo.count);
    const rewardText = combo.rewardMoney > 0 ? ` +${combo.rewardMoney} moeda bônus` : "";

    game.elements.comboTitle.textContent = `Combo x${combo.count}${rewardText}`;
    game.elements.comboText.textContent = nextThreshold
      ? `Colha outro canteiro em sequência para buscar o combo x${nextThreshold.count}.`
      : "Combo máximo deste sprint alcançado.";
    game.elements.comboTimer.textContent = `Expira em ${SF.utils.formatSeconds(remainingMs)}`;
    game.elements.comboProgressBar.style.width = `${Math.max(0, Math.min(100, progressPercent))}%`;
  }

  function renderHelperCard(game) {
    const isActive = game.state.upgrades.helper;
    const nextHarvestAt = game.state.systems.helper.nextHarvestAt;

    game.elements.helperStatusValue.textContent = isActive ? "Ativo" : "Desligado";
    game.elements.helperStatusHint.textContent =
      isActive && Number.isFinite(nextHarvestAt)
        ? `Próxima verificação em ${SF.utils.formatSeconds(Math.max(0, nextHarvestAt - Date.now()))}.`
        : "Compre para colher 1 canteiro pronto automaticamente.";
    game.elements.helperCard.classList.toggle("stat--highlight", isActive);
  }

  function renderPrestigeCard(game) {
    game.elements.prestigeLevelValue.textContent = `Nível ${game.state.prestige.level}`;
    game.elements.prestigeBonusHint.textContent = `Bônus permanente: +${SF.prestige.getPrestigeBonusPercent(game)}% nas vendas.`;
    game.elements.prestigeCard.classList.toggle("stat--highlight", SF.prestige.isPrestigeAvailable(game));
  }

  function renderPrestigePanel(game) {
    const currentThreshold = SF.prestige.getPrestigeThreshold(game);
    const isAvailable = SF.prestige.isPrestigeAvailable(game);
    const nextBonusPercent = SF.prestige.getPrestigeBonusPercent(game, game.state.prestige.level + 1);

    game.elements.prestigePanel.classList.toggle("prestige-panel--available", isAvailable);
    game.elements.prestigePanelTitle.textContent = "Strawberry Knowledge";
    game.elements.prestigePanelDescription.textContent = isAvailable
      ? `Prestígio disponível. Reinicie a fazenda para subir ao nível ${game.state.prestige.level + 1} e ganhar +${nextBonusPercent}% permanente nas vendas.`
      : SF.config.prestige.description;
    game.elements.prestigeThresholdText.textContent = isAvailable
      ? `Disponível agora com ${game.state.money} moedas.`
      : `Próximo prestígio em ${currentThreshold} moedas.`;
    game.elements.prestigeButton.disabled = !isAvailable;
    game.elements.prestigeButton.textContent = isAvailable
      ? `Prestigiar fazenda (+${nextBonusPercent}%)`
      : `Prestígio bloqueado (${currentThreshold})`;
  }

  function renderHelperStrip(game) {
    const isActive = game.state.upgrades.helper;
    game.elements.helperStrip.hidden = !isActive;

    if (!isActive) {
      return;
    }

    const helper = game.state.systems.helper;
    const nextHarvestAt = Number.isFinite(helper.nextHarvestAt)
      ? Math.max(0, helper.nextHarvestAt - Date.now())
      : SF.config.upgrades.helper.harvestIntervalMs;
    const recentAction = Number.isFinite(helper.lastActionAt) && Date.now() - helper.lastActionAt < 2800;

    game.elements.helperStripText.textContent =
      recentAction && helper.lastActionText
        ? helper.lastActionText
        : "Ativo: colhe 1 canteiro pronto por ciclo e não gera combo.";
    game.elements.helperStripTimer.textContent = `Próxima verificação em ${SF.utils.formatSeconds(nextHarvestAt)}`;
  }

  function renderEventTags(game, activeEvent) {
    const tags = SF.events.getEventTags(game, activeEvent);
    game.elements.eventTags.hidden = tags.length === 0;
    game.elements.eventTags.innerHTML = "";

    tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "event-banner__tag";
      tagElement.textContent = tag;
      game.elements.eventTags.append(tagElement);
    });
  }

  function renderProgression(game) {
    const completedCount = game.state.progression.completedGoalIds.length;
    game.elements.progressSummary.textContent = `${completedCount} de ${SF.config.progressionGoals.length} metas concluídas`;
    game.elements.goalList.innerHTML = "";

    SF.config.progressionGoals.forEach((goal) => {
      const item = document.createElement("li");
      const isDone = game.state.progression.completedGoalIds.includes(goal.id);
      item.className = `goal-item${isDone ? " goal-item--done" : ""}`;

      const title = document.createElement("div");
      title.className = "goal-item__title";
      title.textContent = goal.title;

      const description = document.createElement("div");
      description.className = "goal-item__description";
      description.textContent = goal.description;

      const meta = document.createElement("div");
      meta.className = "goal-item__meta";
      meta.textContent = isDone ? "Concluída" : getGoalProgressText(game, goal);

      const progressBar = document.createElement("div");
      progressBar.className = "goal-item__bar";

      const progressFill = document.createElement("div");
      progressFill.className = "goal-item__fill";
      progressFill.style.width = `${getGoalPercent(game, goal)}%`;
      progressBar.append(progressFill);

      item.append(title, description, meta, progressBar);
      game.elements.goalList.append(item);
    });
  }

  function renderHelpPanel(game) {
    game.elements.helpPanel.hidden = !game.state.ui.helpOpen;
    game.elements.helpToggleButton.textContent = game.state.ui.helpOpen ? "Ocultar ajuda" : "Ajuda rápida";
    game.elements.helpToggleButton.setAttribute("aria-expanded", String(game.state.ui.helpOpen));
  }

  function renderProgressIndicators(game, farmMetrics) {
    const moneyProgressPercent = (Math.min(game.state.money, SF.config.winMoney) / SF.config.winMoney) * 100;
    const readyProgressPercent =
      farmMetrics.unlockedPlots > 0 ? (farmMetrics.readyPlots / farmMetrics.unlockedPlots) * 100 : 0;

    game.elements.moneyGoalProgressLabel.textContent = `${game.state.money} / ${SF.config.winMoney} moedas`;
    game.elements.moneyGoalProgressBar.style.width = `${Math.max(0, Math.min(100, moneyProgressPercent))}%`;
    game.elements.readyPlotProgressLabel.textContent = `${farmMetrics.readyPlots} / ${farmMetrics.unlockedPlots}`;
    game.elements.readyPlotProgressBar.style.width = `${Math.max(0, Math.min(100, readyProgressPercent))}%`;
  }

  function renderMilestoneToast(game) {
    const toast = game.uiState.milestoneToast;
    const isVisible = Boolean(toast && toast.visibleUntil > Date.now());

    game.elements.milestoneToast.hidden = !isVisible;
    if (!isVisible) {
      return;
    }

    game.elements.milestoneToastText.textContent = toast.message;
  }

  function showMilestoneToast(game, message) {
    game.uiState.milestoneToast = {
      message,
      visibleUntil: Date.now() + 5000,
    };
  }

  function syncMilestoneToast(game) {
    if (game.uiState.milestoneToast && game.uiState.milestoneToast.visibleUntil <= Date.now()) {
      game.uiState.milestoneToast = null;
    }
  }

  function getGoalProgressText(game, goal) {
    const currentValue = getGoalCurrentValue(game, goal);

    if (goal.targetType === "money") {
      return `${currentValue}/${goal.targetValue} moedas`;
    }
    if (goal.targetType === "harvestedTotal") {
      return `${currentValue}/${goal.targetValue} morangos colhidos`;
    }
    if (goal.targetType === "upgradesPurchased") {
      return `${currentValue}/${goal.targetValue} melhorias`;
    }
    if (goal.targetType === "expandedFarm") {
      return game.state.hasExpandedFarm ? "4x4 liberado" : "Expansão pendente";
    }

    return `${currentValue}/${goal.targetValue}`;
  }

  function getGoalCurrentValue(game, goal) {
    if (goal.targetType === "harvestedTotal") {
      return game.state.stats.harvestedTotal;
    }
    if (goal.targetType === "upgradesPurchased") {
      return game.state.stats.upgradesPurchased;
    }
    if (goal.targetType === "money") {
      return game.state.money;
    }
    if (goal.targetType === "expandedFarm") {
      return game.state.hasExpandedFarm ? 1 : 0;
    }
    return 0;
  }

  function getGoalPercent(game, goal) {
    if (goal.targetType === "expandedFarm") {
      return game.state.hasExpandedFarm ? 100 : 0;
    }

    const current = getGoalCurrentValue(game, goal);
    return Math.max(0, Math.min(100, (current / goal.targetValue) * 100));
  }

  function getSaveStatusText(game) {
    if (!game.storage.isPersistent) {
      return "Salvamento local indisponível neste arquivo.";
    }
    if (game.dirty) {
      return "Salvando automaticamente...";
    }
    if (Number.isFinite(game.state.systems.lastSavedAt)) {
      return `Salvo automaticamente às ${SF.utils.formatClock(game.state.systems.lastSavedAt)}.`;
    }
    return "Salvamento automático ativo.";
  }

  function renderStatHighlights(game) {
    clearStatHighlights(game);

    const activeEvent = SF.events.getActiveEventDefinition(game);

    if (SF.prestige.isPrestigeAvailable(game)) {
      game.elements.prestigeCard.classList.add("stat--highlight");
      game.elements.moneyCard.classList.add("stat--highlight");
    }

    if (!activeEvent) {
      return;
    }

    if (activeEvent.sellPriceBonus) {
      game.elements.sellPriceCard.classList.add("stat--highlight");
      game.elements.moneyCard.classList.add("stat--highlight");
    }

    if (activeEvent.seedPriceDiscount) {
      game.elements.seedCard.classList.add("stat--highlight");
    }

    if (activeEvent.growthMultiplier) {
      game.elements.growthTimeCard.classList.add("stat--highlight");
      game.elements.plotCountCard.classList.add("stat--highlight");
    }
  }

  function clearStatHighlights(game) {
    [
      game.elements.moneyCard,
      game.elements.seedCard,
      game.elements.berryCard,
      game.elements.sellPriceCard,
      game.elements.growthTimeCard,
      game.elements.plotCountCard,
      game.elements.helperCard,
      game.elements.prestigeCard,
    ].forEach((element) => element.classList.remove("stat--highlight"));
  }

  SF.render.render = render;
  SF.render.renderStaticState = renderStaticState;
  SF.render.renderLiveState = renderLiveState;
  SF.render.renderSaveStatus = renderSaveStatus;
  SF.render.showMilestoneToast = showMilestoneToast;
  SF.render.syncMilestoneToast = syncMilestoneToast;
})(window.StrawberryFarm = window.StrawberryFarm || {});
