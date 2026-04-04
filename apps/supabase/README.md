# Supabase (Nomi)

CLI project root: this directory (`config.toml`, `migrations/`).

## Local CLI

From the repo root:

```bash
supabase --workdir apps/supabase start
supabase --workdir apps/supabase db reset
```

Link a remote project and push migrations with `supabase link` and `supabase db push` as needed.

## Web app env

See [`../web/.env.example`](../web/.env.example). `SUPABASE_URL` and `SUPABASE_KEY` (anon) are required for the Nuxt client.
