import { BookOpen, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground/5 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gradient">Parple Notes</span>
            </Link>
            <p className="text-muted-foreground">
              Empowering engineering students with quality notes and study materials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/notes" className="block text-muted-foreground hover:text-primary transition-colors">
                Browse Notes
              </Link>
              <Link to="/subjects" className="block text-muted-foreground hover:text-primary transition-colors">
                Subjects
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Popular Subjects</h4>
            <div className="space-y-2">
              <Link to="/subjects/computer-science" className="block text-muted-foreground hover:text-primary transition-colors">
                Computer Science
              </Link>
              <Link to="/subjects/electrical" className="block text-muted-foreground hover:text-primary transition-colors">
                Electrical Engineering
              </Link>
              <Link to="/subjects/mechanical" className="block text-muted-foreground hover:text-primary transition-colors">
                Mechanical Engineering
              </Link>
              <Link to="/subjects/mathematics" className="block text-muted-foreground hover:text-primary transition-colors">
                Mathematics
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <div className="space-y-2">
              <a 
                href="mailto:contact@parplenotes.com" 
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>contact@parplenotes.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            Made with{" "}
            <Heart className="inline h-4 w-4 text-red-500 mx-1" />
            for engineering students in India
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            © 2024 Parple Notes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;