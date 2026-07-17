# AI Memories

This directory contains the project's durable, tool-neutral collaboration records. Cursor, Codex, and any future AI tooling must treat it as the single canonical source of project context.

| Directory | Purpose |
| --- | --- |
| `inputs/` | Human-maintained inputs. Agents may read but must not modify them. |
| `memories/` | Memory Bank, active context, progress, and architectural decisions. |
| `tasks/` | Approved task plans, debugging notes, and lessons learned. |
| `issues/` | Explicitly deferred issues and their resolution history. |

Tool-specific configuration belongs outside this directory: Cursor configuration remains in `.cursor/`, and Codex workflow packaging remains in `.agents/` and `AGENTS.md`.
