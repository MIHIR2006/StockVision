import { memo } from 'react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  handle: string;
}

const TestimonialCard = memo(({ quote, author, handle }: TestimonialCardProps) => (
  <div 
    className="glass-card p-6 rounded-xl shadow-md dark:bg-slate-800/80 dark:border-slate-700/50"
    role="article"
  >
    <blockquote>
      <p className="mb-4">{quote}</p>
      <footer className="flex items-center">
        <div>
          <cite className="font-semibold not-italic">{author}</cite>
          <p className="text-sm text-muted-foreground">{handle}</p>
        </div>
      </footer>
    </blockquote>
  </div>
));

TestimonialCard.displayName = 'TestimonialCard';

const testimonials = {
  leftColumn: [
    {
      quote: "I bought the Gold membership of Stock Vision, and it has helped me a lot in increasing both my portfolio size and profits. This quarter has been especially beneficial for me.",
      author: "Leslie Alexander",
      handle: "@lesliealexander"
    },
    {
      quote: "The real-time market alerts have saved me from several bad investment decisions. I've been using StockVision for 6 months and my portfolio is up 24%. Couldn't be happier.",
      author: "Michael Foster",
      handle: "@michaelfoster"
    },
    {
      quote: "As a day trader, I need reliable data and quick insights. StockVision's dashboard provides everything I need at a glance. The Silver plan has paid for itself many times over.",
      author: "Dries Vincent",
      handle: "@driesvincent"
    }
  ],
  centerColumn: [
    {
      quote: "The AI predictions on StockVision have been remarkably accurate. I was skeptical at first, but after seeing their 87% accuracy rate on tech stocks over three months, I upgraded to the Platinum plan. My investment firm now relies on it daily.",
      author: "Brenna Goyette",
      handle: "@brennagoyette"
    },
    {
      quote: "StockVision's portfolio optimization tool helped me rebalance my investments and reduce risk while maintaining strong returns. Their Gold plan is worth every penny.",
      author: "Lindsay Walton",
      handle: "@lindsaywalton"
    },
    {
      quote: "The visualizations on StockVision make complex market data easy to understand. I've made 31% returns this year thanks to their insights and predictive analytics.",
      author: "Courtney Henry",
      handle: "@courtneyhenry"
    }
  ],
  rightColumn: [
    {
      quote: "StockVision alerted me to a market downturn three days before it happened. I was able to adjust my positions and avoid a 15% loss. The Platinum plan's predictive alerts are game-changing.",
      author: "Leonard Krasner",
      handle: "@leonardkrasner"
    },
    {
      quote: "I've tried many stock analysis platforms, but StockVision's ML models are in a league of their own. Their Gold plan has helped me identify undervalued stocks with remarkable accuracy.",
      author: "Floyd Miles",
      handle: "@floydmiles"
    },
    {
      quote: "Since signing up for StockVision's Silver plan, my investment strategy has completely transformed. Their real-time analytics and daily insights have helped me achieve a 28% annual return.",
      author: "Emily Selman",
      handle: "@emilyselman"
    }
  ],
  bottomRow: [
    {
      quote: "StockVision's sector-specific trend forecasting helped our fund identify emerging opportunities in renewable energy. We've seen a 41% return in that sector alone over the past year. Looking forward to their Diamond plan.",
      author: "Tom Cook",
      handle: "@tomcook"
    },
    {
      quote: "As a financial advisor, I need tools I can trust. StockVision's Platinum plan gives me insights that impress my clients and keep their portfolios growing. The ROI has been exceptional.",
      author: "Whitney Francis",
      handle: "@whitneyfrancis"
    }
  ]
};

export function TestimonialsSection() {
  return (
    <section 
      className="py-16 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-slate-900/80 dark:to-slate-950/80"
      aria-labelledby="testimonials-title"
    >
      <div className="container mx-auto px-4">
        <h2 
          id="testimonials-title" 
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Trusted by <br />thousands of investors and traders.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-8">
            {testimonials.leftColumn.map((testimonial) => (
              <TestimonialCard key={testimonial.handle} {...testimonial} />
            ))}
          </div>

          <div className="space-y-8">
            {testimonials.centerColumn.map((testimonial) => (
              <TestimonialCard key={testimonial.handle} {...testimonial} />
            ))}
          </div>

          <div className="flex flex-col gap-8">
            {testimonials.rightColumn.map((testimonial) => (
              <TestimonialCard key={testimonial.handle} {...testimonial} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {testimonials.bottomRow.map((testimonial) => (
            <TestimonialCard key={testimonial.handle} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
} 