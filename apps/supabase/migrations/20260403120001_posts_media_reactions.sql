-- Posts (carousel), media rows, poster-only reactions (RLS: only author reads reactions)

CREATE TABLE public.posts (
  post_id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  author_profile_id uuid NOT NULL REFERENCES public.profiles (profile_id) ON DELETE CASCADE,
  caption text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX posts_author_created_idx ON public.posts (author_profile_id, created_at DESC);

CREATE INDEX posts_author_created_active_idx ON public.posts (author_profile_id, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE TABLE public.post_media (
  post_media_id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  post_id uuid NOT NULL REFERENCES public.posts (post_id) ON DELETE CASCADE,
  sort_order smallint NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  width int,
  height int,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT post_media_sort_order_range CHECK (
    sort_order >= 0
    AND sort_order <= 4
  ),
  CONSTRAINT post_media_post_sort_unique UNIQUE (post_id, sort_order)
);

CREATE INDEX post_media_post_idx ON public.post_media (post_id);

CREATE TABLE public.post_reactions (
  post_id uuid NOT NULL REFERENCES public.posts (post_id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles (profile_id) ON DELETE CASCADE,
  reaction_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT post_reactions_type_len CHECK (
    char_length(reaction_type) >= 1
    AND char_length(reaction_type) <= 32
  ),
  PRIMARY KEY (post_id, profile_id)
);

CREATE INDEX post_reactions_post_idx ON public.post_reactions (post_id);

CREATE INDEX post_reactions_profile_id_idx ON public.post_reactions (profile_id);

CREATE TRIGGER posts_set_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

CREATE TRIGGER post_reactions_set_updated_at
BEFORE UPDATE ON public.post_reactions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

-- Posts: author sees all; friends see non-deleted only
CREATE POLICY posts_select_visible
ON public.posts
FOR SELECT
TO authenticated
USING (
  author_profile_id = (SELECT auth.uid ())
  OR (
    deleted_at IS NULL
    AND public.is_accepted_friend ((SELECT auth.uid ()), author_profile_id)
  )
);

CREATE POLICY posts_insert_author
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (author_profile_id = (SELECT auth.uid ()));

CREATE POLICY posts_update_author
ON public.posts
FOR UPDATE
TO authenticated
USING (author_profile_id = (SELECT auth.uid ()))
WITH CHECK (author_profile_id = (SELECT auth.uid ()));

CREATE POLICY posts_delete_author
ON public.posts
FOR DELETE
TO authenticated
USING (author_profile_id = (SELECT auth.uid ()));

-- Post media: same visibility as parent post
CREATE POLICY post_media_select_visible
ON public.post_media
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.post_id = post_media.post_id
      AND (
        p.author_profile_id = (SELECT auth.uid ())
        OR (
          p.deleted_at IS NULL
          AND public.is_accepted_friend ((SELECT auth.uid ()), p.author_profile_id)
        )
      )
  )
);

CREATE POLICY post_media_insert_author
ON public.post_media
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.post_id = post_media.post_id
      AND p.author_profile_id = (SELECT auth.uid ())
  )
);

CREATE POLICY post_media_update_author
ON public.post_media
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.post_id = post_media.post_id
      AND p.author_profile_id = (SELECT auth.uid ())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.post_id = post_media.post_id
      AND p.author_profile_id = (SELECT auth.uid ())
  )
);

CREATE POLICY post_media_delete_author
ON public.post_media
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.post_id = post_media.post_id
      AND p.author_profile_id = (SELECT auth.uid ())
  )
);

-- Reactions: only post author can SELECT (poster-only visibility)
CREATE POLICY post_reactions_select_author_only
ON public.post_reactions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.post_id = post_reactions.post_id
      AND p.author_profile_id = (SELECT auth.uid ())
  )
);

-- Reacting user can insert/update/delete own row if friend of author
CREATE POLICY post_reactions_insert_friend
ON public.post_reactions
FOR INSERT
TO authenticated
WITH CHECK (
  profile_id = (SELECT auth.uid ())
  AND EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.post_id = post_reactions.post_id
      AND p.deleted_at IS NULL
      AND public.is_accepted_friend ((SELECT auth.uid ()), p.author_profile_id)
  )
);

CREATE POLICY post_reactions_update_own
ON public.post_reactions
FOR UPDATE
TO authenticated
USING (profile_id = (SELECT auth.uid ()))
WITH CHECK (
  profile_id = (SELECT auth.uid ())
  AND EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.post_id = post_reactions.post_id
      AND p.deleted_at IS NULL
      AND public.is_accepted_friend ((SELECT auth.uid ()), p.author_profile_id)
  )
);

CREATE POLICY post_reactions_delete_own
ON public.post_reactions
FOR DELETE
TO authenticated
USING (profile_id = (SELECT auth.uid ()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_media TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_reactions TO authenticated;
