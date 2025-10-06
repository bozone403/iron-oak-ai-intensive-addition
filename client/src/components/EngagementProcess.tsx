import { Card } from "@/components/ui/card";

export default function EngagementProcess() {
  const steps = [
    {
      number: "01",
      title: "Strategic Assessment",
      description: "Map reality, constraints, and objectives."
    },
    {
      number: "02",
      title: "Architecture Design",
      description: "Define legal, financial, operational, and data frameworks."
    },
    {
      number: "03",
      title: "Implementation Planning",
      description: "Milestones, ownership, and controls."
    },
    {
      number: "04",
      title: "Execution Support",
      description: "Guidance, iteration, and measurable results."
    }
  ];

  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
            Engagement Process
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A disciplined approach to strategy, architecture, and execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={step.number}
              data-testid={`card-step-${index}`}
              className="p-6 relative hover-elevate transition-all duration-300"
            >
              <div className="font-mono text-5xl font-bold text-primary/20 mb-4">
                {step.number}
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/30"></div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
