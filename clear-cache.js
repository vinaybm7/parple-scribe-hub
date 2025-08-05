#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 Clearing development cache...');

// Clear Vite cache
const viteCacheDir = path.join(__dirname, 'node_modules', '.vite');
if (fs.existsSync(viteCacheDir)) {
  fs.rmSync(viteCacheDir, { recursive: true, force: true });
  console.log('✅ Cleared Vite cache');
}

// Clear dist directory
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log('✅ Cleared dist directory');
}

console.log('🎉 Cache cleared successfully!');
console.log('');
console.log('📝 Next steps:');
console.log('1. Clear your browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)');
console.log('2. Or open an incognito/private window');
console.log('3. Run: npm run dev');
console.log('');
console.log('💡 If issues persist, try:');
console.log('- Disable any browser extensions');
console.log('- Check if any service workers are registered in DevTools > Application > Service Workers');