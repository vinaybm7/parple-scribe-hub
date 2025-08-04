import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle, Sparkles, User } from 'lucide-react';
import CompanionInterface from '@/components/companion/CompanionInterface';
import PersonalitySelector from '@/components/companion/PersonalitySelector';
import CompanionErrorBoundary from '@/components/companion/CompanionErrorBoundary';

import Breadcrumbs from '@/components/ui/breadcrumbs';

const CompanionPage = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isInChat, setIsInChat] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleStartChat = () => {
    if (selectedAvatar) {
      setIsInChat(true);
    }
  };

  const handleBackToSelection = () => {
    setIsInChat(false);
    setSelectedAvatar(null);
  };



  // If in chat mode, show the companion interface
  if (isInChat && selectedAvatar) {
    return (
      <CompanionErrorBoundary>
        <CompanionInterface 
          avatarId={selectedAvatar} 
          onBack={handleBackToSelection}
        />
      </CompanionErrorBoundary>
    );
  }

  return (
    <CompanionErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20 relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-100/20 to-indigo-100/30 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-200/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-200/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: 'AI Companion', current: true }
            ]} 
          />

          {/* Personality Selection */}
          <PersonalitySelector
            selectedAvatar={selectedAvatar}
            onAvatarSelect={setSelectedAvatar}
            onConfirm={handleStartChat}
          />

          {/* Premium Features Preview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/40 dark:to-pink-800/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-pink-200/50 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Heart className="w-8 h-8 text-pink-600 group-hover:text-pink-700 transition-colors duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">Emotional Support</h3>
              <p className="text-muted-foreground leading-relaxed">Get personalized encouragement and motivation when you need it most during your study journey</p>
            </div>
            <div className="text-center group">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-200/50 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <MessageCircle className="w-8 h-8 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">Natural Conversation</h3>
              <p className="text-muted-foreground leading-relaxed">Engage in meaningful conversations about studies, life, and everything in between with AI companions</p>
            </div>
            <div className="text-center group">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-indigo-200/50 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Sparkles className="w-8 h-8 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">Study Motivation</h3>
              <p className="text-muted-foreground leading-relaxed">Stay motivated and focused on your academic goals with personalized study strategies and encouragement</p>
            </div>
          </div>
        </div>


      </div>
    </CompanionErrorBoundary>
  );
};

export default CompanionPage;