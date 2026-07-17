/*
# TryCatch75 Initial Database Schema

This migration creates the complete database structure for the TryCatch75 attendance tracking application.

## Tables Created

1. **profiles** - User profile information
   - `id` (uuid, primary key, references auth.users)
   - `name` (text, display name)
   - `roll_no` (text, student roll number)
   - `branch` (text, engineering branch)
   - `year` (text, academic year)
   - `semester` (integer, current semester)
   - `university` (text, university preset ID)
   - `threshold` (integer, attendance threshold %, default 75)
   - `created_at`, `updated_at` (timestamps)

2. **subjects** - Academic subjects
   - `id` (uuid, primary key)
   - `user_id` (uuid, references auth.users)
   - `name` (text, subject name)
   - `type` (text, theory/lab/tutorial)
   - `credits` (integer, credit hours)
   - `teacher_name` (text, optional)
   - `contact_note` (text, optional)
   - `semester` (integer)
   - `target_attendance` (integer, default 75)
   - `created_at` (timestamp)

3. **attendance** - Daily attendance records
   - `id` (uuid, primary key)
   - `user_id` (uuid, references auth.users)
   - `subject_id` (uuid, references subjects)
   - `date` (date)
   - `status` (text, present/absent/holiday/medical)
   - `note` (text, optional)
   - `marked_at` (timestamp)
   - Unique constraint on (user_id, subject_id, date)

4. **timetables** - Weekly class schedules
   - `id` (uuid, primary key)
   - `user_id` (uuid, references auth.users)
   - `day` (text, monday-saturday)
   - `periods` (jsonb, array of {time, subject_id, room})
   - `created_at`, `updated_at` (timestamps)

## Security

- RLS enabled on all tables
- Owner-scoped policies: users can only access their own data
- Proper CASCADE rules for data integrity
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text DEFAULT '',
  roll_no text DEFAULT '',
  branch text DEFAULT '',
  year text DEFAULT '',
  semester integer DEFAULT 1,
  university text DEFAULT 'custom',
  threshold integer DEFAULT 75,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text DEFAULT 'theory',
  credits integer DEFAULT 3,
  teacher_name text DEFAULT '',
  contact_note text DEFAULT '',
  semester integer DEFAULT 1,
  target_attendance integer DEFAULT 75,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON subjects(user_id);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subjects_select_own" ON subjects;
CREATE POLICY "subjects_select_own" ON subjects FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "subjects_insert_own" ON subjects;
CREATE POLICY "subjects_insert_own" ON subjects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "subjects_update_own" ON subjects;
CREATE POLICY "subjects_update_own" ON subjects FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "subjects_delete_own" ON subjects;
CREATE POLICY "subjects_delete_own" ON subjects FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Attendance records table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL DEFAULT 'present',
  note text DEFAULT '',
  marked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, subject_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_subject_id ON attendance(subject_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "attendance_select_own" ON attendance;
CREATE POLICY "attendance_select_own" ON attendance FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "attendance_insert_own" ON attendance;
CREATE POLICY "attendance_insert_own" ON attendance FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "attendance_update_own" ON attendance;
CREATE POLICY "attendance_update_own" ON attendance FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "attendance_delete_own" ON attendance;
CREATE POLICY "attendance_delete_own" ON attendance FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Timetables table
CREATE TABLE IF NOT EXISTS timetables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  day text NOT NULL,
  periods jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, day)
);

CREATE INDEX IF NOT EXISTS idx_timetables_user_id ON timetables(user_id);

ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "timetables_select_own" ON timetables;
CREATE POLICY "timetables_select_own" ON timetables FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "timetables_insert_own" ON timetables;
CREATE POLICY "timetables_insert_own" ON timetables FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "timetables_update_own" ON timetables;
CREATE POLICY "timetables_update_own" ON timetables FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "timetables_delete_own" ON timetables;
CREATE POLICY "timetables_delete_own" ON timetables FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, created_at, updated_at)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Student'), now(), now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();