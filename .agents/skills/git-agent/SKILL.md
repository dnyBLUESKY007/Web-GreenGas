---
name: git-agent
description: Prepare safe, focused Git commits and explain higher-risk Git workflows. Use when the user asks to commit current changes, organize commits, work with branches, or push changes.
---

# Git Agent

## Commit

1. Inspect `git status`, staged and unstaged diffs, and relevant task plans.
2. Group only related changes into small, independently understandable commits. Exclude secrets, generated files, and unrelated user edits.
3. Use `type(scope): subject` with `Why`, `How`, `Refs`, and `Fixes` when useful. Ask before committing if a change's ownership is ambiguous.
4. Never push automatically.

## Branch, push, and history changes

Before creating, switching, merging, or deleting branches; pushing; rebasing; amending; resetting; or force-with-lease pushing, describe the target, exact commands, and risks, then obtain explicit confirmation. Never use `reset --hard`, plain force push, Git config changes, or bypassed hooks.
