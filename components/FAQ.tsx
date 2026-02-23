import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    id: "01",
    question: "Where can I find a high-end barber shop near Al Reem Island?",
    answer: "Mankind Gentlemen Barber Shop is the premier destination for executive grooming near Al Reem Island. Located just minutes away in Al Karamah, we offer world-class haircuts, beard sculpting, and luxury treatments in a sophisticated setting tailored for the modern gentleman."
  },
  {
    id: "02",
    question: "Do I need to book an appointment in advance?",
    answer: "While we do accommodate walk-ins when possible, we highly recommend booking an appointment to secure your preferred time slot and barber. You can easily book online through our website or by calling us directly."
  },
  {
    id: "03",
    question: "What specific grooming services do you offer?",
    answer: "We provide a full range of services including precision skin fades, classic scissor cuts, hot towel shaves, beard styling, facials, hair coloring, keratin treatments, and manicures/pedicures."
  },
  {
    id: "04",
    question: "What are your opening hours?",
    answer: "We are open Monday through Saturday from 10:00 AM to 10:00 PM, and on Sundays from 12:00 PM to 9:00 PM to accommodate your busy schedule."
  },
  {
    id: "05",
    question: "Is there parking available nearby?",
    answer: "Yes, there is parking available near our location on Al Rayfah St, Al Karamah, making your visit convenient and stress-free."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Marquee Animation
        gsap.to(marqueeRef.current, {
            xPercent: -50,
            repeat: -1,
            duration: 20,
            ease: "linear"
        });

        // Reveal Animation
        const items = gsap.utils.toArray('.faq-item-row');
        gsap.from(items, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out"
        });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Schema Injection
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <section ref={containerRef} className="py-32 bg-zinc-950 relative overflow-hidden border-t border-zinc-900">
      
      {/* Background Marquee */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03]">
          <div ref={marqueeRef} className="flex whitespace-nowrap items-center h-full">
              <span className="text-[20vw] font-display font-bold text-white leading-none">
                  QUESTIONS ASKED FREQUENTLY QUESTIONS ASKED FREQUENTLY
              </span>
          </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div>
                <span className="text-gold-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Need Clarity?</span>
                <h2 className="text-5xl md:text-8xl font-display text-white tracking-tight">
                    INFO & <br/> <span className="text-zinc-600 italic">ANSWERS</span>
                </h2>
            </div>
            <div className="hidden md:block">
                <ArrowUpRight size={48} className="text-zinc-700" strokeWidth={1} />
            </div>
        </div>

        {/* FAQ List */}
        <div className="border-t border-zinc-800">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
                <div 
                    key={index} 
                    className={`faq-item-row border-b border-zinc-800 transition-colors duration-500 ${isOpen ? 'bg-zinc-900/40' : 'hover:bg-zinc-900/20'}`}
                >
                    <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full py-10 md:py-14 flex items-start md:items-center justify-between text-left focus:outline-none group"
                    >
                        {/* ID Number */}
                        <div className="hidden md:block w-32 shrink-0">
                            <span className={`font-mono text-sm tracking-widest transition-colors duration-300 ${isOpen ? 'text-gold-500' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                                /{faq.id}
                            </span>
                        </div>

                        {/* Question */}
                        <div className="flex-grow pr-8">
                            <h3 className={`text-2xl md:text-4xl font-display transition-all duration-300 ${isOpen ? 'text-white translate-x-4' : 'text-zinc-300 group-hover:text-white group-hover:translate-x-4'}`}>
                                {faq.question}
                            </h3>
                        </div>

                        {/* Icon */}
                        <div className="shrink-0 w-12 h-12 flex items-center justify-center border border-zinc-800 rounded-full group-hover:border-gold-500/50 transition-colors duration-300 bg-black/50">
                            <div className="relative w-4 h-4">
                                <span className={`absolute top-1/2 left-0 w-full h-[1.5px] bg-white transition-all duration-300 ${isOpen ? 'bg-gold-500 rotate-180' : ''}`}></span>
                                <span className={`absolute top-1/2 left-0 w-full h-[1.5px] bg-white transition-all duration-300 ${isOpen ? 'bg-gold-500 rotate-180 opacity-0' : 'rotate-90'}`}></span>
                            </div>
                        </div>
                    </button>

                    {/* Answer Area */}
                    <div 
                        className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="pb-14 pl-0 md:pl-32 flex flex-col md:flex-row gap-8">
                            <div className="md:w-2/3">
                                <p className="text-zinc-400 text-lg md:text-xl font-sans leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                            <div className="md:w-1/3 flex items-center">
                                <a href="#book" className="hidden md:inline-flex items-center gap-2 text-gold-500 uppercase tracking-widest text-xs font-bold border-b border-gold-500/30 pb-1 hover:border-gold-500 transition-colors">
                                    Book Related Service
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQ;