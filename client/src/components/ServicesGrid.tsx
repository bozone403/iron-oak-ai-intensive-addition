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
    <section className="py-32 bg-gradient-to-b from-background to-card relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <p className="text-sm font-mono text-primary">What We Do</p>
          </div>
          <h2 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Elite Strategic Solutions
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-yellow-500 rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Frameworks designed for operational excellence and strategic clarity in high-pressure environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.title}
              data-testid={`card-service-${index}`}
              className="group p-8 hover-elevate transition-all duration-500 hover:-translate-y-3 bg-gradient-to-br from-card via-card to-primary/5 border-2 hover:border-primary/30 relative overflow-hidden"
              style={{
                animation: `scale-in 0.8s ease-out ${0.1 * index}s both`
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4 leading-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
