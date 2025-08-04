import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, XCircle, AlertTriangle, TestTube } from 'lucide-react';
import { isAdmin, validateFileUpload, uploadFile, deleteFile, getCurrentUser } from '@/lib/supabase';

interface SecurityTestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const SecurityTest = () => {
  const [results, setResults] = useState<SecurityTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runSecurityTests = async () => {
    setIsRunning(true);
    const testResults: SecurityTestResult[] = [];

    // Test 1: Admin authentication
    try {
      const adminStatus = await isAdmin();
      testResults.push({
        test: 'Admin Authentication',
        status: adminStatus ? 'pass' : 'fail',
        message: adminStatus 
          ? 'Admin authentication is working correctly'
          : 'Admin authentication failed - no authenticated admin user'
      });
    } catch (error) {
      testResults.push({
        test: 'Admin Authentication',
        status: 'fail',
        message: `Admin authentication error: ${error}`
      });
    }

    // Test 2: File validation
    try {
      // Test with valid file
      const validFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      validateFileUpload(validFile);
      
      testResults.push({
        test: 'File Validation (Valid File)',
        status: 'pass',
        message: 'Valid PDF file passed validation'
      });
    } catch (error) {
      testResults.push({
        test: 'File Validation (Valid File)',
        status: 'fail',
        message: `Valid file validation failed: ${error}`
      });
    }

    // Test 3: File validation with invalid file
    try {
      const invalidFile = new File(['test'], 'test.exe', { type: 'application/x-executable' });
      validateFileUpload(invalidFile);
      
      testResults.push({
        test: 'File Validation (Invalid File)',
        status: 'fail',
        message: 'Invalid file type was accepted - security vulnerability!'
      });
    } catch (error) {
      testResults.push({
        test: 'File Validation (Invalid File)',
        status: 'pass',
        message: 'Invalid file type was correctly rejected'
      });
    }

    // Test 4: Path traversal protection
    try {
      const maliciousFile = new File(['test'], '../../../etc/passwd', { type: 'application/pdf' });
      validateFileUpload(maliciousFile);
      
      testResults.push({
        test: 'Path Traversal Protection',
        status: 'fail',
        message: 'Path traversal attempt was not blocked!'
      });
    } catch (error) {
      testResults.push({
        test: 'Path Traversal Protection',
        status: 'pass',
        message: 'Path traversal attempt was correctly blocked'
      });
    }

    // Test 5: Environment variables
    const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
    const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    const hasAdminUIDs = !!import.meta.env.VITE_ADMIN_UIDS;

    testResults.push({
      test: 'Environment Variables',
      status: (hasSupabaseUrl && hasSupabaseKey && hasAdminUIDs) ? 'pass' : 'warning',
      message: `Supabase URL: ${hasSupabaseUrl ? '✓' : '✗'}, Anon Key: ${hasSupabaseKey ? '✓' : '✗'}, Admin UIDs: ${hasAdminUIDs ? '✓' : '✗'}`
    });

    // Test 6: Current user check
    try {
      const { user, error } = await getCurrentUser();
      testResults.push({
        test: 'User Session',
        status: user ? 'pass' : 'warning',
        message: user 
          ? `Authenticated as: ${user.email}`
          : 'No authenticated user session'
      });
    } catch (error) {
      testResults.push({
        test: 'User Session',
        status: 'fail',
        message: `User session check failed: ${error}`
      });
    }

    setResults(testResults);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Shield className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800 border-green-200">PASS</Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-800 border-red-200">FAIL</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">WARNING</Badge>;
      default:
        return <Badge>UNKNOWN</Badge>;
    }
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const warningCount = results.filter(r => r.status === 'warning').length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-6 h-6" />
          Security Test Suite
        </CardTitle>
        <p className="text-sm text-gray-600">
          Run comprehensive security tests to verify system protection
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            onClick={runSecurityTests}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Running Tests...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Run Security Tests
              </div>
            )}
          </Button>
          
          {results.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">{passCount} Passed</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium">{failCount} Failed</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium">{warningCount} Warnings</span>
              </div>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Test Results</h3>
              
              {failCount > 0 && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700">
                    <strong>Security Issues Found:</strong> {failCount} test(s) failed. 
                    Please review and fix the issues before deploying to production.
                  </AlertDescription>
                </Alert>
              )}
              
              {failCount === 0 && warningCount === 0 && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-700">
                    <strong>All Security Tests Passed!</strong> Your system appears to be properly secured.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 border rounded-lg bg-white"
                  >
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{result.test}</h4>
                        {getStatusBadge(result.status)}
                      </div>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Security Checklist</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>✅ Admin authentication required for sensitive operations</p>
            <p>✅ File type and size validation implemented</p>
            <p>✅ Path traversal protection active</p>
            <p>✅ Input sanitization and validation</p>
            <p>✅ Row Level Security (RLS) policies (requires SQL setup)</p>
            <p>✅ Rate limiting for uploads</p>
            <p>✅ Security event logging</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityTest;