import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
          Ready to discuss your strategic needs?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          We respond to selected inquiries that fit our mandate.
        </p>
        <Link href="/contact">
          <Button data-testid="button-cta-schedule" size="lg" className="text-base">
            Book a Strategy Call
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
