import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactForm() {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const { toast } = useToast();

  const emails = [
    { label: "General Inquiries", address: "contact@iron-oak.ca" },
    { label: "Strategic Consulting", address: "strategy@iron-oak.ca" },
    { label: "Project Inquiries", address: "projects@iron-oak.ca" },
    { label: "Client Support", address: "support@iron-oak.ca" },
  ];

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    toast({
      title: "Email copied",
      description: "The email address has been copied to your clipboard.",
    });
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}?subject=Strategic Inquiry - Iron & Oak`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <p className="text-sm font-mono text-primary">Get in Touch</p>
        </div>
        <h2 className="font-serif text-5xl font-bold text-foreground mb-6">
          Contact Iron & Oak
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-primary to-yellow-500 rounded-full mb-8"></div>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          We respond to selected inquiries that fit our mandate. Reach out directly via email 
          to discuss your strategic objectives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {emails.map((item, index) => (
          <Card
            key={item.address}
            className="p-8 hover-elevate transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/30 relative overflow-hidden group"
            style={{
              animation: `scale-in 0.8s ease-out ${0.1 * index}s both`
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              </div>
              
              <a
                href={`mailto:${item.address}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleEmailClick(item.address);
                }}
                className="text-lg font-medium text-primary hover:underline block mb-3 transition-all"
              >
                {item.address}
              </a>

              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(item.address)}
                className="w-full group/btn"
              >
                {copiedEmail === item.address ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2 group-hover/btn:text-primary transition-colors" />
                    Copy Email
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative">
          <h3 className="font-serif text-3xl font-bold text-foreground mb-6">
            Ready to Start a Conversation?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Click any email above to open your mail client, or copy the address to reach out 
            at your convenience. We look forward to discussing how Iron & Oak can support your 
            strategic initiatives.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={() => handleEmailClick("strategy@iron-oak.ca")}
              className="shadow-xl shadow-primary/20"
            >
              <Mail className="mr-2 w-5 h-5" />
              Email Strategy Team
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleEmailClick("contact@iron-oak.ca")}
            >
              <Mail className="mr-2 w-5 h-5" />
              General Inquiry
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-12 p-8 bg-card rounded-3xl border border-card-border">
        <h4 className="font-semibold text-lg text-foreground mb-4">
          What to Include in Your Message
        </h4>
        <ul className="space-y-3">
          {[
            "Your name and organization",
            "Strategic objective or challenge you're facing",
            "Current constraints and timeline",
            "What you're looking to accomplish",
            "Any relevant context about your situation"
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p className="text-base text-muted-foreground">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
