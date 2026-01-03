-- Migration to add brewing methods support

-- Methods table (e.g., V60, Aeropress, French Press)
CREATE TABLE IF NOT EXISTS methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add method_id to logs table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'logs' AND column_name = 'method_id') THEN
        ALTER TABLE logs ADD COLUMN method_id UUID REFERENCES methods(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Enable Row Level Security (RLS) for methods
ALTER TABLE methods ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotency)
DROP POLICY IF EXISTS "Users can view their own methods" ON methods;
DROP POLICY IF EXISTS "Users can insert their own methods" ON methods;
DROP POLICY IF EXISTS "Users can update their own methods" ON methods;
DROP POLICY IF EXISTS "Users can delete their own methods" ON methods;

-- RLS Policies for methods
CREATE POLICY "Users can view their own methods"
  ON methods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own methods"
  ON methods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own methods"
  ON methods FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own methods"
  ON methods FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_methods_user_id ON methods(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_method_id ON logs(method_id);
