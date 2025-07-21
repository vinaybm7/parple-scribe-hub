import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Settings, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import AvatarDisplay from './AvatarDisplay';
import CompanionChat from './CompanionChat';
import CompanionSettings from './CompanionSettings';

interface CompanionInterfaceProps {
  avatarId: string;
  onBack: () => void;
}

const CompanionInterface = ({ avatarId, onBack }: CompanionInterfaceProps) => {
  const [currentMood, setCurrentMood] = useState<'happy' | 'excited' | 'calm' | 'focused' | 'caring'>('caring');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const avatarNames = {
    bella: 'Bella',
    luna: 'Luna', 
    aria: 'Aria'
  };

  const handleResetConversation = () => {
    // This would reset the conversation history
    console.log('Reset conversation');
    setIsSettingsOpen(false);
  };

  const handleChangeAvatar = () => {
    // This would go back to avatar selection
    setIsSettingsOpen(false);
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-pink-500" />
                <h1 className="text-xl font-semibold">
                  Chatting with {avatarNames[avatarId as keyof typeof avatarNames]}
                </h1>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left Side - Avatar Display */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-0">
                <AvatarDisplay
                  avatarId={avatarId}
                  mood={currentMood}
                  isTyping={isTyping}
                  isSpeaking={isSpeaking}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Chat Interface */}
          <div className="flex justify-center lg:justify-start">
            <Card className="w-full max-w-md h-[600px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-0 h-full">
                <CompanionChat
                  avatarId={avatarId}
                  onMoodChange={setCurrentMood}
                  onTypingChange={setIsTyping}
                  onSpeakingChange={setIsSpeaking}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/50 hover:bg-white/70 backdrop-blur-sm"
              onClick={() => {
                // This would trigger a predefined motivational message
                console.log('Study motivation clicked');
              }}
            >
              💪 Study Motivation
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/50 hover:bg-white/70 backdrop-blur-sm"
              onClick={() => {
                console.log('Stress relief clicked');
              }}
            >
              😌 Stress Relief
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/50 hover:bg-white/70 backdrop-blur-sm"
              onClick={() => {
                console.log('Goal setting clicked');
              }}
            >
              🎯 Goal Setting
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/50 hover:bg-white/70 backdrop-blur-sm"
              onClick={() => {
                console.log('Casual chat clicked');
              }}
            >
              💬 Casual Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <CompanionSettings
        avatarId={avatarId}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetConversation={handleResetConversation}
        onChangeAvatar={handleChangeAvatar}
      />
    </div>
  );
};

export default CompanionInterface;