import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const reportUrl = new URL(
  "../../ai-memories/materials/2026-07-26-final-material-gap-report.md",
  import.meta.url,
);
const candidateUrl = new URL(
  "../../ai-memories/releases/2026-07-26-issue-15-rc.md",
  import.meta.url,
);

test("final material report preserves the release approval contract", async () => {
  const report = await readFile(reportUrl, "utf8");

  for (const heading of [
    "## 已完成",
    "## 未完成",
    "## 示例占位",
    "## 待资料替换",
    "## 外部阻塞",
  ]) {
    assert.match(report, new RegExp(`^${heading}$`, "m"), `missing ${heading}`);
  }

  assert.match(report, /\| 资料包 \| 用途 \| 页面 \| 期望格式 \| 优先级 \|/);
  assert.match(report, /ISO140001/);
  assert.match(report, /ISO14001/);
  assert.match(report, /EmailJS/);
  assert.match(report, /不属于本轮发布必需项/);
  assert.match(report, /尚未执行生产部署/);
});

test("release candidate records reproducible source and verification evidence", async () => {
  const candidate = await readFile(candidateUrl, "utf8");

  assert.match(candidate, /sandcastle\/issue-15/);
  assert.match(candidate, /[0-9a-f]{40}/);
  assert.match(candidate, /npm ci/);
  assert.match(candidate, /npm run typecheck/);
  assert.match(candidate, /npm run test/);
  assert.match(candidate, /npm run build/);
  assert.match(candidate, /VITE_BASE=\/rc\/ npm run build/);
  assert.match(candidate, /SHA-256/);
  assert.match(candidate, /未执行生产部署/);
});
