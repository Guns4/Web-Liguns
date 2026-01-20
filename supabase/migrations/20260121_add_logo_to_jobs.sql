-- Migration: Add logo_url support to jobs table
-- Created: 2026-01-21
-- Description: Adds logo_url column to jobs table for company/venue logos

-- Add logo_url column to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN jobs.logo_url IS 'URL to company/venue logo image';

-- Note: No index needed as this field is not used for filtering
