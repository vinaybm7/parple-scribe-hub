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
        <div className="container mx-auto px-4 py-8">
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

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Emotional Support</h3>
              <p className="text-muted-foreground text-sm">Get encouragement and motivation when you need it most</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Natural Conversation</h3>
              <p className="text-muted-foreground text-sm">Chat naturally about studies, life, and everything in between</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Study Motivation</h3>
              <p className="text-muted-foreground text-sm">Stay motivated and focused on your academic goals</p>
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