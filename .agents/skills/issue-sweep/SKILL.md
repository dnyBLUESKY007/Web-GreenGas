---
name: issue-sweep
description: Assess and batch-resolve deferred local issues. Use only when the user explicitly asks to sweep, clean up, or resolve open issues in `ai-memories/issues/`.
---

# Issue Sweep

1. Scan only `status: open` issue files, read their context, and group related work.
2. Create one approved batch plan using `$task-plan`; list every associated issue path in that plan. Do not implement before the user approves.
3. After implementation and verification, change each resolved issue to `closed`, add `closed: YYYY-MM-DD` and `resolved-by: <plan path>`, and retain the file.
4. Use `$git-agent` for the final focused commit with `Fixes: #NNNN` entries. Use `$memory-update` only when the batch produced a reusable lesson or decision.
