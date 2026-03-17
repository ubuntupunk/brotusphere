-- Migration: Add password reset columns to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE;
