import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle, Sparkles, User } from 'lucide-react';
import CompanionInterface from '@/components/companion/CompanionInterface';
import PersonalitySelector from '@/components/companion/PersonalitySelector';
import CompanionErrorBoundary from '@/components/companion/CompanionErrorBoundary';
import CompanionOnboarding from '@/components/companion/CompanionOnboarding';
import Breadcrumbs from '@/components/ui/breadcrumbs';

const CompanionPage = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isInChat, setIsInChat] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check if user has seen onboarding before
    return !localStorage.getItem('companion-onboarding-completed');
  });

  const handleStartChat = () => {
    if (selectedAvatar) {
      setIsInChat(true);
    }
  };

  const handleBackToSelection = () => {
    setIsInChat(false);
    setSelectedAvatar(null);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('companion-onboarding-completed', 'true');
    setShowOnboarding(false);
  };

  const handleSkipOnboarding = () => {
    localStorage.setItem('companion-onboarding-completed', 'true');
    setShowOnboarding(false);
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'AI Companion', current: true }
          ]} 
        />
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Heart className="w-16 h-16 text-pink-500 animate-pulse" />
              <Sparkles className="w-6 h-6 text-purple-400 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Meet Your AI Companion
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your personal study buddy who's always there to support, motivate, and chat with you through your academic journey.
          </p>
        </div>

        {/* Personality Selection */}
        <PersonalitySelector
          selectedAvatar={selectedAvatar}
          onAvatarSelect={setSelectedAvatar}
          onConfirm={handleStartChat}
        />

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Emotional Support</h3>
            <p className="text-muted-foreground">Get encouragement and motivation when you need it most</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Natural Conversation</h3>
            <p className="text-muted-foreground">Chat naturally about studies, life, and everything in between</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Study Motivation</h3>
            <p className="text-muted-foreground">Stay motivated and focused on your academic goals</p>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <CompanionOnboarding
          onComplete={handleOnboardingComplete}
          onSkip={handleSkipOnboarding}
        />
      )}
    </div>
    </CompanionErrorBoundary>
  );
};

export default CompanionPage;