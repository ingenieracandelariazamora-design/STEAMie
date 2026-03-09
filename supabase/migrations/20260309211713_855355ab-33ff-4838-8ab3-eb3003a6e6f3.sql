
CREATE TABLE public.community_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  lesson TEXT NOT NULL,
  advice TEXT,
  category TEXT NOT NULL DEFAULT 'privacy',
  author_name TEXT NOT NULL DEFAULT 'Anónimo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.community_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved stories"
  ON public.community_stories
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "Anyone can insert stories"
  ON public.community_stories
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
