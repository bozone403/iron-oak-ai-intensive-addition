import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import EngagementProcess from "@/components/EngagementProcess";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ServicesGrid />
      <EngagementProcess />
      <CTASection />
      <Footer />
    </div>
  );
}
