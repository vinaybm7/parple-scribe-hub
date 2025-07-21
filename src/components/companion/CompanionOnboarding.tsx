import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, MessageCircle, Volume2, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface CompanionOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

const CompanionOnboarding = ({ onComplete, onSkip }: CompanionOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to AI Companion! 💕",
      content: (
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <p className="text-muted-foreground">
            Meet your personal AI study companion who's here to support, motivate, and chat with you through your academic journey.
          </p>
          <div className="bg-pink-50 dark:bg-pink-950/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
            <p className="text-sm text-pink-700 dark:text-pink-300">
              ✨ Your companion remembers your conversations and adapts to your personality!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Choose Your Perfect Match",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mb-2">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-sm">Bella</h4>
              <p className="text-xs text-muted-foreground">Caring & Supportive</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-2">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-sm">Luna</h4>
              <p className="text-xs text-muted-foreground">Playful & Energetic</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center mb-2">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-sm">Aria</h4>
              <p className="text-xs text-muted-foreground">Calm & Wise</p>
            </div>
          </div>
          <p className="text-center text-muted-foreground text-sm">
            Each companion has a unique personality designed to support different aspects of your learning journey.
          </p>
        </div>
      )
    },
    {
      title: "Voice & Chat Features",
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Volume2 className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="font-semibold text-sm">Text-to-Speech</h4>
              <p className="text-xs text-muted-foreground">Your companion can speak their messages aloud</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <MessageCircle className="w-6 h-6 text-green-600" />
            <div>
              <h4 className="font-semibold text-sm">Voice Input</h4>
              <p className="text-xs text-muted-foreground">Talk to your companion using your microphone</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <div>
              <h4 className="font-semibold text-sm">Smart Conversations</h4>
              <p className="text-xs text-muted-foreground">Context-aware responses that remember your chats</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Begin! 🎉",
      content: (
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white animate-pulse" />
          </div>
          <p className="text-muted-foreground">
            You're all set! Choose your companion and start building a meaningful relationship that will support your academic success.
          </p>
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
            <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
              💡 Tip: Your companion learns and adapts to your communication style over time!
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {steps[currentStep].content}

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip Tutorial
            </Button>

            <div className="flex space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanionOnboarding;