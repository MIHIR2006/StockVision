import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

interface FooterProps {
  onScrollToTop: () => void;
  onScrollToFeatures: () => void;
  onScrollToPricing: () => void;
}

export function Footer({ onScrollToTop, onScrollToFeatures, onScrollToPricing }: FooterProps) {
  return (
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
              <li><a onClick={onScrollToTop} className="hover:text-primary transition-colors cursor-pointer">Home</a></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><a onClick={onScrollToFeatures} className="hover:text-primary transition-colors cursor-pointer">Features</a></li>
              <li><a onClick={onScrollToPricing} className="hover:text-primary transition-colors cursor-pointer">Pricing</a></li>
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
  );
} 