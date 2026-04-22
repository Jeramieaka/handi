import Navbar                   from "@/components/Navbar";
import HeroSection               from "@/components/HeroSection";
import SixIconsSection           from "@/components/SixIconsSection";
import CityScrollSection         from "@/components/CityScrollSection";
import HowItWorks                from "@/components/HowItWorks";
import BuyerTravelerSplitSection from "@/components/BuyerTravelerSplitSection";
import SafetyPoliciesSection     from "@/components/SafetyPoliciesSection";
import TestimonialsSection       from "@/components/TestimonialsSection";
import CTASection                from "@/components/CTASection";
import Footer                    from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Navbar />
        <HeroSection />
        <CityScrollSection />
        <SixIconsSection />
        <HowItWorks />
        <BuyerTravelerSplitSection />
        <SafetyPoliciesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
