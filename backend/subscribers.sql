-- Create subscribers table for email subscriptions

CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for public subscriptions)
CREATE POLICY "Allow anonymous inserts" ON subscribers
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated users to read their own subscriptions
CREATE POLICY "Allow users to read own data" ON subscribers
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.email() = email);
