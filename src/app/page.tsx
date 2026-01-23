import BannerSection from "../components/landing/BannerSection";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SmartRoutesSection from "../components/landing/SmartRoutesSection";
import DriverSection from "../components/landing/DriverSection";
import PricingSection from "../components/landing/PricingSection";
import FAQSection from "../components/landing/FAQSection";
import AnalyticsSection from "../components/landing/AnalyticsSection";

export default function Home() {
  return (
    <div>
      <Navbar />
      <BannerSection />
      <SmartRoutesSection />
      <AnalyticsSection />
      <DriverSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
