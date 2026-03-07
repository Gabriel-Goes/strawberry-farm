const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const TARGET_URL =
  process.env.TARGET_URL ||
  pathToFileURL(path.resolve(__dirname, "../../index.html")).href;

const STORAGE_KEY = "strawberry-farm-save";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function textOf(page, selector) {
  return (await page.locator(selector).textContent())?.trim() || "";
}

async function waitForText(page, selector, expected) {
  await page.waitForFunction(
    ({ selector: targetSelector, expectedText }) => {
      const element = document.querySelector(targetSelector);
      return element && element.textContent && element.textContent.includes(expectedText);
    },
    { selector, expectedText: expected },
  );
}

async function numberOf(page, selector) {
  return Number(await textOf(page, selector));
}

async function completedGoalsCount(page) {
  return page.locator("#goalList .goal-item--done").count();
}

async function reachMoneyTarget(page, target) {
  while ((await numberOf(page, "#moneyCount")) < target) {
    await buySeedsUntilFull(page);
    await plantAllAvailableSeeds(page);

    const growingPlots = await page
      .locator(".plot")
      .evaluateAll((plots) => plots.filter((plot) => plot.textContent.includes("Crescendo")).length);

    assert(growingPlots > 0, `Nenhum canteiro entrou em crescimento ao tentar alcançar ${target} moedas.`);

    await waitForAllGrowingPlots(page);
    await harvestAllReadyPlots(page);

    if (!(await page.locator("#sellButton").isDisabled())) {
      await page.click("#sellButton");
    }
  }
}

async function buySeedsUntilFull(page) {
  while (!(await page.locator("#buySeedButton").isDisabled())) {
    await page.click("#buySeedButton");
  }
}

async function ensureAtLeastOneSeed(page) {
  if ((await numberOf(page, "#seedCount")) <= 0) {
    await page.click("#buySeedButton");
  }
}

async function plantAllAvailableSeeds(page) {
  const plotCount = await page.locator(".plot").count();

  for (let index = 0; index < plotCount; index += 1) {
    if ((await numberOf(page, "#seedCount")) <= 0) {
      break;
    }

    const plot = page.locator(".plot").nth(index);
    const label = await plot.getAttribute("aria-label");

    if (label && label.includes("Terreno vazio")) {
      await plot.click();
    }
  }
}

async function waitForAllGrowingPlots(page) {
  await page.waitForFunction(() => {
    const plots = Array.from(document.querySelectorAll(".plot"));
    return plots.every((plot) => !plot.textContent.includes("Crescendo"));
  }, { timeout: 15000 });
}

async function harvestAllReadyPlots(page) {
  const plotCount = await page.locator(".plot").count();

  for (let index = 0; index < plotCount; index += 1) {
    const plot = page.locator(".plot").nth(index);
    const label = await plot.getAttribute("aria-label");

    if (label && label.includes("colher")) {
      await plot.click();
    }
  }
}

async function reachGoalByPlaying(page) {
  await reachMoneyTarget(page, 20);
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

  try {
    page.on("console", (message) => {
      if (message.type() === "error") {
        console.log("Console error:", message.text());
      }
    });

    page.on("pageerror", (error) => {
      console.log("Page error:", error.message);
    });

    console.log("Abrindo jogo em:", TARGET_URL);
    await page.goto(TARGET_URL, { waitUntil: "load" });

    await page.evaluate((storageKey) => window.localStorage.removeItem(storageKey), STORAGE_KEY);
    await page.reload({ waitUntil: "load" });

    console.log("Cenário 1: renderização inicial");
    await waitForText(page, "h1", "Fazenda de Morangos");
    assert((await page.locator(".plot").count()) === 9, "A grade inicial não possui 9 canteiros.");
    assert((await textOf(page, "#moneyCount")) === "6", "Moedas iniciais incorretas.");
    assert((await textOf(page, "#seedCount")) === "3", "Sementes iniciais incorretas.");
    assert((await textOf(page, "#berryCount")) === "0", "Morangos iniciais incorretos.");
    assert((await textOf(page, "#sellPriceValue")) === "3 moedas", "HUD inicial com valor de venda incorreto.");
    assert((await textOf(page, "#growthTimeValue")) === "10s", "HUD inicial com tempo de crescimento incorreto.");
    assert((await textOf(page, "#progressSummary")) === "0 de 3 metas concluídas", "Resumo inicial de progressão incorreto.");
    assert((await page.locator("#goalList .goal-item").count()) === 3, "A lista de metas não possui 3 itens.");
    assert(await page.locator("#sellButton").isDisabled(), "O botão de vender deveria iniciar desabilitado.");
    assert(
      (await textOf(page, "#saveStatus")).includes("Salvamento automático"),
      "A interface não exibiu o status de salvamento automático.",
    );

    console.log("Cenário 2: compra de semente");
    await page.click("#buySeedButton");
    assert((await textOf(page, "#moneyCount")) === "4", "Compra de semente não descontou moedas.");
    assert((await textOf(page, "#seedCount")) === "4", "Compra de semente não incrementou sementes.");

    console.log("Cenário 3: plantio e persistência antes da colheita");
    const firstPlot = page.locator(".plot").nth(0);
    await firstPlot.click();
    await waitForText(page, "#statusMessage", "Semente plantada");
    assert((await textOf(page, "#seedCount")) === "3", "Plantio não consumiu semente.");
    await page.waitForFunction(() => {
      const plot = document.querySelector(".plot");
      return plot && plot.textContent && plot.textContent.includes("Crescendo");
    });

    await page.reload({ waitUntil: "load" });
    await page.waitForFunction(() => {
      const plot = document.querySelector(".plot");
      return (
        plot &&
        plot.textContent &&
        (plot.textContent.includes("Crescendo") || plot.textContent.includes("Pronto para colher"))
      );
    });
    assert((await textOf(page, "#moneyCount")) === "4", "Estado de moedas não persistiu após reload.");
    assert((await textOf(page, "#seedCount")) === "3", "Estado de sementes não persistiu após reload.");
    assert((await textOf(page, "#saveStatus")).includes("Salvo automaticamente"), "O autosave não foi refletido na interface.");
    assert((await textOf(page, "#progressSummary")) === "0 de 3 metas concluídas", "A progressão inicial não persistiu corretamente.");

    console.log("Cenário 4: crescimento automático e colheita");
    await page.waitForFunction(
      () => {
        const plot = document.querySelector(".plot");
        return plot && plot.textContent && plot.textContent.includes("Pronto para colher");
      },
      { timeout: 12000 },
    );
    await firstPlot.click();
    assert((await textOf(page, "#berryCount")) === "1", "Colheita não adicionou morango.");
    assert(!(await page.locator("#sellButton").isDisabled()), "O botão de vender deveria estar habilitado.");

    console.log("Cenário 5: venda de morangos");
    await page.click("#sellButton");
    assert((await textOf(page, "#berryCount")) === "0", "Venda não zerou morangos.");
    assert((await textOf(page, "#moneyCount")) === "7", "Venda não creditou moedas corretamente.");

    console.log("Cenário 6: comprar melhoria de crescimento");
    await reachMoneyTarget(page, 12);
    await page.click("#fertilizerButton");
    await page.waitForFunction(() => {
      const button = document.querySelector("#fertilizerButton");
      const timeValue = document.querySelector("#growthTimeValue");
      return (
        button &&
        button.textContent &&
        button.textContent.includes("Adubo ativo") &&
        timeValue &&
        timeValue.textContent === "8s"
      );
    });
    assert(await page.locator("#fertilizerButton").isDisabled(), "O botão do adubo deveria ficar desabilitado após a compra.");
    assert(
      (await textOf(page, "#fertilizerDescription")).includes("8s"),
      "A descrição do adubo não refletiu o novo tempo de crescimento.",
    );
    assert((await textOf(page, "#growthTimeValue")) === "8s", "O HUD não refletiu o novo tempo de crescimento.");
    await ensureAtLeastOneSeed(page);
    await page.locator(".plot").nth(0).click();
    await page.waitForFunction(() => {
      const plot = document.querySelector(".plot");
      return plot && plot.textContent && (plot.textContent.includes("Faltam 8s") || plot.textContent.includes("Faltam 7s"));
    });
    await page.waitForFunction(
      () => {
        const plot = document.querySelector(".plot");
        return plot && plot.textContent && plot.textContent.includes("Pronto para colher");
      },
      { timeout: 9000 },
    );
    await page.locator(".plot").nth(0).click();
    await page.click("#sellButton");

    console.log("Cenário 7: comprar melhoria de venda");
    await reachMoneyTarget(page, 15);
    await page.click("#marketButton");
    await page.waitForFunction(() => {
      const button = document.querySelector("#marketButton");
      const sellValue = document.querySelector("#sellPriceValue");
      return (
        button &&
        button.textContent &&
        button.textContent.includes("Venda melhorada") &&
        sellValue &&
        sellValue.textContent === "5 moedas"
      );
    });
    assert(await page.locator("#marketButton").isDisabled(), "O botão de melhoria de venda deveria ficar desabilitado após a compra.");
    assert(
      (await textOf(page, "#marketDescription")).includes("5 moedas"),
      "A descrição da melhoria de venda não refletiu o novo preço de venda.",
    );
    assert((await textOf(page, "#sellPriceValue")) === "5 moedas", "O HUD não refletiu o novo valor de venda.");
    assert((await completedGoalsCount(page)) >= 2, "As metas intermediárias não foram concluídas como esperado.");
    await ensureAtLeastOneSeed(page);
    await page.locator(".plot").nth(1).click();
    await page.waitForFunction(
      () => {
        const plots = Array.from(document.querySelectorAll(".plot"));
        return plots[1] && plots[1].textContent && plots[1].textContent.includes("Pronto para colher");
      },
      { timeout: 9000 },
    );
    await page.locator(".plot").nth(1).click();
    const moneyBeforePremiumSale = await numberOf(page, "#moneyCount");
    await page.click("#sellButton");
    assert(
      (await numberOf(page, "#moneyCount")) === moneyBeforePremiumSale + 5,
      "A melhoria de venda não aumentou o valor do morango para 5 moedas.",
    );

    console.log("Cenário 8: persistência das melhorias e metas");
    await page.reload({ waitUntil: "load" });
    assert((await textOf(page, "#growthTimeValue")) === "8s", "O upgrade de crescimento não persistiu após reload.");
    assert((await textOf(page, "#sellPriceValue")) === "5 moedas", "O upgrade de venda não persistiu após reload.");
    assert((await completedGoalsCount(page)) >= 2, "As metas concluídas não persistiram após reload.");

    console.log("Cenário 9: atingir a meta jogando");
    await reachGoalByPlaying(page);
    assert(
      (await textOf(page, "#goalStatus")) === "Você construiu uma pequena fazenda de morangos!",
      "A mensagem de vitória não foi exibida após alcançar 20 moedas jogando.",
    );
    assert((await numberOf(page, "#moneyCount")) >= 20, "O jogo não alcançou 20 moedas no fluxo jogado.");
    assert((await textOf(page, "#progressSummary")) === "3 de 3 metas concluídas", "A meta final não marcou a progressão completa.");

    console.log("Cenário 10: confirmação de reset");
    page.once("dialog", (dialog) => {
      dialog.dismiss().catch(() => {});
    });
    await page.click("#resetButton");
    await waitForText(page, "#statusMessage", "O progresso foi mantido.");
    assert((await numberOf(page, "#moneyCount")) >= 20, "Cancelar o reset não deveria apagar o progresso.");

    console.log("Cenário 11: reset do jogo");
    page.once("dialog", (dialog) => {
      dialog.accept().catch(() => {});
    });
    await page.click("#resetButton");
    await waitForText(page, "#statusMessage", "Plante seus primeiros morangos.");
    assert((await textOf(page, "#moneyCount")) === "6", "Reset não restaurou moedas.");
    assert((await textOf(page, "#seedCount")) === "3", "Reset não restaurou sementes.");
    assert((await textOf(page, "#berryCount")) === "0", "Reset não restaurou morangos.");
    assert((await textOf(page, "#sellPriceValue")) === "3 moedas", "Reset não restaurou o valor base de venda.");
    assert((await textOf(page, "#growthTimeValue")) === "10s", "Reset não restaurou o tempo base de crescimento.");
    assert((await textOf(page, "#progressSummary")) === "0 de 3 metas concluídas", "Reset não restaurou a progressão.");
    assert((await page.locator(".plot").count()) === 9, "Reset corrompeu a grade.");
    assert(
      (await textOf(page, "#fertilizerButton")) === "Comprar adubo (12)",
      "Reset não restaurou o estado original da melhoria de crescimento.",
    );
    assert(
      (await textOf(page, "#marketButton")) === "Melhorar venda (15)",
      "Reset não restaurou o estado original da melhoria de venda.",
    );

    await page.screenshot({
      path: "/tmp/strawberry-farm-test.png",
      fullPage: true,
    });

    console.log("✅ Todos os cenários principais passaram.");
    console.log("📸 Screenshot salva em /tmp/strawberry-farm-test.png");
  } catch (error) {
    console.error("❌ Falha no teste:", error.message);
    await page
      .screenshot({
        path: "/tmp/strawberry-farm-test-error.png",
        fullPage: true,
      })
      .catch(() => {});
    console.error("📸 Screenshot de erro salva em /tmp/strawberry-farm-test-error.png");
    throw error;
  } finally {
    await browser.close();
  }
})();
