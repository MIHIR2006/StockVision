import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Preloader.css';

const Preloader: React.FC = () => {
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(lettersRef.current, {
      duration: 0.6,
      y: 0,
      stagger: 0.05,
      ease: 'power2.out',
    })
      .to(lettersRef.current, {
        '--clipPath': 'inset(0% 0 0 0)',
        duration: 0.8,
        delay: 0.3,
        ease: 'power1.inOut',
      } as gsap.TweenVars) // Casting because of custom property
      .to(lettersRef.current, {
        duration: 0.6,
        y: 250,
        stagger: 0.05,
        delay: 0.5,
      });
  }, []);

  const text = 'STOCKVISION';

  return (
    <div className="loader">
      <div className="text">
        {text.split('').map((char, i) => (
          <span
            key={i}
            data-text={char}
            ref={(el) => {
              if (el) lettersRef.current[i] = el;
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Preloader;
