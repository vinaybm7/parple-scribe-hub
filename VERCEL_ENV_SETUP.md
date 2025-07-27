# Vercel Environment Variables Setup

## Required Environment Variables for Production

To make ElevenLabs API work in production on Vercel, you need to set these environment variables in your Vercel dashboard:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project: `parple-scribe-hub`
- Go to Settings → Environment Variables

### 2. Add These Environment Variables

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_ELEVENLABS_API_KEY` | `sk_98ab9d165671e69015cfa701a96547907ad3394f406cd6ee` | Production, Preview, Development |
| `VITE_ELEVENLABS_LUNA_VOICE_ID` | `BpjGufoPiobT79j2vtj4` | Production, Preview, Development |
| `VITE_ELEVENLABS_ARIA_VOICE_ID` | `jqcCZkN6Knx8BJ5TBdYR` | Production, Preview, Development |
| `VITE_ELEVENLABS_BELLA_VOICE_ID` | `eVItLK1UvXctxuaRV2Oq` | Production, Preview, Development |
| `VITE_SUPABASE_URL` | `https://jeihvobotkaczagquhmy.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaWh2b2JvdGthY3phZ3F1aG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mjc0OTYsImV4cCI6MjA2ODUwMzQ5Nn0.WWXoYrluo1vj-31GVV-t_8HuS4lAxG57t-I2cWrAq_M` | Production, Preview, Development |
| `VITE_GEMINI_API_KEY` | `AIzaSyCP8LBstvGY97T6aGKwedOmJTIgK1zp9qg` | Production, Preview, Development |

### 3. Steps to Add Variables:

1. **Click "Add New"** for each environment variable
2. **Enter the Variable Name** (exactly as shown above)
3. **Enter the Value** (copy from the table above)
4. **Select Environments**: Check all three boxes (Production, Preview, Development)
5. **Click "Save"**

### 4. Redeploy

After adding all environment variables:
1. Go to the "Deployments" tab
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger automatic deployment

### 5. Verify

After redeployment, check the browser console in production. You should see:
- ✅ ElevenLabs voices working for Luna and Aria
- ❌ No more "API key not configured" errors

## Important Notes:

- **VITE_ prefix is required** for Vite to expose variables to the browser
- **All environments** should be selected for each variable
- **Redeploy is required** after adding environment variables
- **Case sensitive** - make sure variable names match exactly

## Troubleshooting:

If still not working:
1. Check Vercel build logs for any errors
2. Verify all variable names are spelled correctly
3. Ensure no extra spaces in values
4. Try redeploying from scratch