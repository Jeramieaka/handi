import Navbar             from "@/components/Navbar";
import HeroSection         from "@/components/HeroSection";
import SixIconsSection     from "@/components/SixIconsSection";
import CityScrollSection   from "@/components/CityScrollSection";
import HowItWorks            from "@/components/HowItWorks";
import SafetyPoliciesSection from "@/components/SafetyPoliciesSection";
import TestimonialsSection   from "@/components/TestimonialsSection";
import CTASection            from "@/components/CTASection";
import Footer                from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Navbar />
        <HeroSection />
        <CityScrollSection />
        <SixIconsSection />
        <HowItWorks />
        <SafetyPoliciesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
