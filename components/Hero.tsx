import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // Background parallax setup
        gsap.to(bgRef.current, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "100vh top",
                scrub: 0
            }
        });

        // 1. Initial Reveal - Scale Down BG & Grayscale to Color
        tl.from(bgRef.current, {
            scale: 1.2,
            filter: "grayscale(100%) brightness(50%)",
            duration: 2.0,
            ease: "power3.out"
        }, 0);

        // 2. Header & Decor lines
        tl.from(".hero-header-reveal", {
            y: -20,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, 0.5);

        tl.from(".hero-line", {
            scaleX: 0,
            duration: 1.5,
            ease: "power3.inOut"
        }, 0.5);

        // 3. Text Reveal (Staggered up)
        tl.from(".hero-reveal-text", {
            y: 100,
            opacity: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: "power3.out"
        }, 0.8);

        // 4. CTA Button
        tl.from(".hero-cta", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.5");

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden bg-black">
      
      {/* Background Image with Parallax & Overlay */}
      <div className="absolute inset-0 z-0 select-none">
        <img 
          ref={bgRef}
          src="https://i.imgur.com/QuMIGc9.jpeg" 
          alt="Mankind Barber Shop Interior" 
          className="w-full h-full md:h-[120%] object-cover opacity-60" 
          style={{ transform: 'translateY(0%)', willChange: 'transform, filter' }} 
          // @ts-ignore - React types might not fully support fetchPriority yet
          fetchPriority="high"
          decoding="sync"
        />
        {/* Advanced Gradient for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
      </div>

      {/* Decorative Border Frame */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 p-3 md:p-8">
          <div className="w-full h-full border border-white/10 rounded-sm relative flex flex-col justify-between">
              {/* Top Corners */}
              <div className="flex justify-between items-start p-2">
                 <div className="w-4 h-4 border-l border-t border-gold-500"></div>
                 <div className="w-4 h-4 border-r border-t border-gold-500"></div>
              </div>
              {/* Bottom Corners */}
              <div className="flex justify-between items-end p-2">
                 <div className="w-4 h-4 border-l border-b border-gold-500"></div>
                 <div className="w-4 h-4 border-r border-b border-gold-500"></div>
              </div>
          </div>
      </div>

      {/* Brand Header (Visible on Mobile) */}
      <div className="hero-header-reveal absolute top-0 left-0 w-full z-40 p-5 md:p-12 flex justify-between items-start">
         <div className="flex items-center gap-3 md:gap-4">
             <div className="p-1.5 md:p-2 border border-white/10 rounded-sm bg-black/40 backdrop-blur-md">
                <img 
                    src="https://i.imgur.com/qXNeJbV.png" 
                    alt="Mankind Logo" 
                    className="h-8 md:h-12 w-auto object-contain" 
                    referrerPolicy="no-referrer"
                />
             </div>
             <div className="flex flex-col justify-center">
                 <span className="text-white font-bold text-xl md:text-3xl tracking-widest leading-none">MANKIND</span>
                 <span className="text-white font-bold text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase mt-1">Gentlemen Barber Shop</span>
             </div>
         </div>
         
         <div className="hidden md:flex flex-col items-end text-right">
             <p className="text-zinc-400 text-[10px] uppercase tracking-widest mb-1">Abu Dhabi, UAE</p>
             <div className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                 <span className="text-white text-[10px] font-bold uppercase tracking-wider">Open Now</span>
             </div>
         </div>
      </div>

      {/* Main Typography Content */}
      <div className="relative z-10 w-full max-w-[1920px] px-4 flex flex-col items-center justify-center h-full mt-8 md:mt-0">
        
        {/* Top Label */}
        <div className="flex items-center gap-3 mb-4 md:mb-10 overflow-hidden">
             <div className="hero-line h-[1px] w-8 md:w-16 bg-gold-500"></div>
             <p className="hero-reveal-text text-gold-500 text-[9px] md:text-xs font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase whitespace-nowrap">
                The Ultimate Grooming Experience
             </p>
             <div className="hero-line h-[1px] w-8 md:w-16 bg-gold-500"></div>
        </div>

        {/* Main Title Composition */}
        <div className="text-center flex flex-col items-center">
            
            {/* Sub-headline (Main Title) */}
            <h2 className="hero-reveal-text font-display font-bold text-white text-[8vw] md:text-[3rem] lg:text-[4rem] uppercase tracking-[0.1em] mt-0 mb-3 md:mb-6 max-w-6xl mx-auto leading-[1.1] md:leading-tight">
                The Finest Men's Grooming Experience <br/>
                <span className="text-gold-500 text-[5vw] md:text-[2rem] lg:text-[2.5rem] block mt-2 md:mt-2">
                    on Al Reem Island, Abu Dhabi
                </span>
            </h2>

            {/* Description/Arrow (Desktop) */}
             <div className="hero-reveal-text hidden md:flex flex-col items-center mt-10 md:mt-12 max-w-2xl text-center">
                 <ArrowDownRight className="text-zinc-500 mb-4" size={32} />
                 <p className="text-zinc-300 text-xl md:text-2xl leading-relaxed font-display italic tracking-wide">
                    Expert skin fades, precision beard trims, and executive men’s grooming tailored for the modern gentleman.
                 </p>
            </div>
        </div>

        {/* Mobile Description (Compact) */}
        <div className="hero-reveal-text md:hidden mt-4 text-center max-w-xs mx-auto">
             <p className="text-zinc-300 text-sm leading-relaxed font-display italic tracking-wide">
                Expert skin fades, precision beard trims, and executive men’s grooming tailored for the modern gentleman.
             </p>
        </div>

        {/* CTA Button */}
        <div className="hero-cta mt-8 md:mt-16 group perspective-1000">
            <a href="#book" className="relative inline-flex items-center group/btn">
                {/* Button Background */}
                <div className="absolute inset-0 bg-gold-500 transform skew-x-12 transition-transform duration-300 group-hover/btn:skew-x-0 group-hover/btn:scale-105 rounded-sm"></div>
                
                {/* Button Content */}
                <div className="relative px-8 py-3 md:px-12 md:py-5 bg-black border border-zinc-800 transform transition-transform duration-300 group-hover/btn:-translate-y-1 group-hover/btn:-translate-x-1 group-hover/btn:bg-zinc-900 flex items-center gap-3 rounded-sm">
                    <span className="text-white font-bold tracking-widest uppercase text-[10px] md:text-xs">Book Appointment</span>
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full group-hover/btn:animate-ping"></span>
                </div>
            </a>
        </div>

      </div>
      
      {/* Bottom Scroll Indicator - Hide on mobile to save vertical space */}
      <div className="hero-reveal-text absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 opacity-50 mix-blend-difference hidden sm:flex">
          <span className="text-[9px] text-white font-bold uppercase tracking-[0.3em] animate-pulse">Scroll</span>
          <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>

    </div>
  );
};

export default Hero;