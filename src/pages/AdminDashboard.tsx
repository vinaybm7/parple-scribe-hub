import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecureAdminWrapper from "@/components/SecureAdminWrapper";
import { Upload, FileText, Trash2, Download, Eye, AlertCircle, CheckCircle, X } from "lucide-react";
import ElevenLabsKeyManager from "@/components/admin/ElevenLabsKeyManager";
import { supabase, uploadFile, getFileUrl, listFiles, deleteFile, isAdmin, saveFileMetadata, getAllFileMetadata, deleteFileMetadata, FileMetadata, validateFileUpload, logSecurityEvent } from "@/lib/supabase";
import { CATEGORIES, getCategoryOptions } from "@/lib/categories";
import { showSuccessToast, showErrorToast, showLoadingToast } from "@/lib/toast";
import toast from "react-hot-toast";
import imageCompression from 'browser-image-compression';

interface UploadedFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
  fullPath?: string;
  displayName?: string;
  description?: string;
  subject?: string;
  category?: string;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'batch'>('single');
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    subject: "",
    semester: "",
    year: "",
    category: "modules"
  });
  const [batchUploadForm, setBatchUploadForm] = useState({
    subject: "",
    semester: "",
    year: "",
    category: "modules",
    commonDescription: ""
  });
  const [batchFileData, setBatchFileData] = useState<Array<{file: File, title: string, description: string}>>([]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  // Advanced filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Map of semester to subjects
  const semesterToSubjects: Record<string, string[]> = {
    '1': ["Scientific Foundation of Health & Wellness", "POP", "Physics", "Nano Technology", "Maths - I", "IOT", "Indian Constitution", "IE Electronics", "English - I", "Cyber Security", "Cloud Computing", "Civil", "C Programming", "AI"],
    '2': ["Web Dev", "Python", "Mini Project", "Mechanical", "Maths - II", "Java", "English - II", "Electrical", "Civil", "Chemistry", "C++", "Samskruthi Kannada", "Balake Kannada", "Basic Electronics"],
    '3': [],
    '4': [],
    '5': [],
    '6': [],
    '7': [],
    '8': []
  };

  // Get subjects based on selected semester
  const getSubjectsForSemester = (semester: string) => {
    return semesterToSubjects[semester] || [];
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      // Get all file metadata from database
      const { data: fileMetadata, error } = await getAllFileMetadata();
      if (error) throw error;
      
      // Convert database metadata to UploadedFile format
      const allFiles: UploadedFile[] = (fileMetadata || []).map((metadata) => ({
        name: metadata.file_path.split('/').pop() || '',
        id: metadata.id || '',
        updated_at: metadata.updated_at || '',
        created_at: metadata.created_at || '',
        last_accessed_at: metadata.created_at || '',
        metadata: {
          size: metadata.file_size,
          mimetype: metadata.file_type
        },
        fullPath: metadata.file_path,
        displayName: metadata.original_title, // Use the original title from database
        subject: metadata.subject,
        category: metadata.category
      }));
      
      setFiles(allFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      showErrorToast('Failed to load files');
    }
  };

  const validateFile = (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showErrorToast('Please select a PDF, DOCX, or image file');
      return false;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      showErrorToast('File size must be less than 10MB');
      return false;
    }
    
    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadMode === 'single') {
      const file = event.target.files?.[0];
      if (file && validateFile(file)) {
        setSelectedFile(file);
      }
    } else {
      const files = Array.from(event.target.files || []);
      const validFiles = files.filter(validateFile);
      setSelectedFiles(validFiles);
      setBatchFileData(validFiles.map(file => ({
        file,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        description: batchUploadForm.commonDescription
      })));
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (uploadMode === 'single' && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    } else if (uploadMode === 'batch' && files.length > 0) {
      const validFiles = files.filter(validateFile);
      setSelectedFiles(validFiles);
      setBatchFileData(validFiles.map(file => ({
        file,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        description: batchUploadForm.commonDescription
      })));
    }
  }, [uploadMode, batchUploadForm.commonDescription]);

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const removeBatchFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newFileData = batchFileData.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setBatchFileData(newFileData);
  };

  const updateBatchFileData = (index: number, field: 'title' | 'description', value: string) => {
    const newFileData = [...batchFileData];
    newFileData[index][field] = value;
    setBatchFileData(newFileData);
  };

  // Helper to upload file with simulated progress
  const uploadFileWithProgress = async (file: File, path: string, onProgress: (percent: number) => void) => {
    // Supabase does not support native progress events, so we simulate progress
    return new Promise<{ data: any, error: any }>(async (resolve) => {
      let fakeProgress = 0;
      onProgress(0);
      const fakeInterval = setInterval(() => {
        fakeProgress += Math.random() * 10 + 5;
        if (fakeProgress >= 90) {
          clearInterval(fakeInterval);
        } else {
          onProgress(Math.min(90, fakeProgress));
        }
      }, 150);
      const { data, error } = await uploadFile(file, path);
      clearInterval(fakeInterval);
      onProgress(100);
      resolve({ data, error });
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadForm.title || !uploadForm.subject || !uploadForm.semester || !uploadForm.year) {
      showErrorToast('Please fill in all required fields and select a file');
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    const loadingToast = showLoadingToast('Uploading file...');
    try {
      // Compress image if needed
      let fileToUpload = selectedFile;
      if (selectedFile.type.startsWith('image/')) {
        fileToUpload = await imageCompression(selectedFile, { maxSizeMB: 2, maxWidthOrHeight: 1920 });
      }
      // Create file path
      const sanitizedTitle = uploadForm.title.replace(/[<>:"/\\|?*]/g, '');
      const fileName = `${sanitizedTitle}__TIMESTAMP__${Date.now()}.${fileToUpload.name.split('.').pop()}`;
      const filePath = `year-${uploadForm.year}/semester-${uploadForm.semester}/${uploadForm.subject}/${uploadForm.category}/${fileName}`;
      // Upload with simulated progress
      const { data, error } = await uploadFileWithProgress(fileToUpload, filePath, setUploadProgress);
      if (error) throw error;
      // Save file metadata
      const metadata: FileMetadata = {
        file_path: filePath,
        original_title: uploadForm.title,
        description: uploadForm.description,
        subject: uploadForm.subject,
        category: uploadForm.category,
        year: uploadForm.year,
        semester: uploadForm.semester,
        file_size: fileToUpload.size,
        file_type: fileToUpload.type
      };
      await saveFileMetadata(metadata);
      setSelectedFile(null);
      setUploadForm({ title: "", description: "", subject: "", semester: "", year: "", category: "modules" });
      loadFiles();
      toast.dismiss(loadingToast);
      showSuccessToast('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.dismiss(loadingToast);
      showErrorToast('Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleBatchUpload = async () => {
    if (!batchFileData.length || !batchUploadForm.subject || !batchUploadForm.semester || !batchUploadForm.year) {
      showErrorToast('Please fill in all required fields and select files');
      return;
    }

    // Check if all files have titles
    const missingTitles = batchFileData.some(item => !item.title.trim());
    if (missingTitles) {
      showErrorToast('Please provide titles for all files');
      return;
    }

    setUploading(true);
    const loadingToast = showLoadingToast(`Uploading ${batchFileData.length} files...`);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < batchFileData.length; i++) {
        const { file, title, description } = batchFileData[i];
        setUploadProgress(Math.round(((i + 1) / batchFileData.length) * 100));

        try {
          // Compress image if needed
          let fileToUpload = file;
          if (file.type.startsWith('image/')) {
            fileToUpload = await imageCompression(file, { maxSizeMB: 2, maxWidthOrHeight: 1920 });
          }

          // Create file path
          const sanitizedTitle = title.replace(/[<>:"/\\|?*]/g, '');
          const fileName = `${sanitizedTitle}__TIMESTAMP__${Date.now()}.${fileToUpload.name.split('.').pop()}`;
          const filePath = `year-${batchUploadForm.year}/semester-${batchUploadForm.semester}/${batchUploadForm.subject}/${batchUploadForm.category}/${fileName}`;

          // Upload file
          const { data, error } = await uploadFile(fileToUpload, filePath);
          if (error) throw error;

          // Save file metadata
          const metadata: FileMetadata = {
            file_path: filePath,
            original_title: title,
            description: description || batchUploadForm.commonDescription,
            subject: batchUploadForm.subject,
            category: batchUploadForm.category,
            year: batchUploadForm.year,
            semester: batchUploadForm.semester,
            file_size: fileToUpload.size,
            file_type: fileToUpload.type
          };
          await saveFileMetadata(metadata);
          successCount++;
        } catch (error) {
          console.error(`Error uploading ${title}:`, error);
          errorCount++;
        }
      }

      // Reset form
      setSelectedFiles([]);
      setBatchFileData([]);
      setBatchUploadForm({ subject: "", semester: "", year: "", category: "modules", commonDescription: "" });
      loadFiles();
      toast.dismiss(loadingToast);

      if (errorCount === 0) {
        showSuccessToast(`All ${successCount} files uploaded successfully!`);
      } else {
        showErrorToast(`${successCount} files uploaded, ${errorCount} failed`);
      }
    } catch (error) {
      console.error('Batch upload error:', error);
      toast.dismiss(loadingToast);
      showErrorToast('Batch upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      console.log('Deleting file:', fileName);
      
      // Delete file from storage
      const { error: storageError } = await deleteFile(fileName);
      if (storageError) {
        console.error('Storage delete error:', storageError);
        throw storageError;
      }
      
      // Delete metadata from database
      const { error: metadataError } = await deleteFileMetadata(fileName);
      if (metadataError) {
        console.error('Metadata delete error:', metadataError);
        throw metadataError;
      }
      
      console.log('File and metadata deleted successfully');
      loadFiles();
      showSuccessToast('File deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      showErrorToast('Failed to delete file');
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper functions for file management
  const getYearFromPath = (path?: string) => {
    if (!path) return 'N/A';
    const match = path.match(/year-(\d+)/);
    return match ? match[1] : 'N/A';
  };

  const getSemesterFromPath = (path?: string) => {
    if (!path) return 'N/A';
    const match = path.match(/semester-(\d+)/);
    return match ? match[1] : 'N/A';
  };

  const getCategoryName = (categoryId?: string) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId || 'Unknown';
  };

  // Get unique subjects for filter dropdown
  const uniqueSubjects = [...new Set(files.map(file => file.subject).filter(Boolean))];

  // Advanced filtering logic
  const filteredFiles = files.filter(file => {
    // Search filter
    if (searchTerm && !file.displayName?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Year filter
    if (filterYear !== 'all' && getYearFromPath(file.fullPath) !== filterYear) {
      return false;
    }
    
    // Subject filter
    if (filterSubject !== 'all' && file.subject !== filterSubject) {
      return false;
    }
    
    // Category filter
    if (filterCategory !== 'all' && file.category !== filterCategory) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage study materials and notes</p>
        </div>

        {/* File Management Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">File Management Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200 border-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{files.length}</p>
                    <p className="text-sm text-muted-foreground">Total Files</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              const categoryCount = files.filter(f => f.category === category.id).length;
              return (
                <Card key={category.id} className={`${category.color.bg} ${category.color.border} border-2`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${category.color.icon} flex items-center justify-center`}>
                        <IconComponent className={`h-5 w-5 ${category.color.text}`} />
                      </div>
                      <div>
                        <p className={`text-2xl font-bold ${category.color.text}`}>{categoryCount}</p>
                        <p className="text-sm text-muted-foreground">{category.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {alert && (
          <Alert className={`mb-6 ${alert.type === 'error' ? 'border-destructive' : 'border-green-500'}`}>
            {alert.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="manage">Manage Files</TabsTrigger>
            <TabsTrigger value="elevenlabs">ElevenLabs Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Study Material
                </CardTitle>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant={uploadMode === 'single' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setUploadMode('single');
                      setSelectedFiles([]);
                      setBatchFileData([]);
                    }}
                  >
                    Single Upload
                  </Button>
                  <Button
                    variant={uploadMode === 'batch' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setUploadMode('batch');
                      setSelectedFile(null);
                    }}
                  >
                    Batch Upload
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {uploadMode === 'single' ? (
                  /* Single Upload Form */
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Calculus Chapter 1"
                          value={uploadForm.title}
                          onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="year">Year *</Label>
                        <Select 
                          value={uploadForm.year} 
                          onValueChange={(value) => {
                            setUploadForm({
                              ...uploadForm, 
                              year: value, 
                              semester: "", 
                              subject: ""
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st Year</SelectItem>
                            <SelectItem value="2">2nd Year</SelectItem>
                            <SelectItem value="3">3rd Year</SelectItem>
                            <SelectItem value="4">4th Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="semester">Semester *</Label>
                        <Select 
                          value={uploadForm.semester} 
                          onValueChange={(value) => {
                            setUploadForm({
                              ...uploadForm, 
                              semester: value, 
                              subject: ""
                            });
                          }}
                          disabled={!uploadForm.year}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {uploadForm.year === "1" && (
                              <>
                                <SelectItem value="1">Physics cycle</SelectItem>
                                <SelectItem value="2">Chemistry cycle</SelectItem>
                              </>
                            )}
                            {uploadForm.year === "2" && (
                              <>
                                <SelectItem value="3">3rd Semester</SelectItem>
                                <SelectItem value="4">4th Semester</SelectItem>
                              </>
                            )}
                            {uploadForm.year === "3" && (
                              <>
                                <SelectItem value="5">5th Semester</SelectItem>
                                <SelectItem value="6">6th Semester</SelectItem>
                              </>
                            )}
                            {uploadForm.year === "4" && (
                              <>
                                <SelectItem value="7">7th Semester</SelectItem>
                                <SelectItem value="8">8th Semester</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Select value={uploadForm.subject} onValueChange={(value) => setUploadForm({...uploadForm, subject: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {uploadForm.semester && getSubjectsForSemester(uploadForm.semester).map((subject, index) => (
                              <SelectItem key={`${subject}-${index}`} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={uploadForm.category} onValueChange={(value) => setUploadForm({...uploadForm, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {getCategoryOptions().map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the material..."
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>File *</Label>
                      
                      {/* Drag and Drop Zone */}
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                          isDragOver
                            ? 'border-primary bg-primary/5 scale-105'
                            : selectedFile
                            ? 'border-green-300 bg-green-50'
                            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        {selectedFile ? (
                          // Selected File Display
                          <div className="space-y-4">
                            <div className="flex items-center justify-center gap-3">
                              <FileText className="h-12 w-12 text-green-600" />
                              <div className="text-left">
                                <p className="font-medium text-foreground">{selectedFile.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatFileSize(selectedFile.size)} • {selectedFile.type.split('/')[1].toUpperCase()}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={removeSelectedFile}
                                className="ml-auto"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-green-600 font-medium">✓ File ready for upload</p>
                          </div>
                        ) : (
                          // Drag and Drop Interface
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <Upload className={`h-12 w-12 transition-colors ${
                                isDragOver ? 'text-primary' : 'text-muted-foreground'
                              }`} />
                            </div>
                            <div className="space-y-2">
                              <p className={`text-lg font-medium transition-colors ${
                                isDragOver ? 'text-primary' : 'text-foreground'
                              }`}>
                                {isDragOver ? 'Drop your file here' : 'Drag and drop your file here'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                or click to browse files
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Supports PDF, DOCX, JPG, PNG (max 10MB)
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Hidden File Input */}
                        <input
                          type="file"
                          accept=".pdf,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleUpload} 
                      disabled={uploading || !selectedFile}
                      className="w-full"
                    >
                      {uploading ? `Uploading... (${uploadProgress}%)` : "Upload File"}
                    </Button>
                    {uploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Batch Upload Form */
                  <div className="space-y-6 border-t pt-6">
                    <h3 className="text-lg font-semibold">Batch Upload - Common Settings</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="batch-year">Year *</Label>
                        <Select 
                          value={batchUploadForm.year} 
                          onValueChange={(value) => {
                            setBatchUploadForm({
                              ...batchUploadForm, 
                              year: value, 
                              semester: "", 
                              subject: ""
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st Year</SelectItem>
                            <SelectItem value="2">2nd Year</SelectItem>
                            <SelectItem value="3">3rd Year</SelectItem>
                            <SelectItem value="4">4th Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="batch-semester">Semester *</Label>
                        <Select 
                          value={batchUploadForm.semester} 
                          onValueChange={(value) => {
                            setBatchUploadForm({
                              ...batchUploadForm, 
                              semester: value, 
                              subject: ""
                            });
                          }}
                          disabled={!batchUploadForm.year}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {batchUploadForm.year === "1" && (
                              <>
                                <SelectItem value="1">Physics cycle</SelectItem>
                                <SelectItem value="2">Chemistry cycle</SelectItem>
                              </>
                            )}
                            {batchUploadForm.year === "2" && (
                              <>
                                <SelectItem value="3">3rd Semester</SelectItem>
                                <SelectItem value="4">4th Semester</SelectItem>
                              </>
                            )}
                            {batchUploadForm.year === "3" && (
                              <>
                                <SelectItem value="5">5th Semester</SelectItem>
                                <SelectItem value="6">6th Semester</SelectItem>
                              </>
                            )}
                            {batchUploadForm.year === "4" && (
                              <>
                                <SelectItem value="7">7th Semester</SelectItem>
                                <SelectItem value="8">8th Semester</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="batch-subject">Subject *</Label>
                        <Select value={batchUploadForm.subject} onValueChange={(value) => setBatchUploadForm({...batchUploadForm, subject: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {batchUploadForm.semester && getSubjectsForSemester(batchUploadForm.semester).map((subject, index) => (
                              <SelectItem key={`${subject}-${index}`} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="batch-category">Category *</Label>
                        <Select value={batchUploadForm.category} onValueChange={(value) => setBatchUploadForm({...batchUploadForm, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {getCategoryOptions().map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batch-description">Common Description (Optional)</Label>
                      <Textarea
                        id="batch-description"
                        placeholder="Description that will be applied to all files (can be overridden per file)..."
                        value={batchUploadForm.commonDescription}
                        onChange={(e) => setBatchUploadForm({...batchUploadForm, commonDescription: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Files *</Label>
                      
                      {/* Drag and Drop Zone for Multiple Files */}
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                          isDragOver
                            ? 'border-primary bg-primary/5 scale-105'
                            : selectedFiles.length > 0
                            ? 'border-green-300 bg-green-50'
                            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        {selectedFiles.length > 0 ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-center gap-3">
                              <FileText className="h-12 w-12 text-green-600" />
                              <div className="text-left">
                                <p className="font-medium text-foreground">{selectedFiles.length} files selected</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatFileSize(selectedFiles.reduce((total, file) => total + file.size, 0))} total
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-green-600 font-medium">✓ Files ready for batch upload</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <Upload className={`h-12 w-12 transition-colors ${
                                isDragOver ? 'text-primary' : 'text-muted-foreground'
                              }`} />
                            </div>
                            <div className="space-y-2">
                              <p className={`text-lg font-medium transition-colors ${
                                isDragOver ? 'text-primary' : 'text-foreground'
                              }`}>
                                {isDragOver ? 'Drop your files here' : 'Drag and drop multiple files here'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                or click to browse files
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Supports PDF, DOCX, JPG, PNG (max 10MB each)
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Hidden File Input for Multiple Files */}
                        <input
                          type="file"
                          accept=".pdf,.docx,.jpg,.jpeg,.png"
                          multiple
                          onChange={handleFileSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* File List with Individual Titles */}
                    {batchFileData.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-medium">Individual File Settings</h4>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {batchFileData.map((fileData, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-6 w-6 text-primary" />
                                  <div>
                                    <p className="font-medium text-sm">{fileData.file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatFileSize(fileData.file.size)}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeBatchFile(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <Label className="text-xs">Title *</Label>
                                  <Input
                                    placeholder="Enter title for this file"
                                    value={fileData.title}
                                    onChange={(e) => updateBatchFileData(index, 'title', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">Description (Optional)</Label>
                                  <Input
                                    placeholder="Custom description or leave empty for common"
                                    value={fileData.description}
                                    onChange={(e) => updateBatchFileData(index, 'description', e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={handleBatchUpload} 
                      disabled={uploading || !batchFileData.length}
                      className="w-full"
                    >
                      {uploading ? `Uploading... (${uploadProgress}%)` : `Upload ${batchFileData.length} Files`}
                    </Button>
                    {uploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  File Management ({files.length} files)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Advanced Filters */}
                <div className="mb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Search Files</Label>
                      <Input
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Filter by Year</Label>
                      <Select value={filterYear} onValueChange={setFilterYear}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Years" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Years</SelectItem>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Filter by Subject</Label>
                      <Select value={filterSubject} onValueChange={setFilterSubject}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          {uniqueSubjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Filter by Category</Label>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Clear Filters */}
                  {(searchTerm || filterYear !== 'all' || filterSubject !== 'all' || filterCategory !== 'all') && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSearchTerm('');
                        setFilterYear('all');
                        setFilterSubject('all');
                        setFilterCategory('all');
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>

                {/* File List */}
                {filteredFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {files.length === 0 ? 'No files uploaded yet' : 'No files match your filters'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredFiles.map((file) => (
                      <div key={file.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <FileText className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              {/* File Title */}
                              <h3 className="font-semibold text-foreground text-lg mb-1">
                                {file.displayName || file.name}
                              </h3>
                              
                              {/* File Path & Context */}
                              <div className="text-sm text-muted-foreground mb-2">
                                <span className="font-medium">Path:</span> Year {getYearFromPath(file.fullPath)} → Semester {getSemesterFromPath(file.fullPath)} → {file.subject} → {getCategoryName(file.category)}
                              </div>
                              
                              {/* File Details */}
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  {file.metadata?.mimetype?.split('/')[1]?.toUpperCase() || 'FILE'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {formatFileSize(file.metadata?.size || 0)}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  {file.subject}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  {getCategoryName(file.category)}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Uploaded: {new Date(file.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {/* Description if available */}
                              {file.description && (
                                <p className="text-sm text-muted-foreground italic">
                                  "{file.description}"
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(getFileUrl(file.fullPath || file.name), '_blank')}
                              title="View File"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = getFileUrl(file.fullPath || file.name);
                                link.download = file.displayName || file.name;
                                link.click();
                              }}
                              title="Download File"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(file.fullPath || file.name)}
                              title="Delete File"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="elevenlabs">
            <ElevenLabsKeyManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;