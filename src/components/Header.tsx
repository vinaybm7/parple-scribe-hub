import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-gradient">Parple Notes</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link
            to="/"
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium px-4 py-2 rounded-full bg-muted/50 hover:bg-muted"
          >
            Home
          </Link>
          <Link
            to="/notes"
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium px-4 py-2 rounded-full bg-muted/50 hover:bg-muted"
          >
            Browse Notes
          </Link>
          <Link
            to="/subjects"
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium px-4 py-2 rounded-full bg-muted/50 hover:bg-muted"
          >
            Subjects
          </Link>
          <Link
            to="/about"
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium px-4 py-2 rounded-full bg-muted/50 hover:bg-muted"
          >
            About us
          </Link>
        </nav>

        {/* Login */}
        <div className="hidden md:flex items-center">
          <Button variant="ghost" size="sm" className="text-foreground rounded-full px-4 py-2 font-medium hover:bg-muted">
            Login
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-foreground/80 hover:text-primary transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border/20">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/"
              className="block text-foreground/80 hover:text-primary transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/notes"
              className="block text-foreground/80 hover:text-primary transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Notes
            </Link>
            <Link
              to="/subjects"
              className="block text-foreground/80 hover:text-primary transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Subjects
            </Link>
            <Link
              to="/about"
              className="block text-foreground/80 hover:text-primary transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 border-t border-border/20 space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="default" size="sm" className="w-full button-gradient shadow-primary">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;