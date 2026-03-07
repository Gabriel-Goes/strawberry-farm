window.STRAWBERRY_CONFIG = {
  title: "Fazenda de Morangos",
  storageKey: "strawberry-farm-save",
  gridSize: 9,
  winMoney: 20,
  autosaveIntervalMs: 4000,
  crop: {
    name: "Morango",
    growthTimeMs: 10000,
    harvestYield: 1,
    sellPrice: 3,
    seedPrice: 2,
  },
  upgrades: {
    fertilizer: {
      label: "Adubo rápido",
      cost: 12,
      growthMultiplier: 0.75,
      description: "Reduz o tempo de crescimento em 25%.",
    },
    market: {
      label: "Caixa premium",
      cost: 15,
      sellPriceBonus: 2,
      description: "Cada morango vendido rende +2 moedas.",
    },
  },
  startingState: {
    money: 6,
    seeds: 3,
    strawberries: 0,
  },
  plotStates: {
    empty: "empty",
    growing: "growing",
    ready: "ready",
  },
};
