import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg transition-all duration-200 hover:bg-white/15 will-change-transform">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-purple-600 drop-shadow-sm" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">Parple Notes</span>
        </Link>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex items-center space-x-2 flex-1 justify-center">
          <Link
            to="/"
            className="relative text-gray-800 hover:text-purple-600 transition-all duration-300 font-medium px-4 py-2 rounded-full bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/30 hover:border-white/40 shadow-sm hover:shadow-lg hover:shadow-purple-500/20 group overflow-hidden"
          >
            <span className="relative z-10 font-semibold drop-shadow-sm">Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-3/4 transition-all duration-300"></div>
          </Link>
          <Link
            to="/notes"
            className="relative text-gray-800 hover:text-purple-600 transition-all duration-300 font-medium px-4 py-2 rounded-full bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/30 hover:border-white/40 shadow-sm hover:shadow-lg hover:shadow-purple-500/20 group overflow-hidden"
          >
            <span className="relative z-10 font-semibold drop-shadow-sm">Browse Notes</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-3/4 transition-all duration-300"></div>
          </Link>
          <Link
            to="/companion"
            className="relative text-gray-800 hover:text-purple-600 transition-all duration-300 font-medium px-4 py-2 rounded-full bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/30 hover:border-white/40 shadow-sm hover:shadow-lg hover:shadow-purple-500/20 group overflow-hidden"
          >
            <span className="relative z-10 font-semibold drop-shadow-sm">AI Companion</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-3/4 transition-all duration-300"></div>
          </Link>
          <Link
            to="/about"
            className="relative text-gray-800 hover:text-purple-600 transition-all duration-300 font-medium px-4 py-2 rounded-full bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/30 hover:border-white/40 shadow-sm hover:shadow-lg hover:shadow-purple-500/20 group overflow-hidden"
          >
            <span className="relative z-10 font-semibold drop-shadow-sm">About us</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-3/4 transition-all duration-300"></div>
          </Link>
        </nav>



        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm border border-white/20"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-xl border-t border-white/20 shadow-lg">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/"
              className="block text-gray-800 hover:text-purple-600 transition-colors font-semibold py-2 px-3 rounded-lg hover:bg-white/30 drop-shadow-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/notes"
              className="block text-gray-800 hover:text-purple-600 transition-colors font-semibold py-2 px-3 rounded-lg hover:bg-white/30 drop-shadow-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Notes
            </Link>
            <Link
              to="/companion"
              className="block text-gray-800 hover:text-purple-600 transition-colors font-semibold py-2 px-3 rounded-lg hover:bg-white/30 drop-shadow-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Companion
            </Link>
            <Link
              to="/about"
              className="block text-gray-800 hover:text-purple-600 transition-colors font-semibold py-2 px-3 rounded-lg hover:bg-white/30 drop-shadow-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 border-t border-white/20 space-y-2">
              <Link to="/notes" onClick={() => setIsMenuOpen(false)}>
                <Button variant="default" size="sm" className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white shadow-lg rounded-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;