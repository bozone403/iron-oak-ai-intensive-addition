import { Card } from "@/components/ui/card";

export default function AboutSection() {
  const principles = [
    { title: "Clarity", desc: "Truth before comfort. We work from facts, not noise." },
    { title: "Integrity", desc: "The structure must hold. Every design must survive stress." },
    { title: "Precision", desc: "The smallest misalignment compounds; we build to exacting standards." },
    { title: "Purpose", desc: "Systems exist to serve people, not the other way around." },
    { title: "Legacy", desc: "Every architecture should outlive its author." }
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
      
      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
        <div className="mb-20">
          <div className="inline-block mb-8 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <p className="text-sm font-mono text-primary">Our Mission</p>
          </div>
          <h2 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
            Strategic architecture for a world in transition
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-yellow-500 rounded-full mb-12"></div>
        </div>
        
        <div className="space-y-8 mb-20">
          <p className="text-xl lg:text-2xl text-foreground leading-relaxed font-light">
            Iron & Oak is an independent strategy and systems firm. We design the frameworks that turn vision into structure, and structure into stability.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our work serves a single premise: when systems are designed with integrity, people and organizations can operate with purpose, resilience, and autonomy.
          </p>
        </div>

        <div className="mb-20 p-12 rounded-3xl bg-gradient-to-br from-card via-card to-primary/5 border border-card-border shadow-2xl">
          <h3 className="font-serif text-3xl font-bold text-foreground mb-6">Our Purpose</h3>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            The world is built on systems—legal, financial, technological, and human. When those systems fail, everything else follows. Our mission is to rebuild them with precision, discipline, and moral clarity.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Iron & Oak was founded to serve operators and institutions that believe in ownership, accountability, and sustainable progress. We build architectures that protect value, enable growth, and leave something worth inheriting.
          </p>
          <p className="text-lg text-foreground leading-relaxed font-medium">
            We do not chase scale for its own sake. We pursue durability, stewardship, and the freedom that comes from well-designed order.
          </p>
        </div>

        <div className="mb-20">
          <h3 className="font-serif text-4xl font-bold text-foreground mb-12">Our Ethos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((principle, index) => (
              <Card
                key={principle.title}
                data-testid={`card-principle-${index}`}
                className="p-8 hover-elevate transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2 hover:border-primary/30"
                style={{
                  animation: `fade-in-up 0.8s ease-out ${0.1 * index}s both`
                }}
              >
                <div className="mb-4">
                  <div className="w-12 h-1 bg-gradient-to-r from-primary to-yellow-500 rounded-full mb-4"></div>
                  <h4 className="font-serif text-2xl font-bold text-foreground">
                    {principle.title}
                  </h4>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {principle.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h3 className="font-serif text-4xl font-bold text-foreground mb-8">Our Philosophy of Impact</h3>
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
            <p className="text-xl text-foreground leading-relaxed mb-6 font-light">
              True strategy is an act of stewardship. It is the discipline of aligning human potential with intelligent design.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We believe the private sector holds the capacity to restore balance where institutions have failed. Our role is to equip those who build—founders, executives, and operators—with the systems that enable long-term contribution, not short-term wins.
            </p>
            <p className="text-lg text-foreground font-medium">
              Every engagement is an investment in resilience: organizational, social, and generational.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="p-10 rounded-3xl bg-card border border-card-border shadow-xl">
            <h3 className="font-serif text-3xl font-bold text-foreground mb-6">Why Leaders Choose Iron & Oak</h3>
            <ul className="space-y-4">
              {[
                "Discretion and Discipline. We operate quietly and deliver visibly.",
                "End-to-End Clarity. Strategy, governance, and execution built as one continuum.",
                "Execution Bias. We act where leverage is real and measurable.",
                "Moral Center. Growth without purpose is decay; our designs anchor to principle."
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-base text-muted-foreground leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-10 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30">
            <h3 className="font-serif text-3xl font-bold text-foreground mb-6">Who We Serve</h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We work with founders, family offices, institutions, and sovereign operators who understand that real power lies in structure.
            </p>
            <p className="text-lg text-foreground font-medium leading-relaxed">
              Our clients are the ones who make difficult things last. If you believe systems should serve the next generation, not just the next quarter, we will build with you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
