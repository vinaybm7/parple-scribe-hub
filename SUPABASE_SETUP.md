# Supabase Setup Guide for Student Notes Platform

## 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details and create the project
4. Wait for the project to be ready

## 2. Get Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - Anon/Public Key

## 3. Configure Environment Variables

1. Create a `.env` file in the project root
2. Add the following variables:

```env
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 4. Create Storage Bucket

1. In Supabase Dashboard, go to Storage
2. Click "New Bucket"
3. Name it `notes`
4. Choose "Public" for easier access (or "Private" for more security)
5. Click "Create Bucket"

## 5. Configure Storage Policies (RLS)

### For Public Bucket:
If you chose a public bucket, files are automatically accessible via URL.

### For Private Bucket:
1. Go to Storage → Policies
2. Create the following policies for the `storage.objects` table:

#### Allow Admin Uploads:
```sql
CREATE POLICY "Allow admin uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'notes' AND 
  auth.uid() = 'your-admin-user-id-here'
);
```

#### Allow Public Downloads:
```sql
CREATE POLICY "Allow downloads"
ON storage.objects FOR SELECT TO authenticated
WITH CHECK (bucket_id = 'notes');
```

#### Allow Admin Delete:
```sql
CREATE POLICY "Allow admin delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'notes' AND 
  auth.uid() = 'your-admin-user-id-here'
);
```

## 6. Set Up Authentication (Optional)

If you want to restrict admin access:

1. Go to Authentication → Users
2. Create an admin user account
3. Copy the user's UUID
4. Update the `isAdmin` function in `src/lib/supabase.ts`:

```typescript
export const isAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const adminUIDs = ['your-admin-uuid-here'] // Replace with actual admin UUID
  return user && adminUIDs.includes(user.id)
}
```

## 7. File Organization Structure

Files will be organized as follows:
```
notes/
├── year-1/
│   ├── semester-1/
│   │   ├── Physics/
│   │   ├── Maths/
│   │   └── Chemistry/
│   └── semester-2/
├── year-2/
├── year-3/
└── year-4/
```

## 8. Access the Admin Dashboard

1. Navigate to `/admin-dashboard-secure-access` (private URL)
2. Only authorized admins can access this page
3. Upload files with proper categorization
4. Manage existing files (view, download, delete)

## 9. File Upload Restrictions

- **Allowed file types**: PDF, DOCX, JPG, PNG
- **Maximum file size**: 10MB
- **File naming**: Automatic with timestamp to prevent conflicts

## 10. Security Features

- **Private URL**: Admin dashboard is only accessible via `/admin-dashboard-secure-access`
- **Admin verification**: Only authorized users can upload/delete files
- **File validation**: Type and size restrictions
- **Organized storage**: Automatic folder structure based on year/semester/subject

## 11. Usage Instructions

### For Admins:
1. Access the admin dashboard via the private URL
2. Select year, semester, and subject
3. Add title and description
4. Upload the file
5. Files are automatically organized in the storage bucket

### For Students:
1. Navigate through the notes section
2. Browse by year → semester → subject
3. Download available study materials
4. All files are accessible without authentication (if using public bucket)

## Troubleshooting

### Common Issues:

1. **Upload fails**: Check RLS policies and admin UUID
2. **Files not visible**: Verify bucket is public or policies are correct
3. **Access denied**: Ensure admin UUID is correctly configured
4. **Large files**: Check file size limit (10MB default)

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test Supabase connection in browser dev tools
4. Check Storage policies in Supabase dashboard

## Production Deployment

1. Set environment variables in your hosting platform
2. Ensure Supabase project is in production mode
3. Configure proper CORS settings if needed
4. Set up proper admin authentication flow
5. Consider implementing signed URLs for private files

This setup provides a secure, scalable solution for managing student notes with proper access control and file organization.