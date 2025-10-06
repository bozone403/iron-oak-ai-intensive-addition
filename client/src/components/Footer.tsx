import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-card-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-background font-bold text-lg">I&O</span>
              </div>
              <span className="font-serif text-2xl font-semibold text-foreground">Iron & Oak</span>
            </div>
            <p className="text-base text-muted-foreground max-w-md leading-relaxed mb-6">
              Strategy, operational architecture, and AI systems for organizations that need to work under pressure.
            </p>
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <p className="text-sm font-mono text-primary">Strategic Excellence</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-foreground mb-6 font-serif">Navigation</h3>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About" },
                { href: "/services", label: "Services" },
                { href: "/projects", label: "Projects" },
                { href: "/contact", label: "Contact" }
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <button data-testid={`link-footer-${link.label.toLowerCase()}`} className="text-base text-muted-foreground hover:text-primary transition-colors duration-300">
                      {link.label}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-foreground mb-6 font-serif">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contact@iron-oak.ca" className="text-base text-muted-foreground hover:text-primary transition-colors duration-300">
                  contact@iron-oak.ca
                </a>
              </li>
              <li>
                <a href="mailto:strategy@iron-oak.ca" className="text-base text-muted-foreground hover:text-primary transition-colors duration-300">
                  strategy@iron-oak.ca
                </a>
              </li>
              <li>
                <a href="mailto:projects@iron-oak.ca" className="text-base text-muted-foreground hover:text-primary transition-colors duration-300">
                  projects@iron-oak.ca
                </a>
              </li>
            </ul>
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">
                Strategic Partner
              </p>
              <p className="text-sm text-foreground font-medium">
                The House of Clairwood Foundation
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Iron & Oak Strategic Solutions. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy">
              <button data-testid="link-footer-privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                Privacy Policy
              </button>
            </Link>
            <Link href="/terms">
              <button data-testid="link-footer-terms" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                Terms of Service
              </button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
