-- Migration: Add email column to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
