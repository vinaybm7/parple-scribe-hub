-- SUPABASE SECURITY POLICIES
-- Run these in your Supabase SQL Editor

-- 1. Enable Row Level Security on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Enable Row Level Security on file_metadata table
ALTER TABLE file_metadata ENABLE ROW LEVEL SECURITY;

-- 3. Create admin user check function
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Replace these UUIDs with your actual admin user IDs
  RETURN auth.uid() IN (
    '974cdef2-2ea1-4a54-a5ac-6bbff5fcffec'::uuid
    -- Add more admin UUIDs here as needed:
    -- ,'another-admin-uuid-here'::uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Storage Policies for 'notes' bucket

-- Policy: Admin can upload files
CREATE POLICY "Admin can upload files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'notes' AND 
  is_admin_user()
);

-- Policy: Admin can update files
CREATE POLICY "Admin can update files" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'notes' AND 
  is_admin_user()
)
WITH CHECK (
  bucket_id = 'notes' AND 
  is_admin_user()
);

-- Policy: Admin can delete files
CREATE POLICY "Admin can delete files" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'notes' AND 
  is_admin_user()
);

-- Policy: Public can read/download files
CREATE POLICY "Public can read files" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'notes');

-- 5. File Metadata Table Policies

-- Policy: Admin can insert metadata
CREATE POLICY "Admin can insert metadata" ON file_metadata
FOR INSERT TO authenticated
WITH CHECK (is_admin_user());

-- Policy: Admin can update metadata
CREATE POLICY "Admin can update metadata" ON file_metadata
FOR UPDATE TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- Policy: Admin can delete metadata
CREATE POLICY "Admin can delete metadata" ON file_metadata
FOR DELETE TO authenticated
USING (is_admin_user());

-- Policy: Public can read metadata (students can browse and view files)
CREATE POLICY "Public can read metadata" ON file_metadata
FOR SELECT TO public
USING (true);

-- Policy: Anonymous users can read metadata (for unauthenticated students)
CREATE POLICY "Anonymous can read metadata" ON file_metadata
FOR SELECT TO anon
USING (true);

-- 6. Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read audit logs
CREATE POLICY "Admin can read audit logs" ON audit_log
FOR SELECT TO authenticated
USING (is_admin_user());

-- 7. Create function to log file operations
CREATE OR REPLACE FUNCTION log_file_operation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    created_at
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id::TEXT, OLD.id::TEXT),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create triggers for audit logging
CREATE TRIGGER file_metadata_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON file_metadata
  FOR EACH ROW EXECUTE FUNCTION log_file_operation();

-- 9. Create rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  action TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on rate limits
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own rate limits
CREATE POLICY "Users can see own rate limits" ON rate_limits
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Policy: System can manage rate limits
CREATE POLICY "System can manage rate limits" ON rate_limits
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- 10. Create function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_action TEXT,
  p_limit INTEGER DEFAULT 10,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Clean up old entries
  DELETE FROM rate_limits 
  WHERE window_start < window_start;
  
  -- Get current count for this user and action
  SELECT COALESCE(SUM(count), 0) INTO current_count
  FROM rate_limits
  WHERE user_id = auth.uid()
    AND action = p_action
    AND window_start >= window_start;
  
  -- Check if limit exceeded
  IF current_count >= p_limit THEN
    RETURN FALSE;
  END IF;
  
  -- Update or insert rate limit record
  INSERT INTO rate_limits (user_id, action, count, window_start)
  VALUES (auth.uid(), p_action, 1, NOW())
  ON CONFLICT (user_id, action) 
  DO UPDATE SET 
    count = rate_limits.count + 1,
    updated_at = NOW();
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('notes', 'notes', true)
ON CONFLICT (id) DO NOTHING;

-- 12. Set up CORS for the bucket (run this in Supabase dashboard)
-- Go to Storage > Settings > CORS and add your domain

-- 13. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_file_metadata_year_semester ON file_metadata(year, semester);
CREATE INDEX IF NOT EXISTS idx_file_metadata_subject_category ON file_metadata(subject, category);
CREATE INDEX IF NOT EXISTS idx_file_metadata_created_at ON file_metadata(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON rate_limits(user_id, action);

-- 14. Create view for public file access (without sensitive data)
CREATE OR REPLACE VIEW public_files AS
SELECT 
  id,
  file_path,
  original_title,
  description,
  subject,
  category,
  year,
  semester,
  file_size,
  file_type,
  created_at
FROM file_metadata;

-- Grant access to public view
GRANT SELECT ON public_files TO public;

-- 15. Create admin dashboard view
CREATE OR REPLACE VIEW admin_dashboard AS
SELECT 
  fm.*,
  al.action as last_action,
  al.created_at as last_action_time,
  u.email as uploaded_by
FROM file_metadata fm
LEFT JOIN audit_log al ON al.record_id = fm.id::TEXT
LEFT JOIN auth.users u ON al.user_id = u.id
WHERE is_admin_user();

-- Grant access to admin view
GRANT SELECT ON admin_dashboard TO authenticated;

-- 16. Final security check function
CREATE OR REPLACE FUNCTION security_check()
RETURNS TABLE(
  check_name TEXT,
  status TEXT,
  details TEXT
) AS $$
BEGIN
  -- Check if RLS is enabled
  RETURN QUERY
  SELECT 
    'RLS on storage.objects'::TEXT,
    CASE WHEN relrowsecurity THEN 'ENABLED' ELSE 'DISABLED' END::TEXT,
    'Row Level Security status'::TEXT
  FROM pg_class 
  WHERE relname = 'objects' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'storage');
  
  RETURN QUERY
  SELECT 
    'RLS on file_metadata'::TEXT,
    CASE WHEN relrowsecurity THEN 'ENABLED' ELSE 'DISABLED' END::TEXT,
    'Row Level Security status'::TEXT
  FROM pg_class 
  WHERE relname = 'file_metadata';
  
  -- Check if policies exist
  RETURN QUERY
  SELECT 
    'Storage Policies'::TEXT,
    COUNT(*)::TEXT || ' policies found',
    'Number of policies on storage.objects'::TEXT
  FROM pg_policies 
  WHERE tablename = 'objects' AND schemaname = 'storage';
  
  RETURN QUERY
  SELECT 
    'Metadata Policies'::TEXT,
    COUNT(*)::TEXT || ' policies found',
    'Number of policies on file_metadata'::TEXT
  FROM pg_policies 
  WHERE tablename = 'file_metadata';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run security check
SELECT * FROM security_check();