import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle, Sparkles, User } from 'lucide-react';
import CompanionInterface from '@/components/companion/CompanionInterface';

const CompanionPage = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isInChat, setIsInChat] = useState(false);

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
      <CompanionInterface 
        avatarId={selectedAvatar} 
        onBack={handleBackToSelection}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
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

        {/* Avatar Selection */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold text-center mb-8">Choose Your Companion</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Avatar Options */}
            {[
              { id: 'bella', name: 'Bella', personality: 'Caring & Supportive', color: 'pink' },
              { id: 'luna', name: 'Luna', personality: 'Playful & Energetic', color: 'purple' },
              { id: 'aria', name: 'Aria', personality: 'Calm & Wise', color: 'indigo' }
            ].map((avatar) => (
              <Card 
                key={avatar.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedAvatar === avatar.id 
                    ? `ring-2 ring-${avatar.color}-500 shadow-lg` 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedAvatar(avatar.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-${avatar.color}-400 to-${avatar.color}-600 flex items-center justify-center mb-4`}>
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-xl">{avatar.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{avatar.personality}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    variant={selectedAvatar === avatar.id ? "default" : "outline"}
                    className={selectedAvatar === avatar.id ? `bg-${avatar.color}-500 hover:bg-${avatar.color}-600` : ''}
                  >
                    {selectedAvatar === avatar.id ? 'Selected' : 'Choose'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Get Started Button */}
        {selectedAvatar && (
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={handleStartChat}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chatting
            </Button>
          </div>
        )}

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
    </div>
  );
};

export default CompanionPage;