---
name: issue-log
description: Capture a user-requested deferred bug, idea, or requirement as a local issue without fixing it. Use only for explicit defer/stash/log/file-an-issue requests, including Chinese equivalents such as “记个 issue”, “先记下来”, or “以后再修”.
---

# Issue Log

1. Extract a concise title, observed behavior, expected behavior, optional context, priority, and tags from the request.
2. Read existing `ai-memories/issues/issue-*.md` IDs and select the next four-digit ID.
3. Create `ai-memories/issues/issue-NNNN-<slug>.md` from `TEMPLATE.md` with `status: open`, today's date, and relevant links.
4. Report the path and explicitly stop. Do not modify code, start a fix, or commit.
