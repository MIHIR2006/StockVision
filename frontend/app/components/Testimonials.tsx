import React, { useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const Testimonials: React.FC = () => {
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Portfolio Manager",
      company: "Goldman Sachs",
      content: "StockVision transformed how I analyze market trends. The real-time insights helped me increase portfolio returns by 23% this quarter.",
      avatar: "SC",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Investment Analyst",
      company: "BlackRock",
      content: "The data visualization capabilities are incredible. I can spot opportunities and risks faster than ever before.",
      avatar: "MR",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "Hedge Fund Manager",
      company: "Bridgewater",
      content: "Finally, a platform that makes complex financial data accessible and actionable. Game-changing for our trading strategies.",
      avatar: "EJ",
      rating: 5
    },
    {
      id: 4,
      name: "David Kim",
      role: "Quantitative Trader",
      company: "Two Sigma",
      content: "The algorithmic insights and performance tracking have revolutionized our quantitative models. Exceptional platform.",
      avatar: "DK",
      rating: 5
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "Financial Advisor",
      company: "Morgan Stanley",
      content: "My clients love the portfolio visualization features. It's made client presentations more engaging and informative.",
      avatar: "LW",
      rating: 5
    },
    {
      id: 6,
      name: "James Thompson",
      role: "Risk Analyst",
      company: "JPMorgan Chase",
      content: "The risk assessment tools are phenomenal. We've reduced portfolio volatility by 18% using StockVision's insights.",
      avatar: "JT",
      rating: 5
    }
  ];

  const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => (
    <div className="flex-shrink-0 w-96 mx-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
            {testimonial.avatar}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(testimonial.rating)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4 group-hover:text-white transition-colors duration-300">
            "{testimonial.content}"
          </p>
          <div>
            <h4 className="font-semibold text-white text-sm">{testimonial.name}</h4>
            <p className="text-slate-400 text-xs">{testimonial.role}</p>
            <p className="text-blue-400 text-xs font-medium">{testimonial.company}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-950 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Trusted by Financial Professionals
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Join thousands of investors and analysts who rely on StockVision for data-driven investment decisions
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>
        
        {/* First row - moving right */}
        <div 
          className="flex animate-marquee-right hover:pause-animation"
          style={{
            animationDuration: '60s',
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* First set */}
          {testimonials.slice(0, 3).map((testimonial) => (
            <TestimonialCard key={`first-${testimonial.id}`} testimonial={testimonial} />
          ))}
          {/* Duplicate for seamless loop */}
          {testimonials.slice(0, 3).map((testimonial) => (
            <TestimonialCard key={`first-dup-${testimonial.id}`} testimonial={testimonial} />
          ))}
        </div>

        {/* Second row - moving left */}
        <div 
          className="flex animate-marquee-left mt-8 hover:pause-animation"
          style={{
            animationDuration: '60s',
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Second set */}
          {testimonials.slice(3).map((testimonial) => (
            <TestimonialCard key={`second-${testimonial.id}`} testimonial={testimonial} />
          ))}
          {/* Duplicate for seamless loop */}
          {testimonials.slice(3).map((testimonial) => (
            <TestimonialCard key={`second-dup-${testimonial.id}`} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Interactive controls */}
      <div className="text-center mt-12">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {isPaused ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21"></polygon>
              </svg>
              <span>Resume</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
              <span>Pause</span>
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes marquee-right {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0%);
          }
        }

        @keyframes marquee-left {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-100%);
          }
        }

        .animate-marquee-right {
          animation: marquee-right linear infinite;
        }

        .animate-marquee-left {
          animation: marquee-left linear infinite;
        }

        .hover\\:pause-animation:hover {
          animation-play-state: paused !important;
        }

        .pause-animation {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
};

export default Testimonials;