'use client';
import { MarketDataCenter } from "@/components/market-data-center";
import { Sidebar } from "@/components/sidebar";
import { StockTicker } from "@/components/stock-ticker";
import { ThemeToggle } from "@/components/theme-toggle";
import { TreasuryBillSection } from "@/components/treasury-bill-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portfolioStocks } from "@/data/mock-data";
import clsx from "clsx";
import { type Variants } from "framer-motion";
import { BarChart2, ChartLine, CheckCircle, CircleDollarSign, LineChart, LogIn, PieChart, TrendingUp, XCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Testimonials from './Testimonials';
// import {MacbookScroll} from '../../components/ui/macbook-scroll'

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
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const scrollCurrentRef = useRef(0);

  const [showScrollTop, setShowScrollTop] = useState(false);



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


  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };





  // Update active section based on current route
  useEffect(() => {
    if (pathname === "/") {
      setActiveSection("home");
    } else if (pathname === "/dashboard") {
      // Check for hash in URL for dashboard sections
      const hash = window.location.hash.replace('#', '');
      setActiveSection(hash || "overview");
    } else if (pathname === "/performance") {
      setActiveSection("performance");
    } else if (pathname === "/portfolio") {
      setActiveSection("portfolio");
    } else if (pathname === "/settings") {
      setActiveSection("settings");
    }
  }, [pathname]);


  // scroll animation with rAF for smooth, continuous progress (lerped)
  useEffect(() => {
    let rafId: number | null = null;
    const update = () => {
      const doc = document.documentElement;
      const currentScroll = doc.scrollTop || window.scrollY || 0;
      const totalHeight = (doc.scrollHeight - doc.clientHeight) || 1;
      const target = Math.max(0, Math.min(1, currentScroll / totalHeight));
      // Exponential moving average for smoothing
      const smoothing = 0.18; // 0..1 higher = snappier
      scrollCurrentRef.current = scrollCurrentRef.current + (target - scrollCurrentRef.current) * smoothing;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${scrollCurrentRef.current})`;
      }
      rafId = requestAnimationFrame(update);
    };
    const onResize = () => {
      // Trigger a recalculation on resize
      if (rafId === null) rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);


  // Show "Go to Top" after scrolling down
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };


  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <header className="border-b backdrop-blur-lg bg-background/80 sticky top-0 z-50">

        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          className="h-1 w-full origin-left will-change-transform transform-gpu rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 shadow-[0_0_10px_rgba(59,130,246,0.8),0_0_20px_rgba(139,92,246,0.6)]"
          style={{ transform: 'scaleX(0)' }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          >
            <BarChart2 className="h-6 w-6 text-primary" />
            <span className="font-extrabold text-xl">StockVision</span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button
                className="relative overflow-hidden font-bold flex items-center gap-2 px-6 py-3 
                      rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 
                      text-white hover:scale-105 transition-transform"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </span>

                {/* shimmer overlay */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent 
                            translate-x-[-100%] animate-[shimmer_2s_infinite]" />
              </Button>
            </Link>

            {/* <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2" onClick={() => setSidebarOpen(true)}>
                <BarChart2 className="h-6 w-6 text-primary" />
                <span className="font-extrabold text-xl">StockVision</span>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link href="/dashboard">
                  <Button className="font-bold hover:scale-105 transition-transform flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </header>


      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Floating Side Menu Button */}
      <div className={`fixed left-2 top-32 z-30 transition-all duration-300 ${sidebarOpen ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-12 h-12 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-blue-200/50 dark:border-blue-600/30 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          aria-label="Open side menu"
        >
          {/* Light mode: double chevron arrows like in the image */}
          <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-200 dark:hidden">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
            <svg className="w-4 h-4 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Dark mode: double chevron arrows like in the image */}
          <div className="hidden dark:flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
            <svg className="w-4 h-4 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>



      {/* Stock Ticker */}
      <StockTicker speedPxPerSecond={35} />


      {/* Hero Section */}
      <section className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight 
               bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 
               bg-clip-text text-transparent bg-[length:200%_200%] animate-textGradient">
                Visualize Your Portfolio Performance
              </h1>
              <p className="text-xl text-muted-foreground">
                Track your investments, analyze performance, and make data-driven decisions
                with our powerful financial dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto font-bold relative overflow-hidden group"
                  >
                    <span className="relative z-10">Launch Dashboard</span>

                    {/* Water fill gradient */}
                    <span className="absolute inset-0 bg-gradient-to-t from-purple-500 to-blue-600
                                  translate-y-full group-hover:translate-y-0 
                                  transition-transform duration-500 ease-out z-0 " />
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto font-bold relative overflow-hidden group"
                  onClick={scrollToMarketData}
                >
                  <span className="relative z-10">Learn More</span>

                  {/* Different gradient but same palette */}
                  <span className="absolute inset-0 bg-gradient-to-t from-purple-600 to-pink-500 
                                  translate-y-full group-hover:translate-y-0 
                                  transition-transform duration-500 ease-out z-0" />
                </Button>

              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-slide-in">
              <div className="flex flex-col gap-4">
                <div className="card-bottom-line">
                  <LineChart className="h-16 w-16 text-primary mb-2" />
                  <p className="text-center font-medium">Stock Performance</p>
                </div>
                <div className="card-bottom-line">
                  <PieChart className="h-16 w-16 text-primary mb-2" />
                  <p className="text-center font-medium">Portfolio Allocation</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <div className="card-bottom-line">
                  <BarChart2 className="h-16 w-16 text-primary mb-2" />
                  <p className="text-center font-medium">Revenue Analytics</p>
                </div>
                <div className="card-bottom-line">
                  <div className="font-bold text-3xl text-primary">+34%</div>
                  <p className="text-center font-medium mt-2">Portfolio Growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

{/*  
    <section>
      <div>
        <MacbookScroll src = "https://raw.githubusercontent.com/MIHIR2006/StockVision/refs/heads/main/Dashboard.png" showGradient = {true}  title="StockVision" />
        // badge={<img src="/sticker.png" alt="Sticker" />} 
      </div>
    </section>

*/}
      {/* Stock Prices Section */}
      <section className="py-12 bg-primary/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-gradient">
            Live Market Data
          </h2>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {portfolioStocks.map((stock, index) => (
              <div
                key={stock.symbol}
                className="bg-card/60 backdrop-blur-lg p-4 rounded-xl border border-primary/10 animate-fade-in scale-hover card-shimmer"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">{stock.symbol}</span>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${stock.change >= 0 ? "bg-gain/20 text-gain" : "bg-loss/20 text-loss"
                      }`}
                  >
                    {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
                <div className="text-2xl font-bold">${stock.price.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1">{stock.name}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              className="font-bold scale-hover"
              onClick={scrollToYieldCurve}
            >
              Show More
            </Button>
          </div>
        </div>
      </section>


      {/* Market Data Center Section */}
      <div ref={marketDataRef} id="market-data-center" className="scroll-mt-20">
        <MarketDataCenter />
      </div>


      {/* U.S. Treasury Bill Section */}
      <div ref={yieldCurveRef} id="yield-curve" className="scroll-mt-20">
        <TreasuryBillSection />
      </div>


      {/* YIELD CURVE - US Section */}
      <section className="py-16 bg-muted/30 dark:bg-slate-900/50" id="yield-curve-us">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-gradient">
            YIELD CURVE - US
          </h2>

          {/* Card with moving glowing border */}
          <div className="glow-border-card p-6 rounded-xl shadow-lg max-w-5xl mx-auto dark:bg-slate-800/80 dark:border-slate-700/50 relative">
            <div className="aspect-video w-full bg-card/60 dark:bg-slate-900/80 rounded-lg p-6 flex flex-col justify-end mb-6 relative">

              {/* X-Axis Labels */}
              <div className="flex justify-between w-full mb-2 text-sm text-muted-foreground">
                <div>1M</div>
                <div>3M</div>
                <div>6M</div>
                <div>1Y</div>
                <div>2Y</div>
                <div>5Y</div>
                <div>10Y</div>
                <div>20Y</div>
                <div>30Y</div>
              </div>

              {/* Yield Curve */}
              <div className="relative h-64 w-full">
                {/* Grid Lines */}
                <div className="absolute inset-0 grid grid-rows-4 w-full h-full">
                  <div className="border-t border-muted-foreground/10"></div>
                  <div className="border-t border-muted-foreground/10"></div>
                  <div className="border-t border-muted-foreground/10"></div>
                  <div className="border-t border-muted-foreground/10"></div>
                </div>

                {/* Y-Axis Labels */}
                <div className="absolute -left-6 inset-y-0 flex flex-col justify-between text-sm text-muted-foreground">
                  <div>5%</div>
                  <div>4%</div>
                  <div>3%</div>
                  <div>2%</div>
                  <div>1%</div>
                </div>

                {/* Current Yield Curve */}
                <div className="absolute inset-x-0 bottom-0 h-full overflow-hidden">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                    <path
                      d="M0,50 C10,45 20,42 30,40 C40,38 50,37 60,37 C70,43 80,48 90,42 L100,45"
                      fill="none"
                      strokeWidth="2"
                      className="stroke-primary"
                    />
                  </svg>
                </div>

                {/* Previous Yield Curve */}
                <div className="absolute inset-x-0 bottom-0 h-full overflow-hidden">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                    <path
                      d="M0,30 C10,35 20,38 30,40 C40,42 50,43 60,43 C70,43 80,42 90,40 L100,35"
                      fill="none"
                      strokeWidth="2"
                      strokeDasharray="2,2"
                      className="stroke-blue-500/70"
                    />
                  </svg>
                </div>

                {/* Legend */}
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-6 bg-primary rounded-sm"></div>
                    <span className="text-xs">Current (June 2025)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-6 border-2 border-dashed border-blue-500/70 rounded-sm"></div>
                    <span className="text-xs">Previous (March 2025)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Current Yield Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  The US Treasury yield curve is a critical indicator of economic health and market expectations.
                  Our analysis provides insights into potential market movements based on yield curve shapes.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Real-time Treasury yield data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Yield curve inversion alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Historical yield comparisons</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Current Treasury Yields</h3>
                <p className="text-muted-foreground mb-4">
                  Understanding yield curve movements helps predict economic cycles and make informed investment decisions.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>2-Year Treasury</span>
                    <span className="font-bold">4.32%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>5-Year Treasury</span>
                    <span className="font-bold">4.15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>10-Year Treasury</span>
                    <span className="font-bold">4.01%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>30-Year Treasury</span>
                    <span className="font-bold">4.21%</span>
                  </div>

                  {/* Yellow Glowy Alert */}
                  <div className="mt-6 p-3 glow-yellow rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 text-amber-500">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-amber-500">Yield Curve Alert</p>
                        <p className="text-sm">Slight inversion between 5Y and 30Y yields may indicate economic uncertainty ahead.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features-section"
        className="py-16 bg-muted/50 scroll-mt-20"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center">
            Powerful Features
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div
              className="glass-card p-6 rounded-xl shadow-lg animate-fade-in 
                   transition-all duration-300 
                   hover:scale-105 hover:shadow-2xl hover:bg-primary/5 
                   active:scale-110"
              style={{ animationDelay: "0.2s" }}
            >
              <ChartLine className="h-12 w-12 text-primary mb-4 transition-colors duration-300 group-hover:text-primary/80" />
              <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
              <p className="text-muted-foreground">
                Track your portfolio performance with real-time charts and
                analytics that help you make informed decisions.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="glass-card p-6 rounded-xl shadow-lg animate-fade-in 
                   transition-all duration-300 
                   hover:scale-105 hover:shadow-2xl hover:bg-primary/5 
                   active:scale-110"
              style={{ animationDelay: "0.3s" }}
            >
              <TrendingUp className="h-12 w-12 text-primary mb-4 transition-colors duration-300 group-hover:text-primary/80" />
              <h3 className="text-xl font-bold mb-2">Performance Tracking</h3>
              <p className="text-muted-foreground">
                Visualize your investment growth over time with interactive
                charts and comprehensive performance metrics.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="glass-card p-6 rounded-xl shadow-lg animate-fade-in 
                   transition-all duration-300 
                   hover:scale-105 hover:shadow-2xl hover:bg-primary/5 
                   active:scale-110"
              style={{ animationDelay: "0.4s" }}
            >
              <CircleDollarSign className="h-12 w-12 text-primary mb-4 transition-colors duration-300 group-hover:text-primary/80" />
              <h3 className="text-xl font-bold mb-2">Portfolio Management</h3>
              <p className="text-muted-foreground">
                Easily manage your investment portfolio with intuitive tools to
                buy, sell, and track your holdings.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Ready to Optimize Your Investments?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Start tracking your portfolio performance today and make smarter investment decisions with StockVision.</p>
          <Link href="/dashboard">
            <Button size="lg" className="font-bold scale-hover">
              Launch Dashboard
            </Button>
          </Link>
        </div>
      </section>


      {/* Pricing Section */}
      <section
        ref={pricingRef}
        id="pricing-section"
        className="py-16 bg-muted/50 scroll-mt-20"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center">
            Pricing
          </h2>
          <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            Choose the plan that best fits your investment strategy with our
            AI-powered price prediction models.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Silver Plan */}
            <Card className="glass-card border-primary/10 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-gray-400 to-gray-500"></div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">Silver</CardTitle>
                  <Badge
                    variant="outline"
                    className="font-medium text-sm bg-gradient-to-r from-gray-400 to-gray-500"
                  >
                    Basic
                  </Badge>
                </div>
                <div className="flex items-end gap-1 mt-4">
                  <span className="text-4xl font-extrabold">$99</span>
                  <span className="text-muted-foreground mb-1">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Basic price predictions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Top 50 stocks analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Daily market insights</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <XCircle className="h-5 w-5" />
                    <span>Advanced ML models</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <XCircle className="h-5 w-5" />
                    <span>Portfolio optimization</span>
                  </li>
                </ul>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="w-full mt-4 font-bold transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-white"
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Gold Plan */}
            <Card className="glass-card border-primary/10 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary relative overflow-hidden scale-105 z-10">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600"></div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">Gold</CardTitle>
                  <Badge className="font-medium text-sm bg-amber-500">
                    Recommended
                  </Badge>
                </div>
                <div className="flex items-end gap-1 mt-4">
                  <span className="text-4xl font-extrabold">$279</span>
                  <span className="text-muted-foreground mb-1">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Enhanced price predictions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Top 200 stocks analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Real-time market alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Advanced ML models</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <XCircle className="h-5 w-5" />
                    <span>Portfolio optimization</span>
                  </li>
                </ul>
                <Link href="/dashboard">
                  <Button className="w-full mt-4 font-bold transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-white">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Platinum Plan */}
            <Card className="glass-card border-primary/10 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-indigo-400 to-indigo-600"></div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">Platinum</CardTitle>
                  <Badge
                    variant="outline"
                    className="font-medium text-sm bg-gradient-to-r from-indigo-400 to-indigo-600"
                  >
                    Premium
                  </Badge>
                </div>
                <div className="flex items-end gap-1 mt-4">
                  <span className="text-4xl font-extrabold">$499</span>
                  <span className="text-muted-foreground mb-1">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Premium price predictions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Full market analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Personalized market alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Advanced ML models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Portfolio optimization</span>
                  </li>
                </ul>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="w-full mt-4 font-bold transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-white"
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Diamond Plan (Coming Soon) */}
          <div className="mt-12 mb-8">
            <Card className="glass-card border-primary/10 shadow-lg transition-all hover:shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-purple-600 to-purple-500"></div>

              {/* Glowy "Coming Soon" Badge */}
              <div className="absolute right-2 sm:right-4 top-2 sm:top-4 z-20">
                <Badge className="mt-3 font-medium px-3 sm:px-4 py-1 text-xs sm:text-sm whitespace-nowrap glow-badge">
                  Coming Soon
                </Badge>
              </div>

              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-6 sm:mt-0">
                  <CardTitle className="text-3xl font-extrabold">
                    Diamond
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="font-medium text-sm self-start sm:self-auto bg-gradient-to-r from-blue-400 to-purple-500"
                  >
                    Enterprise
                  </Badge>
                </div>
                <p className="text-xl font-bold mt-2">
                  Our most advanced ML prediction Model, trained on{" "}
                  <span className="text-purple-500 font-extrabold">
                    20 years
                  </span>{" "}
                  of historical stock data.
                </p>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Advanced Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">
                        Deep-learning models trained on 20+ years of market data
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">
                        Predictive market crash indicators
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">
                        Sector-specific trend forecasting
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">
                        Custom AI model training on your portfolio
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Enterprise Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">
                        Pattern Recognition Engine
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">
                        Dedicated account manager
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">
                        Get Personal Guidance from Top Market Minds
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">
                        White-label options available
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="md:col-span-2 flex flex-col items-center mt-4">
                  <p className="text-muted-foreground text-center mb-4 font-medium">
                    Join the waitlist to be the first to know when our Diamond
                    plan becomes available
                  </p>
                  <Button
                    variant="outline"
                    className="font-bold hover:scale-105 transition-transform px-8"
                    onClick={() =>
                    (window.location.href =
                      "mailto:elevate360marketingcompany@gmail.com?subject=Diamond%20Plan%20Waitlist&body=I%20am%20interested%20in%20joining%20the%20waitlist%20for%20your%20Diamond%20plan.")
                    }
                  >
                    Join Waitlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>


          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Need a custom solution for your investment firm?
            </p>
            <Button
              variant="outline"
              className="font-bold scale-hover"
              onClick={() => window.location.href = 'mailto:elevate360marketingcompany@gmail.com?subject=Custom%20Solution%20Inquiry&body=I%20am%20interested%20in%20learning%20more%20about%20custom%20solutions%20for%20my%20investment%20firm.'}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>



      {/* Testimonial Section */}
      <Testimonials />


      {/* Footer */}
      <footer className="border-t backdrop-blur-lg bg-background/80">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="h-5 w-5 text-primary" />
                <span className="font-bold text-xl">StockVision</span>
              </div>
              <p className="text-muted-foreground">Your comprehensive tool for portfolio analysis and investment tracking.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a onClick={scrollToTop} className="hover:text-primary transition-colors cursor-pointer">Home</a></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><a onClick={scrollToFeatures} className="hover:text-primary transition-colors cursor-pointer">Features</a></li>
                <li><a onClick={scrollToPricing} className="hover:text-primary transition-colors cursor-pointer">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <p className="text-muted-foreground">Have questions? Reach out to our support team.</p>
              <Button
                variant="outline"
                className="mt-4 scale-hover"
                onClick={() => window.location.href = 'mailto:elevate360marketingcompany@gmail.com?subject=StockVision%20Support%20Request&body=I%20have%20a%20question%20about%20StockVision:'}
              >
                Contact Support
              </Button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 StockVision. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Go to Top Button */}
      <div
        className={clsx(
          "fixed bottom-6 right-6 z-50 transition-all duration-300",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-4"
        )}
      >
        <button
          onClick={scrollToTop}
          className="relative w-14 h-14 rounded-full text-white focus:outline-none focus:ring-4 focus:ring-blue-400/40 active:scale-95 transition-transform"
          aria-label="Go to top"
        >
          {/* Gradient core */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-500" />
          {/* Soft glow */}
          <span className="absolute inset-0 rounded-full blur-xl bg-blue-500/60 animate-pulse" aria-hidden="true" />
          {/* Foreground icon */}
          <span className="relative flex items-center justify-center w-full h-full">
            <svg
              className="w-6 h-6 drop-shadow-md"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l7-7 7 7M12 5v14" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
