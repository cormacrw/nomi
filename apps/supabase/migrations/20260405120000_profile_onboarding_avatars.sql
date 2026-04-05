-- Profile onboarding: completion flag + public avatar storage

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS has_completed_profile_setup boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.has_completed_profile_setup IS
  'True after the user finishes display name / optional avatar onboarding.';

UPDATE public.profiles
SET has_completed_profile_setup = true
WHERE display_name IS NOT NULL
  AND btrim(display_name) <> '';

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile_avatars',
  'profile_avatars',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- Public bucket: anyone can read objects (URLs used in <img> for feed)
CREATE POLICY profile_avatars_storage_select
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile_avatars');

CREATE POLICY profile_avatars_storage_insert
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile_avatars'
  AND split_part(name, '/', 1) = (SELECT auth.uid ())::text
);

CREATE POLICY profile_avatars_storage_update
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile_avatars'
  AND split_part(name, '/', 1) = (SELECT auth.uid ())::text
)
WITH CHECK (
  bucket_id = 'profile_avatars'
  AND split_part(name, '/', 1) = (SELECT auth.uid ())::text
);

CREATE POLICY profile_avatars_storage_delete
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile_avatars'
  AND split_part(name, '/', 1) = (SELECT auth.uid ())::text
);
