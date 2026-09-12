import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import TrustedCompanies from "./TrustedCompanies";
import FeaturesSection from "./FeaturesSection";
import HowItWorks from "./HowItWorks";
import ProductPreview from "./ProductPreview";
import AIShowcase from "./AIShowcase";
import Testimonials from "./Testimonials";
import PricingSection from "./PricingSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070a13] text-slate-100 selection:bg-indigo-500/30 selection:text-white">
      {/* Top Ambient Glow Beam */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 via-purple-500/40 to-transparent" />
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 z-30 h-32 w-3/4 max-w-5xl bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent blur-3xl" />

      {/* Global Ambient Gradient Aura Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[15%] -top-[10%] h-[700px] w-[700px] rounded-full bg-gradient-to-br from-indigo-600/15 via-indigo-950/20 to-transparent blur-[140px]" />
        <div className="absolute right-[5%] top-[20%] h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-violet-600/12 via-purple-950/20 to-transparent blur-[150px]" />
        <div className="absolute left-[20%] top-[60%] h-[700px] w-[700px] rounded-full bg-gradient-to-tr from-cyan-600/10 via-slate-900/40 to-transparent blur-[160px]" />
        <div className="absolute right-[10%] bottom-[5%] h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-indigo-600/15 via-violet-900/10 to-transparent blur-[140px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,#000_60%,transparent_100%)]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <TrustedCompanies />
        <FeaturesSection />
        <HowItWorks />
        <ProductPreview />
        <AIShowcase />
        <Testimonials />
        <PricingSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}

