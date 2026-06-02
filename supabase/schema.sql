-- Run this in your Supabase project's SQL Editor
-- Dashboard → SQL Editor → New query → paste → Run

-- Posts
CREATE TABLE public.posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type        TEXT NOT NULL CHECK (type IN ('article','link','movie','music','book')),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  content     TEXT,          -- TipTap HTML (articles)
  excerpt     TEXT,

  -- Link posts
  link_url    TEXT,
  og_title    TEXT,
  og_desc     TEXT,
  og_image    TEXT,
  og_domain   TEXT,

  -- Music / YouTube
  youtube_url      TEXT,
  youtube_video_id TEXT,
  artist           TEXT,
  song_title       TEXT,

  -- Books
  book_author      TEXT,
  book_amazon_url  TEXT,
  book_cover_url   TEXT,

  -- Movies
  movie_year    INTEGER,
  movie_rating  INTEGER CHECK (movie_rating BETWEEN 1 AND 10),
  movie_genre   TEXT,

  tags       TEXT[]   DEFAULT '{}',
  published  BOOLEAN  DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Messages
CREATE TABLE public.messages (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  name         TEXT,
  email        TEXT,
  hint         TEXT,
  message      TEXT NOT NULL,
  read         BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE public.posts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Public: read published posts
CREATE POLICY "public_read_posts" ON public.posts
  FOR SELECT USING (published = true);

-- Public: send messages
CREATE POLICY "public_send_messages" ON public.messages
  FOR INSERT WITH CHECK (true);

-- Admin ops (UPDATE/DELETE/INSERT on posts, SELECT on messages) use
-- the service-role key in server actions — bypasses RLS entirely.
-- No extra policies needed for the admin.

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
