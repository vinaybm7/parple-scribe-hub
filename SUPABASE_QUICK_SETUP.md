# 🚀 Quick Supabase Setup for Admin Dashboard

## ✅ Step 1: Create Storage Bucket (REQUIRED)

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard/project/jeihvobotkaczagquhmy
2. **Click "Storage" in the left sidebar**
3. **Click "New Bucket"**
4. **Enter bucket name**: `notes`
5. **Choose "Public bucket"** (makes file sharing easier)
6. **Click "Create bucket"**

## ✅ Step 2: Test Your Admin Dashboard

1. **Start your development server**: `npm run dev`
2. **Navigate to**: `http://localhost:8080/admin-dashboard-secure-access`
3. **You should see the admin dashboard!**

## 🎯 Admin Dashboard Features

### **Upload Tab:**
- Select year, semester, and subject
- Add title and description
- Upload PDF, DOCX, or image files
- Files are automatically organized by year/semester/subject

### **Manage Tab:**
- View all uploaded files
- Download files
- Delete files
- See file details (size, type, upload date)

## 📁 File Organization

Files will be stored in this structure:
```
notes/
├── year-1/
│   ├── semester-1/
│   │   ├── Physics/
│   │   ├── Maths/
│   │   └── Chemistry/
│   └── semester-2/
└── year-2/
    ├── semester-3/
    └── semester-4/
```

## 🔒 Security Notes

- **Private URL**: Only people who know `/admin-dashboard-secure-access` can access
- **File Validation**: Only PDF, DOCX, JPG, PNG files allowed
- **Size Limit**: 10MB maximum per file
- **Public Access**: Students can download files without login (since bucket is public)

## 🛠️ Troubleshooting

### If admin dashboard shows "Access Denied":
- Make sure you created the storage bucket named `notes`
- Check that your .env file has the correct credentials

### If file upload fails:
- Verify the storage bucket exists
- Check file type (must be PDF, DOCX, JPG, or PNG)
- Check file size (must be under 10MB)

### If files don't appear in manage tab:
- Refresh the page
- Check browser console for errors

## 🎉 You're All Set!

Once you create the storage bucket, your admin dashboard will be fully functional. You can start uploading study materials immediately!

**Admin Dashboard URL**: `http://localhost:8080/admin-dashboard-secure-access`

**Remember to bookmark this URL for easy access!**