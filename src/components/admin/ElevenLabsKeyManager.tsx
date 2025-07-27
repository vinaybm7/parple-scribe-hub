import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { getAvailableElevenLabsApiKey, markApiKeyAsFailed } from '@/lib/production-env';

const ElevenLabsKeyManager: React.FC = () => {
  const [newApiKey, setNewApiKey] = useState('');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const currentApiKey = getAvailableElevenLabsApiKey();

  const testApiKey = async (apiKey: string) => {
    setIsTestingKey(true);
    setTestResult(null);

    try {
      // Test the API key by making a simple request to ElevenLabs
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'xi-api-key': apiKey
        }
      });

      if (response.ok) {
        setTestResult({ success: true, message: 'API key is valid and has credits!' });
      } else if (response.status === 401) {
        setTestResult({ success: false, message: 'Invalid API key' });
      } else if (response.status === 429) {
        setTestResult({ success: false, message: 'API key has exceeded quota/credits' });
      } else {
        setTestResult({ success: false, message: `API error: ${response.status}` });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Network error or invalid key' });
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleTestCurrentKey = () => {
    testApiKey(currentApiKey);
  };

  const handleTestNewKey = () => {
    if (newApiKey.trim()) {
      testApiKey(newApiKey.trim());
    }
  };

  const handleMarkCurrentKeyAsFailed = () => {
    markApiKeyAsFailed(currentApiKey, 'Manually marked as failed');
    setTestResult({ success: false, message: 'Current key marked as failed. System will use next available key.' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            ElevenLabs API Key Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current API Key Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Active API Key</label>
            <div className="flex items-center gap-2">
              <Input
                value={currentApiKey ? `${currentApiKey.substring(0, 15)}...` : 'No key available'}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(currentApiKey)}
                disabled={!currentApiKey}
              >
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestCurrentKey}
                disabled={isTestingKey || !currentApiKey}
              >
                {isTestingKey ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Test'}
              </Button>
            </div>
          </div>

          {/* Test New API Key */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Test New API Key</label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="sk_your_new_api_key_here"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                className="font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNewKey}
                disabled={isTestingKey || !newApiKey.trim()}
              >
                {isTestingKey ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Test'}
              </Button>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {testResult.success ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{testResult.message}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleMarkCurrentKeyAsFailed}
              disabled={!currentApiKey}
            >
              Mark Current Key as Failed
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Refresh Key Pool
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
            <p><strong>To update API keys permanently:</strong></p>
            <p>1. Run: <code className="bg-gray-100 px-1 rounded">npm run update-elevenlabs-key sk_new_key</code></p>
            <p>2. Update Vercel environment variables</p>
            <p>3. Redeploy the application</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Pool Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">API Key Pool Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            <p>The system automatically rotates between available API keys.</p>
            <p>Failed keys are marked and skipped until manually reset.</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Current: {currentApiKey ? `${currentApiKey.substring(0, 10)}...` : 'None'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElevenLabsKeyManager;