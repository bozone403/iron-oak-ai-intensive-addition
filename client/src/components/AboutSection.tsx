import { Card } from "@/components/ui/card";

export default function AboutSection() {
  const principles = [
    "Clarity first.",
    "Architecture before action.",
    "Numbers over narrative.",
    "Ship what works."
  ];

  return (
    <section className="py-24 bg-card">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <h2 className="font-serif text-4xl font-bold text-foreground mb-8">
          About Iron & Oak
        </h2>
        
        <div className="space-y-6 mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Iron & Oak is a strategy and systems firm. We build the plans, controls, and platforms 
            that keep organizations stable and effective.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our work spans strategic architecture, operational systems, and AI integration—designed 
            for organizations that operate under pressure and cannot afford fragile solutions.
          </p>
        </div>

        <div className="mb-12">
          <h3 className="font-semibold text-xl text-foreground mb-6">Operating Principles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {principles.map((principle, index) => (
              <Card
                key={index}
                data-testid={`card-principle-${index}`}
                className="p-6 hover-elevate transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="font-mono text-2xl font-bold text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <p className="text-base text-foreground font-medium pt-1">
                    {principle}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-background rounded-2xl p-8 border border-border">
          <h3 className="font-semibold text-xl text-foreground mb-4">Operating Model</h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            Advisory, architecture, and execution support. We do not publish case studies. 
            We focus on outcomes. Each engagement is customized to context and objectives, 
            with clear deliverables and measurable progress.
          </p>
        </div>
      </div>
    </section>
  );
}
