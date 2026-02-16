import React, { useEffect, useRef, useState, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header';
import Hero from './components/Hero';
import BookingButton from './components/BookingButton';
import SectionSeparator from './components/SectionSeparator';
import LazyLoad from './components/LazyLoad';

// Dynamic Imports for Heavy Components (Code Splitting)
const Gallery = React.lazy(() => import('./components/Gallery'));
const Location3D = React.lazy(() => import('./components/Location3D'));
const Services = React.lazy(() => import('./components/Services'));
const Reviews = React.lazy(() => import('./components/Reviews'));
const FAQ = React.lazy(() => import('./components/FAQ'));
const Footer = React.lazy(() => import('./components/Footer'));

gsap.registerPlugin(ScrollTrigger);

function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  // Measure footer height and determine layout mode (Mobile vs Desktop)
  useEffect(() => {
    const handleLayoutUpdate = () => {
        const desktop = window.innerWidth >= 768;
        setIsDesktop(desktop);
        ScrollTrigger.refresh();
    };
    
    // Initial check
    handleLayoutUpdate();
    window.addEventListener('resize', handleLayoutUpdate);

    // Use ResizeObserver to detect when lazy-loaded Footer actually renders/changes size
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === footerRef.current) {
          setFooterHeight(entry.contentRect.height);
        }
      }
    });

    if (footerRef.current) {
      resizeObserver.observe(footerRef.current);
    }

    return () => {
        window.removeEventListener('resize', handleLayoutUpdate);
        resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Visibility Toggle
      ScrollTrigger.create({
        trigger: ".main-content-wrapper",
        start: "top top", 
        end: "bottom bottom",
        onEnter: () => gsap.set(".hero-container", { autoAlpha: 0 }), 
        onLeaveBack: () => gsap.set(".hero-container", { autoAlpha: 1 }),
      });
    }, appRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={appRef} className="bg-black min-h-screen font-sans selection:bg-gold-500 selection:text-black">
      <Header />
      
      {/* 
        LAYER 1: Sticky Hero (z-index: 1)
      */}
      <div className="hero-container fixed top-0 left-0 w-full h-screen z-[1]">
         <Hero />
         {/* Shadow gradient to blend the sliding content */}
         <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent opacity-80 z-10 pointer-events-none"></div>
      </div>

      {/* 
        LAYER 2: Scrolling Content (z-index: 10)
        - On Desktop: Has bottom margin to reveal fixed footer
        - On Mobile: No margin, sits directly on top of relative footer
      */}
      <div 
        className="main-content-wrapper relative z-10 bg-zinc-950 mt-[100vh] rounded-t-[3rem] md:rounded-b-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{ marginBottom: isDesktop ? `${footerHeight}px` : '0px' }}
      >
        <LazyLoad placeholderClass="min-h-screen">
            <Gallery />
        </LazyLoad>
        
        <LazyLoad placeholderClass="h-[80vh]">
            <Location3D />
        </LazyLoad>
        
        <LazyLoad placeholderClass="min-h-screen">
            <Services />
        </LazyLoad>
        
        <SectionSeparator />
        
        {/* Reviews Section */}
        <LazyLoad placeholderClass="min-h-[600px]">
           <Reviews />
        </LazyLoad>

        {/* FAQ Section */}
        <LazyLoad placeholderClass="min-h-[400px]">
           <FAQ />
        </LazyLoad>
      </div>

      {/* 
        LAYER 0: Footer
        - On Desktop: Fixed at bottom (z-0) for reveal effect
        - On Mobile: Relative flow (z-20) to ensure full scrollability
      */}
      <div 
        ref={footerRef} 
        className={`w-full ${isDesktop ? 'fixed bottom-0 left-0 z-0' : 'relative z-20'}`}
      >
        <Suspense fallback={<div className="h-64 bg-black"></div>}>
          <Footer />
        </Suspense>
      </div>

      <BookingButton />
    </div>
  );
}

export default App;