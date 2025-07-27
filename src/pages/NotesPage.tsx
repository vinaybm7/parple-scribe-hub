import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, GraduationCap, BookOpen, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllFileMetadata } from "@/lib/supabase";

// Year data for engineering notes
const years = [
  {
    id: 1,
    title: "1st Year",
    description: "Foundation courses and basic engineering subjects",
    color: "from-blue-200 to-blue-300",
    icon: "🎓"
  },
  {
    id: 2,
    title: "2nd Year",
    description: "Core engineering subjects and specialization introduction",
    color: "from-green-200 to-green-300",
    icon: "📚"
  },
  {
    id: 3,
    title: "3rd Year",
    description: "Advanced topics and practical applications",
    color: "from-purple-200 to-purple-300",
    icon: "🔬"
  },
  {
    id: 4,
    title: "4th Year",
    description: "Specialization and project work",
    color: "from-orange-200 to-orange-300",
    icon: "🎯"
  }
];

// Subject data for comprehensive search
const allSubjects = [
  // 1st Semester
  { id: 1, name: "Scientific Foundation of Health & Wellness", code: "SFHW101", semester: 1, year: 1, keywords: ["health", "wellness", "foundation", "scientific"] },
  { id: 2, name: "Samskruthi Kannada", code: "SK101", semester: 1, year: 1, keywords: ["kannada", "samskruthi", "language"] },
  { id: 3, name: "POP", code: "POP101", semester: 1, year: 1, keywords: ["pop", "programming", "principles"] },
  { id: 4, name: "Physics", code: "PHY101", semester: 1, year: 1, keywords: ["physics", "mechanics", "waves", "optics"] },
  { id: 5, name: "Nano Technology", code: "NT101", semester: 1, year: 1, keywords: ["nano", "technology", "nanotechnology", "materials"] },
  { id: 6, name: "Maths", code: "MATH101", semester: 1, year: 1, keywords: ["mathematics", "maths", "calculus", "algebra"] },
  { id: 7, name: "IOT", code: "IOT101", semester: 1, year: 1, keywords: ["iot", "internet", "things", "sensors"] },
  { id: 8, name: "Indian Constitution", code: "IC101", semester: 1, year: 1, keywords: ["constitution", "indian", "law", "rights"] },
  { id: 9, name: "IE Electronics", code: "IEE101", semester: 1, year: 1, keywords: ["electronics", "circuits", "components"] },
  { id: 10, name: "IE Electrical", code: "IEL101", semester: 1, year: 1, keywords: ["electrical", "power", "circuits", "current"] },
  { id: 11, name: "English", code: "ENG101", semester: 1, year: 1, keywords: ["english", "language", "communication"] },
  { id: 12, name: "Cyber Security", code: "CS101", semester: 1, year: 1, keywords: ["cyber", "security", "hacking", "protection"] },
  { id: 13, name: "Cloud Computing", code: "CC101", semester: 1, year: 1, keywords: ["cloud", "computing", "aws", "server"] },
  { id: 14, name: "Civil", code: "CIV101", semester: 1, year: 1, keywords: ["civil", "construction", "structures"] },
  { id: 15, name: "Chemistry", code: "CHEM101", semester: 1, year: 1, keywords: ["chemistry", "organic", "inorganic", "reactions"] },
  { id: 16, name: "CAED", code: "CAED101", semester: 1, year: 1, keywords: ["caed", "design", "drawing", "autocad"] },
  { id: 17, name: "C Programming", code: "CP101", semester: 1, year: 1, keywords: ["c", "programming", "coding", "language"] },
  { id: 18, name: "Balake Kannada", code: "BK101", semester: 1, year: 1, keywords: ["balake", "kannada", "language"] },
  { id: 19, name: "AI", code: "AI101", semester: 1, year: 1, keywords: ["ai", "artificial", "intelligence", "machine", "learning"] },
  
  // 2nd Semester
  { id: 20, name: "Web Dev", code: "WD102", semester: 2, year: 1, keywords: ["web", "development", "html", "css", "javascript"] },
  { id: 21, name: "Python", code: "PY102", semester: 2, year: 1, keywords: ["python", "programming", "coding", "language"] },
  { id: 22, name: "Physics", code: "PHY102", semester: 2, year: 1, keywords: ["physics", "mechanics", "waves", "optics"] },
  { id: 23, name: "Mini Project", code: "MP102", semester: 2, year: 1, keywords: ["mini", "project", "development", "implementation"] },
  { id: 24, name: "Mechanical", code: "MECH102", semester: 2, year: 1, keywords: ["mechanical", "machines", "thermodynamics"] },
  { id: 25, name: "Maths", code: "MATH102", semester: 2, year: 1, keywords: ["mathematics", "maths", "calculus", "algebra"] },
  { id: 26, name: "Java", code: "JAVA102", semester: 2, year: 1, keywords: ["java", "programming", "oop", "object"] },
  { id: 27, name: "Indian Constitution", code: "IC102", semester: 2, year: 1, keywords: ["constitution", "indian", "law", "rights"] },
  { id: 28, name: "English", code: "ENG102", semester: 2, year: 1, keywords: ["english", "language", "communication"] },
  { id: 29, name: "Electrical", code: "EE102", semester: 2, year: 1, keywords: ["electrical", "power", "circuits", "current"] },
  { id: 30, name: "Civil", code: "CIV102", semester: 2, year: 1, keywords: ["civil", "construction", "structures"] },
  { id: 31, name: "Chemistry", code: "CHEM102", semester: 2, year: 1, keywords: ["chemistry", "organic", "inorganic", "reactions"] },
  { id: 32, name: "C++", code: "CPP102", semester: 2, year: 1, keywords: ["cpp", "c++", "programming", "oop"] },
  { id: 33, name: "Basic Electronics", code: "BE102", semester: 2, year: 1, keywords: ["electronics", "basic", "circuits", "components"] },
  { id: 34, name: "CAED", code: "CAED102", semester: 2, year: 1, keywords: ["caed", "design", "drawing", "autocad"] }
];

interface SearchResult {
  type: 'year' | 'subject' | 'file';
  id: number | string;
  title: string;
  description: string;
  path: string;
  semester?: number;
  year?: number;
  category?: string;
}

interface FileMetadata {
  id: string;
  original_title: string;
  file_path: string;
  subject: string;
  category: string;
  year: string;
  semester: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

const NotesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load file metadata on component mount
  useEffect(() => {
    loadFileMetadata();
  }, []);

  const loadFileMetadata = async () => {
    try {
      const response = await getAllFileMetadata();
      if (response.data) {
        setFileMetadata(response.data);
      }
    } catch (error) {
      console.error('Error loading file metadata:', error);
    }
  };

  // Perform comprehensive search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];
    const searchLower = searchTerm.toLowerCase();

    // Search in years
    years.forEach(year => {
      if (year.title.toLowerCase().includes(searchLower) ||
          year.description.toLowerCase().includes(searchLower)) {
        results.push({
          type: 'year',
          id: year.id,
          title: year.title,
          description: year.description,
          path: `/notes/year/${year.id}`,
          year: year.id
        });
      }
    });

    // Search in subjects
    allSubjects.forEach(subject => {
      const matchesName = subject.name.toLowerCase().includes(searchLower);
      const matchesCode = subject.code.toLowerCase().includes(searchLower);
      const matchesKeywords = subject.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchLower)
      );

      if (matchesName || matchesCode || matchesKeywords) {
        results.push({
          type: 'subject',
          id: subject.id,
          title: subject.name,
          description: `${subject.code} - Year ${subject.year}, Semester ${subject.semester}`,
          path: `/notes/subject/${subject.id}`,
          year: subject.year,
          semester: subject.semester
        });
      }
    });

    // Search in file metadata
    fileMetadata.forEach(file => {
      const matchesTitle = file.original_title?.toLowerCase().includes(searchLower);
      const matchesSubject = file.subject?.toLowerCase().includes(searchLower);
      const matchesCategory = file.category?.toLowerCase().includes(searchLower);

      if (matchesTitle || matchesSubject || matchesCategory) {
        results.push({
          type: 'file',
          id: file.id,
          title: file.original_title || file.file_path.split('/').pop() || 'Unknown File',
          description: `${file.subject} - ${file.category} (Year ${file.year}, Semester ${file.semester})`,
          path: `/notes/subject/${getSubjectIdByName(file.subject)}/${file.category}`,
          year: parseInt(file.year),
          semester: parseInt(file.semester),
          category: file.category
        });
      }
    });

    // Sort results by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === searchLower;
      const bExact = b.title.toLowerCase() === searchLower;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      const aStarts = a.title.toLowerCase().startsWith(searchLower);
      const bStarts = b.title.toLowerCase().startsWith(searchLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      return a.title.localeCompare(b.title);
    });

    setSearchResults(results.slice(0, 20)); // Limit to 20 results
    setIsSearching(false);
  }, [searchTerm, fileMetadata]);

  const getSubjectIdByName = (subjectName: string): number => {
    const subject = allSubjects.find(s => s.name === subjectName);
    return subject?.id || 1;
  };

  // Filter years based on search term (for when no specific search results)
  const filteredYears = years.filter(year =>
    year.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    year.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'year': return '🎓';
      case 'subject': return '📚';
      case 'file': return '📄';
      default: return '📁';
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'year': return 'Year';
      case 'subject': return 'Subject';
      case 'file': return 'File';
      default: return 'Item';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Bar Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for notes, subjects, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-background border-border"
            />
          </div>
        </div>
      </section>

      {/* Search Results or Year Cards Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {searchTerm.trim() ? (
            // Show search results
            <>
              {isSearching ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Search Results ({searchResults.length})
                    </h2>
                    <p className="text-muted-foreground">
                      Found {searchResults.length} results for "{searchTerm}"
                    </p>
                  </div>
                  <div className="space-y-4">
                    {searchResults.map((result, index) => (
                      <Link key={`${result.type}-${result.id}-${index}`} to={result.path}>
                        <Card className="group hover:shadow-card transition-all duration-300 hover:scale-[1.02] border-border/50 hover:border-primary/20 cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                                  {getResultIcon(result.type)}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {getResultTypeLabel(result.type)}
                                  </Badge>
                                  {result.year && (
                                    <Badge variant="outline" className="text-xs">
                                      Year {result.year}
                                    </Badge>
                                  )}
                                  {result.semester && (
                                    <Badge variant="outline" className="text-xs">
                                      Sem {result.semester}
                                    </Badge>
                                  )}
                                  {result.category && (
                                    <Badge variant="outline" className="text-xs">
                                      {result.category}
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                  {result.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {result.description}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-4">
                    No matches found for "{searchTerm}"
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">Try searching for:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="outline" className="cursor-pointer" onClick={() => setSearchTerm("Physics")}>Physics</Badge>
                      <Badge variant="outline" className="cursor-pointer" onClick={() => setSearchTerm("Mathematics")}>Mathematics</Badge>
                      <Badge variant="outline" className="cursor-pointer" onClick={() => setSearchTerm("Programming")}>Programming</Badge>
                      <Badge variant="outline" className="cursor-pointer" onClick={() => setSearchTerm("1st Year")}>1st Year</Badge>
                      <Badge variant="outline" className="cursor-pointer" onClick={() => setSearchTerm("Chemistry")}>Chemistry</Badge>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Show year cards when no search term
            filteredYears.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredYears.map((year) => (
                <Link key={year.id} to={`/notes/year/${year.id}`}>
                  <Card className="group hover:shadow-card transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/20 cursor-pointer h-full">
                    <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                      <div className="flex flex-col items-center">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${year.color} flex items-center justify-center text-2xl`}>
                          {year.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-[#6366f1] transition-colors">
                          {year.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {year.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try searching for different terms like "1st Year", "Foundation", or "Engineering"
                </p>
              </div>
            )
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotesPage;