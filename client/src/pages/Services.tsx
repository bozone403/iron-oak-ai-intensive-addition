import Navigation from "@/components/Navigation";
import ServicesList from "@/components/ServicesList";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-32">
        <ServicesList />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
}
