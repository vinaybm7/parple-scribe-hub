# 🔒 SECURITY SETUP GUIDE

## ⚠️ CRITICAL: Complete These Steps IMMEDIATELY

Your Supabase configuration has been secured, but you need to complete the setup to ensure full protection.

## Phase 1: Database Security (REQUIRED)

### 1. Run SQL Security Policies

1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `supabase-security-policies.sql`
4. Replace `'your-admin-uuid-1'` and `'your-admin-uuid-2'` with actual admin user IDs
5. Execute the SQL script

### 2. Create Admin User

1. In Supabase dashboard, go to Authentication → Users
2. Click "Add User"
3. Create an admin account with email/password
4. Copy the user's UUID
5. Update the `is_admin_user()` function in SQL with this UUID

### 3. Update Environment Variables

1. Replace `VITE_ADMIN_UIDS=your-admin-user-id-here` in `.env`
2. Use the UUID from step 2 above
3. For multiple admins, separate with commas: `uuid1,uuid2,uuid3`

## Phase 2: Test Security

### 1. Test Admin Login

1. Go to `/admin` (will redirect to login)
2. Try logging in with the admin account created above
3. Verify you can access admin functions
4. Try logging in with a non-admin account (should fail)

### 2. Test File Operations

1. Try uploading a file (should work for admin)
2. Try accessing admin functions without login (should fail)
3. Test file validation (try uploading invalid file types)

## Phase 3: Production Deployment

### 1. Environment Variables

Set these in your hosting platform (Vercel/Netlify):

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_UIDS=admin-uuid-1,admin-uuid-2
VITE_GEMINI_API_KEY=your-gemini-key
VITE_ELEVENLABS_API_KEY=your-elevenlabs-key
# ... other keys
```

### 2. Remove .env from Git

```bash
# Make sure .env is in .gitignore (it already is)
git rm --cached .env  # Remove if accidentally committed
git commit -m "Remove .env from tracking"
```

### 3. Rotate API Keys

1. Generate new Supabase anon key (optional but recommended)
2. Generate new API keys for external services
3. Update environment variables

## Phase 4: Monitoring & Maintenance

### 1. Set Up Monitoring

1. Check Supabase logs regularly
2. Monitor for failed login attempts
3. Review file upload patterns

### 2. Regular Security Checks

1. Review admin user list monthly
2. Check for suspicious file uploads
3. Monitor API usage for abuse

## Security Features Now Active

✅ **Authentication Required**: Admin functions require login
✅ **File Validation**: Strict file type and size limits
✅ **Rate Limiting**: Prevents upload spam
✅ **Path Sanitization**: Prevents directory traversal
✅ **SQL Injection Protection**: Parameterized queries
✅ **Row Level Security**: Database-level access control
✅ **Audit Logging**: All admin actions logged
✅ **Input Validation**: Malicious content detection

## Emergency Procedures

### If System is Compromised

1. **Immediately disable** the Supabase project
2. **Rotate all API keys**
3. **Review audit logs** for unauthorized access
4. **Check uploaded files** for malicious content
5. **Reset admin passwords**

### If Admin Account is Compromised

1. **Remove compromised UUID** from `is_admin_user()` function
2. **Create new admin account**
3. **Update environment variables**
4. **Review recent admin actions** in audit log

## Support

If you need help with security setup:

1. Check Supabase documentation
2. Review the SQL policies in `supabase-security-policies.sql`
3. Test each security feature individually
4. Monitor logs for any issues

## Security Checklist

- [ ] SQL security policies executed
- [ ] Admin user created in Supabase Auth
- [ ] Environment variables updated with admin UUID
- [ ] Admin login tested and working
- [ ] File upload security tested
- [ ] Production environment variables set
- [ ] .env file not committed to Git
- [ ] API keys rotated (optional)
- [ ] Monitoring set up
- [ ] Emergency procedures documented

**Status: 🔴 INCOMPLETE - Complete checklist above**

Once all items are checked, your system will be secure! 🔒