import { Card } from "@/components/ui/card";
import { Target, Zap, Shield, Cpu } from "lucide-react";

export default function ServicesGrid() {
  const services = [
    {
      icon: Target,
      title: "Sovereign-grade Strategy",
      description: "Long-range positioning and decision frameworks built for clarity and control."
    },
    {
      icon: Cpu,
      title: "Operational Architecture",
      description: "Programs, SOPs, and management systems that perform at load."
    },
    {
      icon: Zap,
      title: "AI Systems Integration",
      description: "LLM-driven workflows and automation tied to measurable outcomes."
    },
    {
      icon: Shield,
      title: "Risk and Resilience",
      description: "Failure planning, controls, and buffers that reduce fragility."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
            What We Do
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Elite consulting solutions designed for operational excellence and strategic clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={service.title}
              data-testid={`card-service-${index}`}
              className="p-6 hover-elevate transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
