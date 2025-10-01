import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Lock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/lib/firebase';
import { toast } from 'sonner';

const Navigation = () => {
  const location = useLocation();
  const { user } = useAuth();

  const handleLogout = async () => {
    const { error } = await logoutUser();
    if (error) {
      toast.error('Logout failed', { description: error });
    } else {
      toast.success('Logged out successfully');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-card transition-all duration-300 group-hover:shadow-hover group-hover:scale-105">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ClassTrack
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/admin">
                  <Button 
                    variant={location.pathname === '/admin' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm" className="gap-2">
                  <Lock className="h-4 w-4" />
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
