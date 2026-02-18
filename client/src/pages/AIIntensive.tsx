import { useState } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Zap, Target, Users, Calendar, Clock, MapPin, Phone, CheckCircle2 } from "lucide-react";

export default function AIIntensive() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
                Registration Received!
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                You'll receive a call from us shortly to discuss the AI Intensive course.
              </p>
              <p className="text-base text-muted-foreground">
                After our call, we'll send you an SMS with a payment link to complete your registration.
              </p>
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
      
      {/* Hero Section */}
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <p className="text-sm font-mono text-primary">4-Evening Intensive Course</p>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              Applied AI Intensive
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Master practical AI implementation in 4 focused evenings. Learn automation, 
              integration, and real-world applications from industry experts.
            </p>
          </div>

          {/* Course Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-2 hover:border-primary/30 transition-all hover-elevate">
              <Calendar className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">When</h3>
              <p className="text-muted-foreground">Every Thursday to Sunday</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-2 hover:border-primary/30 transition-all hover-elevate">
              <Clock className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Time</h3>
              <p className="text-muted-foreground">7:00 PM - 8:15 PM</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-2 hover:border-primary/30 transition-all hover-elevate">
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Location</h3>
              <p className="text-muted-foreground">Airdrie, AB</p>
            </Card>
          </div>

          {/* What You'll Learn */}
          <div className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">
              What You'll Learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/30 transition-all hover-elevate">
                <Brain className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                  AI Fundamentals
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Understand core AI concepts, LLMs, and how to evaluate AI tools for your specific needs.
                </p>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/30 transition-all hover-elevate">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                  Automation & Integration
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Build practical automations and integrate AI into your existing workflows and systems.
                </p>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/30 transition-all hover-elevate">
                <Target className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                  Advanced Topics
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Explore RAG, fine-tuning, agents, and cutting-edge AI techniques for complex problems.
                </p>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/30 transition-all hover-elevate">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                  Real-World Implementation
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Apply what you've learned to your own projects with hands-on guidance and support.
                </p>
              </Card>
            </div>
          </div>

          {/* Registration Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="p-10 bg-gradient-to-br from-card to-primary/5 border-2">
              <div className="mb-8 text-center">
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
                  Get Started Today
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll call you to discuss the course and answer any questions.
                </p>
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
                    placeholder="(587) 123-4567"
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

                <div className="flex items-start gap-3 p-4 bg-background/30 rounded-xl border border-border/50">
                  <Checkbox
                    id="consent"
                    checked={formData.consentGiven}
                    onCheckedChange={handleConsentChange}
                    disabled={status === 'submitting'}
                    className="mt-1"
                  />
                  <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    I consent to receive phone calls and SMS messages from Iron & Oak regarding the AI Intensive course. 
                    I understand I can opt out at any time by replying STOP to any SMS.
                  </label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  disabled={status === 'submitting' || !formData.consentGiven}
                >
                  {status === 'submitting' ? 'Submitting...' : 'Get a Call Now'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Questions? Call us at <a href="tel:403-613-6014" className="text-primary hover:underline">403-613-6014</a> or 
                  email <a href="mailto:Registration@iron-oak.ca" className="text-primary hover:underline">Registration@iron-oak.ca</a>
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
