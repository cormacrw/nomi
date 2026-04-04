# Issue worktrees

Per-issue git worktrees are created **here** (under the repo root) so editors and agents use one workspace path:

`worktrees/<ISSUE_KEY>/` — e.g. `worktrees/NOM-55/`

Create from the main clone (see `.cursor/skills/do-task/SKILL.md`):

`git worktree add -b feature/nom-55 worktrees/NOM-55 origin/master`

**Why not gitignore this whole folder?** A root `.gitignore` entry like `worktrees/` would ignore every file in the checkout and prevent `git add` / commits from that worktree. Cruft-only patterns live in the repo `.gitignore` instead.
