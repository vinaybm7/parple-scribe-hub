import { ChevronRight, Home, Heart, MessageCircle, Sparkles, User } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: 'default' | 'enhanced';
}

const Breadcrumbs = ({ items, variant = 'default' }: BreadcrumbsProps) => {
  if (variant === 'enhanced') {
    return (
      <nav className="mb-8">
        {/* Enhanced breadcrumb with background */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-800/20 shadow-lg">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              to="/"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 text-muted-foreground hover:text-foreground group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Home</span>
            </Link>
            
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                {item.href && !item.current ? (
                  <Link
                    to={item.href}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 text-muted-foreground hover:text-foreground group"
                  >
                    {item.icon && (
                      <span className="group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                    )}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200/50 dark:border-purple-800/50">
                    {item.icon && (
                      <span className="text-purple-600 dark:text-purple-400">
                        {item.icon}
                      </span>
                    )}
                    <span className="font-semibold text-foreground">{item.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Current page description */}
          {items.find(item => item.current)?.description && (
            <div className="mt-3 pt-3 border-t border-white/20 dark:border-gray-800/20">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {items.find(item => item.current)?.description}
              </p>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Default breadcrumb style
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Link
        to="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="w-4 h-4" />
          {item.href && !item.current ? (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={item.current ? "text-foreground font-medium" : ""}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;