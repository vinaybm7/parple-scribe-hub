import { Brain, Mail, Heart, Download, Book, Users, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary via-primary-dark to-primary text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Platform */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">Platform</h4>
            <div className="space-y-3">
              <Link to="/about" className="block text-white/80 hover:text-white transition-colors">
                About
              </Link>
              <Link to="/companion" className="block text-white/80 hover:text-white transition-colors">
                AI Companions
              </Link>
              <Link to="/voice-learning" className="block text-white/80 hover:text-white transition-colors">
                Voice Learning
              </Link>
              <Link to="/contact" className="block text-white/80 hover:text-white transition-colors">
                Support Hub
              </Link>
              <Link to="/feedback" className="block text-white/80 hover:text-white transition-colors">
                Feedback
              </Link>
              <Link to="/privacy" className="block text-white/80 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Study Resources */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">Study Resources</h4>
            <div className="space-y-3">
              <Link to="/guides/ai-study-guide" className="block text-white/80 hover:text-white transition-colors">
                AI Study Guide
              </Link>
              <Link to="/guides/voice-learning" className="block text-white/80 hover:text-white transition-colors">
                Voice Learning Tips
              </Link>
              <Link to="/guides/companion-tips" className="block text-white/80 hover:text-white transition-colors">
                Companion Study Tips
              </Link>
              <Link to="/guides/personal-paths" className="block text-white/80 hover:text-white transition-colors">
                Personal Learning Paths
              </Link>
              <Link to="/guides/smart-notes" className="block text-white/80 hover:text-white transition-colors">
                AI-Enhanced Notes
              </Link>
              <Link to="/guides/exam-prep-ai" className="block text-white/80 hover:text-white transition-colors">
                Exam Prep with AI
              </Link>
            </div>
          </div>

          {/* AI Features */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">AI Features</h4>
            <div className="space-y-3">
              <Link to="/companions/luna" className="block text-white/80 hover:text-white transition-colors">
                Meet Luna
              </Link>
              <Link to="/companions/aria" className="block text-white/80 hover:text-white transition-colors">
                Meet Aria
              </Link>
              <Link to="/guides/voice-interaction" className="block text-white/80 hover:text-white transition-colors">
                Voice Interaction Guide
              </Link>
              <Link to="/guides/ai-techniques" className="block text-white/80 hover:text-white transition-colors">
                AI Study Techniques
              </Link>
              <Link to="/guides/learning-analytics" className="block text-white/80 hover:text-white transition-colors">
                Learning Analytics
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">Connect</h4>
            <div className="space-y-3">
              <a 
                href="mailto:hello@parplenotes.com" 
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>hello@parplenotes.com</span>
              </a>
              <div className="text-white/80 text-sm">
                <p>Empowering Students</p>
                <p>Across India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">Parple Notes</span>
            </Link>
            
            <div className="text-center md:text-right">
              <p className="text-white/80 text-sm">
                © 2024 Parple Notes. AI-powered learning made with{" "}
                <Heart className="inline h-4 w-4 text-red-400 mx-1" />
                for engineering students in India
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;