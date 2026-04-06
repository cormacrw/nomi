-- Expose profile updated_at for avatar cache-busting in add-friend lookup

CREATE OR REPLACE FUNCTION public.lookup_friend_candidate_by_email (search_email text)
RETURNS TABLE (
  profile_id uuid,
  display_name text,
  avatar_url text,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.profile_id, p.display_name, p.avatar_url, p.updated_at
  FROM public.profiles p
  WHERE p.email_normalized = lower(btrim(search_email))
    AND btrim(search_email) <> ''
  LIMIT 1;
$$;
