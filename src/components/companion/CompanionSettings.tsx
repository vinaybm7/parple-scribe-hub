import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Heart, 
  Sparkles, 
  Moon,
  Settings,
  RotateCcw,
  Trash2,
  Zap
} from 'lucide-react';
import ModelStatusMonitor from './ModelStatusMonitor';

interface CompanionSettingsProps {
  avatarId: string;
  isOpen: boolean;
  onClose: () => void;
  onResetConversation: () => void;
  onChangeAvatar: () => void;
}

const CompanionSettings = ({ 
  avatarId, 
  isOpen, 
  onClose, 
  onResetConversation, 
  onChangeAvatar 
}: CompanionSettingsProps) => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState([1.0]);
  const [voicePitch, setVoicePitch] = useState([1.1]);
  const [responseDelay, setResponseDelay] = useState([1.5]);

  const avatarInfo = {
    luna: { name: 'Luna', icon: Sparkles, color: 'purple' },
    aria: { name: 'Aria', icon: Moon, color: 'indigo' }
  };

  const currentAvatar = avatarInfo[avatarId as keyof typeof avatarInfo] || avatarInfo.luna;
  const IconComponent = currentAvatar.icon;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl bg-white dark:bg-gray-900 shadow-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Companion Settings
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="ai-status" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                AI Status
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 p-6 pt-4">
          {/* Current Avatar */}
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-${currentAvatar.color}-400 to-${currentAvatar.color}-600 flex items-center justify-center mb-3`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold">{currentAvatar.name}</h3>
            <Badge variant="secondary" className="mt-1">
              Active Companion
            </Badge>
          </div>

          {/* Voice Settings */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Voice Settings
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Text-to-Speech</span>
                <Switch 
                  checked={voiceEnabled} 
                  onCheckedChange={setVoiceEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Voice Input</span>
                <Switch 
                  checked={micEnabled} 
                  onCheckedChange={setMicEnabled}
                />
              </div>

              {voiceEnabled && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Speech Speed</span>
                      <span>{voiceSpeed[0].toFixed(1)}x</span>
                    </div>
                    <Slider
                      value={voiceSpeed}
                      onValueChange={setVoiceSpeed}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Voice Pitch</span>
                      <span>{voicePitch[0].toFixed(1)}</span>
                    </div>
                    <Slider
                      value={voicePitch}
                      onValueChange={setVoicePitch}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Conversation Settings */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Conversation Settings
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Response Delay</span>
                <span>{responseDelay[0].toFixed(1)}s</span>
              </div>
              <Slider
                value={responseDelay}
                onValueChange={setResponseDelay}
                min={0.5}
                max={3.0}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Simulates natural typing delay
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={onChangeAvatar}
            >
              <Heart className="w-4 h-4 mr-2" />
              Change Companion
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={onResetConversation}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Conversation
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                if (confirm('Are you sure you want to clear all conversation history?')) {
                  onResetConversation();
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All History
            </Button>
          </div>
            </TabsContent>

            <TabsContent value="ai-status" className="p-6 pt-4">
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">AI Model Performance Monitor</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor and manage AI model status, including automatic fallback to Gemini 2.0 Flash when needed.
                  </p>
                </div>
                <ModelStatusMonitor />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanionSettings;