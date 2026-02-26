import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function ServicesList() {
  const services = [
    {
      title: "Strategic Business Architecture",
      summary: "Exclusive frameworks for operational excellence and growth. We design operating models that align leadership, numbers, and delivery.",
      category: "Strategy"
    },
    {
      title: "AI System Integration",
      summary: "AI implementation that creates asymmetric advantage. We integrate models and workflows where they move numbers, not where they add noise.",
      category: "Technology"
    },
    {
      title: "Executive Project Management",
      summary: "Oversight and delivery for critical initiatives with disciplined cadence and risk control.",
      category: "Execution"
    },
    {
      title: "Operational Optimization",
      summary: "Process redesign to remove friction and increase throughput with measurable standards.",
      category: "Operations"
    },
    {
      title: "Persona System Deployment",
      summary: "Strategic identity and communication frameworks for founders and operators.",
      category: "Strategy"
    },
    {
      title: "Startup and Venture Strategy",
      summary: "Foundations and growth plans that are realistic, staged, and accountable.",
      category: "Growth"
    },
    {
      title: "Full-Stack Automation Planning",
      summary: "End-to-end automation design across teams and tools with clear ownership and observability.",
      category: "Technology"
    },
    {
      title: "Trust Mapping and Governance Architecture",
      summary: "Governance designs that separate risk and preserve optionality without overexposure.",
      category: "Governance"
    },
    {
      title: "Corporate Structuring and Entity Design",
      summary: "Entity architectures aligned to strategy, control, and clean execution.",
      category: "Legal"
    },
    {
      title: "Treasury and Capital Strategy",
      summary: "Cash, credit, and runway frameworks that stabilize operations under pressure.",
      category: "Finance"
    },
    {
      title: "Compliance and Policy Systems",
      summary: "Practical policies that guide action, training, and audit-ready documentation.",
      category: "Compliance"
    },
    {
      title: "Risk, Resilience, and Continuity",
      summary: "Failure-tolerant planning with tested triggers and recovery lanes.",
      category: "Risk"
    },
    {
      title: "Data, Automation, and AI Pipelines",
      summary: "Data flows, agents, and observability tied to real metrics and governance.",
      category: "Data"
    }
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
      
      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <p className="text-sm font-mono text-primary">Our Services</p>
          </div>
          <h2 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Strategic Services
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-yellow-500 rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Elite consulting solutions designed for operational excellence and strategic clarity. 
            Each engagement is customized to context and objectives.
          </p>
        </div>

        <div className="space-y-6">
          {services.map((service, index) => (
            <Card
              key={service.title}
              data-testid={`card-service-${index}`}
              className="group p-8 hover-elevate transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/30 relative overflow-hidden"
              style={{
                animation: `fade-in-up 0.6s ease-out ${0.05 * index}s both`
              }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
              <div className="relative flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <span className="text-xs font-mono text-primary">{service.category}</span>
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {service.summary}
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all flex-shrink-0 mt-2" />
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <p className="text-xl text-foreground mb-6 font-medium">
            Ready to discuss your specific needs?
          </p>
          <Link href="/contact">
            <button data-testid="button-services-contact" className="text-primary font-semibold text-lg hover:underline transition-all">
              Contact us for a strategic consultation →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
