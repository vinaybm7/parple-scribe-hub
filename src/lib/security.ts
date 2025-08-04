// Security utilities for input validation and sanitization

// HTML sanitization to prevent XSS
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// SQL injection prevention
export const sanitizeSqlInput = (input: string): string => {
  return input
    .replace(/'/g, "''")
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
};

// File path sanitization to prevent directory traversal
export const sanitizeFilePath = (path: string): string => {
  return path
    .replace(/\.\./g, '')
    .replace(/[<>:"|?*]/g, '_')
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/')
    .trim();
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validate file upload
export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  const minSize = 1024; // 1KB
  
  // File type validation
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type: ${file.type}. Allowed types: PDF, DOCX, JPG, PNG`
    };
  }
  
  // File size validation
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: 10MB`
    };
  }
  
  if (file.size < minSize) {
    return {
      isValid: false,
      error: 'File too small. Minimum size: 1KB'
    };
  }
  
  // File name validation
  const fileName = file.name.toLowerCase();
  
  // Check for path traversal attempts
  if (fileName.includes('../') || fileName.includes('..\\')) {
    return {
      isValid: false,
      error: 'Invalid file name: Path traversal detected'
    };
  }
  
  // Check for suspicious extensions
  const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar', '.com', '.pif'];
  if (suspiciousExtensions.some(ext => fileName.endsWith(ext))) {
    return {
      isValid: false,
      error: 'Invalid file name: Suspicious file extension detected'
    };
  }
  
  // Check file name length
  if (fileName.length > 255) {
    return {
      isValid: false,
      error: 'File name too long. Maximum 255 characters allowed'
    };
  }
  
  // Check for empty file name
  if (fileName.trim().length === 0) {
    return {
      isValid: false,
      error: 'File name cannot be empty'
    };
  }
  
  return { isValid: true };
};

// Rate limiting helper
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export const checkRateLimit = (
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean => {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= maxRequests) {
    return false;
  }
  
  entry.count++;
  return true;
};

// Content Security Policy headers
export const getCSPHeader = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://*.unicornstudio.com https://*.hiunicornstudio.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' blob:",
    "connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com https://api.elevenlabs.io https://*.unicornstudio.com https://*.hiunicornstudio.com https://storage.googleapis.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "worker-src 'self' blob:",
    "child-src 'self' blob:"
  ].join('; ');
};

// Security headers for production
export const getSecurityHeaders = () => {
  return {
    'Content-Security-Policy': getCSPHeader(),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };
};

// Validate environment variables on startup
export const validateEnvironmentVariables = (): void => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_ADMIN_UIDS',
    'VITE_GEMINI_API_KEY',
    'VITE_ELEVENLABS_API_KEY'
  ];
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Log security events
export const logSecurityEvent = (event: string, details: any): void => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // In production, this should be sent to a security monitoring service
  console.warn('SECURITY EVENT:', logEntry);
};