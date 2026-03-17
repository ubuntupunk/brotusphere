-- Migration: Add role column to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer';

-- Set first user as admin (for testing - update email as needed)
-- UPDATE user_profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
