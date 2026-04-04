# Supabase (Nomi)

CLI project root: this directory (`config.toml`, `migrations/`, `edge/`).

## Local CLI

From the repo root (or this directory):

```bash
supabase --workdir apps/supabase start
supabase --workdir apps/supabase db reset
supabase --workdir apps/supabase functions serve send-sms --no-verify-jwt
```

Deploy the `send-sms` function and apply migrations against your hosted project using your usual `supabase link` project.

## Hosted project: phone auth + Send SMS hook

1. **Authentication → Providers → Phone**: enable phone sign-in.
2. **Authentication → Hooks**: add a **Send SMS** hook:
   - **HTTP endpoint**: `https://<project-ref>.supabase.co/functions/v1/send-sms` (or your custom domain).
   - **Secret**: generate a secret; use the same value for the Edge Function secret `SEND_SMS_HOOK_SECRET` (Supabase often shows it as `v1,whsec_...`; the function accepts that form or the raw `whsec_` segment).
3. **Edge Functions → `send-sms` → Secrets**:
   - `SEND_SMS_HOOK_SECRET` — must match the hook secret above.
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_MESSAGING_SERVICE_SID` — Twilio Messaging Service SID (primary sender for OTP).
4. **Twilio**: use [test credentials](https://www.twilio.com/docs/iam/test-credentials) and [magic phone numbers](https://www.twilio.com/docs/iam/test-credentials#test-sms-messages-parameters-from) for development; use a real Messaging Service + numbers for production.

## Web app env

See [`../web/.env.example`](../web/.env.example). `SUPABASE_URL` and `SUPABASE_KEY` (anon) are required for the Nuxt client.
