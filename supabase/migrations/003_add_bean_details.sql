-- Rename origin to country to aligns with user's terminology (assuming origin held country data like 'Ethiopia')
ALTER TABLE beans RENAME COLUMN origin TO country;

-- Add new columns
ALTER TABLE beans ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE beans ADD COLUMN IF NOT EXISTS producer TEXT;
ALTER TABLE beans ADD COLUMN IF NOT EXISTS variety TEXT;

-- process already exists in 001, but ensuring it is there just in case (though duplicate add column raises error unless IF NOT EXISTS)
ALTER TABLE beans ADD COLUMN IF NOT EXISTS process TEXT;

-- Add characteristics as a JSONB column to store flexible structured data
ALTER TABLE beans ADD COLUMN IF NOT EXISTS characteristics JSONB DEFAULT '{}'::jsonb;

-- Add comment to describe characteristics structure
COMMENT ON COLUMN beans.characteristics IS 'Structured JSON containing: aroma, beginning, middle, end, aftertaste, mouthfeel, color_tone';
