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
      status: "In Development",
      color: "from-blue-500/20 to-blue-500/5"
    },
    {
      icon: Users,
      title: "CivicOS",
      category: "Governance Platform",
      description: "Verifiable governance platform operated under strategic partnership with The House of Clairwood Foundation.",
      status: "Partnership",
      color: "from-emerald-500/20 to-emerald-500/5"
    },
    {
      icon: Plane,
      title: "Elysian Expeditions",
      category: "AI Travel Concierge",
      description: "AI-powered luxury travel concierge delivering bespoke experiences through intelligent automation.",
      status: "Active",
      color: "from-primary/20 to-primary/5"
    },
    {
      icon: Database,
      title: "PersonaOS",
      category: "AI Execution Framework",
      description: "Strategic identity and communication frameworks for founders and operators, powered by AI.",
      status: "Active",
      color: "from-primary/20 to-primary/5"
    },
    {
      icon: Lightbulb,
      title: "ScheduleOS",
      category: "AI Execution Framework",
      description: "Intelligent scheduling and task management system that optimizes operational workflows.",
      status: "Active",
      color: "from-primary/20 to-primary/5"
    },
    {
      icon: Building2,
      title: "The Dominion Stack",
      category: "Sovereign Infrastructure",
      description: "Comprehensive habitat infrastructure system with 14 integrated pods for resilient operations.",
      status: "Engineering",
      color: "from-purple-500/20 to-purple-500/5"
    },
    {
      icon: Home,
      title: "Eco-Cube Developments",
      category: "Modular Housing",
      description: "Advanced modular shelter solutions ranging from economy to hardened subterranean models.",
      status: "Engineering",
      color: "from-purple-500/20 to-purple-500/5"
    },
    {
      icon: Shield,
      title: "Tactical Systems",
      category: "Defense Technology",
      description: "Research and development of advanced defense systems, tactical gear, and operational training programs.",
      status: "R&D",
      color: "from-orange-500/20 to-orange-500/5"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-primary/10 text-primary border-primary/30";
      case "In Development":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "Engineering":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "Partnership":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "R&D":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="py-32 bg-gradient-to-b from-background to-card relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <p className="text-sm font-mono text-primary">Innovation Portfolio</p>
          </div>
          <h2 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Portfolio of Innovations
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-yellow-500 rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Strategic initiatives across AI systems, infrastructure, and operational technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={project.title}
              data-testid={`card-project-${index}`}
              className="group p-8 hover-elevate transition-all duration-500 hover:-translate-y-3 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/30 relative overflow-hidden"
              style={{
                animation: `scale-in 0.8s ease-out ${0.1 * index}s both`
              }}
            >
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${project.color} rounded-full blur-3xl group-hover:opacity-75 opacity-50 transition-all duration-500`}></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${project.color} backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <project.icon className="w-8 h-8 text-foreground" />
                  </div>
                  <Badge className={`${getStatusColor(project.status)} text-xs px-3 py-1 font-mono`}>
                    {project.status}
                  </Badge>
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-primary mb-4 font-mono">
                  {project.category}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
