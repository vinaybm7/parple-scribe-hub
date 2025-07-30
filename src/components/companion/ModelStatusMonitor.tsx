import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { getModelStatus, resetModelStatus, getCurrentModel } from '@/lib/gemini';
import { 
  getOptimizationMetrics, 
  formatMetrics, 
  getOptimizationRecommendations,
  getOptimizationTips,
  resetMetrics 
} from '@/lib/ai-optimization-utils';

interface ModelStatusMonitorProps {
  className?: string;
}

const ModelStatusMonitor: React.FC<ModelStatusMonitorProps> = ({ className = '' }) => {
  const [status, setStatus] = useState(getModelStatus());
  const [currentModel, setCurrentModel] = useState(getCurrentModel());
  const [metrics, setMetrics] = useState(getOptimizationMetrics());
  const [recommendations, setRecommendations] = useState(getOptimizationRecommendations());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getModelStatus());
      setCurrentModel(getCurrentModel());
      setMetrics(getOptimizationMetrics());
      setRecommendations(getOptimizationRecommendations());
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleResetModel = (modelName?: string) => {
    resetModelStatus(modelName);
    setStatus(getModelStatus());
    setCurrentModel(getCurrentModel());
  };

  const handleResetMetrics = () => {
    resetMetrics();
    setMetrics(getOptimizationMetrics());
    setRecommendations(getOptimizationRecommendations());
  };

  const formatTime = (timestamp: number) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString();
  };

  const getModelStatusBadge = (modelName: string) => {
    const modelStatus = status.models[modelName];
    if (!modelStatus) return <Badge variant="secondary">Unknown</Badge>;

    const now = Date.now();
    const isInCooldown = modelStatus.cooldownUntil && now < modelStatus.cooldownUntil;
    
    if (isInCooldown) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Cooldown
      </Badge>;
    }
    
    if (modelStatus.errorCount > 0) {
      return <Badge variant="outline" className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        {modelStatus.errorCount} errors
      </Badge>;
    }
    
    return <Badge variant="default" className="flex items-center gap-1">
      <CheckCircle className="w-3 h-3" />
      Available
    </Badge>;
  };

  const getCooldownTime = (modelName: string) => {
    const modelStatus = status.models[modelName];
    if (!modelStatus?.cooldownUntil) return null;
    
    const remaining = Math.max(0, modelStatus.cooldownUntil - Date.now());
    const minutes = Math.ceil(remaining / 60000);
    return minutes > 0 ? `${minutes}m remaining` : null;
  };

  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          AI Model Status Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Active Model */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Currently Active Model
              </h3>
              <p className="text-blue-700 dark:text-blue-300 font-mono text-sm">
                {currentModel}
              </p>
            </div>
            <Badge variant="default" className="bg-blue-600">
              Active
            </Badge>
          </div>
        </div>

        {/* Request Queue Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Queue Length</h4>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {status.queueLength}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Processing</h4>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {status.isProcessing ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {/* Model Details */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Model Status</h3>
          
          {Object.entries(status.models).map(([modelName, modelStatus]) => (
            <div key={modelName} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium font-mono text-sm">{modelName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {getModelStatusBadge(modelName)}
                    {modelName === status.config.primary && (
                      <Badge variant="outline">Primary</Badge>
                    )}
                    {modelName === status.config.fallback && (
                      <Badge variant="outline">Fallback</Badge>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResetModel(modelName)}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium">Last Used:</span>
                  <br />
                  {formatTime(modelStatus.lastUsed)}
                </div>
                <div>
                  <span className="font-medium">Error Count:</span>
                  <br />
                  {modelStatus.errorCount}
                </div>
              </div>
              
              {modelStatus.lastError && (
                <div className="text-sm">
                  <span className="font-medium text-red-600 dark:text-red-400">Last Error:</span>
                  <p className="text-red-500 dark:text-red-300 mt-1 font-mono text-xs">
                    {modelStatus.lastError}
                  </p>
                </div>
              )}
              
              {getCooldownTime(modelName) && (
                <div className="text-sm">
                  <span className="font-medium text-orange-600 dark:text-orange-400">Cooldown:</span>
                  <p className="text-orange-500 dark:text-orange-300 mt-1">
                    {getCooldownTime(modelName)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Performance Metrics</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 text-sm">Success Rate</h4>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatMetrics(metrics).successRate}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm">Avg Response</h4>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatMetrics(metrics).averageResponseTime}
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-medium text-orange-900 dark:text-orange-100 text-sm">Fallback Rate</h4>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {formatMetrics(metrics).fallbackRate}
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 text-sm">Total Requests</h4>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {formatMetrics(metrics).totalRequests}
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recommendations</h3>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optimization Tips */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Optimization Tips</h3>
          <div className="space-y-2">
            {getOptimizationTips().map((tip, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{tip.title}</h4>
                  <Badge 
                    variant={tip.impact === 'high' ? 'default' : tip.impact === 'medium' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {tip.impact} impact
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={() => handleResetModel()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Models
          </Button>
          <Button
            onClick={handleResetMetrics}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Metrics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelStatusMonitor;