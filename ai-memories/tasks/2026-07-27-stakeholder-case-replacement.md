# Task: Replace Case Center with stakeholder cases

- **日期**：2026-07-27
- **状态**：已完成
- **关联**：GitHub issue #20

## Problem / 目标

Replace the legacy Case Center records with the four supplied stakeholder cases without adding unsupported locations, URLs, or project claims.

## 核心思路

Use the extracted stakeholder descriptions as the content boundary, make unsupported detail fields optional, and expose map points only for cases with supplied country locations.

## 受影响的文件 / 模块

- `frontend/src/data/projects.json` — four stakeholder case records and uploaded image names
- `frontend/src/data/case-map.json` — three verified case points plus existing market coverage
- `frontend/src/types/index.ts` — optional source and detail fields
- `frontend/src/pages/cases/detail/index.ts` — conditional detail and source rendering
- `frontend/tests/case-center.test.mjs` — updated case and map contracts

## 分步计划

- [x] Replace case data with source-bounded trilingual records.
- [x] Make unsupported detail/source fields optional in types and rendering.
- [x] Update map and focused regression contracts.
- [x] Run focused tests and typecheck.

## Debug Notes

- 2026-07-27: Verified-case markers for South Africa and Australia were offset from same-country market-coverage markers so both controls remain independently reachable; the broader map visual redesign remains deferred to GitHub #24.

## Lessons Learned

- Stakeholder descriptions may support only selected narrative sections; optional fields prevent the UI from implying a complete challenge-response-result story.
- Case map eligibility must follow supplied project location precision rather than company identity or image context.
