/*
# Create verification_codes table

1. Purpose
   - Stores 6-digit OTP codes for email verification during sign-up.
   - The code is generated client-side, emailed via the send-email edge function
     (which routes to the demo address), and verified here before completing
     Supabase auth sign-up.

2. New Table: verification_codes
   - id (uuid, primary key)
   - email (text, not null) — the address being verified
   - code (text, not null) — 6-digit OTP
   - expires_at (timestamptz, not null) — 10 minutes from creation
   - verified (boolean, default false) — set true once the user enters the correct code
   - created_at (timestamptz, default now())

3. Security
   - RLS enabled.
   - This is a no-auth flow: the anon key needs to insert (create code) and
     select/verify (check code). All policies use TO anon, authenticated.
   - Anyone can create a code for any email (rate-limiting is handled client-side
     for this demo). Anyone can read/verify codes — the code itself is the secret.
*/

CREATE TABLE IF NOT EXISTS verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_codes" ON verification_codes;
CREATE POLICY "anon_select_codes" ON verification_codes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_codes" ON verification_codes;
CREATE POLICY "anon_insert_codes" ON verification_codes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_codes" ON verification_codes;
CREATE POLICY "anon_update_codes" ON verification_codes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_codes" ON verification_codes;
CREATE POLICY "anon_delete_codes" ON verification_codes FOR DELETE
  TO anon, authenticated USING (true);
