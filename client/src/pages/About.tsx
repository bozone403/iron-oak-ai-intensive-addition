import Navigation from "@/components/Navigation";
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-32">
        <AboutSection />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
}
