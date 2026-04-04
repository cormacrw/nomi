-- Onboarding: track Welcome (AUTH-01) completion server-side after signup

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS has_completed_welcome boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.has_completed_welcome IS
  'True once the user has finished the welcome step; synced from client after first session.';
