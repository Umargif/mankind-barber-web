import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SectionSeparator: React.FC = () => {
  const firstText = useRef<HTMLDivElement>(null);
  const secondText = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  
  let xPercent = 0;
  let direction = -1;

  useEffect(() => {
    let requestID: number;

    const animate = () => {
      if (xPercent <= -100) {
        xPercent = 0;
      }
      if (xPercent > 0) {
        xPercent = -100;
      }
      
      if (firstText.current && secondText.current) {
         gsap.set(firstText.current, { xPercent: xPercent });
         gsap.set(secondText.current, { xPercent: xPercent });
      }
      
      xPercent += 0.05 * direction;
      requestID = requestAnimationFrame(animate);
    };

    requestID = requestAnimationFrame(animate);

    return () => {
        cancelAnimationFrame(requestID);
    };
  }, []);

  return (
    <div className="relative h-40 bg-zinc-950 flex items-center overflow-hidden border-y border-zinc-900/50">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none"></div>
      
      <div ref={slider} className="relative whitespace-nowrap flex">
        <div ref={firstText} className="flex items-center gap-12 pr-12">
            <MarqueeItem />
            <MarqueeItem />
            <MarqueeItem />
            <MarqueeItem />
        </div>
        <div ref={secondText} className="flex items-center gap-12 pr-12 absolute left-full top-0">
            <MarqueeItem />
            <MarqueeItem />
            <MarqueeItem />
            <MarqueeItem />
        </div>
      </div>
    </div>
  );
};

const MarqueeItem = () => (
    <div className="flex items-center gap-12">
        <span className="text-8xl font-display italic text-zinc-900 opacity-50" style={{ WebkitTextStroke: '1px #3f3f46' }}>
            MANKIND
        </span>
        <span className="w-4 h-4 rounded-full bg-gold-500/30"></span>
        <span className="text-8xl font-display font-bold text-transparent" style={{ WebkitTextStroke: '1px #D66D46' }}>
            GENTLEMEN
        </span>
        <span className="w-4 h-4 rounded-full bg-gold-500/30"></span>
    </div>
)

export default SectionSeparator;