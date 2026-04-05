-- Allow viewing minimal profile fields for people in a pending friend request with you
-- (incoming or outgoing). Without this, RLS only allows self + accepted friends.

CREATE POLICY profiles_select_pending_friend_request
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.friend_requests fr
    WHERE fr.status = 'pending'::public.friend_request_status
      AND (
        (
          fr.from_profile_id = (SELECT auth.uid ())
          AND fr.to_profile_id = profiles.profile_id
        )
        OR (
          fr.to_profile_id = (SELECT auth.uid ())
          AND fr.from_profile_id = profiles.profile_id
        )
      )
  )
);
