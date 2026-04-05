-- Email-based discovery: mirror verified auth email on profiles for lookup + friend requests.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email_normalized text;

COMMENT ON COLUMN public.profiles.email_normalized IS
  'Lowercase trimmed email from auth, for find-by-email. Null if the account has no email yet.';

CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_normalized_unique
  ON public.profiles (email_normalized)
  WHERE email_normalized IS NOT NULL;

UPDATE public.profiles p
SET email_normalized = lower(btrim(u.email))
FROM auth.users u
WHERE u.id = p.profile_id
  AND u.email IS NOT NULL
  AND btrim(u.email) <> '';

CREATE OR REPLACE FUNCTION public.handle_new_user ()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (profile_id, email_normalized)
  VALUES (
    NEW.id,
    CASE
      WHEN NEW.email IS NOT NULL AND btrim(NEW.email) <> '' THEN lower(btrim(NEW.email))
      ELSE NULL
    END
  )
  ON CONFLICT (profile_id) DO NOTHING;
  RETURN NEW;
END
$$;

CREATE OR REPLACE FUNCTION public.sync_profile_email_from_auth_user ()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET email_normalized = CASE
      WHEN NEW.email IS NOT NULL AND btrim(NEW.email) <> '' THEN lower(btrim(NEW.email))
      ELSE NULL
    END
  WHERE profile_id = NEW.id;
  RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;
CREATE TRIGGER on_auth_user_email_updated
AFTER UPDATE OF email ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_email_from_auth_user ();

-- Find a profile by exact email match (for add-friend). SECURITY DEFINER bypasses RLS.
CREATE OR REPLACE FUNCTION public.lookup_friend_candidate_by_email (search_email text)
RETURNS TABLE (
  profile_id uuid,
  display_name text,
  avatar_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.profile_id, p.display_name, p.avatar_url
  FROM public.profiles p
  WHERE p.email_normalized = lower(btrim(search_email))
    AND btrim(search_email) <> ''
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.lookup_friend_candidate_by_email (text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lookup_friend_candidate_by_email (text) TO authenticated;
