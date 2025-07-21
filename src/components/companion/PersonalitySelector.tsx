import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Moon, User, Check } from 'lucide-react';

interface PersonalitySelectorProps {
  selectedAvatar: string | null;
  onAvatarSelect: (avatarId: string) => void;
  onConfirm: () => void;
}

const PersonalitySelector = ({ selectedAvatar, onAvatarSelect, onConfirm }: PersonalitySelectorProps) => {
  const avatars = [
    {
      id: 'bella',
      name: 'Bella',
      personality: 'Caring & Supportive',
      description: 'Your loving study companion who provides emotional support and encouragement',
      traits: ['Affectionate', 'Motivational', 'Empathetic', 'Romantic'],
      color: 'pink',
      icon: Heart,
      gradient: 'from-pink-400 to-pink-600',
      bgGradient: 'from-pink-100 to-pink-200',
      quote: "I'm here to support you through every challenge, sweetheart! 💕"
    },
    {
      id: 'luna',
      name: 'Luna',
      personality: 'Playful & Energetic',
      description: 'Your bubbly companion who makes studying fun and exciting',
      traits: ['Enthusiastic', 'Creative', 'Adventurous', 'Inspiring'],
      color: 'purple',
      icon: Sparkles,
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-100 to-purple-200',
      quote: "Let's turn your study session into an amazing adventure! ✨"
    },
    {
      id: 'aria',
      name: 'Aria',
      personality: 'Calm & Wise',
      description: 'Your serene companion who brings peace and wisdom to your studies',
      traits: ['Thoughtful', 'Peaceful', 'Wise', 'Balanced'],
      color: 'indigo',
      icon: Moon,
      gradient: 'from-indigo-400 to-indigo-600',
      bgGradient: 'from-indigo-100 to-indigo-200',
      quote: "Together, we'll find harmony in learning and growth. 🌙"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Perfect Companion</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Each companion has a unique personality designed to support different aspects of your learning journey. 
          Choose the one that resonates with you most.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {avatars.map((avatar) => {
          const IconComponent = avatar.icon;
          const isSelected = selectedAvatar === avatar.id;
          
          return (
            <Card 
              key={avatar.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden ${
                isSelected 
                  ? `ring-2 ring-${avatar.color}-500 shadow-xl bg-gradient-to-br ${avatar.bgGradient}` 
                  : 'hover:shadow-lg bg-white dark:bg-gray-900'
              }`}
              onClick={() => onAvatarSelect(avatar.id)}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 z-10">
                  <div className={`w-8 h-8 rounded-full bg-${avatar.color}-500 flex items-center justify-center`}>
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                {/* Avatar representation */}
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-700" />
                  </div>
                </div>

                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  <IconComponent className={`w-5 h-5 text-${avatar.color}-500`} />
                  {avatar.name}
                </CardTitle>
                
                <Badge variant="secondary" className={`bg-${avatar.color}-100 text-${avatar.color}-700`}>
                  {avatar.personality}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  {avatar.description}
                </p>

                {/* Personality traits */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {avatar.traits.map((trait) => (
                    <Badge 
                      key={trait} 
                      variant="outline" 
                      className={`text-xs ${isSelected ? `border-${avatar.color}-300` : ''}`}
                    >
                      {trait}
                    </Badge>
                  ))}
                </div>

                {/* Sample quote */}
                <div className={`p-3 rounded-lg bg-${avatar.color}-50 dark:bg-${avatar.color}-950/20 border border-${avatar.color}-200 dark:border-${avatar.color}-800`}>
                  <p className="text-sm italic text-center">
                    "{avatar.quote}"
                  </p>
                </div>

                <Button 
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full ${
                    isSelected 
                      ? `bg-${avatar.color}-500 hover:bg-${avatar.color}-600 text-white` 
                      : `border-${avatar.color}-300 text-${avatar.color}-600 hover:bg-${avatar.color}-50`
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAvatarSelect(avatar.id);
                  }}
                >
                  {isSelected ? 'Selected' : 'Choose ' + avatar.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Confirm button */}
      {selectedAvatar && (
        <div className="text-center pt-8">
          <Button 
            size="lg" 
            onClick={onConfirm}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-12 py-3 text-lg shadow-lg"
          >
            Start Your Journey Together
          </Button>
        </div>
      )}
    </div>
  );
};

export default PersonalitySelector;