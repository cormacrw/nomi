# Stack options (brainstorm)

No final decisions here — use [decisions/](decisions/) for ADRs once something is accepted.

## Monorepo tooling

- **pnpm workspaces**, **npm workspaces**, **Turborepo**, **Nx** — tradeoffs: cache speed, task graph, learning curve.

## Backend

- **BaaS** (Firebase, Supabase, etc.) vs **custom API** (Node, Go, Rust, etc.) vs **serverless** — driven by graph complexity, auth model, and real-time needs.

## Auth and phone verification

- **Twilio**, **MessageBird**, **Vonage**, **AWS SNS**, etc. — compare pricing, regions, and developer experience.
- **App attestation** / device integrity for high-risk flows (optional later).

## Clients

- **React Native** / **Flutter** / **native** — one codebase vs polish.
- **Web** — PWA vs SPA; accessibility and SEO if public pages exist.

## Data

- Relational vs document vs graph DB for social graph — normalize expectations in an ADR when evaluated.

## Observability

- Logging, metrics, tracing — pick when first services ship.