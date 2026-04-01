import Navbar             from "@/components/Navbar";
import HeroSection         from "@/components/HeroSection";
import SixIconsSection     from "@/components/SixIconsSection";
import CityScrollSection   from "@/components/CityScrollSection";
import HowItWorks          from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import TrustStats          from "@/components/TrustStats";
import CTASection          from "@/components/CTASection";
import Footer              from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Navbar />
        <HeroSection />
        <SixIconsSection />
        <CityScrollSection />
        <HowItWorks />
        <TestimonialsSection />
        <TrustStats />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
