import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function ServicesList() {
  const services = [
    {
      title: "Strategic Business Architecture",
      summary: "Exclusive frameworks for operational excellence and growth."
    },
    {
      title: "AI System Integration",
      summary: "AI implementation that creates asymmetric advantage."
    },
    {
      title: "Executive Project Management",
      summary: "Oversight and delivery for critical initiatives."
    },
    {
      title: "Operational Optimization",
      summary: "Process design for efficiency and throughput."
    },
    {
      title: "Persona System Deployment",
      summary: "Strategic identity frameworks for founders and operators."
    },
    {
      title: "Startup and Venture Strategy",
      summary: "Foundations for early and growth-stage ventures."
    },
    {
      title: "Full-Stack Automation Planning",
      summary: "End-to-end automation across teams and tools."
    },
    {
      title: "Trust Mapping and Governance Architecture",
      summary: "Governance designs that separate risk and preserve optionality."
    },
    {
      title: "Corporate Structuring and Entity Design",
      summary: "Entity architectures aligned to strategy and control."
    },
    {
      title: "Treasury and Capital Strategy",
      summary: "Cash, credit, and runway frameworks that stabilize operations."
    },
    {
      title: "Compliance and Policy Systems",
      summary: "Practical policies that guide action and protect operations."
    },
    {
      title: "Risk, Resilience, and Continuity",
      summary: "Failure-tolerant planning with measurable safeguards."
    },
    {
      title: "Data, Automation, and AI Pipelines",
      summary: "Data flows and agents tied to real metrics."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
            Strategic Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Elite consulting solutions designed for operational excellence and strategic clarity. 
            Each engagement is customized to context and objectives.
          </p>
        </div>

        <div className="space-y-4">
          {services.map((service, index) => (
            <Card
              key={service.title}
              data-testid={`card-service-${index}`}
              className="p-6 hover-elevate transition-all duration-300 hover:border-primary/50 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.summary}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/contact">
            <button data-testid="button-services-contact" className="text-primary font-medium hover:underline">
              Contact us to discuss your specific needs →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
