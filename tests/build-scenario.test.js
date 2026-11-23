import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build } from "vite";
import { brokenCode, fixedCode } from "../src/content/agent-trace.js";
test("the teaching error really fails Vite; the shown repair really builds", async () => {
  const dir = await mkdtemp(join(tmpdir(), "agent-build-"));
  try {
    await mkdir(join(dir, "src"));
    await writeFile(
      join(dir, "index.html"),
      '<div id="app"></div><script type="module" src="/src/main.js"></script>',
    );
    await writeFile(join(dir, "src/style.css"), "body { color: #203933; }");
    await writeFile(join(dir, "src/main.js"), brokenCode);
    const options = { root: dir, configFile: false, logLevel: "silent" };
    await assert.rejects(build(options), /Could not resolve.*theme.css/s);
    await writeFile(join(dir, "src/main.js"), fixedCode);
    const result = await build(options);
    assert.ok(
      result.output.some(
        (asset) => asset.type === "chunk" && asset.code.includes("draw"),
      ),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
