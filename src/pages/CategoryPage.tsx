import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import FileViewerModal from "@/components/FileViewerModal";
import { ArrowLeft, Download, FileText, Eye, Search } from "lucide-react";
import { listFiles, getFileUrl, getFileMetadataByCategory } from "@/lib/supabase";
import { CATEGORIES, getCategoryById } from "@/lib/categories";

// Subject names mapping (same as SubjectPage)
const subjectNames = {
  // 1st Semester
  1: "Scientific Foundation of Health & Wellness",
  2: "Samskruthi Kannada", 
  3: "POP",
  4: "Physics",
  5: "Nano Technology",
  6: "Maths",
  7: "IOT",
  8: "Indian Constitution",
  9: "IE Electronics",
  10: "IE Electrical",
  11: "English",
  12: "Cyber Security",
  13: "Cloud Computing",
  14: "Civil",
  15: "Chemistry",
  16: "CAED",
  17: "C Programming",
  18: "Balake Kannada",
  19: "AI",
  // 2nd Semester
  20: "Web Dev",
  21: "Python",
  22: "Physics",
  23: "Mini Project",
  24: "Mechanical",
  25: "Maths",
  26: "Java",
  27: "Indian Constitution",
  28: "English",
  29: "Electrical",
  30: "Civil",
  31: "Chemistry",
  32: "C++",
  33: "Basic Electronics",
  34: "CAED"
};

interface StudyMaterial {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
  original_title?: string;
  file_path?: string;
}

const CategoryPage = () => {
  const { subjectId, category } = useParams();
  const navigate = useNavigate();
  const subject = parseInt(subjectId || "1");
  const subjectName = subjectNames[subject as keyof typeof subjectNames] || "Unknown Subject";
  const categoryConfig = getCategoryById(category || 'modules');
  
  // Get year and semester for breadcrumbs
  const getYearAndSemester = (subjectId: number) => {
    let year, semester;
    if (subjectId <= 19) {
      year = 1;
      semester = 1;
    } else if (subjectId <= 34) {
      year = 1;
      semester = 2;
    } else {
      year = Math.ceil((subjectId - 19) / 12) + 1;
      semester = ((subjectId - 20) % 12 < 6) ? (Math.ceil((subjectId - 19) / 6) * 2 - 1) : (Math.ceil((subjectId - 19) / 6) * 2);
    }
    return { year, semester };
  };
  
  const { year, semester } = getYearAndSemester(subject);
  const yearTitle = `${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year`;
  const semesterTitle = `${semester}${semester === 1 ? 'st' : semester === 2 ? 'nd' : semester === 3 ? 'rd' : 'th'} Semester`;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<StudyMaterial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    loadMaterials();
  }, [subject, category]);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      // Get year and semester for database query
      let year, semester;
      if (subject <= 19) {
        year = 1;
        semester = 1;
      } else if (subject <= 34) {
        year = 1;
        semester = 2;
      } else {
        year = Math.ceil((subject - 19) / 12) + 1;
        semester = ((subject - 20) % 12 < 6) ? (Math.ceil((subject - 19) / 6) * 2 - 1) : (Math.ceil((subject - 19) / 6) * 2);
      }
      
      // Get file metadata from database
      const { data: fileMetadata, error } = await getFileMetadataByCategory(
        year.toString(),
        semester.toString(),
        subjectName,
        category || 'modules'
      );
      
      if (error) {
        console.error('Error loading materials:', error);
        setMaterials([]);
      } else {
        // Convert database metadata to StudyMaterial format
        const materials: StudyMaterial[] = (fileMetadata || []).map((metadata) => ({
          name: metadata.file_path.split('/').pop() || '',
          id: metadata.id || '',
          updated_at: metadata.updated_at || '',
          created_at: metadata.created_at || '',
          metadata: {
            size: metadata.file_size,
            mimetype: metadata.file_type
          },
          original_title: metadata.original_title,
          file_path: metadata.file_path
        }));
        
        setMaterials(materials);
      }
    } catch (error) {
      console.error('Error loading materials:', error);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectPath = () => {
    // Determine year and semester based on subject ID
    let year, semester;
    if (subject <= 19) {
      year = 1;
      semester = 1; // Subjects 1-19 are 1st semester
    } else if (subject <= 34) {
      year = 1;
      semester = 2; // Subjects 20-34 are 2nd semester
    } else {
      // For future subjects beyond 34
      year = Math.ceil((subject - 19) / 12) + 1;
      semester = ((subject - 20) % 12 < 6) ? (Math.ceil((subject - 19) / 6) * 2 - 1) : (Math.ceil((subject - 19) / 6) * 2);
    }
    
    const path = `year-${year}/semester-${semester}/${subjectName}`;
    console.log('Subject path calculation:', { subject, subjectName, year, semester, path });
    return path;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('word')) return '📝';
    if (mimetype.includes('image')) return '🖼️';
    return '📁';
  };

  const filterMaterials = useCallback((materialList: StudyMaterial[]) => {
    if (!searchTerm) return materialList;
    return materialList.filter(material =>
      (material.original_title || material.name).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredMaterials = useMemo(() => filterMaterials(materials), [materials, filterMaterials]);

  const getFullFilePath = (fileName: string) => {
    const fullPath = `${getSubjectPath()}/${category}/${fileName}`;
    console.log('Constructing full file path:', { fileName, category, subjectPath: getSubjectPath(), fullPath });
    return fullPath;
  };

  const handleViewFile = (material: StudyMaterial) => {
    console.log('Opening file viewer for:', {
      material,
      file_path: material.file_path,
      name: material.name,
      original_title: material.original_title
    });
    setSelectedFile(material);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const MaterialCard = ({ material }: { material: StudyMaterial }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="secondary" className="text-xs">
            {material.metadata?.mimetype?.split('/')[1]?.toUpperCase() || 'FILE'}
          </Badge>
          <div className="text-2xl">
            {getFileIcon(material.metadata?.mimetype || '')}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-[#6366f1] transition-colors">
          {material.original_title || material.name.split('/').pop()?.replace(/\.[^/.]+$/, "")}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center text-xs text-muted-foreground space-x-4">
            <span>{formatFileSize(material.metadata?.size || 0)}</span>
            <span>{new Date(material.created_at).toLocaleDateString()}</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewFile(material)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const link = document.createElement('a');
                link.href = getFileUrl(material.file_path || getFullFilePath(material.name));
                link.download = material.original_title || material.name;
                link.click();
              }}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!categoryConfig) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Category Not Found</h1>
            <Button onClick={() => navigate(`/notes/subject/${subjectId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Subject
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent = categoryConfig.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <Breadcrumbs 
            items={[
              { label: 'Browse Notes', href: '/notes' },
              { label: yearTitle, href: `/notes/year/${year}` },
              { label: semesterTitle, href: `/notes/semester/${semester}` },
              { label: subjectName, href: `/notes/subject/${subjectId}` },
              { label: categoryConfig?.name || 'Category', current: true }
            ]} 
          />
          
          {/* Category Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 text-center sm:text-left">
            <div className={`w-16 h-16 rounded-full ${categoryConfig.color.icon} flex items-center justify-center flex-shrink-0`}>
              <IconComponent className={`h-8 w-8 ${categoryConfig.color.text}`} />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${categoryConfig.color.text} mb-2`}>
                {categoryConfig.name}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">{categoryConfig.description}</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading materials...</p>
            </div>
          ) : filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No {categoryConfig.name} Available
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'No materials match your search.' 
                  : `${categoryConfig.name} will be available soon.`
                }
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
      
      {/* File Viewer Modal */}
      {selectedFile && (
        <FileViewerModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          fileUrl={getFileUrl(selectedFile.file_path || getFullFilePath(selectedFile.name))}
          fileName={selectedFile.original_title || selectedFile.name.split('/').pop() || 'Unknown File'}
          fileType={selectedFile.metadata?.mimetype || ''}
        />
      )}
    </div>
  );
};

export default CategoryPage;