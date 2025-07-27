#!/usr/bin/env node

/**
 * Simple script to update ElevenLabs API key when credits run out
 * Usage: node scripts/update-elevenlabs-key.js NEW_API_KEY_HERE
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newApiKey = process.argv[2];

if (!newApiKey) {
  console.error('❌ Please provide a new API key');
  console.log('Usage: node scripts/update-elevenlabs-key.js sk_your_new_api_key_here');
  process.exit(1);
}

if (!newApiKey.startsWith('sk_')) {
  console.error('❌ Invalid API key format. ElevenLabs API keys should start with "sk_"');
  process.exit(1);
}

console.log('🔄 Updating ElevenLabs API key...');

// Update .env file
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(
    /VITE_ELEVENLABS_API_KEY=.*/,
    `VITE_ELEVENLABS_API_KEY=${newApiKey}`
  );
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated .env file');
}

// Update production-env.ts file
const prodEnvPath = path.join(__dirname, '../src/lib/production-env.ts');
if (fs.existsSync(prodEnvPath)) {
  let prodEnvContent = fs.readFileSync(prodEnvPath, 'utf8');
  
  // Add the new key to the pool if it's not already there
  if (!prodEnvContent.includes(newApiKey)) {
    prodEnvContent = prodEnvContent.replace(
      /export const ELEVENLABS_API_KEY_POOL = \[([\s\S]*?)\];/,
      (match, keys) => {
        const cleanKeys = keys.trim();
        const newPool = cleanKeys ? 
          `  '${newApiKey}', // New key added ${new Date().toISOString().split('T')[0]}\n${cleanKeys}` :
          `  '${newApiKey}', // New key added ${new Date().toISOString().split('T')[0]}`;
        return `export const ELEVENLABS_API_KEY_POOL = [\n${newPool}\n];`;
      }
    );
    fs.writeFileSync(prodEnvPath, prodEnvContent);
    console.log('✅ Added new key to production environment pool');
  } else {
    console.log('ℹ️ Key already exists in production pool');
  }
}

console.log('🎉 ElevenLabs API key updated successfully!');
console.log('📝 Next steps:');
console.log('   1. Test locally: npm run dev');
console.log('   2. Update Vercel environment variables:');
console.log(`      - Go to Vercel dashboard → Settings → Environment Variables`);
console.log(`      - Update VITE_ELEVENLABS_API_KEY to: ${newApiKey}`);
console.log('   3. Redeploy: git add . && git commit -m "Update ElevenLabs API key" && git push');