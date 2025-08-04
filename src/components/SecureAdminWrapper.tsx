import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, Shield, AlertTriangle } from 'lucide-react';
import AdminLogin from './AdminLogin';
import { isAdmin, signOutAdmin, getCurrentUser, logSecurityEvent } from '@/lib/supabase';

interface SecureAdminWrapperProps {
  children: React.ReactNode;
}

const SecureAdminWrapper = ({ children }: SecureAdminWrapperProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { user: currentUser, error: userError } = await getCurrentUser();
      
      if (userError || !currentUser) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Check admin status
      const adminStatus = await isAdmin();
      
      if (adminStatus) {
        setIsAuthenticated(true);
        setUser(currentUser);
        
        // Log successful admin access
        await logSecurityEvent('admin_access_granted', {
          userId: currentUser.id,
          email: currentUser.email
        });
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setError('Access denied: Admin privileges required');
        
        // Log unauthorized access attempt
        await logSecurityEvent('admin_access_denied', {
          userId: currentUser.id,
          email: currentUser.email,
          reason: 'insufficient_privileges'
        });
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setIsAuthenticated(false);
      setUser(null);
      setError('Authentication check failed');
      
      // Log authentication error
      await logSecurityEvent('admin_auth_error', {
        error: err instanceof Error ? err.message : 'unknown_error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    checkAuthStatus();
  };

  const handleLogout = async () => {
    try {
      await logSecurityEvent('admin_logout', {
        userId: user?.id,
        email: user?.email
      });
      
      await signOutAdmin();
      setIsAuthenticated(false);
      setUser(null);
      setError('');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-blue-50/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div>
        {error && (
          <Alert className="m-4 border-red-200 bg-red-50/80">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-blue-50/80">
      {/* Secure Admin Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">
                  Secure Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Logged in as: {user?.email}
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 hover:bg-white/30 text-gray-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="container mx-auto px-4 py-4">
        <Alert className="border-blue-200 bg-blue-50/80">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-blue-700">
            <strong>Security Notice:</strong> You are accessing a secure administrative area. 
            All actions are monitored and logged. Only perform authorized operations.
          </AlertDescription>
        </Alert>
      </div>

      {/* Admin Content */}
      <div className="container mx-auto px-4 pb-8">
        {children}
      </div>
    </div>
  );
};

export default SecureAdminWrapper;