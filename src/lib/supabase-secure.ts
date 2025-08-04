import { createClient } from '@supabase/supabase-js'

// SECURE VERSION - No hardcoded fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fail fast if credentials are missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Enable session persistence for admin auth
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// SECURE ADMIN CHECK - Requires actual authentication
export const isAdmin = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.log('No authenticated user found')
      return false
    }
    
    // Get admin UIDs from environment variable
    const adminUIDs = import.meta.env.VITE_ADMIN_UIDS?.split(',') || []
    
    if (adminUIDs.length === 0) {
      console.error('No admin UIDs configured')
      return false
    }
    
    const isUserAdmin = adminUIDs.includes(user.id)
    console.log('Admin check:', { userId: user.id, isAdmin: isUserAdmin })
    
    return isUserAdmin
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// Rate limiting for uploads
const uploadAttempts = new Map<string, { count: number; resetTime: number }>()

export const checkUploadRateLimit = (userIP: string): boolean => {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxUploads = 10 // Max 10 uploads per 15 minutes
  
  const userAttempts = uploadAttempts.get(userIP)
  
  if (!userAttempts || now > userAttempts.resetTime) {
    uploadAttempts.set(userIP, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (userAttempts.count >= maxUploads) {
    console.warn(`Rate limit exceeded for IP: ${userIP}`)
    return false
  }
  
  userAttempts.count++
  return true
}

// Secure file validation
export const validateFileUpload = (file: File): void => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ]
  
  const maxSize = 10 * 1024 * 1024 // 10MB
  const minSize = 1024 // 1KB minimum
  
  // File type validation
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Allowed types: PDF, DOCX, JPG, PNG`)
  }
  
  // File size validation
  if (file.size > maxSize) {
    throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: 10MB`)
  }
  
  if (file.size < minSize) {
    throw new Error('File too small. Minimum size: 1KB')
  }
  
  // File name validation
  const fileName = file.name.toLowerCase()
  
  // Check for path traversal attempts
  if (fileName.includes('../') || fileName.includes('..\\') || fileName.includes('/') || fileName.includes('\\')) {
    throw new Error('Invalid file name: Path traversal detected')
  }
  
  // Check for suspicious extensions
  const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar', '.com', '.pif']
  if (suspiciousExtensions.some(ext => fileName.endsWith(ext))) {
    throw new Error('Invalid file name: Suspicious file extension detected')
  }
  
  // Check file name length
  if (fileName.length > 255) {
    throw new Error('File name too long. Maximum 255 characters allowed')
  }
  
  // Check for empty file name
  if (fileName.trim().length === 0) {
    throw new Error('File name cannot be empty')
  }
}

// Secure upload with admin check and validation
export const uploadFile = async (file: File, path: string) => {
  try {
    // Check if user is admin
    const adminStatus = await isAdmin()
    if (!adminStatus) {
      throw new Error('Unauthorized: Admin access required for file uploads')
    }
    
    // Validate file
    validateFileUpload(file)
    
    // Sanitize path
    const sanitizedPath = path.replace(/[^a-zA-Z0-9\-_./]/g, '_')
    
    console.log('Secure upload attempt:', { 
      fileName: file.name, 
      path: sanitizedPath, 
      size: file.size, 
      type: file.type 
    })
    
    const { data, error } = await supabase.storage
      .from('notes')
      .upload(sanitizedPath, file, {
        cacheControl: '31536000',
        upsert: false,
        duplex: 'half'
      })
    
    if (error) {
      console.error('Secure upload error:', error)
      throw new Error(`Upload failed: ${error.message}`)
    }
    
    console.log('Secure upload successful:', data)
    return { data, error: null }
    
  } catch (err) {
    console.error('Secure upload exception:', err)
    return { data: null, error: err }
  }
}

// Secure delete with admin check
export const deleteFile = async (path: string) => {
  try {
    // Check if user is admin
    const adminStatus = await isAdmin()
    if (!adminStatus) {
      throw new Error('Unauthorized: Admin access required for file deletion')
    }
    
    // Sanitize path
    const sanitizedPath = path.replace(/[^a-zA-Z0-9\-_./]/g, '_')
    
    console.log('Secure delete attempt:', sanitizedPath)
    
    const { data, error } = await supabase.storage
      .from('notes')
      .remove([sanitizedPath])
    
    if (error) {
      console.error('Secure delete error:', error)
      throw new Error(`Delete failed: ${error.message}`)
    }
    
    return { data, error: null }
    
  } catch (err) {
    console.error('Secure delete exception:', err)
    return { data: null, error: err }
  }
}

// Get public URL (safe for public access)
export const getFileUrl = (path: string) => {
  // Sanitize path
  const sanitizedPath = path.replace(/[^a-zA-Z0-9\-_./]/g, '_')
  
  const { data } = supabase.storage
    .from('notes')
    .getPublicUrl(sanitizedPath)
  
  return data.publicUrl
}

// Secure list files with admin check
export const listFiles = async (folder: string = '') => {
  try {
    // Check if user is admin for listing
    const adminStatus = await isAdmin()
    if (!adminStatus) {
      throw new Error('Unauthorized: Admin access required for file listing')
    }
    
    // Sanitize folder path
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9\-_./]/g, '_')
    
    const { data, error } = await supabase.storage
      .from('notes')
      .list(sanitizedFolder)
    
    return { data, error }
    
  } catch (err) {
    console.error('Secure list files exception:', err)
    return { data: null, error: err }
  }
}

// All other functions remain the same but with added security logging
export const saveFileMetadata = async (metadata: any) => {
  try {
    // Check if user is admin
    const adminStatus = await isAdmin()
    if (!adminStatus) {
      throw new Error('Unauthorized: Admin access required for metadata operations')
    }
    
    console.log('Secure metadata save attempt:', metadata.file_path)
    
    const { data, error } = await supabase
      .from('file_metadata')
      .insert([metadata])
      .select()
    
    return { data, error }
  } catch (err) {
    console.error('Secure metadata save exception:', err)
    return { data: null, error: err }
  }
}

// Public functions (safe for student access)
export const getFileMetadata = async (filePath: string) => {
  try {
    const { data, error } = await supabase
      .from('file_metadata')
      .select('*')
      .eq('file_path', filePath)
      .single()
    
    return { data, error }
  } catch (err) {
    console.error('Exception getting file metadata:', err)
    return { data: null, error: err }
  }
}

export const getFileMetadataByCategory = async (year: string, semester: string, subject: string, category: string) => {
  try {
    const { data, error } = await supabase
      .from('file_metadata')
      .select('id, file_path, original_title, file_size, file_type, created_at')
      .eq('year', year)
      .eq('semester', semester)
      .eq('subject', subject)
      .eq('category', category)
      .order('created_at', { ascending: true })
      .limit(50)
    
    return { data, error }
  } catch (err) {
    console.error('Exception getting file metadata by category:', err)
    return { data: null, error: err }
  }
}

export const getAllFileMetadata = async () => {
  try {
    const { data, error } = await supabase
      .from('file_metadata')
      .select('id, file_path, original_title, subject, category, file_size, file_type, created_at, updated_at')
      .order('created_at', { ascending: true })
      .limit(100)
    
    return { data, error }
  } catch (err) {
    console.error('Exception getting all file metadata:', err)
    return { data: null, error: err }
  }
}

// Admin authentication functions
export const signInAdmin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      throw error
    }
    
    // Verify admin status after login
    const adminStatus = await isAdmin()
    if (!adminStatus) {
      await supabase.auth.signOut()
      throw new Error('Access denied: Admin privileges required')
    }
    
    return { data, error: null }
  } catch (err) {
    console.error('Admin sign in error:', err)
    return { data: null, error: err }
  }
}

export const signOutAdmin = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (err) {
    console.error('Admin sign out error:', err)
    return { error: err }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  } catch (err) {
    console.error('Get current user error:', err)
    return { user: null, error: err }
  }
}