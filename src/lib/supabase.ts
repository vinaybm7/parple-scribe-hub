import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jeihvobotkaczagquhmy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaWh2b2JvdGthY3phZ3F1aG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mjc0OTYsImV4cCI6MjA2ODUwMzQ5Nn0.WWXoYrluo1vj-31GVV-t_8HuS4lAxG57t-I2cWrAq_M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
})

// Simple admin check - always returns true for Option A
export const isAdmin = async () => {
  return true // Simple URL-based access - anyone with the URL can access
}

// Upload file to Supabase Storage
export const uploadFile = async (file: File, path: string) => {
  try {
    console.log('Uploading file:', { fileName: file.name, path, size: file.size, type: file.type })
    
    const { data, error } = await supabase.storage
      .from('notes')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      console.error('Upload error details:', error)
    } else {
      console.log('Upload successful:', data)
    }
    
    return { data, error }
  } catch (err) {
    console.error('Upload exception:', err)
    return { data: null, error: err }
  }
}

// Get public URL for file
export const getFileUrl = (path: string) => {
  console.log('Getting file URL for path:', path)
  
  const { data } = supabase.storage
    .from('notes')
    .getPublicUrl(path)
  
  console.log('Generated public URL:', data.publicUrl)
  
  return data.publicUrl
}

// List files in a folder
export const listFiles = async (folder: string = '') => {
  console.log('Listing files in folder:', folder)
  
  const { data, error } = await supabase.storage
    .from('notes')
    .list(folder)
  
  if (error) {
    console.error('List files error:', error)
  } else {
    console.log('Files found:', data?.length || 0, 'files in', folder)
    console.log('File details:', data?.map(f => ({ name: f.name, size: f.metadata?.size })))
  }
  
  return { data, error }
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

// Delete file
export const deleteFile = async (path: string) => {
  const { data, error } = await supabase.storage
    .from('notes')
    .remove([path])
  
  return { data, error }
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

// Save file metadata to database
export const saveFileMetadata = async (metadata: FileMetadata) => {
  try {
    const { data, error } = await supabase
      .from('file_metadata')
      .insert([metadata])
      .select()
    
    if (error) {
      console.error('Error saving file metadata:', error)
    } else {
      console.log('File metadata saved:', data)
    }
    
    return { data, error }
  } catch (err) {
    console.error('Exception saving file metadata:', err)
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

// Get all file metadata for a category
export const getFileMetadataByCategory = async (year: string, semester: string, subject: string, category: string) => {
  try {
    const { data, error } = await supabase
      .from('file_metadata')
      .select('*')
      .eq('year', year)
      .eq('semester', semester)
      .eq('subject', subject)
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    return { data, error }
  } catch (err) {
    console.error('Exception getting file metadata by category:', err)
    return { data: null, error: err }
  }
}

// Get all file metadata (for admin dashboard)
export const getAllFileMetadata = async () => {
  try {
    const { data, error } = await supabase
      .from('file_metadata')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  } catch (err) {
    console.error('Exception getting all file metadata:', err)
    return { data: null, error: err }
  }
}

// Delete file metadata
export const deleteFileMetadata = async (filePath: string) => {
  try {
    const { data, error } = await supabase
      .from('file_metadata')
      .delete()
      .eq('file_path', filePath)
    
    return { data, error }
  } catch (err) {
    console.error('Exception deleting file metadata:', err)
    return { data: null, error: err }
  }
}