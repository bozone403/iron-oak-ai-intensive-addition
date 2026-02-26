import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              <strong>Effective Date:</strong> January 2025
            </p>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using the Iron & Oak Strategic Solutions website and services, you agree to be 
                bound by these Terms of Service and all applicable laws and regulations. If you do not agree 
                with any of these terms, you are prohibited from using this site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Iron & Oak Strategic Solutions provides strategic consulting, operational architecture, and 
                AI systems integration services. All engagements are subject to separate written agreements 
                that specify scope, deliverables, fees, and terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on this website, including text, graphics, logos, and software, is the property 
                of Iron & Oak Strategic Solutions and is protected by copyright and other intellectual property 
                laws. Deliverables created as part of consulting engagements are subject to the terms of 
                individual service agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Confidentiality</h2>
              <p className="text-muted-foreground leading-relaxed">
                We maintain strict confidentiality regarding all client engagements. We do not publish case 
                studies or disclose client identities without explicit written permission. All confidentiality 
                terms are detailed in our service agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Iron & Oak Strategic Solutions shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of our services or website. Our 
                maximum liability is limited to the fees paid for the specific service in question.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms shall be governed by and construed in accordance with applicable Canadian law. 
                Any disputes shall be resolved through binding arbitration in accordance with the terms 
                specified in individual service agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-muted-foreground mt-4">
                <strong>Email:</strong> <a href="mailto:contact@iron-oak.ca" className="text-primary hover:underline">contact@iron-oak.ca</a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
