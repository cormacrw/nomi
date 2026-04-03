---
name: linear-issue-worktree
description: >-
  Starts work from a Linear issue key using an isolated git worktree, optionally
  moves the agent to that root, opens a GitHub PR with issue context, and syncs
  Linear (status + PR link). Use when the user gives an issue id (e.g. NOM-12),
  wants parallel worktrees per issue, or says worktree / Linear / PR workflow.
---

# Linear issue → worktree → PR → Linear

Requires **Linear MCP**, **git**, **GitHub CLI (`gh`)** authenticated to the repo, and **cursor-app-control** MCP for `move_agent_to_root` when switching the agent workspace.

## Limitations (important)

- **Composer / chat title:** There is **no API** in Cursor MCP to rename the chat. Instruct the user to **rename the chat manually** to: `` `{ISSUE_KEY} — {issue title}` `` (example: `NOM-1 — Research: choose implementation stack`).
- Use Linear’s **`gitBranchName`** from `get_issue` for the git branch name (not only the issue key).

## Phase A — Start work from issue key

User provides **issue key** (e.g. `NOM-1`).

1. **Fetch issue** — Call Linear `get_issue` with `id` = that key. Read `title`, `description`, `url`, **`gitBranchName`**, `team` (for statuses).

2. **Create worktree** — Run from the **main repository** (not inside another worktree). Substitute `ISSUE_KEY`, `BRANCH`, and set `WT_PATH` to a **new** empty path. Default layout: sibling folder `nomi-worktrees` next to the repo root, one directory per issue so parallel runs do not collide.

   ```bash
   cd "$(git rev-parse --show-toplevel)"
   ISSUE_KEY='NOM-1'                       # replace
   BRANCH='feature/nom-1-…'              # exact gitBranchName from Linear
   PARENT="$(cd .. && pwd)"
   WT_PATH="$PARENT/nomi-worktrees/$ISSUE_KEY"
   mkdir -p "$(dirname "$WT_PATH")"
   git fetch origin --prune
   ```

   Pick a base ref (use the first that exists): `origin/main`, else `origin/master`, else `HEAD`.

   - If **local branch `BRANCH` already exists:** `git worktree add "$WT_PATH" "$BRANCH"`
   - **Else (new branch):** `git worktree add -b "$BRANCH" "$WT_PATH" origin/main` — or `origin/master` / `HEAD` per detection above.

   Use the **absolute** path for `WT_PATH` (e.g. `WT_PATH="$(cd .. && pwd)/nomi-worktrees/$ISSUE_KEY"` after `cd` to repo root). If `mkdir` / `worktree add` fails because the path exists, stop and tell the user to remove the old worktree (`git worktree remove …` from the main repo) or pick another path.

3. **Mark issue in progress** — `save_issue` with `id` = issue key, `state` = `In Progress` (team must match the issue’s team, e.g. `Nomi`).

4. **Move agent (optional)** — If the user wants this session on the worktree: call **cursor-app-control** `move_agent_to_root` with `rootPath` = the absolute `WT_PATH`.

5. **Chat title** — Tell the user to rename the chat to `` `{ISSUE_KEY} — {title}` ``.

**Parallel runs:** Each issue should use a **distinct** `WT_PATH` (e.g. different `ISSUE_KEY` folder under `nomi-worktrees`).

## Phase B — Open PR and update Linear (after commits)

Run from **inside the worktree** directory.

1. **Push branch** — `git push -u origin HEAD` (or the branch name from Linear).

2. **Create PR** — Use `gh pr create` with:
   - **Title:** `[ISSUE_KEY] {issue title}` or short variant.
   - **Body** (markdown), include at minimum:
     - Link to Linear issue: issue `url` from `get_issue`.
     - Summary of changes (or bullets).
     - Optional: paste first ~40 lines of issue `description` if helpful for reviewers.

   Example:

   ```bash
   gh pr create --base master --title "NOM-1: …" --body "$(cat <<'EOF'
   ## Linear
   - https://linear.app/…/issue/NOM-1/…

   ## Summary
   …
   EOF
   )"
   ```

   Use `--base main` or `--base master` to match the repo’s default branch.

3. **Update Linear** — From `gh pr create` output, capture the PR URL, then:
   - `save_issue` with `id` = issue key, `state` = `In Review` (or team’s equivalent for “PR open”).
   - `save_comment` with `issueId` = issue key and `body` containing the **PR URL** and one line context, e.g. `Opened PR: https://github.com/...`.

If the team’s workflow uses different status names, use `list_issue_statuses` with the issue’s team and pick the closest match.

## Quick reference

| Step       | Action |
|------------|--------|
| Load issue | Linear `get_issue` |
| Worktree   | `git fetch` → `git worktree add` (see Phase A) using `gitBranchName` |
| Agent root | `move_agent_to_root` with absolute `WT_PATH` |
| PR         | `gh pr create` from worktree |
| Linear     | `save_issue` state; `save_comment` with PR link |

## Troubleshooting

- **`gh` not found:** Install [GitHub CLI](https://cli.github.com/) and `gh auth login`.
- **Worktree path exists:** Remove old tree with `git worktree remove <path>` (from main repo) and delete the folder if needed, or use a different `WT_PATH`.
- **Branch already checked out elsewhere:** Another worktree holds that branch; use one worktree per branch or remove the other checkout.
