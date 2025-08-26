'use client';

import { useState, useEffect } from 'react';

export function MouseFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="glowing-orb"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
}
