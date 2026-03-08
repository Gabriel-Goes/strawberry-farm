(function (SF) {
  function getPrestigeMultiplierForLevel(level) {
    return 1 + Math.max(0, level) * SF.config.prestige.sellBonusPerLevel;
  }

  function getPrestigeSaleMultiplier(game) {
    return 1 + Math.max(0, game.state.prestige.sellBonusMultiplier);
  }

  function getPrestigeBonusPercent(game, level = game.state.prestige.level) {
    if (level === game.state.prestige.level) {
      return Math.round(game.state.prestige.sellBonusMultiplier * 100);
    }

    return Math.round((getPrestigeMultiplierForLevel(level) - 1) * 100);
  }

  function getPrestigeThreshold(game) {
    return SF.config.prestige.baseThresholdMoney * (Math.max(0, game.state.prestige.level) + 1);
  }

  function isPrestigeAvailable(game) {
    return game.state.money >= getPrestigeThreshold(game);
  }

  function getPrestigeSaleBonus(game, baseEarned) {
    if (game.state.prestige.level <= 0 || baseEarned <= 0) {
      return 0;
    }

    return Math.max(0, Math.round(baseEarned * getPrestigeSaleMultiplier(game)) - baseEarned);
  }

  SF.prestige = {
    getPrestigeMultiplierForLevel,
    getPrestigeSaleMultiplier,
    getPrestigeBonusPercent,
    getPrestigeThreshold,
    isPrestigeAvailable,
    getPrestigeSaleBonus,
  };
})(window.StrawberryFarm = window.StrawberryFarm || {});
