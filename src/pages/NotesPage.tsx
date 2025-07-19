import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Download, FileText, Calendar, User } from "lucide-react";

// Mock data for notes
const mockNotes = [
  {
    id: 1,
    title: "Data Structures and Algorithms",
    subject: "Computer Science",
    description: "Complete notes covering arrays, linked lists, trees, graphs, and sorting algorithms with examples.",
    uploadDate: "2024-01-15",
    author: "Prof. Sharma",
    downloads: 1250,
    type: "PDF",
    pages: 45
  },
  {
    id: 2,
    title: "Circuit Analysis Fundamentals",
    subject: "Electrical Engineering",
    description: "Basic and advanced circuit analysis techniques including Kirchhoff's laws and network theorems.",
    uploadDate: "2024-01-10",
    author: "Dr. Patel",
    downloads: 890,
    type: "PDF",
    pages: 32
  },
  {
    id: 3,
    title: "Thermodynamics - Heat Engines",
    subject: "Mechanical Engineering",
    description: "Comprehensive coverage of heat engines, refrigeration cycles, and thermodynamic processes.",
    uploadDate: "2024-01-08",
    author: "Prof. Kumar",
    downloads: 756,
    type: "PDF",
    pages: 38
  },
  {
    id: 4,
    title: "Digital Signal Processing",
    subject: "Electronics & Communication",
    description: "DSP fundamentals, Z-transforms, DFT, FFT, and digital filter design with MATLAB examples.",
    uploadDate: "2024-01-05",
    author: "Dr. Singh",
    downloads: 623,
    type: "PDF",
    pages: 52
  },
  {
    id: 5,
    title: "Linear Algebra Applications",
    subject: "Mathematics",
    description: "Vector spaces, eigenvalues, matrix operations, and applications in engineering problems.",
    uploadDate: "2024-01-03",
    author: "Prof. Gupta",
    downloads: 543,
    type: "PDF",
    pages: 28
  },
  {
    id: 6,
    title: "Database Management Systems",
    subject: "Computer Science",
    description: "RDBMS concepts, normalization, SQL queries, and database design principles.",
    uploadDate: "2024-01-01",
    author: "Dr. Mehta",
    downloads: 987,
    type: "PDF",
    pages: 41
  }
];

const subjects = ["All", "Computer Science", "Electrical Engineering", "Mechanical Engineering", "Electronics & Communication", "Mathematics"];

const NotesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "All" || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-background to-accent/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Browse Engineering Notes
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access our comprehensive collection of engineering notes and study materials
          </p>
          
          {/* Search Bar */}
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

      {/* Filters */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
                className={selectedSubject === subject ? "button-gradient shadow-primary" : ""}
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Notes Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredNotes.length} Notes Found
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <Card 
                key={note.id}
                className="group hover:shadow-card transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/20"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {note.subject}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <FileText className="h-3 w-3 mr-1" />
                      {note.pages} pages
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {note.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {note.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {note.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(note.uploadDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {note.downloads.toLocaleString()} downloads
                      </span>
                      <Button size="sm" className="button-gradient shadow-primary">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No notes found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotesPage;