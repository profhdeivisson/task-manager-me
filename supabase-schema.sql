-- Create the projects table in Supabase
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stages JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for better query performance
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can make this more restrictive later)
CREATE POLICY "Allow all operations on projects" ON projects
  FOR ALL USING (true);
