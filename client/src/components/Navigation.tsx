import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          <Link href="/" className="flex items-center space-x-4 hover-elevate rounded-xl px-4 py-3 transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
              <span className="text-background font-bold text-lg">I&O</span>
            </div>
            <span className="font-serif text-2xl font-semibold text-foreground">Iron & Oak</span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <button
                  data-testid={`link-${link.label.toLowerCase()}`}
                  className={`px-5 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    location === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover-elevate"
                  }`}
                >
                  {link.label}
                </button>
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link href="/contact">
              <Button 
                data-testid="button-schedule" 
                size="lg" 
                className="font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                Schedule a Call
              </Button>
            </Link>
          </div>

          <button
            data-testid="button-mobile-menu"
            className="md:hidden p-3 rounded-xl hover-elevate"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-2xl border-t border-border/50 animate-fade-in">
          <div className="px-6 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <button
                  data-testid={`link-mobile-${link.label.toLowerCase()}`}
                  className={`w-full text-left px-5 py-4 rounded-xl text-base font-medium transition-all ${
                    location === link.href
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover-elevate"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </button>
              </Link>
            ))}
            <Link href="/contact">
              <Button
                data-testid="button-mobile-schedule"
                size="lg"
                className="w-full mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Schedule a Call
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
