import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, CheckCircle2 } from "lucide-react";

export default function AIIntensive() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    inquiryType: '',
    message: '',
    consentGiven: false,
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://iron-oak-ai-intensive-addition.onrender.com';
      const response = await fetch(`${apiUrl}/api/ai/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setStatus('success');
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInquiryTypeChange = (value: string) => {
    setFormData({
      ...formData,
      inquiryType: value,
    });
  };

  const handleConsentChange = (checked: boolean) => {
    setFormData({
      ...formData,
      consentGiven: checked,
    });
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <Card className="p-12 text-center bg-gradient-to-br from-card to-primary/5 border-2 border-primary/30">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                Received
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Check your phone for next steps.
              </p>
              <p className="text-base text-muted-foreground mb-8">
                If urgent, call <a href="tel:403-613-6014" className="text-primary hover:underline font-semibold">403-613-6014</a>
              </p>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                size="lg"
                className="border-border/50 hover:bg-background/50"
              >
                Return Home
              </Button>
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
      
      {/* Hero Section with Form */}
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              Talk to Iron & Oak
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Strategy, operational architecture, and systems implementation for organizations that need to work under pressure.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
              Tell us what you're building or fixing. We'll route you to the right next step.
            </p>
          </div>

          {/* Registration Form */}
          <div className="max-w-2xl mx-auto mb-16">
            <Card className="p-10 bg-gradient-to-br from-card to-primary/5 border-2">
              <div className="mb-8 text-center">
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
                  Start the Process
                </h2>
              </div>

              {status === 'error' && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
                  <p className="text-destructive text-sm">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                      First Name *
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="bg-background/50 border-border/50 focus:border-primary"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="bg-background/50 border-border/50 focus:border-primary"
                      disabled={status === 'submitting'}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="(403) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    disabled={status === 'submitting'}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    disabled={status === 'submitting'}
                  />
                </div>

                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-medium text-foreground mb-2">
                    Inquiry Type *
                  </label>
                  <Select 
                    value={formData.inquiryType} 
                    onValueChange={handleInquiryTypeChange}
                    disabled={status === 'submitting'}
                    required
                  >
                    <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="systems">Systems Implementation</SelectItem>
                      <SelectItem value="consulting">Strategic Consulting</SelectItem>
                      <SelectItem value="education">Education / Training</SelectItem>
                      <SelectItem value="ai-intensive">AI Intensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message / Context
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="What operational challenge or objective are you working toward?"
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary min-h-[100px]"
                    disabled={status === 'submitting'}
                  />
                </div>

                <div className="flex items-start gap-3 p-4 bg-background/30 rounded-xl border border-border/50">
                  <Checkbox
                    id="consent"
                    checked={formData.consentGiven}
                    onCheckedChange={handleConsentChange}
                    disabled={status === 'submitting'}
                    className="mt-1"
                  />
                  <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    I consent to receive calls and SMS from Iron & Oak regarding my inquiry. Reply STOP to opt out.
                  </label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  disabled={status === 'submitting' || !formData.consentGiven || !formData.inquiryType}
                >
                  {status === 'submitting' ? 'Submitting...' : 'Start the Process'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Questions? Call <a href="tel:403-613-6014" className="text-primary hover:underline">403-613-6014</a>
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
