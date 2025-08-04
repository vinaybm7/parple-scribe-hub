import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactNode } from 'react';
import Index from "./pages/Index";
import NotesPage from "./pages/NotesPage";
import YearPage from "./pages/YearPage";
import SemesterPage from "./pages/SemesterPage";
import SubjectPage from "./pages/SubjectPage";
import CategoryPage from "./pages/CategoryPage";
import SubjectsPage from "./pages/SubjectsPage";
import AboutPage from "./pages/AboutPage";
import CompanionPage from "./pages/CompanionPage";
import SecureAdminDashboard from "./pages/SecureAdminDashboard";
import NotFound from "./pages/NotFound";
import ChatWidget from "./components/chat/ChatWidget";

// Wrapper component to include ChatWidget with specific pages
const WithChatWidget = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
};

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
          <Route path="/notes" element={<WithChatWidget><NotesPage /></WithChatWidget>} />
          <Route path="/notes/year/:yearId" element={<WithChatWidget><YearPage /></WithChatWidget>} />
          <Route path="/notes/semester/:semesterId" element={<WithChatWidget><SemesterPage /></WithChatWidget>} />
          <Route path="/notes/subject/:subjectId" element={<WithChatWidget><SubjectPage /></WithChatWidget>} />
          <Route path="/notes/subject/:subjectId/:category" element={<WithChatWidget><CategoryPage /></WithChatWidget>} />
          <Route path="/subjects" element={<WithChatWidget><SubjectsPage /></WithChatWidget>} />
          <Route path="/about" element={<WithChatWidget><AboutPage /></WithChatWidget>} />
          <Route path="/companion" element={<CompanionPage />} />
          <Route path="/admin-dashboard-secure-vny-access" element={<SecureAdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<WithChatWidget><NotFound /></WithChatWidget>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
