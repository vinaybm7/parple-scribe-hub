import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { getAvailableElevenLabsApiKey, markApiKeyAsFailed, ELEVENLABS_API_KEY_POOL, getApiKeyPoolStatus } from '@/lib/production-env';

const ElevenLabsKeyManager: React.FC = () => {
  const [newApiKey, setNewApiKey] = useState('');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render

  const currentApiKey = getAvailableElevenLabsApiKey();
  const poolStatus = getApiKeyPoolStatus();

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
    setRefreshKey(prev => prev + 1); // Force refresh
  };

  const handleRefreshPool = () => {
    setRefreshKey(prev => prev + 1);
    window.location.reload();
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
              onClick={handleRefreshPool}
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

      {/* Enhanced Key Pool Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">API Key Pool Status ({ELEVENLABS_API_KEY_POOL.length} keys)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground mb-3">
              <p>The system automatically rotates between available API keys.</p>
              <p>Failed keys are marked and skipped until manually reset.</p>
            </div>
            
            {/* Display all keys in the pool with enhanced status */}
            <div className="space-y-2">
              {poolStatus.allKeys.map((keyInfo) => {
                return (
                  <div key={keyInfo.index} className={`flex items-center justify-between p-3 rounded border ${
                    keyInfo.isCurrent ? 'bg-green-50 border-green-200' : 
                    keyInfo.isFailed ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Badge variant={keyInfo.isCurrent ? "default" : "outline"} className="text-xs">
                        Key {keyInfo.index}
                      </Badge>
                      <code className="text-xs font-mono">{keyInfo.preview}</code>
                      <div className="flex gap-1">
                        {keyInfo.isCurrent && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            ACTIVE
                          </Badge>
                        )}
                        {keyInfo.isFailed && (
                          <Badge variant="destructive" className="text-xs">
                            FAILED
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => testApiKey(keyInfo.key)}
                        disabled={isTestingKey}
                        className="h-6 px-2 text-xs"
                      >
                        Test
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(keyInfo.key)}
                        className="h-6 px-2 text-xs"
                      >
                        Copy
                      </Button>
                      {keyInfo.isFailed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Reset this specific key (you'd need to implement this)
                            handleRefreshPool();
                          }}
                          className="h-6 px-2 text-xs text-blue-600"
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Enhanced Pool Statistics */}
            <div className="pt-3 border-t">
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="font-medium">Total Keys:</span> {poolStatus.totalKeys}
                </div>
                <div>
                  <span className="font-medium">Active Key:</span> Key {poolStatus.allKeys.find(k => k.isCurrent)?.index || 'None'}
                </div>
                <div>
                  <span className="font-medium">Failed Keys:</span> {poolStatus.failedKeys.length}
                </div>
              </div>
              
              {/* Show failed keys if any */}
              {poolStatus.failedKeys.length > 0 && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <div className="text-xs text-red-700">
                    <strong>Failed Keys:</strong> {poolStatus.failedKeys.length} key(s) are currently marked as failed
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElevenLabsKeyManager;