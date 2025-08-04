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

// Get public URL (safe for public access)
export const getFileUrl = (path: string) => {
  // Sanitize path
  const sanitizedPath = path.replace(/[^a-zA-Z0-9\-_./]/g, '_')
  
  console.log('Getting file URL for path:', sanitizedPath)
  
  const { data } = supabase.storage
    .from('notes')
    .getPublicUrl(sanitizedPath)
  
  console.log('Generated public URL:', data.publicUrl)
  
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
    
    console.log('Secure listing files in folder:', sanitizedFolder)
    
    const { data, error } = await supabase.storage
      .from('notes')
      .list(sanitizedFolder)
    
    if (error) {
      console.error('Secure list files error:', error)
    } else {
      console.log('Files found:', data?.length || 0, 'files in', sanitizedFolder)
    }
    
    return { data, error }
    
  } catch (err) {
    console.error('Secure list files exception:', err)
    return { data: null, error: err }
  }
}

// Verify if file exists
export const verifyFileExists = async (path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('notes')
      .list(path.substring(0, path.lastIndexOf('/')), {
        search: path.substring(path.lastIndexOf('/') + 1)
      })
    
    console.log('File verification for:', path, { exists: !error && data && data.length > 0 })
    return !error && data && data.length > 0
  } catch (err) {
    console.error('File verification error:', err)
    return false
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
    
    console.log('Secure delete successful:', data)
    return { data, error: null }
    
  } catch (err) {
    console.error('Secure delete exception:', err)
    return { data: null, error: err }
  }
}

// File metadata interface
export interface FileMetadata {
  id?: string;
  file_path: string;
  original_title: string;
  description?: string;
  subject: string;
  category: string;
  year: string;
  semester: string;
  file_size: number;
  file_type: string;
  created_at?: string;
  updated_at?: string;
}

// Secure save file metadata with admin check
export const saveFileMetadata = async (metadata: FileMetadata) => {
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
    
    if (error) {
      console.error('Secure metadata save error:', error)
      throw new Error(`Metadata save failed: ${error.message}`)
    }
    
    console.log('Secure metadata save successful:', data)
    return { data, error: null }
    
  } catch (err) {
    console.error('Secure metadata save exception:', err)
    return { data: null, error: err }
  }
}

// Get file metadata from database
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

// Get all file metadata for a category (optimized)
export const getFileMetadataByCategory = async (year: string, semester: string, subject: string, category: string) => {
  try {
    const { data, error } = await supabase
      .from('file_metadata')
      .select('id, file_path, original_title, file_size, file_type, created_at') // Select only needed fields
      .eq('year', year)
      .eq('semester', semester)
      .eq('subject', subject)
      .eq('category', category)
      .order('created_at', { ascending: true })
      .limit(50) // Limit results for better performance
    
    return { data, error }
  } catch (err) {
    console.error('Exception getting file metadata by category:', err)
    return { data: null, error: err }
  }
}

// Get all file metadata (for admin dashboard) - optimized
export const getAllFileMetadata = async () => {
  try {
    console.log('Fetching all file metadata from database...')
    
    const { data, error } = await supabase
      .from('file_metadata')
      .select('id, file_path, original_title, subject, category, file_size, file_type, created_at, updated_at') // Select only needed fields
      .order('created_at', { ascending: true })
      .limit(100) // Limit for better performance
    
    if (error) {
      console.error('Error fetching file metadata:', error)
    } else {
      console.log('Successfully fetched file metadata:', data?.length || 0, 'files')
    }
    
    return { data, error }
  } catch (err) {
    console.error('Exception getting all file metadata:', err)
    return { data: null, error: err }
  }
}

// Secure delete file metadata with admin check
export const deleteFileMetadata = async (filePath: string) => {
  try {
    // Check if user is admin
    const adminStatus = await isAdmin()
    if (!adminStatus) {
      throw new Error('Unauthorized: Admin access required for metadata deletion')
    }
    
    console.log('Secure metadata delete attempt:', filePath)
    
    const { data, error } = await supabase
      .from('file_metadata')
      .delete()
      .eq('file_path', filePath)
    
    if (error) {
      console.error('Secure metadata delete error:', error)
      throw new Error(`Metadata delete failed: ${error.message}`)
    }
    
    console.log('Secure metadata delete successful')
    return { data, error: null }
    
  } catch (err) {
    console.error('Secure metadata delete exception:', err)
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
    
    console.log('Admin signed in successfully')
    return { data, error: null }
  } catch (err) {
    console.error('Admin sign in error:', err)
    return { data: null, error: err }
  }
}

export const signOutAdmin = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    console.log('Admin signed out')
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

// Security monitoring function
export const logSecurityEvent = async (event: string, details: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    console.log('Security event:', {
      event,
      details,
      userId: user?.id,
      timestamp: new Date().toISOString()
    })
    
    // In a production environment, you would save this to an audit log table
    // For now, we'll just log to console
  } catch (error) {
    console.error('Error logging security event:', error)
  }
}

// PUBLIC FUNCTIONS - Available to all users (no authentication required)

// Public function to browse files (read-only access)
export const getPublicFileMetadata = async (year?: string, semester?: string, subject?: string, category?: string) => {
  try {
    let query = supabase
      .from('file_metadata')
      .select('id, file_path, original_title, description, subject, category, year, semester, file_size, file_type, created_at')
      .order('created_at', { ascending: true })
      .limit(100)

    // Apply filters if provided
    if (year) query = query.eq('year', year)
    if (semester) query = query.eq('semester', semester)
    if (subject) query = query.eq('subject', subject)
    if (category) query = query.eq('category', category)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching public file metadata:', error)
      return { data: null, error }
    }

    console.log('Public file metadata fetched:', data?.length || 0, 'files')
    return { data, error: null }
  } catch (err) {
    console.error('Exception getting public file metadata:', err)
    return { data: null, error: err }
  }
}

// Public function to get download URL (read-only access)
export const getPublicDownloadUrl = (filePath: string) => {
  try {
    // Sanitize path for security
    const sanitizedPath = filePath.replace(/[^a-zA-Z0-9\-_./]/g, '_')
    
    const { data } = supabase.storage
      .from('notes')
      .getPublicUrl(sanitizedPath)
    
    console.log('Public download URL generated for:', sanitizedPath)
    return data.publicUrl
  } catch (error) {
    console.error('Error generating public download URL:', error)
    return null
  }
}

// Public function to search files (read-only access)
export const searchPublicFiles = async (searchTerm: string, filters?: {
  year?: string
  semester?: string
  subject?: string
  category?: string
}) => {
  try {
    let query = supabase
      .from('file_metadata')
      .select('id, file_path, original_title, description, subject, category, year, semester, file_size, file_type, created_at')
      .or(`original_title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: true })
      .limit(50)

    // Apply additional filters
    if (filters?.year) query = query.eq('year', filters.year)
    if (filters?.semester) query = query.eq('semester', filters.semester)
    if (filters?.subject) query = query.eq('subject', filters.subject)
    if (filters?.category) query = query.eq('category', filters.category)

    const { data, error } = await query

    if (error) {
      console.error('Error searching public files:', error)
      return { data: null, error }
    }

    console.log('Public file search completed:', data?.length || 0, 'results for:', searchTerm)
    return { data, error: null }
  } catch (err) {
    console.error('Exception searching public files:', err)
    return { data: null, error: err }
  }
}

// Public function to get file statistics (read-only access)
export const getPublicFileStats = async () => {
  try {
    const { data, error } = await supabase
      .from('file_metadata')
      .select('subject, category, year, semester, file_size')

    if (error) {
      console.error('Error fetching file stats:', error)
      return { data: null, error }
    }

    // Calculate statistics
    const stats = {
      totalFiles: data?.length || 0,
      totalSize: data?.reduce((sum, file) => sum + (file.file_size || 0), 0) || 0,
      bySubject: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byYear: {} as Record<string, number>
    }

    // Group by subject, category, and year
    data?.forEach(file => {
      if (file.subject) {
        stats.bySubject[file.subject] = (stats.bySubject[file.subject] || 0) + 1
      }
      if (file.category) {
        stats.byCategory[file.category] = (stats.byCategory[file.category] || 0) + 1
      }
      if (file.year) {
        stats.byYear[file.year] = (stats.byYear[file.year] || 0) + 1
      }
    })

    console.log('Public file statistics calculated:', stats)
    return { data: stats, error: null }
  } catch (err) {
    console.error('Exception getting file statistics:', err)
    return { data: null, error: err }
  }
}

// ADMIN-ONLY FUNCTIONS - Require authentication and admin privileges

// Note: All existing functions (uploadFile, deleteFile, saveFileMetadata, etc.) 
// already have admin checks and are only available to authenticated admins

// Function to check if current user has admin access (for UI purposes)
export const checkAdminAccess = async () => {
  try {
    const adminStatus = await isAdmin()
    const { user } = await getCurrentUser()
    
    return {
      isAdmin: adminStatus,
      user: user,
      hasUploadAccess: adminStatus,
      hasDeleteAccess: adminStatus,
      hasManageAccess: adminStatus
    }
  } catch (error) {
    console.error('Error checking admin access:', error)
    return {
      isAdmin: false,
      user: null,
      hasUploadAccess: false,
      hasDeleteAccess: false,
      hasManageAccess: false
    }
  }
}