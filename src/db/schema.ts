export const CREATE_ORGANIZATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    short_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT,
    logo_url TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    county TEXT,
    landing_enabled BOOLEAN DEFAULT false,
    landing_primary_color TEXT DEFAULT '#2563eb',
    landing_secondary_color TEXT DEFAULT '#f59e0b',
    landing_about_text TEXT,
    landing_experience_years TEXT,
    company_name TEXT,
    cui TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
`;

export const ALTER_ORGANIZATIONS_LANDING = `
  ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS landing_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS landing_primary_color TEXT DEFAULT '#2563eb',
  ADD COLUMN IF NOT EXISTS landing_secondary_color TEXT DEFAULT '#f59e0b',
  ADD COLUMN IF NOT EXISTS landing_about_text TEXT,
  ADD COLUMN IF NOT EXISTS landing_experience_years TEXT,
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS cui TEXT;
`;

export const CREATE_UPDATED_AT_FUNCTION = `
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`;

export const CREATE_UPDATED_AT_TRIGGER = `
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at'
    ) THEN
      CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON organizations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    END IF;
  END;
  $$;
`;
