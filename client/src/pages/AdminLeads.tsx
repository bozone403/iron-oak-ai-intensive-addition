import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Download, Mail, Building2, Target, MessageSquare, Calendar, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminLeads() {
  const { data, isLoading } = useQuery<{ success: boolean; leads: any[] }>({
    queryKey: ["/api/leads"],
  });

  const leads = data?.leads || [];

  const handleDownload = () => {
    window.location.href = "/api/leads/download";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <p className="text-sm font-mono text-primary">Admin Dashboard</p>
              </div>
              <h1 className="font-serif text-5xl font-bold text-foreground mb-4">
                Lead Management
              </h1>
              <p className="text-lg text-muted-foreground">
                View and manage all inquiry submissions
              </p>
            </div>
            <Button
              onClick={handleDownload}
              size="lg"
              disabled={leads.length === 0}
              className="shadow-lg shadow-primary/20"
            >
              <Download className="mr-2 w-5 h-5" />
              Download CSV
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <Card className="p-20 text-center bg-gradient-to-br from-card to-primary/5">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                No leads yet
              </h3>
              <p className="text-muted-foreground">
                Lead submissions will appear here when users contact you through the form.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <Badge className="bg-primary/10 text-primary border-primary/30 text-base px-4 py-2">
                  {leads.length} {leads.length === 1 ? "Lead" : "Leads"}
                </Badge>
              </div>

              {leads.map((lead: any) => (
                <Card
                  key={lead.id}
                  className="p-8 hover-elevate transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/30"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                        {lead.name}
                      </h3>
                      <div className="flex items-center gap-2 text-primary">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${lead.email}`} className="hover:underline">
                          {lead.email}
                        </a>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(lead.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Organization</p>
                        <p className="text-base text-foreground font-medium">{lead.organization}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Objective</p>
                        <p className="text-base text-foreground font-medium">{lead.objective}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <MessageSquare className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">Message</p>
                      <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
                        {lead.message}
                      </p>
                    </div>
                  </div>

                  {lead.ip && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border/50">
                      <Globe className="w-3 h-3" />
                      <span>IP: {lead.ip}</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
