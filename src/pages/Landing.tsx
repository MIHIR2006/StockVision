import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { MarketDataCenter } from "@/components/market-data-center";
import { StockTicker } from "@/components/stock-ticker";
import { TreasuryBillSection } from "@/components/treasury-bill-section";
import { useEffect, useRef } from "react";

// Declare the global window interface extension
declare global {
  interface Window {
    scrollToPricing: () => void;
  }
}

export default function Landing() {
  const marketDataRef = useRef<HTMLDivElement>(null);
  const yieldCurveRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  // Expose scrollToPricing function to window so it can be called from MarketDataCenter
  useEffect(() => {
    window.scrollToPricing = scrollToPricing;
    return () => {
      // Cleanup when component unmounts
      delete window.scrollToPricing;
    };
  }, []);

  const scrollToMarketData = () => {
    if (marketDataRef.current) {
      const yOffset = -80; // Adjust offset to account for header height
      const y = marketDataRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToYieldCurve = () => {
    const yieldCurveElement = document.getElementById('yield-curve-us');
    if (yieldCurveElement) {
      const yOffset = -80; // Adjust offset to account for header height
      const y = yieldCurveElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToPricing = () => {
    if (pricingRef.current) {
      const yOffset = -80; // Adjust offset to account for header height
      const y = pricingRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      const yOffset = -80; // Adjust offset to account for header height
      const y = featuresRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <StockTicker />
      <HeroSection onLearnMore={scrollToMarketData} />

      {/* Market Data Center Section */}
      <div ref={marketDataRef} id="market-data-center" className="scroll-mt-20">
        <MarketDataCenter />
      </div>

      {/* U.S. Treasury Bill Section */}
      <div ref={yieldCurveRef} id="yield-curve" className="scroll-mt-20">
        <TreasuryBillSection />
      </div>

      <FeaturesSection />
      <TestimonialsSection />

      {/* Footer */}
      <Footer 
        onScrollToTop={scrollToTop}
        onScrollToFeatures={scrollToFeatures}
        onScrollToPricing={scrollToPricing}
      />
    </div>
  );
}
