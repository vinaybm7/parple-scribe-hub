import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileViewerModal from "@/components/FileViewerModal";
import { ArrowLeft, Download, FileText, Calendar, User, Eye, Star, Search, BookOpen, FileQuestion, Library, ChevronRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { listFiles, getFileUrl, getFileMetadataByCategory } from "@/lib/supabase";

// Subject names mapping
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

const SubjectPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const subject = parseInt(subjectId || "1");
  const subjectName = subjectNames[subject as keyof typeof subjectNames] || "Unknown Subject";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [materials, setMaterials] = useState<{
    modules: StudyMaterial[];
    pyqs: StudyMaterial[];
    additional: StudyMaterial[];
  }>({
    modules: [],
    pyqs: [],
    additional: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaterials();
  }, [subject]);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      // Get year and semester for database query
      let year, semester;
      if (subject <= 19) {
        year = 1;
        semester = 1;
      } else if (subject <= 33) {
        year = 1;
        semester = 2;
      } else {
        year = Math.ceil((subject - 19) / 12) + 1;
        semester = ((subject - 20) % 12 < 6) ? (Math.ceil((subject - 19) / 6) * 2 - 1) : (Math.ceil((subject - 19) / 6) * 2);
      }
      
      // Load materials from database for each category
      const [modulesData, pyqsData, additionalData] = await Promise.all([
        getFileMetadataByCategory(year.toString(), semester.toString(), subjectName, 'modules'),
        getFileMetadataByCategory(year.toString(), semester.toString(), subjectName, 'pyqs'),
        getFileMetadataByCategory(year.toString(), semester.toString(), subjectName, 'additional')
      ]);

      // Convert database metadata to StudyMaterial format
      const convertToStudyMaterial = (metadata: any[]) => 
        (metadata || []).map((item) => ({
          name: item.file_path.split('/').pop() || '',
          id: item.id || '',
          updated_at: item.updated_at || '',
          created_at: item.created_at || '',
          metadata: {
            size: item.file_size,
            mimetype: item.file_type
          },
          original_title: item.original_title,
          file_path: item.file_path
        }));

      setMaterials({
        modules: convertToStudyMaterial(modulesData.data),
        pyqs: convertToStudyMaterial(pyqsData.data),
        additional: convertToStudyMaterial(additionalData.data)
      });
    } catch (error) {
      console.error('Error loading materials:', error);
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
    } else if (subject <= 33) {
      year = 1;
      semester = 2; // Subjects 20-33 are 2nd semester
    } else {
      // For future subjects beyond 33
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

  const filterMaterials = (materialList: StudyMaterial[]) => {
    if (!searchTerm) return materialList;
    return materialList.filter(material =>
      (material.original_title || material.name).toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const MaterialCard = ({ material, category }: { material: StudyMaterial; category: string }) => (
    <Card className="group hover:shadow-card transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/20">
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
              onClick={() => window.open(getFileUrl(material.file_path || material.name), '_blank')}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const link = document.createElement('a');
                link.href = getFileUrl(material.file_path || material.name);
                link.download = material.original_title || material.name.split('/').pop() || 'download';
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

  const getCategoryId = (title: string) => {
    const categoryMap: { [key: string]: string } = {
      'Modules': 'modules',
      "PYQ's": 'pyqs',
      'Additional Study Materials': 'additional'
    };
    return categoryMap[title] || 'modules';
  };

  const handleCategoryClick = (title: string) => {
    const categoryId = getCategoryId(title);
    navigate(`/notes/subject/${subjectId}/${categoryId}`);
  };

  const SectionCard = ({ 
    title, 
    description, 
    icon, 
    materials, 
    colorClasses 
  }: { 
    title: string; 
    description: string; 
    icon: React.ReactNode; 
    materials: StudyMaterial[]; 
    colorClasses: { bg: string; border: string; text: string; icon: string };
  }) => {
    const filteredMaterials = filterMaterials(materials);
    const materialCount = filteredMaterials.length;
    
    return (
      <Card 
        className={`h-full ${colorClasses.bg} ${colorClasses.border} border-2 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105`}
        onClick={() => handleCategoryClick(title)}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${colorClasses.icon} flex items-center justify-center`}>
                {icon}
              </div>
              <div>
                <h3 className={`text-xl font-bold ${colorClasses.text}`}>{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
            <ChevronRight className={`h-5 w-5 ${colorClasses.text}`} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className={`text-3xl font-bold ${colorClasses.text} mb-2`}>
              {loading ? '...' : materialCount}
            </div>
            <p className="text-sm text-muted-foreground">
              {materialCount === 1 ? 'File Available' : 'Files Available'}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className={`mt-4 ${colorClasses.border} ${colorClasses.text} hover:${colorClasses.bg}`}
              onClick={(e) => {
                e.stopPropagation();
                handleCategoryClick(title);
              }}
            >
              View All Files
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" className="mr-4" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Subjects
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{subjectName}</h1>
          <p className="text-lg text-muted-foreground mb-6">Study materials organized by category</p>
          
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

      {/* Three Sections */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <SectionCard
              title="Modules"
              description="Course modules and lecture notes"
              icon={<BookOpen className="h-6 w-6 text-blue-600" />}
              materials={materials.modules}
              colorClasses={{
                bg: "bg-blue-50",
                border: "border-blue-200",
                text: "text-blue-700",
                icon: "bg-blue-100"
              }}
            />
            
            <SectionCard
              title="PYQ's"
              description="Previous year question papers"
              icon={<FileQuestion className="h-6 w-6 text-green-600" />}
              materials={materials.pyqs}
              colorClasses={{
                bg: "bg-green-50",
                border: "border-green-200",
                text: "text-green-700",
                icon: "bg-green-100"
              }}
            />
            
            <SectionCard
              title="Additional Study Materials"
              description="Extra resources and references"
              icon={<Library className="h-6 w-6 text-purple-600" />}
              materials={materials.additional}
              colorClasses={{
                bg: "bg-purple-50",
                border: "border-purple-200",
                text: "text-purple-700",
                icon: "bg-purple-100"
              }}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SubjectPage;