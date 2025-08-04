# 🔒 Security Documentation

## Security Measures Implemented

### 1. Environment Variable Security
- ✅ Removed all hardcoded API keys from source code
- ✅ Implemented secure environment variable validation
- ✅ Added production environment template
- ✅ Updated .gitignore to prevent sensitive file commits

### 2. Authentication & Authorization
- ✅ Secure admin authentication with Supabase Auth
- ✅ Row Level Security (RLS) policies implemented
- ✅ Admin-only access controls for file operations
- ✅ Removed development admin bypass vulnerability

### 3. Input Validation & Sanitization
- ✅ File upload validation (type, size, name)
- ✅ Path traversal prevention
- ✅ HTML sanitization for XSS prevention
- ✅ SQL injection prevention measures

### 4. Security Headers
- ✅ Content Security Policy (CSP)
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Permissions-Policy restrictions

### 5. Rate Limiting
- ✅ Upload rate limiting implementation
- ✅ API request rate limiting
- ✅ Failed attempt tracking

### 6. Build Security
- ✅ Console statements removed in production
- ✅ Source map obfuscation
- ✅ Minification and compression

## Environment Variables Required

### Production Deployment
Set these environment variables in your deployment platform:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Admin Configuration
VITE_ADMIN_UIDS=admin-user-id-1,admin-user-id-2

# AI Services
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_ELEVENLABS_API_KEY=your-elevenlabs-api-key

# Voice IDs
VITE_ELEVENLABS_BELLA_VOICE_ID=your-bella-voice-id
VITE_ELEVENLABS_LUNA_VOICE_ID=your-luna-voice-id
VITE_ELEVENLABS_ARIA_VOICE_ID=your-aria-voice-id
VITE_ELEVENLABS_ZYAN_VOICE_ID=your-zyan-voice-id
```

## Security Checklist for Deployment

### Before Deployment
- [ ] All environment variables configured in deployment platform
- [ ] No hardcoded secrets in source code
- [ ] Admin user IDs updated in VITE_ADMIN_UIDS
- [ ] Supabase RLS policies applied
- [ ] Security headers configured

### Database Security (Supabase)
- [ ] Row Level Security enabled on all tables
- [ ] Admin-only policies for file operations
- [ ] Public read-only access for students
- [ ] Audit logging enabled
- [ ] Rate limiting tables created

### File Upload Security
- [ ] File type restrictions enforced
- [ ] File size limits configured (10MB max)
- [ ] Path traversal prevention active
- [ ] Malicious file extension blocking

### API Security
- [ ] API keys rotated regularly
- [ ] Rate limiting configured
- [ ] Error messages don't expose sensitive info
- [ ] CORS properly configured

## Security Monitoring

### Audit Logging
The application logs security events including:
- Admin login attempts
- File upload/delete operations
- Failed authentication attempts
- Rate limit violations

### Recommended Monitoring
- Set up alerts for failed admin logins
- Monitor file upload patterns
- Track API usage and rate limits
- Regular security audits

## Incident Response

### If API Keys Are Compromised
1. Immediately rotate all API keys
2. Update environment variables in deployment
3. Check audit logs for unauthorized access
4. Review and update access controls

### If Admin Account Is Compromised
1. Disable the compromised admin account
2. Remove from VITE_ADMIN_UIDS
3. Review all recent admin actions in audit logs
4. Create new admin account with strong credentials

## Security Updates

### Regular Maintenance
- Update dependencies monthly
- Run `npm audit` before each deployment
- Review and update security policies quarterly
- Monitor security advisories for used packages

### Dependency Security
Current known vulnerabilities:
- esbuild <=0.24.2 (development only, moderate risk)
- Monitor for updates and apply when available

## Contact

For security issues or questions, contact the development team immediately.

**Do not report security vulnerabilities in public issues.**