# Nomi

**Working product name.** A social app where connections stay limited to people you actually know, enforced through verified phone numbers and discovery by phone.

**Documentation is the source of truth** while the monorepo is still empty. Start here:

- **[Documentation index](docs/README.md)** — reading order, glossary, and map of all specs.

## Contributing

Work is tracked in **Linear** (Nomi) and merged via **GitHub**. Use branches `feature/{issue-key-lowercase}` (e.g. `feature/nom-12`), not Linear’s long auto-generated branch names, unless you have a reason to diverge.

The Cursor skill **[`.cursor/skills/do-task/SKILL.md`](.cursor/skills/do-task/SKILL.md)** describes the full workflow: isolated git worktree per issue, deliverables, **PR as the default close-out**, and syncing Linear (including Figma design steps when the issue is UI work). Invoke it by saying **do-task** with an issue id (e.g. `NOM-12`).

**Typical tooling:** [Git](https://git-scm.com/), [GitHub CLI](https://cli.github.com/) (`gh auth login` to this repo), and in Cursor enable **Linear**, **GitHub**, and **Figma** MCPs if you want the automated path.

## Repository layout

Planned layout: application code will live under `apps/` and shared packages under `packages/` when implementation begins.
