import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Zap, 
  BookOpen, 
  Coffee, 
  Target, 
  MessageCircle,
  Sparkles,
  Moon
} from 'lucide-react';

interface CompanionQuickActionsProps {
  avatarId: string;
  onActionClick: (action: string, message: string) => void;
  isVisible: boolean;
}

const CompanionQuickActions = ({ avatarId, onActionClick, isVisible }: CompanionQuickActionsProps) => {
  const getActionsForAvatar = () => {
    const baseActions = [
      {
        id: 'motivation',
        icon: Zap,
        label: 'Motivate Me',
        color: 'from-yellow-400 to-orange-500',
        message: "I need some motivation to keep going with my studies!"
      },
      {
        id: 'study-help',
        icon: BookOpen,
        label: 'Study Help',
        color: 'from-blue-400 to-blue-600',
        message: "Can you help me with my studies? I need some guidance."
      },
      {
        id: 'break-time',
        icon: Coffee,
        label: 'Take a Break',
        color: 'from-green-400 to-green-600',
        message: "I think I need a break. Can we chat about something relaxing?"
      },
      {
        id: 'goal-setting',
        icon: Target,
        label: 'Set Goals',
        color: 'from-purple-400 to-purple-600',
        message: "Help me set some study goals and plan my learning journey."
      }
    ];

    // Avatar-specific actions
    const avatarSpecificActions = {
      bella: [
        {
          id: 'comfort',
          icon: Heart,
          label: 'Need Comfort',
          color: 'from-pink-400 to-pink-600',
          message: "I'm feeling a bit overwhelmed. Can you comfort me, sweetheart?"
        },
        {
          id: 'encouragement',
          icon: Sparkles,
          label: 'Encourage Me',
          color: 'from-rose-400 to-rose-600',
          message: "I could use some loving encouragement right now, darling."
        }
      ],
      luna: [
        {
          id: 'energy-boost',
          icon: Zap,
          label: 'Energy Boost',
          color: 'from-purple-400 to-purple-600',
          message: "I need an energy boost! Let's get excited about studying!"
        },
        {
          id: 'fun-study',
          icon: Sparkles,
          label: 'Make It Fun',
          color: 'from-indigo-400 to-indigo-600',
          message: "How can we make studying more fun and exciting?"
        }
      ],
      aria: [
        {
          id: 'calm-down',
          icon: Moon,
          label: 'Find Peace',
          color: 'from-indigo-400 to-indigo-600',
          message: "I'm feeling stressed. Help me find some inner peace and calm."
        },
        {
          id: 'mindfulness',
          icon: Heart,
          label: 'Mindfulness',
          color: 'from-blue-400 to-blue-600',
          message: "Guide me through some mindful studying techniques, please."
        }
      ]
    };

    const specificActions = avatarSpecificActions[avatarId as keyof typeof avatarSpecificActions] || [];
    return [...baseActions, ...specificActions];
  };

  if (!isVisible) return null;

  const actions = getActionsForAvatar();

  return (
    <Card className="fixed bottom-4 left-4 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border z-40">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <MessageCircle className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium">Quick Actions</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => onActionClick(action.id, action.message)}
                className={`h-auto p-3 flex flex-col items-center space-y-1 bg-gradient-to-br ${action.color} text-white border-0 hover:opacity-90 transition-opacity`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-xs font-medium text-center leading-tight">
                  {action.label}
                </span>
              </Button>
            );
          })}
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">
            Click any action to start a conversation
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanionQuickActions;