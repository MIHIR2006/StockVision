import { ChartLine, CircleDollarSign, TrendingUp } from "lucide-react";
import { memo } from 'react';

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  delay: string;
}

const FeatureCard = memo(({ icon: Icon, title, description, delay }: FeatureCardProps) => (
  <div 
    className="glass-card p-6 rounded-xl shadow-lg animate-fade-in" 
    style={{ animationDelay: delay }}
  >
    <Icon className="h-12 w-12 text-primary mb-4" aria-hidden="true" />
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
));

FeatureCard.displayName = 'FeatureCard';

const features = [
  {
    icon: ChartLine,
    title: "Real-time Analytics",
    description: "Track your portfolio performance with real-time charts and analytics that help you make informed decisions.",
    delay: "0.2s"
  },
  {
    icon: TrendingUp,
    title: "Performance Tracking",
    description: "Visualize your investment growth over time with interactive charts and comprehensive performance metrics.",
    delay: "0.3s"
  },
  {
    icon: CircleDollarSign,
    title: "Portfolio Management",
    description: "Easily manage your investment portfolio with intuitive tools to buy, sell, and track your holdings.",
    delay: "0.4s"
  }
];

export function FeaturesSection() {
  return (
    <section id="features-section" className="py-16 bg-muted/50 scroll-mt-20" aria-labelledby="features-title">
      <div className="container mx-auto px-4">
        <h2 id="features-title" className="text-3xl md:text-4xl font-extrabold mb-12 text-center">
          Powerful Features
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 