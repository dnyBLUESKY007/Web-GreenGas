# Task: Workflow reference audit and memory-bank decoupling

- **Date**: 2026-07-17
- **Status**: Completed
- **Related**: `ai-memories/README.md`, `ai-memories/memories/README.md`

## Problem / Goal

Audit the repository's collaboration records and configuration after the workflow relocation. Remove stale paths and make `ai-memories/` a self-contained, tool-neutral record system that does not depend on external execution packaging for its meaning or maintenance.

## Approach

Keep execution instructions and tool-specific integration outside the durable record system. In `ai-memories/`, replace references to those mechanisms with direct, tool-neutral lifecycle requirements and local paths. Preserve `inputs/` unchanged because it is human-maintained and read-only; report any historical stale references there rather than editing them. Repair verified broken Markdown links in configuration documents and verify all remaining local links and cross-directory references after edits.

## Affected files / Modules

- `ai-memories/README.md` — remove tool-package references.
- `ai-memories/memories/{README.md,projectbrief.md,techContext.md,progress.md,activeContext.md}` — remove external workflow/rule references and stale historical paths.
- `ai-memories/tasks/{README.md,TEMPLATE.md,2026-07-11-home-capability-process-layout.md,2026-07-15-about-news-redesign.md,2026-07-15-solutions-page-redesign.md}` — correct former `.cursor` paths and self-contain lifecycle guidance.
- `ai-memories/issues/{README.md,TEMPLATE.md}` — correct former `.cursor` paths and self-contain issue workflow.
- Tool-specific plan and issue templates — repair broken template links and stale issue scan paths.
- Tool-specific pricing documentation — repair or remove obsolete local source-file links after verifying intended sources.
- Other configuration documents — audit-only unless a verified inconsistency requires a focused correction.

## Plan

- [x] Complete a reference and link audit across all three directories; classify stale, broken, and intentionally historical references.
- [x] Update `ai-memories/` so its guidance uses only local records and tool-neutral instructions; do not modify `inputs/`.
- [x] Repair verified stale or broken references in tool-specific configuration without duplicating workflow content unnecessarily.
- [x] Re-run automated local-link checks and targeted searches for old record paths and external packaging references inside `ai-memories/`.
- [x] Record findings, validation results, and reusable maintenance guidance in this plan and the Memory Bank where appropriate.

## Debug Notes

> Add material audit findings or design changes here as they occur.

- 2026-07-17: Initial scan found stale legacy record paths in mutable `ai-memories/` files; `inputs/ai-discusses/TALK-0001.md` also contains them but is read-only historical source material.
- 2026-07-17: Local-link checker found broken template, project-brief, issue-guide, changelog-template, and pricing-document links.
- 2026-07-17: Replaced mutable legacy paths, moved website acceptance principles into `projectbrief.md`, and retained the obsolete paths in `inputs/ai-discusses/TALK-0001.md` because inputs are human-maintained historical source material.
- 2026-07-17: Final local-link checker reported no broken local Markdown links across the audited directories; targeted searches found legacy workflow paths only in the immutable input history.

## Lessons Learned

> Fill in at task completion with reusable conclusions.

- Keep durable records self-contained: describe lifecycle requirements and local paths in `ai-memories/`; keep tool invocation and integration details in tool-specific configuration.
- Treat human-maintained inputs as evidence, not generated documentation; flag stale historical references instead of silently rewriting them.
