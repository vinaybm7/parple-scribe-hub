#!/usr/bin/env node

// Script to inject environment variables into the build for Vercel
const fs = require('fs');
const path = require('path');

console.log('🔧 Injecting environment variables for production build...');

// Environment variables to inject
const envVars = {
  VITE_ELEVENLABS_API_KEY: process.env.VITE_ELEVENLABS_API_KEY,
  VITE_ELEVENLABS_LUNA_VOICE_ID: process.env.VITE_ELEVENLABS_LUNA_VOICE_ID,
  VITE_ELEVENLABS_ARIA_VOICE_ID: process.env.VITE_ELEVENLABS_ARIA_VOICE_ID,
  VITE_ELEVENLABS_BELLA_VOICE_ID: process.env.VITE_ELEVENLABS_BELLA_VOICE_ID,
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
  VITE_GEMINI_API_KEY: process.env.VITE_GEMINI_API_KEY
};

// Log environment variable status
console.log('Environment variables status:');
Object.keys(envVars).forEach(key => {
  const value = envVars[key];
  console.log(`  ${key}: ${value ? '✅ Set' : '❌ Missing'}`);
});

// Create env-config.js with actual values
const envConfigPath = path.join(__dirname, '../public/env-config.js');
let envConfigContent = fs.readFileSync(envConfigPath, 'utf8');

// Replace placeholders with actual values
Object.keys(envVars).forEach(key => {
  const value = envVars[key];
  if (value) {
    const placeholder = `%${key}%`;
    envConfigContent = envConfigContent.replace(new RegExp(placeholder, 'g'), value);
    console.log(`🔧 Replaced ${placeholder} with actual value`);
  }
});

// Write the updated file
fs.writeFileSync(envConfigPath, envConfigContent);
console.log('✅ Environment variables injected successfully');