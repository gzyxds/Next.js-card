/**
 * 首页入口组件
 *
 * 组合 Header / HeroSection / FeaturesSection / PlansSection /
 * ProcessSection / GuaranteeSection / FAQSection / Footer 等子组件
 */

import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import PlansSection from "@/components/home/PlansSection";
import ProcessSection from "@/components/home/ProcessSection";
import GuaranteeSection from "@/components/home/GuaranteeSection";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/home/Footer";

/** 首页入口组件 */
export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <PlansSection />
        <ProcessSection />
        <GuaranteeSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
