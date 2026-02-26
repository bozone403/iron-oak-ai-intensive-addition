import Navigation from "@/components/Navigation";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Projects() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-32">
        <ProjectsShowcase />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
}
