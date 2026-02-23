import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Logo animation removed here as it's handled by scroll state opacity now
        gsap.from(".header-nav-item", {
            y: -20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.5,
            ease: "power3.out"
        });
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav ref={headerRef} className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md py-2' : 'bg-transparent py-6'}`}>
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Hidden at top, fades in on scroll */}
          <div className={`flex items-center gap-3 header-logo transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <a href="#" className="flex-shrink-0 block group bg-black p-2 rounded-sm">
              <img 
                src="https://i.imgur.com/qXNeJbV.png" 
                alt="Mankind Logo" 
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </a>
            <div className="flex flex-col justify-center">
              <span className="text-white font-display font-bold text-xl tracking-wider leading-none uppercase">MANKIND</span>
              <span className="text-white font-sans font-bold text-[0.6rem] tracking-[0.2em] uppercase mt-0.5">Gentlemen Barber Shop</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#book" className={`header-nav-item px-6 py-2 rounded-sm font-bold uppercase tracking-widest text-xs transition-all ${scrolled ? 'bg-gold-500 text-black' : 'bg-white text-black hover:bg-gold-500'}`}>
                Book Now
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:hidden">
            <a 
              href="#book" 
              className="text-gold-500 border border-gold-500 hover:bg-gold-500 hover:text-black px-3 py-1.5 rounded-sm font-bold uppercase tracking-widest text-[10px] transition-all"
            >
              Book
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-white hover:text-gold-500 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-zinc-900 absolute top-full w-full left-0">
          <div className="px-6 pt-4 pb-6 space-y-2">
            <a 
              href="#book"
              onClick={() => setIsOpen(false)} 
              className="bg-gold-500 text-black block px-3 py-3 mt-4 text-center rounded-sm font-bold uppercase tracking-widest text-sm"
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;