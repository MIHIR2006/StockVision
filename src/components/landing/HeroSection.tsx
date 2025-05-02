import { Button } from "@/components/ui/button";
import { BarChart2, LineChart, PieChart } from "lucide-react";
import { memo } from 'react';
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onLearnMore: () => void;
}

const FeatureCard = memo(({ icon: Icon, title, value }: { icon: any, title: string, value?: string }) => (
  <div className="bg-primary/10 rounded-lg p-6 h-40 flex flex-col justify-center items-center backdrop-blur-lg border border-primary/20 scale-hover">
    {Icon && <Icon className="h-16 w-16 text-primary mb-2" aria-hidden="true" />}
    {value && <div className="font-bold text-3xl text-primary">{value}</div>}
    <p className="text-center font-medium mt-2">{title}</p>
  </div>
));

FeatureCard.displayName = 'FeatureCard';

export function HeroSection({ onLearnMore }: HeroSectionProps) {
  return (
    <section className="flex-1 flex items-center" aria-labelledby="hero-title">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 id="hero-title" className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gradient">
              Visualize Your Portfolio Performance
            </h1>
            <p className="text-xl text-muted-foreground">
              Track your investments, analyze performance, and make data-driven decisions
              with our powerful financial dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto font-bold scale-hover"
                  aria-label="Launch Dashboard"
                >
                  Launch Dashboard
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto font-bold scale-hover"
                onClick={onLearnMore}
                aria-label="Learn more about our features"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 animate-slide-in">
            <div className="flex flex-col gap-4">
              <FeatureCard icon={LineChart} title="Stock Performance" />
              <FeatureCard icon={PieChart} title="Portfolio Allocation" />
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <FeatureCard icon={BarChart2} title="Revenue Analytics" />
              <FeatureCard title="Portfolio Growth" value="+34%" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 