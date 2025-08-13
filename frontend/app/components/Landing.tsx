'use client';
import { MarketDataCenter } from "@/components/market-data-center";
import { StockTicker } from "@/components/stock-ticker";
import { ThemeToggle } from "@/components/theme-toggle";
import { TreasuryBillSection } from "@/components/treasury-bill-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portfolioStocks } from "@/data/mock-data";
import { BarChart2, ChartLine, CheckCircle, CircleDollarSign, LineChart, LogIn, PieChart, TrendingUp, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { useRouter, usePathname } from "next/navigation";
import { resetPreloaderState } from "@/lib/preloader-utils";




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

  // Function to reset preloader state (for testing purposes)
  const resetPreloader = () => {
    resetPreloaderState();
    // Optionally reload the page to show preloader again
    window.location.reload();
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




    




  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b backdrop-blur-lg bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2" onClick={() => setSidebarOpen(true)}>
            <BarChart2 className="h-6 w-6 text-primary" />
            <span className="font-extrabold text-xl">StockVision</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button className="font-bold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/25 flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>
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
      


      {/* Stock Ticker */}
      <StockTicker />


      {/* Hero Section */}
      <section className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gradient">
                Visualize Your Portfolio Performance
              </h1>
              <p className="text-xl text-muted-foreground">
                Track your investments, analyze performance, and make data-driven decisions
                with our powerful financial dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto font-bold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/25">
                    Launch Dashboard
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto font-bold transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25"
                  onClick={scrollToMarketData}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-slide-in">
              <div className="flex flex-col gap-4">
                <div className="bg-primary/10 rounded-lg p-6 h-40 flex flex-col justify-center items-center backdrop-blur-lg border border-primary/20 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/25">
                  <LineChart className="h-16 w-16 text-primary mb-2 transition-all duration-300 ease-in-out hover:scale-110" />
                  <p className="text-center font-medium transition-colors duration-300 ease-in-out hover:text-primary">Stock Performance</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-6 h-40 flex flex-col justify-center items-center backdrop-blur-lg border border-primary/20 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/25">
                  <PieChart className="h-16 w-16 text-primary mb-2 transition-all duration-300 ease-in-out hover:scale-110" />
                  <p className="text-center font-medium transition-colors duration-300 ease-in-out hover:text-primary">Portfolio Allocation</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-8">
                <div className="bg-primary/10 rounded-lg p-6 h-40 flex flex-col justify-center items-center backdrop-blur-lg border border-primary/20 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/25">
                  <BarChart2 className="h-16 w-16 text-primary mb-2 transition-all duration-300 ease-in-out hover:scale-110" />
                  <p className="text-center font-medium transition-colors duration-300 ease-in-out hover:text-primary">Revenue Analytics</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-6 h-40 flex flex-col justify-center items-center backdrop-blur-lg border border-primary/20 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/25">
                  <div className="font-bold text-3xl text-primary transition-all duration-300 ease-in-out hover:scale-110">+34%</div>
                  <p className="text-center font-medium mt-2 transition-colors duration-300 ease-in-out hover:text-primary">Portfolio Growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


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
                className="bg-card/60 backdrop-blur-lg p-4 rounded-xl border border-primary/10 animate-fade-in transition-all duration-300 ease-in-out hover:scale-105 hover:bg-card/80 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/25 cursor-pointer group" 
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg transition-colors duration-300 ease-in-out group-hover:text-primary">{stock.symbol}</span>
                  <div 
                    className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ease-in-out group-hover:scale-110 ${stock.change >= 0 ? "bg-gain/20 text-gain" : "bg-loss/20 text-loss"
                    }`}
                  >
                    {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
                <div className="text-2xl font-bold transition-colors duration-300 ease-in-out group-hover:text-primary">${stock.price.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1 transition-colors duration-300 ease-in-out group-hover:text-foreground/80">{stock.name}</div>
              </div>
            ))}
          </div>


          <div className="mt-8 text-center">
            <Button
              variant="outline"
              className="font-bold transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25"
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
          <div className="glass-card p-6 rounded-xl shadow-lg max-w-5xl mx-auto dark:bg-slate-800/80 dark:border-slate-700/50">
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
                      d="M0,50 C10,45 20,42 30,40 C40,38 50,37 60,37 C70,37 80,38 90,42 L100,45"
                      fill="none"
                      strokeWidth="2"
                      className="stroke-primary"
                    />
                  </svg>
                </div>


                {/* Data Points */}
                <div className="absolute left-0 bottom-40 h-2 w-2 rounded-full bg-primary"></div>
                <div className="absolute left-1/8 bottom-42 h-2 w-2 rounded-full bg-primary"></div>
                <div className="absolute left-2/8 bottom-45 h-2 w-2 rounded-full bg-primary"></div>
                <div className="absolute left-3/8 bottom-48 h-2 w-2 rounded-full bg-primary"></div>
                <div className="absolute left-4/8 bottom-50 h-2 w-2 rounded-full bg-primary"></div>
                <div className="absolute left-5/8 bottom-50 h-2 w-2 rounded-full bg-primary"></div>
                <div className="absolute left-6/8 bottom-48 h-2 w-2 rounded-full bg-primary"></div>
                <div className="absolute left-7/8 bottom-45 h-2 w-2 rounded-full bg-primary"></div>
                <div className="absolute right-0 bottom-42 h-2 w-2 rounded-full bg-primary"></div>


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


                  <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
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
      <section ref={featuresRef} id="features-section" className="py-16 bg-muted/50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center">Powerful Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="glass-card p-6 rounded-xl shadow-lg animate-fade-in group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:bg-card/90 hover:border-primary/30" style={{ animationDelay: "0.2s" }}>
              <ChartLine className="h-12 w-12 text-primary mb-4 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:text-primary/80" />
              <h3 className="text-xl font-bold mb-2 transition-colors duration-300 ease-in-out group-hover:text-primary">Real-time Analytics</h3>
              <p className="text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground/80">Track your portfolio performance with real-time charts and analytics that help you make informed decisions.</p>
            </div>
            <div className="glass-card p-6 rounded-xl shadow-lg animate-fade-in group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:bg-card/90 hover:border-primary/30" style={{ animationDelay: "0.3s" }}>
              <TrendingUp className="h-12 w-12 text-primary mb-4 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:text-primary/80" />
              <h3 className="text-xl font-bold mb-2 transition-colors duration-300 ease-in-out group-hover:text-primary">Performance Tracking</h3>
              <p className="text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground/80">Visualize your investment growth over time with interactive charts and comprehensive performance metrics.</p>
            </div>
            <div className="glass-card p-6 rounded-xl shadow-lg animate-fade-in group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:bg-card/90 hover:border-primary/30" style={{ animationDelay: "0.4s" }}>
              <CircleDollarSign className="h-12 w-12 text-primary mb-4 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:text-primary/80" />
              <h3 className="text-xl font-bold mb-2 transition-colors duration-300 ease-in-out group-hover:text-primary">Portfolio Management</h3>
              <p className="text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground/80">Easily manage your investment portfolio with intuitive tools to buy, sell, and track your holdings.</p>
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
            <Button size="lg" className="font-bold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/25">
              Launch Dashboard
            </Button>
          </Link>
        </div>
      </section>


    {/*Pricing Section*/}
      <section ref={pricingRef} id="pricing-section" className="py-16 bg-muted/50 scroll-mt-20">
      <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center">Pricing</h2>
          <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            Choose the plan that best fits your investment strategy with our AI-powered price prediction models.
          </p>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Silver Plan */}
            <Card className="glass-card border-primary/10 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 hover:bg-card/90 hover:border-primary/30 relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-gray-400 to-gray-500 transition-all duration-300 ease-in-out group-hover:from-gray-300 group-hover:to-gray-400"></div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold transition-colors duration-300 ease-in-out group-hover:text-primary">Silver</CardTitle>
                  <Badge variant="outline" className="font-medium text-sm  bg-gradient-to-r from-gray-400 to-gray-500 transition-all duration-300 ease-in-out group-hover:from-gray-300 group-hover:to-gray-400">Basic</Badge>
                </div>
                <div className="flex items-end gap-1 mt-4">
                  <span className="text-4xl font-extrabold transition-colors duration-300 ease-in-out group-hover:text-primary">$99</span>
                  <span className="text-muted-foreground mb-1 transition-colors duration-300 ease-in-out group-hover:text-foreground/70">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 transition-all duration-300 ease-in-out group-hover:scale-110" />
                    <span>Basic price predictions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 transition-all duration-300 ease-in-out group-hover:scale-110" />
                    <span>Top 50 stocks analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 transition-all duration-300 ease-in-out group-hover:scale-110" />
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
                  <Button variant="outline" className="w-full mt-4 font-bold transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Gold Plan */}
            <Card className="glass-card border-primary/10 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-105 hover:bg-card/90 hover:border-amber-500/30 relative overflow-hidden scale-105 z-10 group cursor-pointer">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 ease-in-out group-hover:from-amber-300 group-hover:to-amber-500"></div>
              {/* <div className="absolute -right-8 top-6 rotate-45 bg-primary text-primary-foreground py-1 px-10 text-sm font-semibold">Popular</div> */}
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold transition-colors duration-300 ease-in-out group-hover:text-amber-600">Gold</CardTitle>
                  <Badge className="font-medium text-sm bg-amber-500 transition-all duration-300 ease-in-out group-hover:bg-amber-600 group-hover:scale-105">Recommended</Badge>
                </div>
                <div className="flex items-end gap-1 mt-4">
                  <span className="text-4xl font-extrabold transition-colors duration-300 ease-in-out group-hover:text-amber-600">$279</span>
                  <span className="text-muted-foreground mb-1 transition-colors duration-300 ease-in-out group-hover:text-foreground/70">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 transition-all duration-300 ease-in-out group-hover:scale-110" />
                    <span>Enhanced price predictions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 transition-all duration-300 ease-in-out group-hover:scale-110" />
                    <span>Top 200 stocks analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 transition-all duration-300 ease-in-out group-hover:scale-110" />
                    <span>Real-time market alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 transition-all duration-300 ease-in-out group-hover:scale-110" />
                    <span>Advanced ML models</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <XCircle className="h-5 w-5" />
                    <span>Portfolio optimization</span>
                  </li>
                </ul>

                <Link href="/dashboard">
                  <Button className="w-full mt-4 font-bold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/25 hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Platinum Plan */}
            <Card className="glass-card border-primary/10 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-105 hover:bg-card/90 hover:border-indigo-500/30 relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-300 ease-in-out group-hover:from-indigo-300 group-hover:to-indigo-500"></div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold transition-colors duration-300 ease-in-out group-hover:text-indigo-600">Platinum</CardTitle>
                  <Badge variant="outline" className="font-medium text-sm bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-300 ease-in-out group-hover:from-indigo-300 group-hover:to-indigo-500">Premium</Badge>
                </div>
                <div className="flex items-end gap-1 mt-4">
                  <span className="text-4xl font-extrabold transition-colors duration-300 ease-in-out group-hover:text-indigo-600">$499</span>
                  <span className="text-muted-foreground mb-1 transition-colors duration-300 ease-in-out group-hover:text-foreground/70">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 transition-all duration-300 ease-in-out group-hover:scale-110" />
                    <span>Premium price predictions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 transition-all duration-300 ease-in-out group-hover:scale-110" />
                    <span>Full market analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 transition-all duration-300 ease-in-out group-hover:scale-110" />
                    <span>Personalized market alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 transition-all duration-300 ease-in-out group-hover:scale-110" />
                    <span>Advanced ML models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 transition-all duration-300 ease-in-out group-hover:scale-110" />
                    <span>Portfolio optimization</span>
                  </li>
                </ul>

                <Link href="/dashboard">
                  <Button variant="outline" className="w-full mt-4 font-bold transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>


          {/* Diamond Plan (Coming Soon) */}
          <div className="mt-12 mb-8">
            <Card className="glass-card border-primary/10 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 hover:bg-card/90 hover:border-purple-500/30 relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-purple-600 to-purple-500 transition-all duration-300 ease-in-out group-hover:from-purple-500 group-hover:to-purple-400"></div>
              <div className="absolute right-2 sm:right-4 top-2 sm:top-4 z-20">
                <Badge className="mt-3 font-medium bg-blue-400/80 px-3 sm:px-4 py-1 text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ease-in-out group-hover:bg-blue-300 group-hover:scale-105">Coming Soon</Badge>
              </div>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-6 sm:mt-0">
                  <CardTitle className="text-3xl font-extrabold transition-colors duration-300 ease-in-out group-hover:text-purple-600">Diamond</CardTitle>
                  <Badge variant="outline" className="font-medium text-sm self-start sm:self-auto bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ease-in-out group-hover:from-blue-300 group-hover:to-purple-400">Enterprise</Badge>
                </div>
                <p className="text-xl font-bold mt-2 transition-colors duration-300 ease-in-out group-hover:text-foreground/90">
                Our most advanced ML prediction Model, trained on <span className="text-purple-500 font-extrabold transition-colors duration-300 ease-in-out group-hover:text-purple-400">20 years</span> of historical stock data.
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold transition-colors duration-300 ease-in-out group-hover:text-purple-600">Advanced Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5 transition-all duration-300 ease-in-out group-hover:scale-110" />
                      <span className="font-medium">Deep-learning models trained on 20+ years of market data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5 transition-all duration-300 ease-in-out group-hover:scale-110" />
                      <span className="font-medium">Predictive market crash indicators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5 transition-all duration-300 ease-in-out group-hover:scale-110" />
                      <span className="font-medium">Sector-specific trend forecasting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5 transition-all duration-300 ease-in-out group-hover:scale-110" />
                      <span className="font-medium">Custom AI model training on your portfolio</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold transition-colors duration-300 ease-in-out group-hover:text-purple-600">Enterprise Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5 transition-all duration-300 ease-in-out group-hover:scale-110" />
                      <span className="font-medium"> Pattern Recognition Engine</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5 transition-all duration-300 ease-in-out group-hover:scale-110" />
                      <span className="font-medium">Dedicated account manager</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5 transition-all duration-300 ease-in-out group-hover:scale-110" />
                      <span className="font-medium">Get Personal Guidance from Top Market Minds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5 transition-all duration-300 ease-in-out group-hover:scale-110" />
                      <span className="font-medium">White-label options available</span>
                    </li>
                  </ul>
                </div>
                <div className="md:col-span-2 flex flex-col items-center mt-4">
                  <p className="text-muted-foreground text-center mb-4 font-medium transition-colors duration-300 ease-in-out group-hover:text-foreground/80">
                    Join the waitlist to be the first to know when our Diamond plan becomes available
                  </p>
                  <Button variant="outline" className="font-bold transition-all duration-300 ease-in-out hover:scale-105 hover:bg-purple-500 hover:text-white hover:shadow-lg hover:shadow-purple-500/25 px-8" onClick={() => window.location.href = 'mailto:elevate360marketingcompany@gmail.com?subject=Diamond%20Plan%20Waitlist&body=I%20am%20interested%20in%20joining%20the%20waitlist%20for%20your%20Diamond%20plan.'}>
                    Join Waitlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>


          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4 transition-colors duration-300 ease-in-out hover:text-foreground/80">Need a custom solution for your investment firm?</p>
            <Button variant="outline" className="font-bold transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25" onClick={() => window.location.href = 'mailto:elevate360marketingcompany@gmail.com?subject=Custom%20Solution%20Inquiry&body=I%20am%20interested%20in%20learning%20more%20about%20custom%20solutions%20for%20my%20investment%20firm.'}>
              Contact Sales
            </Button>
          </div>
      </div>
    </section>


      {/* Testimonial Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-slate-900/80 dark:to-slate-950/80">
        <div className="container mx-auto px-4">


          <h3 className="text-4xl md:text-5xl font-bold text-center mb-16">Trusted by <br />thousands of investors and traders.
          </h3>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="flex flex-col gap-8">
              <div className="glass-card p-6 rounded-xl shadow-md dark:bg-slate-800/80 dark:border-slate-700/50 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:bg-card/90 hover:border-primary/20 group cursor-pointer">
                <p className="mb-4 transition-colors duration-300 ease-in-out group-hover:text-foreground/90">"I bought the Gold membership of Stock Vision, and it has helped me a lot in increasing both my portfolio size and profits. This quarter has been especially beneficial for me."</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold transition-colors duration-300 ease-in-out group-hover:text-primary">Leslie Alexander</p>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground/70">@lesliealexander</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl shadow-md dark:bg-slate-800/80 dark:border-slate-700/50 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:bg-card/90 hover:border-primary/20 group cursor-pointer">
                <p className="mb-4 transition-colors duration-300 ease-in-out group-hover:text-foreground/90">"The real-time market alerts have saved me from several bad investment decisions. I've been using StockVision for 6 months and my portfolio is up 24%. Couldn't be happier."</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold transition-colors duration-300 ease-in-out group-hover:text-primary">Michael Foster</p>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground/70">@michaelfoster</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl shadow-md dark:bg-slate-800/80 dark:border-slate-700/50 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:bg-card/90 hover:border-primary/20 group cursor-pointer">
                <p className="mb-4 transition-colors duration-300 ease-in-out group-hover:text-foreground/90">"As a day trader, I need reliable data and quick insights. StockVision's dashboard provides everything I need at a glance. The Silver plan has paid for itself many times over."</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold transition-colors duration-300 ease-in-out group-hover:text-primary">Dries Vincent</p>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground/70">@driesvincent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column */}
            <div className="space-y-8">
              <div className="glass-card p-6 rounded-xl shadow-md dark:bg-slate-800/80 dark:border-slate-700/50 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:bg-card/90 hover:border-primary/20 group cursor-pointer">
                <p className="mb-4 transition-colors duration-300 ease-in-out group-hover:text-foreground/90">"The AI predictions on StockVision have been remarkably accurate. I was skeptical at first, but after seeing their 87% accuracy rate on tech stocks over three months, I upgraded to the Platinum plan. My investment firm now relies on it daily."</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold transition-colors duration-300 ease-in-out group-hover:text-primary">Brenna Goyette</p>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground/70">@brennagoyette</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl shadow-md dark:bg-slate-800/80 dark:border-slate-700/50 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:bg-card/90 hover:border-primary/20 group cursor-pointer">
                <p className="mb-4 transition-colors duration-300 ease-in-out group-hover:text-foreground/90">"StockVision's portfolio optimization tool helped me rebalance my investments and reduce risk while maintaining strong returns. Their Gold plan is worth every penny."</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold transition-colors duration-300 ease-in-out group-hover:text-primary">Lindsay Walton</p>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground/70">@lindsaywalton</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl shadow-md dark:bg-slate-800/80 dark:border-slate-700/50 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:bg-card/90 hover:border-primary/20 group cursor-pointer">
                <p className="mb-4 transition-colors duration-300 ease-in-out group-hover:text-foreground/90">"The visualizations on StockVision make complex market data easy to understand. I've made 31% returns this year thanks to their insights and predictive analytics."</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold transition-colors duration-300 ease-in-out group-hover:text-primary">Courtney Henry</p>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground/70">@courtneyhenry</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-8">
              <div className="glass-card p-6 rounded-xl shadow-md dark:bg-slate-800/80 dark:border-slate-700/50 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:bg-card/90 hover:border-primary/20 group cursor-pointer">
                <p className="mb-4 transition-colors duration-300 ease-in-out group-hover:text-foreground/90">"StockVision alerted me to a market downturn three days before it happened. I was able to adjust my positions and avoid a 15% loss. The Platinum plan's predictive alerts are game-changing."</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold transition-colors duration-300 ease-in-out group-hover:text-primary">Leonard Krasner</p>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground/70">@leonardkrasner</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl shadow-md dark:bg-slate-800/80 dark:border-slate-700/50 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:bg-card/90 hover:border-primary/20 group cursor-pointer">
                <p className="mb-4 transition-colors duration-300 ease-in-out group-hover:text-foreground/90">"I've tried many stock analysis platforms, but StockVision's ML models are in a league of their own. Their Gold plan has helped me identify undervalued stocks with remarkable accuracy."</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold transition-colors duration-300 ease-in-out group-hover:text-primary">Floyd Miles</p>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground/70">@floydmiles</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl shadow-md dark:bg-slate-800/80 dark:border-slate-700/50 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:bg-card/90 hover:border-primary/20 group cursor-pointer">
                <p className="mb-4 transition-colors duration-300 ease-in-out group-hover:text-foreground/90">"Since signing up for StockVision's Silver plan, my investment strategy has completely transformed. Their real-time analytics and daily insights have helped me achieve a 28% annual return."</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold transition-colors duration-300 ease-in-out group-hover:text-primary">Emily Selman</p>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground/70">@emilyselman</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="glass-card p-6 rounded-xl shadow-md dark:bg-slate-800/80 dark:border-slate-700/50 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:bg-card/90 hover:border-primary/20 group cursor-pointer">
              <p className="mb-4 transition-colors duration-300 ease-in-out group-hover:text-foreground/90">"StockVision's sector-specific trend forecasting helped our fund identify emerging opportunities in renewable energy. We've seen a 41% return in that sector alone over the past year. Looking forward to their Diamond plan."</p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold transition-colors duration-300 ease-in-out group-hover:text-primary">Tom Cook</p>
                  <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground/70">@tomcook</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl shadow-md dark:bg-slate-800/80 dark:border-slate-700/50 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:bg-card/90 hover:border-primary/20 group cursor-pointer">
              <p className="mb-4 transition-colors duration-300 ease-in-out group-hover:text-foreground/90">"As a financial advisor, I need tools I can trust. StockVision's Platinum plan gives me insights that impress my clients and keep their portfolios growing. The ROI has been exceptional."</p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold transition-colors duration-300 ease-in-out group-hover:text-primary">Whitney Francis</p>
                  <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground/70">@whitneyfrancis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


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
                <li><a onClick={scrollToTop} className="hover:text-primary transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 inline-block">Home</a></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-all duration-300 ease-in-out hover:scale-105 inline-block">Dashboard</Link></li>
                <li><a onClick={scrollToFeatures} className="hover:text-primary transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 inline-block">Features</a></li>
                <li><a onClick={scrollToPricing} className="hover:text-primary transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 inline-block">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <p className="text-muted-foreground">Have questions? Reach out to our support team.</p>
              <Button 
                variant="outline" 
                className="mt-4 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25"
                onClick={() => window.location.href = 'mailto:elevate360marketingcompany@gmail.com?subject=StockVision%20Support%20Request&body=I%20have%20a%20question%20about%20StockVision:'}
              >
                Contact Support
              </Button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 StockVision. All rights reserved.
            {/* Hidden reset button for testing purposes */}
            <button 
              onClick={resetPreloader}
              className="ml-4 text-xs text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors"
              title="Reset preloader (for testing)"
            >
              Reset Preloader
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}