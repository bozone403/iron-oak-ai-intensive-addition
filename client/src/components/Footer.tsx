import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">I&O</span>
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">Iron & Oak</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Strategy, operational architecture, and AI systems for organizations that need to work under pressure.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <button data-testid="link-footer-about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    About
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <button data-testid="link-footer-services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Services
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/projects">
                  <button data-testid="link-footer-projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Projects
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <button data-testid="link-footer-contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </button>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@iron-oak.ca" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  contact@iron-oak.ca
                </a>
              </li>
              <li>
                <a href="mailto:strategy@iron-oak.ca" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  strategy@iron-oak.ca
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">
                Strategic Partner:
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                The House of Clairwood Foundation
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Iron & Oak Strategic Solutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy">
              <button data-testid="link-footer-privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </button>
            </Link>
            <Link href="/terms">
              <button data-testid="link-footer-terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
