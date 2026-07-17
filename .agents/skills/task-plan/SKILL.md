---
name: task-plan
description: Create a durable plan for a large repository task before implementation. Use when the user asks to plan a task or when work is multi-file, architectural, likely exceeds about 30 changed lines, or needs iterative debugging.
---

# Task Plan

1. Read `ai-memories/memories/activeContext.md`; for architectural work also read the project brief, system patterns, and technical context.
2. Read `ai-memories/tasks/TEMPLATE.md` and create `ai-memories/tasks/YYYY-MM-DD-<slug>.md`. Include the problem, rationale, affected files, ordered checkable steps, and empty Debug Notes/Lessons Learned sections.
3. Give the user the path and a concise plan summary. Do not implement the business change, write Git changes, or modify Memory Bank records until the user approves.
4. If the task is truly small and localized, say that a plan document is optional and proceed only if the user wants planning.
