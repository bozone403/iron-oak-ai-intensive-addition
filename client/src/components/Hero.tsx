import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import portraitImg from "@assets/20250807_1339_Elegant Business Portrait_remix_01k230k4ghf15bff0vv39n7mrc_1759739151101.png";

export default function Hero() {
  const trustMarkers = [
    "Strategic Architecture",
    "Operational Systems",
    "AI Delivery",
    "Risk and Resilience"
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Hard problems, <span className="text-primary">simple systems</span>, durable outcomes.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Iron & Oak designs strategy, operational architecture, and AI systems that hold under pressure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/contact">
                <Button data-testid="button-hero-schedule" size="lg" className="text-base">
                  Book a Strategy Call
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/services">
                <Button data-testid="button-hero-services" size="lg" variant="outline" className="text-base">
                  View Services
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {trustMarkers.map((marker, index) => (
                <div
                  key={marker}
                  data-testid={`trust-marker-${index}`}
                  className="flex items-center gap-2 animate-fade-in-up"
                  style={{ animationDelay: `${0.2 + index * 0.1}s`, animationFillMode: 'both' }}
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{marker}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-slide-in-right lg:justify-self-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-2xl"></div>
              <img
                src={portraitImg}
                alt="J. Kenneth Boisclair, Founder"
                data-testid="img-founder-portrait"
                className="relative w-full max-w-md rounded-2xl border-2 border-primary shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-6 rounded-b-2xl">
                <p className="font-semibold text-foreground">J. Kenneth Boisclair</p>
                <p className="text-sm text-muted-foreground">Founder & Principal Strategist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
