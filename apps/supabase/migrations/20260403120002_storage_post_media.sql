-- Storage bucket `post_media`: object key must match post_media.storage_path (full path within bucket).
-- Path convention: `{post_id}/{filename}` — first segment is post_id; author can upload; friends + author can read.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post_media',
  'post_media',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY post_media_storage_select
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'post_media'
  AND EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.post_id = (split_part(name, '/', 1))::uuid
      AND (
        p.author_profile_id = (SELECT auth.uid ())
        OR (
          p.deleted_at IS NULL
          AND public.is_accepted_friend ((SELECT auth.uid ()), p.author_profile_id)
        )
      )
  )
);

CREATE POLICY post_media_storage_insert
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post_media'
  AND EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.post_id = (split_part(name, '/', 1))::uuid
      AND p.author_profile_id = (SELECT auth.uid ())
  )
);

CREATE POLICY post_media_storage_update
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'post_media'
  AND EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.post_id = (split_part(name, '/', 1))::uuid
      AND p.author_profile_id = (SELECT auth.uid ())
  )
)
WITH CHECK (
  bucket_id = 'post_media'
  AND EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.post_id = (split_part(name, '/', 1))::uuid
      AND p.author_profile_id = (SELECT auth.uid ())
  )
);

CREATE POLICY post_media_storage_delete
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'post_media'
  AND EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.post_id = (split_part(name, '/', 1))::uuid
      AND p.author_profile_id = (SELECT auth.uid ())
  )
);
