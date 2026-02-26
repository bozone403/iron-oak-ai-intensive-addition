import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import portraitImg from "@assets/20250807_1339_Elegant Business Portrait_remix_01k230k4ghf15bff0vv39n7mrc_1759739151101.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-3xl rounded-full animate-float"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-10">
            <div 
              className="animate-fade-in-up"
              style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            >
              <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <p className="text-sm font-mono text-primary">Strategic Architecture</p>
              </div>
              <h1 className="font-serif text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.1] mb-8 tracking-tight">
                Hard problems,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-yellow-500 animate-shimmer">
                  simple systems
                </span>
                , durable outcomes.
              </h1>
            </div>
            
            <p 
              className="text-xl lg:text-2xl text-muted-foreground leading-relaxed animate-fade-in-up"
              style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
            >
              Iron & Oak designs strategy, operational architecture, and AI systems that hold under pressure.
            </p>
            
            <div 
              className="flex flex-col sm:flex-row gap-6 animate-fade-in-up"
              style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
            >
              <Link href="/contact">
                <Button 
                  data-testid="button-hero-schedule" 
                  size="lg" 
                  className="text-lg px-10 py-7 shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                >
                  Book a Strategy Call
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/services">
                <Button 
                  data-testid="button-hero-services" 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-10 py-7 border-2 hover:bg-primary/5 transition-all duration-300"
                >
                  View Services
                </Button>
              </Link>
            </div>

            <div 
              className="grid grid-cols-2 gap-6 pt-8 border-t border-border/50 animate-fade-in-up"
              style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
            >
              {["Strategic Architecture", "Operational Systems", "AI Delivery", "Risk & Resilience"].map((marker, index) => (
                <div
                  key={marker}
                  data-testid={`trust-marker-${index}`}
                  className="flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 animate-pulse"></div>
                  <span className="text-sm text-muted-foreground font-medium">{marker}</span>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="animate-slide-in-left lg:justify-self-end"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-yellow-500 to-primary rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-700 animate-shimmer"></div>
              <div className="relative">
                <div className="absolute -inset-6 bg-primary/5 rounded-3xl backdrop-blur-xl"></div>
                <img
                  src={portraitImg}
                  alt="J. Kenneth Boisclair, Founder"
                  data-testid="img-founder-portrait"
                  className="relative w-full max-w-lg rounded-3xl border-2 border-primary/30 shadow-2xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent p-8 rounded-b-3xl backdrop-blur-sm">
                  <p className="font-semibold text-xl text-foreground mb-1">J. Kenneth Boisclair</p>
                  <p className="text-base text-primary font-medium">Founder & Principal Strategist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
