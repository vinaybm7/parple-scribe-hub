// Production environment configuration fallback
// This script will be loaded in production to ensure environment variables are available
(function() {
  console.log('🔧 Loading production environment configuration...');
  
  // Check if environment variables are available
  const envVars = {
    VITE_ELEVENLABS_API_KEY: '%VITE_ELEVENLABS_API_KEY%',
    VITE_ELEVENLABS_LUNA_VOICE_ID: '%VITE_ELEVENLABS_LUNA_VOICE_ID%',
    VITE_ELEVENLABS_ARIA_VOICE_ID: '%VITE_ELEVENLABS_ARIA_VOICE_ID%',
    VITE_ELEVENLABS_BELLA_VOICE_ID: '%VITE_ELEVENLABS_BELLA_VOICE_ID%',
    VITE_SUPABASE_URL: '%VITE_SUPABASE_URL%',
    VITE_SUPABASE_ANON_KEY: '%VITE_SUPABASE_ANON_KEY%',
    VITE_GEMINI_API_KEY: '%VITE_GEMINI_API_KEY%'
  };
  
  // Create global environment object
  window.__ENV__ = {};
  
  // Process environment variables
  Object.keys(envVars).forEach(key => {
    const value = envVars[key];
    // Only set if the value is not a placeholder
    if (value && !value.startsWith('%') && !value.endsWith('%')) {
      window.__ENV__[key] = value;
      console.log(`🔧 Set ${key} from production config`);
    }
  });
  
  console.log('🔧 Production environment configuration loaded:', Object.keys(window.__ENV__));
})();