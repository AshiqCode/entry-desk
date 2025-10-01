import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const location = useLocation();

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
            <Link to="/admin">
              <Button 
                variant={location.pathname === '/admin' ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Manage Classes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
