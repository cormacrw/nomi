-- Nomi MVP: enums, profiles, friend graph, helper for RLS
-- friend_request_status: enum; reaction_type: deferred to post_reactions migration (text + CHECK)

CREATE TYPE public.friend_request_status AS ENUM (
  'pending',
  'accepted',
  'declined',
  'cancelled'
);

CREATE TABLE public.profiles (
  profile_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  phone_e164 text,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_display_name_len CHECK (
    display_name IS NULL OR char_length(display_name) <= 100
  )
);

CREATE UNIQUE INDEX profiles_phone_e164_unique
  ON public.profiles (phone_e164)
  WHERE phone_e164 IS NOT NULL;

CREATE TABLE public.friend_requests (
  friend_request_id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  from_profile_id uuid NOT NULL REFERENCES public.profiles (profile_id) ON DELETE CASCADE,
  to_profile_id uuid NOT NULL REFERENCES public.profiles (profile_id) ON DELETE CASCADE,
  status public.friend_request_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT friend_requests_distinct CHECK (from_profile_id <> to_profile_id),
  CONSTRAINT friend_requests_pair_unique UNIQUE (from_profile_id, to_profile_id)
);

CREATE INDEX friend_requests_from_status_idx ON public.friend_requests (from_profile_id, status);
CREATE INDEX friend_requests_to_status_idx ON public.friend_requests (to_profile_id, status);

-- Used by RLS on posts, post_media, post_reactions, storage (friends can read)
CREATE OR REPLACE FUNCTION public.is_accepted_friend (viewer uuid, other uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT viewer IS NOT NULL
    AND other IS NOT NULL
    AND viewer <> other
    AND EXISTS (
      SELECT 1
      FROM public.friend_requests fr
      WHERE fr.status = 'accepted'::public.friend_request_status
        AND (
          (fr.from_profile_id = viewer AND fr.to_profile_id = other)
          OR (fr.from_profile_id = other AND fr.to_profile_id = viewer)
        )
    )
$$;

REVOKE ALL ON FUNCTION public.is_accepted_friend (uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_accepted_friend (uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.set_updated_at ()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END
$$;

CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

CREATE TRIGGER friend_requests_set_updated_at
BEFORE UPDATE ON public.friend_requests
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

CREATE OR REPLACE FUNCTION public.handle_new_user ()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (profile_id)
  VALUES (NEW.id)
  ON CONFLICT (profile_id) DO NOTHING;
  RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user ();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_own_or_friend
ON public.profiles
FOR SELECT
TO authenticated
USING (
  profile_id = (SELECT auth.uid ())
  OR public.is_accepted_friend ((SELECT auth.uid ()), profile_id)
);

CREATE POLICY profiles_update_own
ON public.profiles
FOR UPDATE
TO authenticated
USING (profile_id = (SELECT auth.uid ()))
WITH CHECK (profile_id = (SELECT auth.uid ()));

CREATE POLICY friend_requests_select_participant
ON public.friend_requests
FOR SELECT
TO authenticated
USING (
  from_profile_id = (SELECT auth.uid ())
  OR to_profile_id = (SELECT auth.uid ())
);

CREATE POLICY friend_requests_insert_outgoing
ON public.friend_requests
FOR INSERT
TO authenticated
WITH CHECK (
  from_profile_id = (SELECT auth.uid ())
  AND to_profile_id <> (SELECT auth.uid ())
);

CREATE POLICY friend_requests_update_participant
ON public.friend_requests
FOR UPDATE
TO authenticated
USING (
  from_profile_id = (SELECT auth.uid ())
  OR to_profile_id = (SELECT auth.uid ())
)
WITH CHECK (
  from_profile_id = (SELECT auth.uid ())
  OR to_profile_id = (SELECT auth.uid ())
);

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.friend_requests TO authenticated;
