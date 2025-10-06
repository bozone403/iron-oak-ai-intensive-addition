import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Building2, Plane, Users, Home, Shield, Database, Lightbulb } from "lucide-react";

export default function ProjectsShowcase() {
  const projects = [
    {
      icon: Brain,
      title: "PrometheusOS",
      category: "AI Financial Governance",
      description: "Banking firewall for multi-entity financial governance and compliance integration with AML/KYC readiness.",
      status: "In Development"
    },
    {
      icon: Users,
      title: "CivicOS",
      category: "Governance Platform",
      description: "Verifiable governance platform operated under strategic partnership with The House of Clairwood Foundation.",
      status: "Partnership"
    },
    {
      icon: Plane,
      title: "Elysian Expeditions",
      category: "AI Travel Concierge",
      description: "AI-powered luxury travel concierge delivering bespoke experiences through intelligent automation.",
      status: "Active"
    },
    {
      icon: Database,
      title: "PersonaOS",
      category: "AI Execution Framework",
      description: "Strategic identity and communication frameworks for founders and operators, powered by AI.",
      status: "Active"
    },
    {
      icon: Lightbulb,
      title: "ScheduleOS",
      category: "AI Execution Framework",
      description: "Intelligent scheduling and task management system that optimizes operational workflows.",
      status: "Active"
    },
    {
      icon: Building2,
      title: "The Dominion Stack",
      category: "Sovereign Infrastructure",
      description: "Comprehensive habitat infrastructure system with 14 integrated pods for resilient operations.",
      status: "Engineering"
    },
    {
      icon: Home,
      title: "Eco-Cube Developments",
      category: "Modular Housing",
      description: "Advanced modular shelter solutions ranging from economy to hardened subterranean models.",
      status: "Engineering"
    },
    {
      icon: Shield,
      title: "Tactical Systems",
      category: "Defense Technology",
      description: "Research and development of advanced defense systems, tactical gear, and operational training programs.",
      status: "R&D"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-primary/10 text-primary border-primary/20";
      case "In Development":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Engineering":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Partnership":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "R&D":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
            Portfolio of Innovations
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Strategic initiatives across AI systems, infrastructure, and operational technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card
              key={project.title}
              data-testid={`card-project-${index}`}
              className="p-6 hover-elevate transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <project.icon className="w-6 h-6 text-primary" />
                </div>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-lg text-foreground mb-1">
                {project.title}
              </h3>
              <p className="text-sm text-primary mb-3 font-mono">
                {project.category}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
