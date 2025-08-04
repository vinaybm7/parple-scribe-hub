import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { validateEnvironmentVariables } from './lib/security'

// Initialize security checks
try {
  validateEnvironmentVariables();
} catch (error) {
  console.error('Security initialization failed:', error);
  // In production, you might want to show an error page instead
}

createRoot(document.getElementById("root")!).render(<App />);
