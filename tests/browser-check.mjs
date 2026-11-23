import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { stateAt } from "../src/core/state-reducer.js";
const record = process.env.RECORD_DEMO === "1";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  ...(record
    ? {
        recordVideo: {
          dir: "artifacts/video",
          size: { width: 1280, height: 900 },
        },
      }
    : {}),
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("response", (r) => {
  if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
});
const linger = () => (record ? page.waitForTimeout(1200) : Promise.resolve());
try {
  await page.goto(process.env.BASE_URL || "http://localhost:5173");
  await page.locator("#hero-play").waitFor();
  if (record) {
    await page.waitForTimeout(21500);
    await page.screenshot({ path: "artifacts/hero.png" });
  }
  if ((await page.locator("#hero-play").textContent()) === "暂停开场")
    await page.locator("#hero-play").click();
  await page.locator("#agent-mode").click();
  assert.match(
    await page.locator("#comparison-output").innerText(),
    /文件已修改/,
  );
  await linger();
  await page.locator("#chat-mode").click();
  assert.match(
    await page.locator("#comparison-output").innerText(),
    /没有变化/,
  );
  await page.locator("#lab").scrollIntoViewIfNeeded();
  await page.locator("#presentation").click();
  await linger();
  for (let index = 0; index < 13; index++) {
    await page.locator(`[data-step="${index}"]`).click();
    const state = stateAt(index);
    assert.match(
      await page.locator("#position").innerText(),
      new RegExp(String(index + 1).padStart(2, "0")),
    );
    assert.equal(
      await page.locator("#mini-preview .draw").count(),
      state.previewStage === "initial" ? 0 : 1,
    );
    assert.equal(
      await page.locator(".flow-node.active").getAttribute("data-node"),
      state.activeNode,
    );
    if (index === 5) {
      await page.locator("#deny").click();
      assert.match(await page.locator("#event-copy").innerText(), /未修改/);
      assert.equal(await page.locator("#mini-preview .draw").count(), 0);
      await linger();
      await page.locator("#approve").click();
      await linger();
    }
    if (index === 9)
      assert.match(
        await page.locator("#terminal").innerText(),
        /Could not resolve/,
      );
    if (index === 11) {
      assert.match(
        await page.locator("#build-badge").innerText(),
        /Build passed/,
      );
      await page.locator("#mini-preview .draw").click();
      assert.match(
        await page.locator("#mini-preview .draw-result").innerText(),
        /抽签结果/,
      );
      await page.screenshot({ path: "artifacts/lab-desktop.png" });
    }
    await linger();
  }
  for (let index = 12; index >= 0; index--) {
    await page.locator(`[data-step="${index}"]`).click();
    assert.equal(
      await page.locator("#mini-preview .draw").count(),
      index >= 7 ? 1 : 0,
    );
  }
  await page.locator("#lab").focus();
  await page.keyboard.press("ArrowRight");
  assert.match(await page.locator("#position").innerText(), /02/);
  await page.keyboard.press("ArrowLeft");
  assert.match(await page.locator("#position").innerText(), /01/);
  await page.locator("#manual").uncheck();
  await page.locator("#speed").selectOption("1.5");
  await page.locator("#play").click();
  await page.waitForTimeout(1300);
  await page.locator("#play").click();
  assert.match(await page.locator("#position").innerText(), /02/);
  await page.locator("#reset").click();
  assert.equal(await page.locator("#mini-preview .draw").count(), 0);
  await page.locator("#presentation").click();
  assert.equal(await page.locator("#permissions").isVisible(), true);
  await page.locator('[data-tool="edit"]').click();
  await page.locator("#tool-deny").click();
  assert.match(await page.locator("#tool-approval").innerText(), /未修改/);
  await linger();
  await page.locator("#tool-approve").click();
  assert.match(await page.locator("#tool-effect").innerText(), /编辑已执行/);
  await linger();
  for (const tool of ["read", "bash", "mcp"]) {
    await page.locator(`[data-tool="${tool}"]`).click();
    assert.ok(
      (await page.locator("#tool-example pre").allTextContents()).every(
        Boolean,
      ),
    );
  }
  await page.locator('[data-tool="edit"]').click();
  await page.locator("#tool-manual").uncheck();
  assert.match(await page.locator("#tool-effect").innerText(), /编辑已执行/);
  for (const source of ["rules", "file", "build"])
    await page.locator(`[data-source="${source}"]`).click();
  const expanded = Number(
    await page.locator(".capacity").getAttribute("aria-valuenow"),
  );
  await page.locator("#compact").click();
  assert.ok(
    Number(await page.locator(".capacity").getAttribute("aria-valuenow")) <
      expanded,
  );
  assert.match(await page.locator("#context-items").innerText(), /摘要/);
  await linger();
  await page.locator("#context-reset").click();
  for (const ext of ["skills", "mcp", "subagents", "hooks"]) {
    await page.locator(`[data-extension="${ext}"]`).click();
    assert.equal(
      await page
        .locator(`[data-extension="${ext}"]`)
        .getAttribute("aria-pressed"),
      "true",
    );
    await linger();
  }
  await page.locator("#show-overview").click();
  assert.ok(await page.locator("#overview").isVisible());
  await linger();
  await page.locator("#return-lab").click();
  assert.match(await page.locator("#position").innerText(), /01/);
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => scrollTo(0, 0));
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.screenshot({
      path: `artifacts/complete-${width}.png`,
      fullPage: true,
    });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.locator("#hero-play").waitFor();
  assert.equal(await page.locator("#hero-play").innerText(), "播放开场");
  assert.equal(
    await page
      .locator(".hero-route i")
      .evaluate((e) => getComputedStyle(e, ":after").animationName),
    "none",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: 13 snapshots, reverse, permission branches, preview, keyboard, speed, tools, context, extensions, responsive, reduced motion, console",
  );
} finally {
  await context.close();
  await browser.close();
}
