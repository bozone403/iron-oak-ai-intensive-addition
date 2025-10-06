import { Card } from "@/components/ui/card";

export default function EngagementProcess() {
  const steps = [
    {
      number: "01",
      title: "Strategic Discovery",
      description: "Diagnose where the signal hides beneath the noise."
    },
    {
      number: "02",
      title: "Framework Design",
      description: "Engineer the structures that convert intention into motion."
    },
    {
      number: "03",
      title: "Implementation Planning",
      description: "Build the operational spine: milestones, controls, accountability."
    },
    {
      number: "04",
      title: "Execution Support",
      description: "Measure, adapt, and refine until performance is self-sustaining."
    }
  ];

  return (
    <section className="py-32 bg-card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <p className="text-sm font-mono text-primary">Our Method</p>
          </div>
          <h2 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Engagement Process
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-yellow-500 rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A disciplined approach to strategy, architecture, and execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative"
              style={{
                animation: `fade-in-up 0.8s ease-out ${0.15 * index}s both`
              }}
            >
              <Card
                data-testid={`card-step-${index}`}
                className="h-full p-8 hover-elevate transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-background to-background/50 border-2 hover:border-primary/30 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
                <div className="relative">
                  <div className="font-mono text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-yellow-500 mb-6">
                    {step.number}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-4 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
