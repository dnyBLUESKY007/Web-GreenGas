# Codex Workflow

This repository keeps durable context in `ai-memories/`, independent of any AI tool configuration. It is the canonical location for the Memory Bank, task records, deferred issues, templates, and human-supplied inputs. Do not rename, move, or duplicate those records for a Codex task.

## Start every task with context

- Read `ai-memories/memories/activeContext.md` before making changes.
- For architecture, new-module, or cross-module work, also read `projectbrief.md`, `systemPatterns.md`, and `techContext.md` in `ai-memories/memories/`.
- Treat source code as the truth for implementation details. If it conflicts with the Memory Bank, call out the mismatch and update the relevant memory record when warranted.
- `ai-memories/inputs/` is human-maintained and read-only for agents. Never modify it.

## Planning and durable records

- For work expected to change more than about 30 lines, span several files, require multi-round debugging, or make an architectural change, create a plan from `ai-memories/tasks/TEMPLATE.md` at `ai-memories/tasks/YYYY-MM-DD-<slug>.md` before implementation. Fill in the problem, rationale, affected files, and steps.
- For a task that needs approval before implementation, present the plan and wait for the user's approval. Small, localized changes do not need a plan file.
- Append material debugging discoveries and design changes to `## Debug Notes` as they occur. At completion, fill in `## Lessons Learned` and return reusable conclusions to the Memory Bank.
- Record major technical decisions as a new ADR in `ai-memories/memories/decisions/`.
- At milestones, update `activeContext.md` and `progress.md` in `ai-memories/memories/` incrementally; update `systemPatterns.md` when architecture changes. Keep rationale and conclusions, not copies of code or stale detail.

## Deferred issues

- Create a file under `ai-memories/issues/` only when the user explicitly asks to defer, stash, log, or file an issue. Capture it from `ai-memories/issues/TEMPLATE.md`; do not fix code or commit as part of that request.
- Batch-resolve issues only when explicitly requested. Group related open issues, create and obtain approval for a task plan, then close resolved issues with `closed` and `resolved-by` fields. Never delete issue records.

## Engineering quality

- Validate untrusted input at trust boundaries, parameterize queries, never hardcode or log secrets, and enforce authorization on the server for privileged actions.
- Keep functions focused, favor early returns, avoid unrelated refactors, and add tests for changed behavior when risk or blast radius is meaningful.
- Document public APIs, exported types, non-obvious invariants, and operational gotchas. Update documentation when behavior or contracts change.
- Reuse existing utilities before adding dependencies. For a new dependency, check maintenance, security, license, and ecosystem fit; explain its necessity.
- Follow project tooling first. In the absence of stricter local conventions: Python uses PEP 8/Black, type hints, narrow exceptions, and no mutable defaults; TypeScript uses strict types (`unknown` at trust boundaries, no unjustified `any`); Java follows Google Java Style; C/C++ follows `.clang-format`, RAII, and explicit ownership/lifetime rules. Use camelCase except Python snake_case, PascalCase for types/classes/components, and predicate names for booleans.

## Safety and Git

- Preserve unrelated user changes. Do not edit binary/generated artifacts directly, delete/overwrite/mass-move files without authorization, modify machine-wide configuration, expose secrets, or perform destructive database operations.
- Ask before external side effects such as deployment, publication, remote service mutation, email/message sending, billing changes, `git push`, and branch changes.
- Before a commit, inspect status and relevant diffs. Keep commits focused and never include secrets, build artifacts, or unrelated changes. Use:

  ```text
  type(scope): subject

  Why: motivation
  How: core implementation
  Refs: ai-memories/tasks/<plan>.md
  Fixes: #NNNN
  ```

  `Refs` and `Fixes` are included when applicable; trivial changes may omit the body.
- Never use `git reset --hard`, plain `git push --force`, skipped hooks, or changed Git configuration. Rebase, amend, reset, and force-with-lease require a written plan, risk explanation, and explicit user confirmation.

## Local Codex skills

Use the repository skills in `.agents/skills/` when the matching workflow is explicitly requested: `$task-plan`, `$memory-update`, `$issue-log`, `$issue-sweep`, or `$git-agent`.
