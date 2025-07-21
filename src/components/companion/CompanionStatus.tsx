import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Wifi, 
  WifiOff, 
  Zap, 
  Clock, 
  Heart, 
  AlertCircle, 
  CheckCircle,
  Activity
} from 'lucide-react';

interface CompanionStatusProps {
  isVisible: boolean;
  responseTime?: number;
  errorCount?: number;
  totalMessages?: number;
}

const CompanionStatus = ({ 
  isVisible, 
  responseTime = 0, 
  errorCount = 0, 
  totalMessages = 0 
}: CompanionStatusProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiStatus, setApiStatus] = useState<'healthy' | 'slow' | 'error'>('healthy');

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Determine API status based on response time and errors
  useEffect(() => {
    if (errorCount > totalMessages * 0.2) {
      setApiStatus('error');
    } else if (responseTime > 5000) {
      setApiStatus('slow');
    } else {
      setApiStatus('healthy');
    }
  }, [responseTime, errorCount, totalMessages]);

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500';
    switch (apiStatus) {
      case 'healthy': return 'text-green-500';
      case 'slow': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    switch (apiStatus) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'slow': return <Clock className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    switch (apiStatus) {
      case 'healthy': return 'All Systems Operational';
      case 'slow': return 'Slower Than Usual';
      case 'error': return 'Experiencing Issues';
      default: return 'Checking Status...';
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border z-40">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={getStatusColor()}>
              {getStatusIcon()}
            </div>
            <span className="text-sm font-medium">Companion Status</span>
          </div>
          <Badge 
            variant={apiStatus === 'healthy' ? 'default' : apiStatus === 'slow' ? 'secondary' : 'destructive'}
            className="text-xs"
          >
            {getStatusText()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <Wifi className={`w-3 h-3 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-muted-foreground">
              {isOnline ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Zap className="w-3 h-3 text-blue-500" />
            <span className="text-muted-foreground">
              {responseTime > 0 ? `${(responseTime / 1000).toFixed(1)}s` : 'Ready'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Heart className="w-3 h-3 text-pink-500" />
            <span className="text-muted-foreground">
              {totalMessages} messages
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Activity className="w-3 h-3 text-purple-500" />
            <span className="text-muted-foreground">
              {errorCount === 0 ? 'No errors' : `${errorCount} errors`}
            </span>
          </div>
        </div>

        {!isOnline && (
          <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-700 dark:text-red-300">
              You're offline. Some features may not work properly.
            </p>
          </div>
        )}

        {apiStatus === 'error' && (
          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Experiencing connection issues. Responses may be delayed.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanionStatus;