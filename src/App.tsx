import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotesPage from "./pages/NotesPage";
import YearPage from "./pages/YearPage";
import SemesterPage from "./pages/SemesterPage";
import SubjectPage from "./pages/SubjectPage";
import CategoryPage from "./pages/CategoryPage";
import SubjectsPage from "./pages/SubjectsPage";
import AboutPage from "./pages/AboutPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ChatWidget from "./components/chat/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HotToaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/year/:yearId" element={<YearPage />} />
          <Route path="/notes/semester/:semesterId" element={<SemesterPage />} />
          <Route path="/notes/subject/:subjectId" element={<SubjectPage />} />
          <Route path="/notes/subject/:subjectId/:category" element={<CategoryPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin-dashboard-secure-vny-access" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Bella Chat Widget - Available on all pages */}
        <ChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
