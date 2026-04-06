-- Friends can SELECT only their own post_reactions row (self-state + RETURNING).
-- OR with post_reactions_select_author_only: author sees all rows on their posts.

CREATE POLICY post_reactions_select_own_friend
ON public.post_reactions
FOR SELECT
TO authenticated
USING (
  profile_id = (SELECT auth.uid ())
  AND EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.post_id = post_reactions.post_id
      AND p.deleted_at IS NULL
      AND public.is_accepted_friend ((SELECT auth.uid ()), p.author_profile_id)
  )
);
