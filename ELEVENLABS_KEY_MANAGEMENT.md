# ElevenLabs API Key Management Guide

## 🔄 Quick Key Rotation (When Credits Run Out)

### Method 1: Automated Script (Recommended)
```bash
# Run this command with your new API key
node scripts/update-elevenlabs-key.js sk_your_new_api_key_here
```

This script will:
- ✅ Update your local `.env` file
- ✅ Add the new key to the production key pool
- ✅ Show you next steps for Vercel deployment

### Method 2: Manual Update

1. **Update Local Environment**
   ```bash
   # Edit .env file
   VITE_ELEVENLABS_API_KEY=sk_your_new_api_key_here
   ```

2. **Update Production Key Pool**
   - Edit `src/lib/production-env.ts`
   - Add your new key to the `ELEVENLABS_API_KEY_POOL` array:
   ```typescript
   export const ELEVENLABS_API_KEY_POOL = [
     'sk_your_new_api_key_here', // New key
     'sk_98ab9d165671e69015cfa701a96547907ad3394f406cd6ee', // Old key
   ];
   ```

3. **Update Vercel Environment Variables**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project → Settings → Environment Variables
   - Update `VITE_ELEVENLABS_API_KEY` with the new key
   - Click "Save"

4. **Deploy Changes**
   ```bash
   git add .
   git commit -m "Update ElevenLabs API key"
   git push origin main
   ```

## 🔧 Advanced Features

### Automatic Key Rotation
The system automatically tries multiple API keys if one fails:
- ✅ Tries environment variable first
- ✅ Falls back to key pool if env var fails
- ✅ Marks failed keys to avoid retrying
- ✅ Automatically resets failed keys (in case credits were refilled)

### Multiple Key Pool
You can add multiple backup keys to `ELEVENLABS_API_KEY_POOL`:
```typescript
export const ELEVENLABS_API_KEY_POOL = [
  'sk_primary_key_here',
  'sk_backup_key_1_here',
  'sk_backup_key_2_here',
  // Add more keys as needed
];
```

### Credit Monitoring
The system logs API key usage and failures:
- 🔍 Check browser console for key rotation logs
- ⚠️ Failed keys are automatically marked and skipped
- 🔄 System retries with next available key

## 📋 Troubleshooting

### "All API keys have failed"
1. Check if all your keys have run out of credits
2. Add a new key with credits to the pool
3. The system will automatically reset and try again

### Key not working in production
1. Verify the key is added to Vercel environment variables
2. Check that the key is in the production key pool
3. Redeploy the application after changes

### Local vs Production keys
- **Local**: Uses `.env` file
- **Production**: Uses Vercel environment variables + key pool fallback

## 🎯 Best Practices

1. **Keep Multiple Keys**: Always have 2-3 backup keys ready
2. **Monitor Credits**: Check ElevenLabs dashboard regularly
3. **Update Immediately**: Don't wait for keys to completely run out
4. **Test Locally**: Always test new keys locally first
5. **Document Changes**: Use descriptive commit messages

## 🚀 Quick Commands

```bash
# Update API key (automated)
node scripts/update-elevenlabs-key.js sk_new_key_here

# Test locally
npm run dev

# Deploy to production
git add . && git commit -m "Update ElevenLabs API key" && git push

# Check key status in browser console
# Look for: "🔧 Using ElevenLabs API key from pool"
```

## 📞 Emergency Fallback

If all else fails, the system will:
1. Fall back to browser text-to-speech
2. Continue working without ElevenLabs voices
3. Log detailed error information for debugging

This ensures your app never completely breaks due to API key issues!