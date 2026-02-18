import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Calendar, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AIIntensive() {
  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    email: '',
    consentGiven: false,
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consentGiven) {
      setErrorMessage('Please agree to receive calls and SMS messages');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
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

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">You're All Set!</CardTitle>
            <CardDescription>
              You'll receive a call from us shortly to discuss the AI Intensive.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              After the call, we'll send you a registration link via SMS.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            AI Intensive
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8">
            Master Applied AI in 4 Evenings
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center justify-center gap-3 text-slate-200">
              <Calendar className="w-6 h-6 text-blue-400" />
              <span>Last Thu-Sun of Month</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-200">
              <Clock className="w-6 h-6 text-blue-400" />
              <span>7:00 PM - 8:15 PM</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-200">
              <MapPin className="w-6 h-6 text-blue-400" />
              <span>Airdrie, AB</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Get a Call from Us
              </CardTitle>
              <CardDescription>
                We'll call you to answer questions and help you register
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status === 'error' && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Jordan"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(403) 555-1234"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jordan@example.com"
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consent"
                    checked={formData.consentGiven}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, consentGiven: checked as boolean })
                    }
                  />
                  <label
                    htmlFor="consent"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I consent to receive automated calls and SMS messages from Iron & Oak at the
                    number provided. Message and data rates may apply. Reply STOP to opt out.
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'Submitting...' : 'Get a Call Now'}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Questions? Contact us at{' '}
                <a href="mailto:Registration@iron-oak.ca" className="underline">
                  Registration@iron-oak.ca
                </a>{' '}
                or{' '}
                <a href="tel:4036136014" className="underline">
                  403-613-6014
                </a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Details */}
        <div className="max-w-4xl mx-auto mt-16 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">What You'll Learn</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Evening 1: Foundations</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <ul className="space-y-2">
                  <li>• AI fundamentals and practical applications</li>
                  <li>• Prompt engineering techniques</li>
                  <li>• Tool selection and integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Evening 2: Automation</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <ul className="space-y-2">
                  <li>• Workflow automation with AI</li>
                  <li>• API integration patterns</li>
                  <li>• Custom AI assistants</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Evening 3: Advanced Topics</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <ul className="space-y-2">
                  <li>• Multi-modal AI (text, image, voice)</li>
                  <li>• RAG and knowledge bases</li>
                  <li>• Fine-tuning and customization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Evening 4: Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <ul className="space-y-2">
                  <li>• Build your own AI project</li>
                  <li>• Deployment strategies</li>
                  <li>• Best practices and ethics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
