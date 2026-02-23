import React, { useEffect, useRef } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GOOGLE_REVIEW_LINK = "https://www.google.com/maps/place/Mankind+Gentlemen+Barbershop/@24.4980465,54.4054845,17z/data=!4m17!1m8!3m7!1s0x3e5e670c1c7a8867:0x6a29da3a8fd499a7!2sMankind+Gentlemen+Barbershop!8m2!3d24.4980498!4d54.4053779!10e1!16s%2Fg%2F11qq5r8zp_!3m7!1s0x3e5e670c1c7a8867:0x6a29da3a8fd499a7!8m2!3d24.4980498!4d54.4053779!9m1!1b1!16s%2Fg%2F11qq5r8zp_?entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D";

const REVIEWS = [
  {
    name: "Sultan Al Nahyan",
    initials: "SN",
    rating: 5,
    time: "2 weeks ago",
    text: "Exceptional service and atmosphere. The barbers are true artists who understand exactly what you need. Best grooming experience in Abu Dhabi.",
  },
  {
    name: "James Henderson",
    initials: "JH",
    rating: 5,
    time: "a month ago",
    text: "Mankind is simply the best. Professional, clean, and the vibe is unmatched. Great coffee and even better fades. Highly recommended.",
  },
  {
    name: "Mohammed Al Kaabi",
    initials: "MK",
    rating: 5,
    time: "3 weeks ago",
    text: "Finally found a barber who pays attention to details. The hot towel shave was relaxing and the haircut was precise. 5 stars well deserved.",
  }
];

const Reviews: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Header
      gsap.from(".review-header-anim", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });

      // Animate Cards
      gsap.from(".google-review-card", {
        scrollTrigger: {
          trigger: ".reviews-grid",
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="reviews" ref={containerRef} className="py-24 bg-zinc-950 relative overflow-hidden">
        {/* Decorative background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.02] select-none">
            <h2 className="text-[12rem] md:text-[20rem] font-display font-bold leading-none text-white whitespace-nowrap">
                TRUSTED
            </h2>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="review-header-anim flex items-center justify-center gap-2 mb-4">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={20} className="fill-gold-500 text-gold-500" />
                        ))}
                    </div>
                    <span className="text-white font-bold text-lg">4.8</span>
                    <span className="text-zinc-500 text-sm">(Based on Google Reviews)</span>
                </div>
                
                <h2 className="review-header-anim text-4xl md:text-5xl font-serif text-white mb-6">
                    CLIENT STORIES
                </h2>
                <p className="review-header-anim text-zinc-400 max-w-2xl mx-auto">
                    Don't just take our word for it. See what our distinguished gentlemen have to say about their experience at Mankind.
                </p>
            </div>

            {/* Google Reviews Grid */}
            <div className="reviews-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {REVIEWS.map((review, i) => (
                    <div key={i} className="google-review-card bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-sm hover:border-gold-500/50 transition-colors group relative">
                        {/* Google Icon Overlay */}
                        <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                             <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all" />
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-gold-500 font-bold border border-zinc-700">
                                {review.initials}
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">{review.name}</h4>
                                <span className="text-zinc-500 text-xs">{review.time}</span>
                            </div>
                        </div>

                        <div className="flex gap-0.5 mb-4">
                            {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={14} className="fill-gold-500 text-gold-500" />
                            ))}
                        </div>

                        <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                            "{review.text}"
                        </p>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="text-center">
                <a 
                    href={GOOGLE_REVIEW_LINK} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white text-black hover:bg-gold-500 px-8 py-4 rounded-sm font-bold uppercase tracking-widest text-xs transition-colors duration-300"
                >
                    <span>Read All Reviews on Google</span>
                    <ExternalLink size={16} />
                </a>
            </div>
        </div>
    </section>
  );
};

export default Reviews;