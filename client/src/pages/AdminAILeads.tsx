import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Phone, MessageSquare, CreditCard, Calendar, Clock, User, Mail, Ban, CheckCircle2, XCircle, AlertCircle, Trash2, Edit, CalendarPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AILead {
  id: string;
  firstName: string;
  lastName: string | null;
  phone: string;
  email: string | null;
  consentGiven: boolean;
  consentTimestamp: string;
  callStatus: string;
  callSid: string | null;
  callDuration: number | null;
  smsStatus: string;
  smsOutcome: string | null;
  smsSid: string | null;
  smsSentAt: string | null;
  paymentStatus: string;
  amountPaid: number | null;
  paidAt: string | null;
  optedOut: boolean;
  optedOutAt: string | null;
  scheduledDate: string | null;
  scheduledNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminAILeads() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingLead, setEditingLead] = useState<AILead | null>(null);
  const [schedulingLead, setSchedulingLead] = useState<AILead | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleNotes, setScheduleNotes] = useState("");
  
  const queryClient = useQueryClient();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'https://iron-oak-ai-intensive-addition.onrender.com';

  const { data: leads, isLoading, error } = useQuery<AILead[]>({
    queryKey: ['aiLeads'],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/api/ai/admin/leads`);
      if (!response.ok) throw new Error('Failed to fetch leads');
      return response.json();
    },
    refetchInterval: 10000,
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${apiUrl}/api/ai/admin/leads/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete lead');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiLeads'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AILead> }) => {
      const response = await fetch(`${apiUrl}/api/ai/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update lead');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiLeads'] });
      setEditingLead(null);
      setSchedulingLead(null);
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Oliver92!@") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSchedule = () => {
    if (!schedulingLead) return;
    updateMutation.mutate({
      id: schedulingLead.id,
      updates: {
        scheduledDate: scheduleDate,
        scheduledNotes: scheduleNotes,
      },
    });
    setScheduleDate("");
    setScheduleNotes("");
  };

  const downloadCSV = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/ai/leads/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-intensive-leads-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download CSV:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <h1 className="font-serif text-3xl font-bold mb-6 text-center">Admin Access</h1>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      completed: { variant: "default", icon: CheckCircle2 },
      answered: { variant: "default", icon: CheckCircle2 },
      sent: { variant: "default", icon: CheckCircle2 },
      paid: { variant: "default", icon: CheckCircle2 },
      pending: { variant: "secondary", icon: Clock },
      sending: { variant: "secondary", icon: Clock },
      failed: { variant: "destructive", icon: XCircle },
      "no-answer": { variant: "destructive", icon: XCircle },
      busy: { variant: "outline", icon: AlertCircle },
      canceled: { variant: "outline", icon: Ban },
    };

    const config = statusMap[status.toLowerCase()] || { variant: "outline" as const, icon: AlertCircle };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2">AI Intensive Leads</h1>
            <p className="text-muted-foreground">Manage course registrations and follow-ups</p>
          </div>
          <Button onClick={downloadCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading leads...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load leads. Please try again.</p>
          </div>
        )}

        {leads && leads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No leads yet.</p>
          </div>
        )}

        {leads && leads.length > 0 && (
          <div className="grid gap-6">
            {leads.map((lead) => (
              <Card key={lead.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold mb-1">
                      {lead.firstName} {lead.lastName}
                    </h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </span>
                      {lead.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSchedulingLead(lead);
                            setScheduleDate(lead.scheduledDate || "");
                            setScheduleNotes(lead.scheduledNotes || "");
                          }}
                        >
                          <CalendarPlus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Schedule Follow-up</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Date & Time</label>
                            <Input
                              type="datetime-local"
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Notes</label>
                            <Textarea
                              value={scheduleNotes}
                              onChange={(e) => setScheduleNotes(e.target.value)}
                              placeholder="Add notes about this follow-up..."
                              rows={4}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleSchedule}>Save Schedule</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingLead(lead)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(lead.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Call Status
                    </p>
                    {getStatusBadge(lead.callStatus)}
                    {lead.callDuration && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {lead.callDuration}s
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      SMS Status
                    </p>
                    {getStatusBadge(lead.smsStatus)}
                    {lead.smsOutcome && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {lead.smsOutcome}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      Payment
                    </p>
                    {getStatusBadge(lead.paymentStatus)}
                    {lead.amountPaid && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ${(lead.amountPaid / 100).toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Opt Status
                    </p>
                    {lead.optedOut ? (
                      <Badge variant="destructive" className="gap-1">
                        <Ban className="h-3 w-3" />
                        Opted Out
                      </Badge>
                    ) : (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </Badge>
                    )}
                  </div>
                </div>

                {lead.scheduledDate && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4" />
                      Scheduled: {new Date(lead.scheduledDate).toLocaleString()}
                    </p>
                    {lead.scheduledNotes && (
                      <p className="text-sm text-muted-foreground">{lead.scheduledNotes}</p>
                    )}
                  </div>
                )}

                <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                  <p>Created: {new Date(lead.createdAt).toLocaleString()}</p>
                  <p>Updated: {new Date(lead.updatedAt).toLocaleString()}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
