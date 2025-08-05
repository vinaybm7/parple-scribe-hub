import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link, useParams } from "react-router-dom";

// Semester data for each year
const semesterData = {
  1: [
    { id: 1, title: "Physics cycle", description: "Mathematics I, Physics, Chemistry, Engineering Drawing", color: "from-blue-100 to-blue-200" },
    { id: 2, title: "Chemistry cycle", description: "Mathematics II, Physics II, Chemistry II, Programming", color: "from-blue-200 to-blue-300" }
  ],
  2: [
    { id: 3, title: "3rd Semester", description: "Core engineering subjects and advanced concepts", color: "from-green-100 to-green-200" },
    { id: 4, title: "4th Semester", description: "Specialized topics and practical applications", color: "from-green-200 to-green-300" }
  ],
  3: [
    { id: 5, title: "5th Semester", description: "Advanced engineering topics and specialization", color: "from-purple-100 to-purple-200" },
    { id: 6, title: "6th Semester", description: "Professional subjects and industry applications", color: "from-purple-200 to-purple-300" }
  ],
  4: [
    { id: 7, title: "7th Semester", description: "Project work and advanced electives", color: "from-orange-100 to-orange-200" },
    { id: 8, title: "8th Semester", description: "Final projects and industry preparation", color: "from-orange-200 to-orange-300" }
  ]
};

const yearTitles = {
  1: "1st Year",
  2: "2nd Year", 
  3: "3rd Year",
  4: "4th Year"
};

const YearPage = () => {
  const { yearId } = useParams();
  const year = parseInt(yearId || "1");
  const semesters = semesterData[year as keyof typeof semesterData] || [];
  const yearTitle = yearTitles[year as keyof typeof yearTitles] || "Year";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <Breadcrumbs 
            items={[
              { label: 'Browse Notes', href: '/notes' },
              { label: yearTitle, current: true }
            ]} 
          />
          <h1 className="text-4xl font-bold text-foreground mb-2">{yearTitle}</h1>
          <p className="text-lg text-muted-foreground">Select a semester to browse notes</p>
        </div>
      </section>

      {/* Semester Cards Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {semesters.map((semester) => (
              <Link key={semester.id} to={`/notes/semester/${semester.id}`}>
                <Card className="group hover:shadow-card transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/20 cursor-pointer h-full">
                  <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                    <div className="flex flex-col items-center">
                      <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${semester.color} flex items-center justify-center`}>
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-[#6366f1] transition-colors">
                        {semester.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">
                      {semester.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default YearPage;