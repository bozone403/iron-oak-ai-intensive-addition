import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-32 bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      
      <div className="relative max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <div className="inline-block mb-8 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <p className="text-sm font-mono text-primary">Next Step</p>
        </div>
        <h2 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
          Ready to discuss your strategic needs?
        </h2>
        <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          We respond to selected inquiries that fit our mandate.
        </p>
        <Link href="/contact">
          <Button 
            data-testid="button-cta-schedule" 
            size="lg" 
            className="text-lg px-12 py-8 shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
          >
            Book a Strategy Call
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
