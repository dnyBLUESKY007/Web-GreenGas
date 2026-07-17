---
name: memory-update
description: Incrementally refresh the repository Memory Bank at a milestone. Use when the user asks to update memory, refresh context, summarize a milestone, or sync the project memory bank.
---

# Memory Update

1. Read recent Git history/diffs, relevant task plans, and the current Memory Bank.
2. Compare the actual state with `ai-memories/memories/activeContext.md` and `progress.md`; inspect `systemPatterns.md` when architecture may have changed.
3. Present a per-file update proposal before writing, especially for substantial removal or reframing.
4. After approval, edit only `ai-memories/memories/` incrementally. Preserve valid context, record rationale rather than code, update the date, and add an ADR for a major decision. Do not change application code or create Git commits.
