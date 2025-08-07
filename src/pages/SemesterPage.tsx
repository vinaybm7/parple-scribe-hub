import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

// Subject data for each semester with color coding
const subjectData = {
  1: [ // Physics cycle
    { id: 1, name: "Scientific Foundation of Health & Wellness", code: "SFHW101", color: "from-red-100 to-red-200", icon: "🏥" },
    { id: 3, name: "POP", code: "POP101", color: "from-green-100 to-green-200", icon: "💻" },
    { id: 4, name: "Physics", code: "PHY101", color: "from-purple-100 to-purple-200", icon: "⚛️" },
    { id: 5, name: "Nano Technology", code: "NT101", color: "from-yellow-100 to-yellow-200", icon: "🔬" },
    { id: 6, name: "Maths - I", code: "MATH101", color: "from-indigo-100 to-indigo-200", icon: "📐" },
    { id: 7, name: "IOT", code: "IOT101", color: "from-orange-100 to-orange-200", icon: "🌐" },
    { id: 8, name: "Indian Constitution", code: "IC101", color: "from-teal-100 to-teal-200", icon: "⚖️" },
    { id: 9, name: "IE Electronics", code: "IEE101", color: "from-pink-100 to-pink-200", icon: "🔌" },
    { id: 11, name: "English - I", code: "ENG101", color: "from-lime-100 to-lime-200", icon: "📚" },
    { id: 12, name: "Cyber Security", code: "CS101", color: "from-rose-100 to-rose-200", icon: "🔒" },
    { id: 13, name: "Cloud Computing", code: "CC101", color: "from-violet-100 to-violet-200", icon: "☁️" },
    { id: 14, name: "Civil", code: "CIV101", color: "from-amber-100 to-amber-200", icon: "🏗️" },
    { id: 17, name: "C Programming", code: "CP101", color: "from-fuchsia-100 to-fuchsia-200", icon: "💾" },
    { id: 19, name: "AI", code: "AI101", color: "from-stone-100 to-stone-200", icon: "🤖" }
  ],
  2: [ // Chemistry cycle
    { id: 20, name: "Web Dev", code: "WD102", color: "from-red-100 to-red-200", icon: "🌐" },
    { id: 21, name: "Python", code: "PY102", color: "from-blue-100 to-blue-200", icon: "🐍" },
    { id: 23, name: "Mini Project", code: "MP102", color: "from-purple-100 to-purple-200", icon: "🚀" },
    { id: 24, name: "Mechanical", code: "MECH102", color: "from-yellow-100 to-yellow-200", icon: "⚙️" },
    { id: 25, name: "Maths - II", code: "MATH102", color: "from-indigo-100 to-indigo-200", icon: "📐" },
    { id: 26, name: "Java", code: "JAVA102", color: "from-orange-100 to-orange-200", icon: "☕" },
    { id: 28, name: "English - II", code: "ENG102", color: "from-pink-100 to-pink-200", icon: "📚" },
    { id: 29, name: "Electrical", code: "EE102", color: "from-cyan-100 to-cyan-200", icon: "⚡" },
    { id: 30, name: "Civil", code: "CIV102", color: "from-lime-100 to-lime-200", icon: "🏗️" },
    { id: 31, name: "Chemistry", code: "CHEM102", color: "from-rose-100 to-rose-200", icon: "🧪" },
    { id: 32, name: "C++", code: "CPP102", color: "from-violet-100 to-violet-200", icon: "💻" },
    { id: 2, name: "Samskruthi Kannada", code: "SK102", color: "from-blue-100 to-blue-200", icon: "🕉️" },
    { id: 18, name: "Balake Kannada", code: "BK102", color: "from-sky-100 to-sky-200", icon: "📖" },
    { id: 33, name: "Basic Electronics", code: "BE102", color: "from-amber-100 to-amber-200", icon: "🔌" }
  ],

  // Add more semesters as needed...
};

const semesterTitles = {
  1: "Physics cycle",
  2: "Chemistry cycle",
  3: "3rd Semester",
  4: "4th Semester",
  5: "5th Semester",
  6: "6th Semester",
  7: "7th Semester",
  8: "8th Semester"
};

const SemesterPage = () => {
  const { semesterId } = useParams();
  const navigate = useNavigate();
  const semester = parseInt(semesterId || "1");
  const subjects = subjectData[semester as keyof typeof subjectData] || [];
  const semesterTitle = semesterTitles[semester as keyof typeof semesterTitles] || "Semester";
  
  // Determine year based on semester
  const getYearFromSemester = (sem: number) => {
    if (sem <= 2) return 1;
    if (sem <= 4) return 2;
    if (sem <= 6) return 3;
    return 4;
  };
  
  const year = getYearFromSemester(semester);
  const yearTitle = `${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year`;

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
              { label: semesterTitle, current: true }
            ]} 
          />
          
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/notes/year/${year}`)}
              className="flex items-center gap-2 hover:bg-muted/50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {yearTitle}
            </Button>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-2">{semesterTitle}</h1>
          <p className="text-lg text-muted-foreground">Select a subject to access study materials</p>
        </div>
      </section>

      {/* Subject Cards Section - 6 rows x 4 columns */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {subjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {subjects.map((subject) => (
                <Link key={subject.id} to={`/notes/subject/${subject.id}`}>
                  <Card className="group hover:shadow-card transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/20 cursor-pointer h-full">
                    <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                      <div className="flex flex-col items-center">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${subject.color} flex items-center justify-center text-2xl`}>
                          {subject.icon}
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-[#6366f1] transition-colors">
                          {subject.name}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-foreground mb-4">Coming Soon</h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Subjects for {semesterTitle} will be available soon. We're working on adding comprehensive study materials for this semester.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SemesterPage;