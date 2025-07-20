import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

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

const NotesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter years based on search term
  const filteredYears = years.filter(year =>
    year.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    year.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Year Cards Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredYears.length > 0 ? (
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
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotesPage;