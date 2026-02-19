import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Download, Phone, MessageSquare, CreditCard, Calendar, Clock, User, Mail, Ban, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AILead {
  id: string;
  firstName: string;
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
  createdAt: string;
  updatedAt: string;
}

export default function AdminAILeads() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Oliver92!@') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const { data, isLoading, refetch } = useQuery<{ success: boolean; leads: AILead[] }>({
    queryKey: ["/api/ai/leads"],
    refetchInterval: 10000, // Refresh every 10 seconds
    enabled: isAuthenticated, // Only fetch if authenticated
  });

  const leads = data?.leads || [];

  const handleDownload = () => {
    window.location.href = "/api/ai/leads/download";
  };

  const getStatusBadge = (status: string, type: 'call' | 'sms' | 'payment') => {
    const configs = {
      call: {
        completed: { color: 'bg-green-500/10 text-green-500 border-green-500/30', icon: CheckCircle2 },
        answered: { color: 'bg-green-500/10 text-green-500 border-green-500/30', icon: CheckCircle2 },
        pending: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30', icon: Clock },
        failed: { color: 'bg-red-500/10 text-red-500 border-red-500/30', icon: XCircle },
        'no-answer': { color: 'bg-orange-500/10 text-orange-500 border-orange-500/30', icon: AlertCircle },
      },
      sms: {
        sent: { color: 'bg-green-500/10 text-green-500 border-green-500/30', icon: CheckCircle2 },
        sending: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/30', icon: Clock },
        pending: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30', icon: Clock },
        failed: { color: 'bg-red-500/10 text-red-500 border-red-500/30', icon: XCircle },
      },
      payment: {
        paid: { color: 'bg-green-500/10 text-green-500 border-green-500/30', icon: CheckCircle2 },
        pending: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30', icon: Clock },
        failed: { color: 'bg-red-500/10 text-red-500 border-red-500/30', icon: XCircle },
      },
    };

    const config = configs[type][status as keyof typeof configs[typeof type]] || configs[type].pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border text-xs px-3 py-1 flex items-center gap-1.5`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  // Show password prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-24">
          <div className="max-w-md mx-auto px-6">
            <Card className="p-8">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4 text-center">
                Admin Access
              </h2>
              <p className="text-muted-foreground mb-6 text-center">
                Enter password to view AI Intensive registrations
              </p>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
                <Button type="submit" className="w-full" size="lg">
                  Access Admin Panel
                </Button>
              </form>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <p className="text-sm font-mono text-primary">AI Intensive Admin</p>
              </div>
              <h1 className="font-serif text-5xl font-bold text-foreground mb-4">
                Registration Management
              </h1>
              <p className="text-lg text-muted-foreground">
                View and manage AI Intensive course registrations
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="lg"
                className="shadow-lg"
              >
                <Clock className="mr-2 w-5 h-5" />
                Refresh
              </Button>
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
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading registrations...</p>
            </div>
          ) : leads.length === 0 ? (
            <Card className="p-20 text-center bg-gradient-to-br from-card to-primary/5">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                No registrations yet
              </h3>
              <p className="text-muted-foreground">
                AI Intensive registrations will appear here when users sign up.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <Badge className="bg-primary/10 text-primary border-primary/30 text-base px-4 py-2">
                  {leads.length} {leads.length === 1 ? "Registration" : "Registrations"}
                </Badge>
              </div>

              {leads.map((lead: AILead) => (
                <Card
                  key={lead.id}
                  className="p-8 hover-elevate transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/30"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-serif text-2xl font-bold text-foreground">
                          {lead.firstName}
                        </h3>
                        {lead.optedOut && (
                          <Badge className="bg-red-500/10 text-red-500 border-red-500/30">
                            <Ban className="w-3 h-3 mr-1" />
                            Opted Out
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-primary">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${lead.phone}`} className="hover:underline">
                            {lead.phone}
                          </a>
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-2 text-primary">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${lead.email}`} className="hover:underline">
                              {lead.email}
                            </a>
                          </div>
                        )}
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Call Status</p>
                        {getStatusBadge(lead.callStatus, 'call')}
                        {lead.callDuration && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Duration: {lead.callDuration}s
                          </p>
                        )}
                        {lead.callSid && (
                          <p className="text-xs text-muted-foreground mt-1 font-mono">
                            {lead.callSid.slice(0, 20)}...
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">SMS Status</p>
                        {getStatusBadge(lead.smsStatus, 'sms')}
                        {lead.smsOutcome && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {lead.smsOutcome === 'completed_offer' ? 'Registration Link Sent' : 'Missed Call Notice'}
                          </p>
                        )}
                        {lead.smsSentAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(lead.smsSentAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
                        {getStatusBadge(lead.paymentStatus, 'payment')}
                        {lead.amountPaid && (
                          <p className="text-xs text-muted-foreground mt-2">
                            ${(lead.amountPaid / 100).toFixed(2)}
                          </p>
                        )}
                        {lead.paidAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(lead.paidAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span>ID: {lead.id.slice(0, 8)}...</span>
                        </div>
                        {lead.consentGiven && (
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Consent Given</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        Last Updated: {new Date(lead.updatedAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
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
