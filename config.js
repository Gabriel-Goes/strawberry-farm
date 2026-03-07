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
  progressionGoals: [
    {
      id: "harvest-3",
      title: "Primeira colheita",
      description: "Colha 3 morangos ao todo.",
      targetType: "harvestedTotal",
      targetValue: 3,
      reward: {
        money: 3,
      },
    },
    {
      id: "buy-upgrade",
      title: "Primeira melhoria",
      description: "Compre 1 melhoria.",
      targetType: "upgradesPurchased",
      targetValue: 1,
      reward: {
        seeds: 2,
      },
    },
    {
      id: "reach-20",
      title: "Fazenda rentável",
      description: "Alcance 20 moedas.",
      targetType: "money",
      targetValue: 20,
      reward: null,
    },
  ],
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
