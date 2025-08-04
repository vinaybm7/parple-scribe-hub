import { Brain, Mail, Heart, Download, Book, Users, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Footer = () => {
  const { elementRef: footerRef, isVisible: footerVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <footer 
      ref={footerRef as any}
      className={`bg-white/20 backdrop-blur-2xl text-gray-800 border-t border-white/30 relative overflow-hidden mt-16 scroll-fade-in ${footerVisible ? 'visible' : ''}`}
      style={{
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 -8px 32px rgba(0, 0, 0, 0.1)'
      }}>
      {/* Enhanced background gradient for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/40 to-blue-50/50"></div>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Platform */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6 text-lg drop-shadow-sm">Platform</h4>
            <div className="space-y-4">
              <Link to="/about" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                About
              </Link>
              <Link to="/companion" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                AI Companions
              </Link>
              <Link to="/voice-learning" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                Voice Learning
              </Link>
              <Link to="/contact" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                Support Hub
              </Link>
              <Link to="/feedback" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                Feedback
              </Link>
              <Link to="/privacy" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Study Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6 text-lg drop-shadow-sm">Study Resources</h4>
            <div className="space-y-4">
              <Link to="/guides/ai-study-guide" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                AI Study Guide
              </Link>
              <Link to="/guides/voice-learning" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                Voice Learning Tips
              </Link>
              <Link to="/guides/companion-tips" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                Companion Study Tips
              </Link>
              <Link to="/guides/personal-paths" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                Personal Learning Paths
              </Link>
              <Link to="/guides/smart-notes" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                AI-Enhanced Notes
              </Link>
              <Link to="/guides/exam-prep-ai" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                Exam Prep with AI
              </Link>
            </div>
          </div>

          {/* AI Features */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6 text-lg drop-shadow-sm">AI Features</h4>
            <div className="space-y-4">
              <Link to="/companions/luna" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                Meet Luna
              </Link>
              <Link to="/companions/zyan" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                Meet Zyan
              </Link>
              <Link to="/companions/aria" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                Meet Aria
              </Link>
              <Link to="/guides/voice-interaction" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                Voice Interaction Guide
              </Link>
              <Link to="/guides/ai-techniques" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                AI Study Techniques
              </Link>
              <Link to="/guides/learning-analytics" className="block text-gray-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 hover:drop-shadow-sm">
                Learning Analytics
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6 text-lg drop-shadow-sm">Connect</h4>
            <div className="space-y-4">
              <a 
                href="mailto:parplenotes@gmail.com" 
                className="flex items-center space-x-2 text-gray-800 hover:text-purple-600 transition-all duration-200 hover:drop-shadow-sm"
              >
                <Mail className="h-4 w-4" />
                <span>parplenotes@gmail.com</span>
              </a>
              <div className="text-gray-700 text-sm">
                <p>Empowering Students</p>
                <p>Across India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/30 mt-12 pt-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 mb-6 md:mb-0 group">
              <Brain className="h-8 w-8 text-purple-600 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">Parple Notes</span>
            </Link>
            
            <div className="text-center md:text-right">
              <p className="text-gray-800 text-sm drop-shadow-sm mb-2">
                © 2024 Parple Notes. AI-powered learning made with{" "}
                <Heart className="inline h-4 w-4 text-red-500 mx-1 animate-pulse" />
                for engineering students in India
              </p>
              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-end space-x-4 mt-2">
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;