import Navbar             from "@/components/Navbar";
import HeroSection         from "@/components/HeroSection";
import HowItWorks          from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection          from "@/components/CTASection";
import Footer              from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
