---
name: do-task
description: >-
  Starts work from a Linear issue key using an isolated git worktree, optionally
  moves the agent to that root, completes the task, opens a GitHub PR (mandatory
  close-out when there is anything to ship), and syncs Linear. Design / Google Stitch
  issues: create or update screens in the Stitch project, then mark Linear ready for
  review, then PR. Use when the user says do-task, gives an issue id (e.g. NOM-12),
  wants parallel worktrees per issue, or says worktree / Linear / PR workflow.
---

# do-task

Linear issue → worktree → **deliverables** → **PR** → Linear.

Requires **Linear MCP**, **git**, **GitHub CLI (`gh`)** authenticated to the repo. **cursor-app-control** MCP is optional for `move_agent_to_root` — see *Limitations → move_agent_to_root* (moving workspace usually **drops** other MCPs). **user-stitch** MCP for design work in **Google Stitch** (read each tool’s schema under the MCP descriptors before calling).

## Linear ↔ GitHub

With the **Linear–GitHub integration** (linked repo), GitHub PRs and branches are associated with Linear issues when the workflow matches your workspace rules. Using a **fixed branch pattern** keeps that reliable.

**Branch name (required):** `feature/{identifier}` where `{identifier}` is the **issue id in lowercase**. Examples: `NOM-1` → `feature/nom-1`, `NOM-12` → `feature/nom-12`.

Do **not** use Linear’s long `gitBranchName` from the API (e.g. `feature/nom-1-research-choose-…`) for this workflow unless the user explicitly asks—those fight the short `feature/{identifier}` convention and duplicate what the issue title already describes.

Still put the **Linear issue URL** in the PR body so reviewers and automation both see it.

## Limitations (important)

- **Composer / chat title:** There is **no API** in Cursor MCP to rename the chat. Instruct the user to **rename the chat manually** to: `` `{ISSUE_KEY} — {issue title}` `` (example: `NOM-1 — Research: choose implementation stack`).

### Do **not** use `move_agent_to_root` by default (MCP + tooling)

Switching the agent workspace to a **git worktree path** creates a **different Cursor project** than the main repo folder. MCP servers (Linear, Stitch, etc.) are typically attached to the project/workspace you opened first; after `move_agent_to_root`, the bridge often only exposes **built-in** servers (e.g. `cursor-app-control`, browser) — so **Linear, user-stitch, and similar tools disappear** for that chat. That makes the workflow useless for issue-driven work that needs those MCPs.

**Default pattern:** Keep the workspace root on the **main clone** (or whichever folder still has full MCP). Do all git work against the worktree using an absolute path, for example:

```bash
WT_PATH='/abs/path/to/nomi-worktrees/NOM-54'
git -C "$WT_PATH" status
git -C "$WT_PATH" add -A && git -C "$WT_PATH" commit -m '…'
git -C "$WT_PATH" push -u origin HEAD
```

Open files in the worktree via path when needed, or add the worktree folder to the workspace **without** moving the agent root, if your client supports multi-root.

**When to move:** Only if the user explicitly wants the default cwd and file tree rooted in the worktree **and** accepts that this chat may lose third-party MCP until Cursor wires the same servers to that folder (or the user re-opens the worktree as the primary project with MCP enabled there).

### `gh` in the agent

`gh pr create` may fail if the CLI is not logged in in that environment, or if the command runs in a **sandbox** without access to the user’s keychain. Re-run with **full permissions** (`all`) / outside sandbox, or set `GH_TOKEN`, or create the PR from the GitHub UI.

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

5. **Move agent (usually skip)** — **Do not** call `move_agent_to_root` unless the user explicitly chooses isolation over MCP (see *Limitations*). Prefer staying on the main repo workspace and using `git -C "$WT_PATH"` for commits/push.

6. **Chat title** — Tell the user to rename the chat to `` `{ISSUE_KEY} — {title}` ``.

**Parallel runs:** Each issue should use a **distinct** `WT_PATH` (e.g. different `ISSUE_KEY` folder under `nomi-worktrees`).

## Design / Google Stitch issues (before Phase B)

Use this branch when the issue is **product UI in Google Stitch** (new screens, edits, variants)—not code-only refactors. Signals: label (e.g. Design / Stitch), description mentions Stitch, title contains “Stitch”, or the user says it is a design task.

1. **Project** — Obtain the Stitch **`projectId`** (numeric id, no `projects/` prefix) from the issue description/link, project docs, or **`list_projects`** / **`get_project`** on **`user-stitch`**. If the issue starts a new effort, **`create_project`** may be appropriate; read the tool schema first.

2. **Generate or edit** — Use **`user-stitch`** tools (check descriptors before each call):
   - **New screen from prompt:** `generate_screen_from_text` with `projectId`, `prompt`, and optional `deviceType` (`MOBILE`, `DESKTOP`, etc.). Generation can take **several minutes**; do **not** blindly retry—if the call errors on connection, `get_screen` may still show progress later per tool notes.
   - **Iterate:** `list_screens` → `edit_screens` with `projectId`, `selectedScreenIds`, and `prompt`.
   - **Variants / design system:** `generate_variants`, `list_design_systems`, `apply_design_system`, etc., when the issue asks for those—match tool names to the issue.

3. **Link back to Linear** — `save_comment` on the issue with the Stitch **project id** (`projects/{id}` style if you return resource names) and any **browser URL** the team uses to open the project in Google Stitch (copy from Stitch UI when needed). Update `save_issue` **description** only if your team keeps the canonical project link there.

4. **Mark ready for review** — `save_issue` with `id` = issue key, `state` = the team’s **“Ready for review”** / **“In Review”** / **“Done”** (design sign-off), whichever matches your workflow. Use `list_issue_statuses` with the issue’s team and pick the closest match. Prefer a state that means *design is ready for review*, not only “code PR open”—that distinction is team-specific.

5. **Repo work** — If the issue requires doc updates (inventory, branding link, screen checklist), commit those in the worktree **before** Phase B so the PR includes them.

**Order:** Stitch deliverable → comment with project reference (and link if available) → Linear status (ready for review) → **then** Phase B (PR). If the issue is purely Stitch with **no** repo changes, still run Phase B only when there is at least one commit (e.g. a one-line doc link); if the user explicitly wants no git change, skip PR and document that exception.

## Phase B — Open PR and update Linear (mandatory close-out)

Run from **inside the worktree** directory when there is **anything to ship in git** (code, docs, config). This is the default **end state** of do-task: **push branch → open PR → sync Linear with the PR URL.**

1. **Push branch** — `git push -u origin HEAD` (branch should already be `feature/{identifier}`).

2. **Create PR** — Use `gh pr create` with:
   - **Title:** `[ISSUE_KEY] {issue title}` or short variant.
   - **Body** (markdown), include at minimum:
     - Link to Linear issue: issue `url` from `get_issue`.
     - Summary of changes (or bullets).
     - For design issues: **Stitch project** reference (id and/or URL) if not already only in Linear.
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
   - `save_issue` with `id` = issue key, `state` = `In Review` (or team’s equivalent for “PR open”) **if** the issue is still tracking the code review and automation has not already moved it. For design-first issues already marked “ready for review,” you may only add the PR link via comment instead of changing state again—follow team rules.
   - `save_comment` with `issueId` = issue key and `body` containing the **PR URL** and one line context, e.g. `Opened PR: https://github.com/...` (skip if the integration already posted the link and the user prefers a single source).

If the team’s workflow uses different status names, use `list_issue_statuses` with the issue’s team and pick the closest match.

**MCP note:** If `call_mcp_tool` fails for Linear or **user-stitch** with “server not available,” retry after a moment, confirm **Settings → MCP** shows the server connected, or complete the step manually in Linear / Stitch. The agent’s MCP bridge can lag at session start. If MCP vanished after **`move_agent_to_root`**, revert strategy: open a new chat with workspace on the **main repo** and continue using `git -C` to the worktree, or add MCP to the worktree project in Cursor settings.

## Quick reference

| Step       | Action |
|------------|--------|
| Load issue | Linear `get_issue` |
| Branch     | `feature/{lowercase issue key}` e.g. `feature/nom-1` |
| Worktree   | `git fetch` → `git worktree add` (see Phase A) |
| Agent root | **Avoid** `move_agent_to_root` if you need Linear/Stitch/other MCP; use `git -C "$WT_PATH"` from main workspace |
| Design     | `user-stitch`: project id → `generate_screen_from_text` / `edit_screens` (see tool schemas) → Linear comment + ready for review |
| Close-out  | `git push` → `gh pr create` (mandatory when there are commits to ship) |
| Linear     | `save_issue` / `save_comment` (Stitch reference, then PR link) |

## Troubleshooting

- **`gh` not found:** Install [GitHub CLI](https://cli.github.com/) and `gh auth login`.
- **Worktree path exists:** Remove old tree with `git worktree remove <path>` (from main repo) and delete the folder if needed, or use a different `WT_PATH`.
- **Branch already checked out elsewhere:** Another worktree holds that branch; use one worktree per branch or remove the other checkout.
