import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CTAGlow } from "@/components/ui/cta-glow";
import { Menu, X, Brain, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FloatingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <header className="bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-border/20">
        <div className="px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gradient">Parple Notes</span>
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

          {/* Get Started CTA */}
          <div className="hidden md:flex items-center">
            <Link to="/notes">
              <Button size="sm" className="font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                Get Started
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
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
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-border/20 rounded-b-2xl">
            <nav className="px-6 py-4 space-y-2">
              <Link
                to="/"
                className="block text-foreground/80 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/notes"
                className="block text-foreground/80 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Notes
              </Link>
              <Link
                to="/subjects"
                className="block text-foreground/80 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Subjects
              </Link>
              <Link
                to="/about"
                className="block text-foreground/80 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About us
              </Link>
              <div className="pt-2 border-t border-border/20">
                <Link to="/notes" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                    Get Started
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default FloatingHeader;