-- Coffee Brew Tracker Database Schema
-- This script is idempotent and can be run multiple times safely

-- Profiles table for user settings
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  temp_preference TEXT DEFAULT 'celsius' CHECK (temp_preference IN ('celsius', 'fahrenheit')),
  is_public BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grinders table
CREATE TABLE IF NOT EXISTS grinders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('manual', 'electric')),
  setting_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Beans table (The Pantry)
CREATE TABLE IF NOT EXISTS beans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  roaster TEXT,
  origin TEXT,
  process TEXT,
  roast_date DATE CHECK (roast_date <= CURRENT_DATE),
  total_weight NUMERIC(6,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brew Logs table
CREATE TABLE IF NOT EXISTS logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bean_id UUID REFERENCES beans(id) ON DELETE SET NULL,
  grinder_id UUID REFERENCES grinders(id) ON DELETE SET NULL,
  device TEXT,
  grind_setting TEXT,
  dose NUMERIC(5,2) CHECK (dose <= 500),
  ratio NUMERIC(4,1),
  water_temp NUMERIC(4,1), -- Always stored in Celsius
  bloom_time INTEGER,
  total_time INTEGER,
  yield NUMERIC(6,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE grinders ENABLE ROW LEVEL SECURITY;
ALTER TABLE beans ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view their own grinders" ON grinders;
DROP POLICY IF EXISTS "Users can insert their own grinders" ON grinders;
DROP POLICY IF EXISTS "Users can update their own grinders" ON grinders;
DROP POLICY IF EXISTS "Users can delete their own grinders" ON grinders;

DROP POLICY IF EXISTS "Users can view their own beans" ON beans;
DROP POLICY IF EXISTS "Users can insert their own beans" ON beans;
DROP POLICY IF EXISTS "Users can update their own beans" ON beans;
DROP POLICY IF EXISTS "Users can delete their own beans" ON beans;

DROP POLICY IF EXISTS "Users can view their own logs" ON logs;
DROP POLICY IF EXISTS "Users can insert their own logs" ON logs;
DROP POLICY IF EXISTS "Users can update their own logs" ON logs;
DROP POLICY IF EXISTS "Users can delete their own logs" ON logs;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for grinders
CREATE POLICY "Users can view their own grinders"
  ON grinders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grinders"
  ON grinders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grinders"
  ON grinders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own grinders"
  ON grinders FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for beans
CREATE POLICY "Users can view their own beans"
  ON beans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own beans"
  ON beans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own beans"
  ON beans FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own beans"
  ON beans FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for logs
CREATE POLICY "Users can view their own logs"
  ON logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
  ON logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
  ON logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
  ON logs FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better query performance (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_grinders_user_id ON grinders(user_id);
CREATE INDEX IF NOT EXISTS idx_beans_user_id ON beans(user_id);
CREATE INDEX IF NOT EXISTS idx_beans_is_active ON beans(is_active);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_bean_id ON logs(bean_id);
CREATE INDEX IF NOT EXISTS idx_logs_grinder_id ON logs(grinder_id);
