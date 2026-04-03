---
name: do-task
description: >-
  Starts work from a Linear issue key using an isolated git worktree, optionally
  moves the agent to that root, opens a GitHub PR with issue context, and syncs
  Linear (status + PR link). Use when the user says do-task, gives an issue id
  (e.g. NOM-12), wants parallel worktrees per issue, or says worktree / Linear / PR workflow.
---

# do-task

Linear issue → worktree → PR → Linear.

Requires **Linear MCP**, **git**, **GitHub CLI (`gh`)** authenticated to the repo, and **cursor-app-control** MCP for `move_agent_to_root` when switching the agent workspace.

## Linear ↔ GitHub

With the **Linear–GitHub integration** (linked repo), GitHub PRs and branches are associated with Linear issues when the workflow matches your workspace rules. Using a **fixed branch pattern** keeps that reliable.

**Branch name (required):** `feature/{identifier}` where `{identifier}` is the **issue id in lowercase**. Examples: `NOM-1` → `feature/nom-1`, `NOM-12` → `feature/nom-12`.

Do **not** use Linear’s long `gitBranchName` from the API (e.g. `feature/nom-1-research-choose-…`) for this workflow unless the user explicitly asks—those fight the short `feature/{identifier}` convention and duplicate what the issue title already describes.

Still put the **Linear issue URL** in the PR body so reviewers and automation both see it.

## Limitations (important)

- **Composer / chat title:** There is **no API** in Cursor MCP to rename the chat. Instruct the user to **rename the chat manually** to: `` `{ISSUE_KEY} — {issue title}` `` (example: `NOM-1 — Research: choose implementation stack`).

## Phase A — Start work from issue key

User provides **issue key** (e.g. `NOM-1`).

1. **Fetch issue** — Call Linear `get_issue` with `id` = that key. Read `title`, `description`, `url`, `team` (for statuses).

2. **Set branch name** — `BRANCH="feature/$(echo "$ISSUE_KEY" | tr '[:upper:]' '[:lower:]')"` so the identifier matches the issue key (e.g. `feature/nom-1`).

3. **Create worktree** — Run from the **main repository** (not inside another worktree). Substitute `ISSUE_KEY`, `BRANCH`, and set `WT_PATH` to a **new** empty path. Default layout: sibling folder `nomi-worktrees` next to the repo root, one directory per issue so parallel runs do not collide.

   ```bash
   cd "$(git rev-parse --show-toplevel)"
   ISSUE_KEY='NOM-1'                       # replace with actual key
   BRANCH="feature/$(echo "$ISSUE_KEY" | tr '[:upper:]' '[:lower:]')"
   PARENT="$(cd .. && pwd)"
   WT_PATH="$PARENT/nomi-worktrees/$ISSUE_KEY"
   mkdir -p "$(dirname "$WT_PATH")"
   git fetch origin --prune
   ```

   Pick a base ref (use the first that exists): `origin/main`, else `origin/master`, else `HEAD`.

   - If **local branch `BRANCH` already exists:** `git worktree add "$WT_PATH" "$BRANCH"`
   - **Else (new branch):** `git worktree add -b "$BRANCH" "$WT_PATH" origin/main` — or `origin/master` / `HEAD` per detection above.

   Use the **absolute** path for `WT_PATH`. If `mkdir` / `worktree add` fails because the path exists, stop and tell the user to remove the old worktree (`git worktree remove …` from the main repo) or pick another path.

4. **Mark issue in progress** — `save_issue` with `id` = issue key, `state` = `In Progress` (team must match the issue’s team, e.g. `Nomi`).

5. **Move agent (optional)** — If the user wants this session on the worktree: call **cursor-app-control** `move_agent_to_root` with `rootPath` = the absolute `WT_PATH`.

6. **Chat title** — Tell the user to rename the chat to `` `{ISSUE_KEY} — {title}` ``.

**Parallel runs:** Each issue should use a **distinct** `WT_PATH` (e.g. different `ISSUE_KEY` folder under `nomi-worktrees`).

## Phase B — Open PR and update Linear (after commits)

Run from **inside the worktree** directory.

1. **Push branch** — `git push -u origin HEAD` (branch should already be `feature/{identifier}`).

2. **Create PR** — Use `gh pr create` with:
   - **Title:** `[ISSUE_KEY] {issue title}` or short variant.
   - **Body** (markdown), include at minimum:
     - Link to Linear issue: issue `url` from `get_issue`.
     - Summary of changes (or bullets).
     - Optional: paste first ~40 lines of issue `description` if helpful for reviewers.

   With GitHub linked, Linear usually picks up the PR from the branch/repo; the link in the body still helps reviewers.

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
   - `save_issue` with `id` = issue key, `state` = `In Review` (or team’s equivalent for “PR open”) if automation has not already moved it.
   - `save_comment` with `issueId` = issue key and `body` containing the **PR URL** and one line context, e.g. `Opened PR: https://github.com/...` (skip if the integration already posted the link and the user prefers a single source).

If the team’s workflow uses different status names, use `list_issue_statuses` with the issue’s team and pick the closest match.

## Quick reference

| Step       | Action |
|------------|--------|
| Load issue | Linear `get_issue` |
| Branch     | `feature/{lowercase issue key}` e.g. `feature/nom-1` |
| Worktree   | `git fetch` → `git worktree add` (see Phase A) |
| Agent root | `move_agent_to_root` with absolute `WT_PATH` |
| PR         | `gh pr create` from worktree (Linear ↔ GitHub associates branch/PR) |
| Linear     | `save_issue` / `save_comment` as needed |

## Troubleshooting

- **`gh` not found:** Install [GitHub CLI](https://cli.github.com/) and `gh auth login`.
- **Worktree path exists:** Remove old tree with `git worktree remove <path>` (from main repo) and delete the folder if needed, or use a different `WT_PATH`.
- **Branch already checked out elsewhere:** Another worktree holds that branch; use one worktree per branch or remove the other checkout.
