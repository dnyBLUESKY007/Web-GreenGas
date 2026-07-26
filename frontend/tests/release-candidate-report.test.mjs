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

function assertContainsLines(document, expectedLines) {
  const documentLines = new Set(document.split(/\r?\n/));

  for (const line of expectedLines) {
    assert.ok(documentLines.has(line), `missing line: ${line}`);
  }
}

function assertContainsText(document, expectedValues) {
  for (const value of expectedValues) {
    assert.ok(document.includes(value), `missing text: ${value}`);
  }
}

test("final material report preserves the release approval contract", async () => {
  const report = await readFile(reportUrl, "utf8");

  assertContainsLines(report, [
    "## 已完成",
    "## 未完成",
    "## 示例占位",
    "## 待资料替换",
    "## 外部阻塞",
    "| 资料包 | 用途 | 页面 | 期望格式 | 优先级 |",
  ]);

  assertContainsText(report, [
    "ISO140001",
    "ISO14001",
    "EmailJS",
    "不属于本轮发布必需项",
    "尚未执行生产部署",
  ]);
});

test("release candidate records reproducible source and verification evidence", async () => {
  const candidate = await readFile(candidateUrl, "utf8");

  assert.match(
    candidate,
    /^- \*\*集成应用源码提交：\*\* `[0-9a-f]{40}`$/m,
    "missing the integrated source commit",
  );
  assertContainsLines(candidate, [
    "npm ci",
    "npm run typecheck",
    "npm run test",
    "npm run build",
    "VITE_BASE=/rc/ npm run build",
  ]);
  assertContainsText(candidate, [
    "sandcastle/issue-15",
    "SHA-256",
    "未执行生产部署",
  ]);
});
