import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CTAGlow } from "@/components/ui/cta-glow";
import { Menu, X, Brain, Search, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const FloatingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-4xl px-4 transition-all duration-300">
      {/* Multi-layered Glassmorphism Frame */}
      <div className="relative">
        {/* Background blur layers */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/15 border border-white/25 rounded-full shadow-2xl transform rotate-0.5 scale-[1.01]" 
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}></div>
        <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/12 to-purple-500/8 border border-white/30 rounded-full shadow-xl transform -rotate-0.3"
          style={{
            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
          }}></div>
        
        <header className="relative backdrop-blur-xl bg-gradient-to-t from-white/25 via-white/20 to-white/15 border border-white/40 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300"
          style={{
            boxShadow: '0 15px 30px -8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}>
        <div className="px-6 h-16 flex items-center justify-between">
          {/* Logo with Elegant Hover Effect */}
          <Link to="/" className="flex items-center space-x-2 group transition-all duration-300 hover:scale-105">
            <Brain className="h-6 w-6 text-purple-600 drop-shadow-sm group-hover:text-pink-600 transition-all duration-300 group-hover:rotate-12 group-hover:drop-shadow-lg" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-300">
              Parple Notes
            </span>
          </Link>

          {/* Desktop Navigation with Elegant Hover Effects */}
          <nav className="hidden md:flex items-center space-x-3">
            <Link
              to="/"
              className="relative text-gray-800 hover:text-purple-600 transition-all duration-300 font-semibold px-5 py-2 rounded-full bg-white/30 hover:bg-white/60 backdrop-blur-md border border-white/40 hover:border-purple-300/60 shadow-lg hover:shadow-2xl group overflow-hidden transform hover:scale-105 hover:-translate-y-0.5"
              style={{ 
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Elegant glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <span className="relative z-10">Home</span>
            </Link>
            <Link
              to="/notes"
              className="relative text-gray-800 hover:text-purple-600 transition-all duration-300 font-semibold px-5 py-2 rounded-full bg-white/30 hover:bg-white/60 backdrop-blur-md border border-white/40 hover:border-purple-300/60 shadow-lg hover:shadow-2xl group overflow-hidden transform hover:scale-105 hover:-translate-y-0.5"
              style={{ 
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <span className="relative z-10">Browse Notes</span>
            </Link>
            <Link
              to="/companion"
              className="relative text-gray-800 hover:text-purple-600 transition-all duration-300 font-semibold px-5 py-2 rounded-full bg-white/30 hover:bg-white/60 backdrop-blur-md border border-white/40 hover:border-purple-300/60 shadow-lg hover:shadow-2xl group overflow-hidden transform hover:scale-105 hover:-translate-y-0.5"
              style={{ 
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <span className="relative z-10">AI Companion</span>
            </Link>
            <Link
              to="/about"
              className="relative text-gray-800 hover:text-purple-600 transition-all duration-300 font-semibold px-5 py-2 rounded-full bg-white/30 hover:bg-white/60 backdrop-blur-md border border-white/40 hover:border-purple-300/60 shadow-lg hover:shadow-2xl group overflow-hidden transform hover:scale-105 hover:-translate-y-0.5"
              style={{ 
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <span className="relative z-10">About us</span>
            </Link>
          </nav>



          {/* Enhanced Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-800 hover:text-purple-600 transition-all duration-300 bg-white/30 hover:bg-white/60 rounded-full backdrop-blur-md border border-white/40 hover:border-purple-300/60 shadow-lg hover:shadow-xl transform hover:scale-110 hover:-translate-y-0.5 group"
            style={{
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.1)'
            }}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Menu className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden backdrop-blur-xl bg-gradient-to-b from-white/25 via-white/20 to-white/15 border-t border-white/30 rounded-b-2xl shadow-2xl"
            style={{
              boxShadow: '0 15px 30px -8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}>
            <nav className="px-6 py-4 space-y-2">
              <Link
                to="/"
                className="block text-gray-800 hover:text-purple-600 transition-all duration-300 font-semibold py-3 px-4 rounded-xl hover:bg-white/40 backdrop-blur-sm border border-transparent hover:border-purple-200/50 hover:shadow-lg transform hover:scale-105 hover:translate-x-2 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Home
                </span>
              </Link>
              <Link
                to="/notes"
                className="block text-gray-800 hover:text-purple-600 transition-all duration-300 font-semibold py-3 px-4 rounded-xl hover:bg-white/40 backdrop-blur-sm border border-transparent hover:border-purple-200/50 hover:shadow-lg transform hover:scale-105 hover:translate-x-2 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Browse Notes
                </span>
              </Link>
              <Link
                to="/companion"
                className="block text-gray-800 hover:text-purple-600 transition-all duration-300 font-semibold py-3 px-4 rounded-xl hover:bg-white/40 backdrop-blur-sm border border-transparent hover:border-purple-200/50 hover:shadow-lg transform hover:scale-105 hover:translate-x-2 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  AI Companion
                </span>
              </Link>
              <Link
                to="/about"
                className="block text-gray-800 hover:text-purple-600 transition-all duration-300 font-semibold py-3 px-4 rounded-xl hover:bg-white/40 backdrop-blur-sm border border-transparent hover:border-purple-200/50 hover:shadow-lg transform hover:scale-105 hover:translate-x-2 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  About us
                </span>
              </Link>

            </nav>
          </div>
        )}
        </header>
      </div>
    </div>
  );
};

export default FloatingHeader;