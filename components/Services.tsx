import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  name: string;
  description: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  items: ServiceItem[];
}

const detailedServices: ServiceCategory[] = [
  {
    id: "01",
    title: "Hair Services",
    items: [
      {
        name: "Haircut + Beard + Wash + Blow Dry",
        description: "Our signature full-grooming package on Al Reem Island. Includes a precision haircut, professional beard shaping, a refreshing hair wash, and a professional blow-dry finish for a sharp, executive look."
      },
      {
        name: "Trim + Wash + Blow Dry",
        description: "Perfect for maintaining your current style. We provide a meticulous hair trim followed by a deep-cleansing wash and a styled blow-dry."
      },
      {
        name: "Signature Haircut",
        description: "A standalone precision cut tailored to your head shape. Our expert barbers specialize in skin fades, tapers, and classic scissor cuts in Abu Dhabi."
      },
      {
        name: "Hairstyling",
        description: "Whether it’s for a special event or a daily professional look, we use premium pomades and styling techniques to perfect your hair's volume and texture."
      },
      {
        name: "Perming / Perm",
        description: "Add texture and curls to your hair with our modern men's perm service. We ensure a natural-looking curl that is easy to manage and style."
      },
      {
        name: "Kids Haircut",
        description: "A gentle and patient grooming experience for the younger gentlemen of Al Reem. We specialize in stylish, clean cuts for children of all ages."
      }
    ]
  },
  {
    id: "02",
    title: "Beard Services",
    items: [
      {
        name: "Beard Trim",
        description: "Maintain your length and clean up the edges. Our barbers use clippers and shears to ensure your beard shape complements your facial features perfectly."
      },
      {
        name: "Full Beard Shave",
        description: "A clean, smooth shave for those who prefer the sharp, clean-shaven look. We focus on skin comfort and a close finish."
      },
      {
        name: "Beard Styling",
        description: "The ultimate sculpting service. We use precision tools to define your beard lines, including cheek and neck fades for a high-definition look."
      },
      {
        name: "Shave With Steam",
        description: "Experience the luxury of a traditional straight-razor shave. Warm steam softens the hair and opens pores for the closest, most comfortable shave in Abu Dhabi."
      }
    ]
  },
  {
    id: "03",
    title: "Facial Services",
    items: [
      {
        name: "Express Facial",
        description: "A quick skin-refresh for the busy professional. Includes deep cleansing and hydration to remove impurities and energize your complexion. (30 mins)"
      },
      {
        name: "Facial (1 Hour)",
        description: "Our most popular skin treatment on Al Reem Island. A deep-pore cleansing, exfoliation, and hydration session designed specifically for men's skin."
      },
      {
        name: "Face Scrub",
        description: "A professional exfoliation treatment that removes dead skin cells and prevents ingrown hairs, leaving your skin feeling smooth and revitalized."
      },
      {
        name: "Eye Mask (Patch)",
        description: "Reduce puffiness and dark circles with our cooling eye patches. Perfect for looking refreshed before a meeting or event."
      },
      {
        name: "Face Mask",
        description: "A deep-cleansing mask tailored to your skin type (oily, dry, or sensitive) to draw out toxins and tighten pores."
      },
      {
        name: "Face Threading",
        description: "Achieve ultra-clean lines for your eyebrows or cheeks. Threading provides a precise finish that lasts longer than shaving."
      }
    ]
  },
  {
    id: "04",
    title: "Hair & Beard Dye",
    items: [
      {
        name: "Hair Color Change",
        description: "A complete transformation. Whether you're going for a bold new look or a subtle shift, we use high-quality, scalp-safe men's hair color."
      },
      {
        name: "Hair Coloring (Black)",
        description: "Specialized grey coverage for men. We apply natural black tones that blend seamlessly with your existing hair for a youthful look."
      },
      {
        name: "Beard Color (Black)",
        description: "Define your beard and cover patches or greys. Our beard-specific dyes are designed to be skin-safe and long-lasting."
      }
    ]
  },
  {
    id: "05",
    title: "Treatments",
    items: [
      {
        name: "Keratin Treatment",
        description: "The best solution for frizzy or unmanageable hair. This treatment smoothens the hair cuticle, making it easier to style and resistant to Abu Dhabi humidity."
      },
      {
        name: "Hair Protein",
        description: "Strengthen your hair from the root. Our protein treatment restores damaged hair fibers, adding volume and a healthy shine."
      },
      {
        name: "Hot Oil Treatment",
        description: "A traditional remedy for dry scalps and brittle hair. Warm oils penetrate deep to nourish the scalp and promote healthy hair growth."
      },
      {
        name: "Relaxer Treatment",
        description: "Soften tight curls and reduce volume. This service makes thick or coarse hair much easier to manage and comb."
      }
    ]
  },
  {
    id: "06",
    title: "Manicure & Pedicure",
    items: [
      {
        name: "Mani-Pedi + Spa",
        description: "The ultimate executive relaxation. Includes nail shaping, cuticle care, an exfoliating foot scrub, and a soothing spa massage."
      },
      {
        name: "Manicure",
        description: "Professional hand and nail grooming. We focus on clean cuticles and buffed nails for a polished, professional appearance."
      },
      {
        name: "Pedicure",
        description: "Relax while we take care of your feet. Includes nail trimming, dead skin removal, and moisturizing for healthy, soft feet."
      },
      {
        name: "Foot Scrub",
        description: "A specialized exfoliation treatment to remove calluses and dry skin, followed by a hydrating cream application."
      }
    ]
  },
  {
    id: "07",
    title: "Waxing Services",
    items: [
      {
        name: "Nose / Ear Waxing",
        description: "Quick and effective removal of unwanted hair. We use high-quality wax designed for sensitive areas to minimize discomfort."
      },
      {
        name: "Body Waxing",
        description: "Full Back, Chest, or Stomach. Achieve a smooth, athletic look. Our technicians ensure even hair removal with minimal skin irritation for larger body areas."
      }
    ]
  },
  {
    id: "08",
    title: "Massage & Home",
    items: [
      {
        name: "Head, Neck & Shoulder",
        description: "Relieve tension from a long day. This targeted massage focuses on the most common areas of stress for immediate relaxation."
      },
      {
        name: "VIP Home Services",
        description: "Mankind brings the luxury barbershop experience to you. Our expert barbers arrive fully equipped to provide premium grooming in the comfort of your home or office."
      }
    ]
  }
];

const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // --- 3D Background Animation (Snow Particles - Desktop & Mobile) ---
  useEffect(() => {
    if (!mountRef.current) return;

    // Detect environment
    const isMobile = window.innerWidth < 768;

    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 60;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile, 
      alpha: true,
      powerPreference: "high-performance" 
    });
    
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    // CRITICAL PERFORMANCE FIX: Cap pixel ratio on mobile
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    mountRef.current.appendChild(renderer.domElement);

    // Reduced count for mobile
    const particleCount = isMobile ? 400 : 2000;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const randomness = new Float32Array(particleCount);

    const width = 300;
    const height = 250;
    const depth = 200;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * width;
      positions[i * 3 + 1] = (Math.random() - 0.5) * height;
      positions[i * 3 + 2] = (Math.random() - 0.5) * depth;
      scales[i] = Math.random();
      randomness[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randomness, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#FFFFFF') },
        uSize: { value: 6.0 * renderer.getPixelRatio() }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        attribute float aScale;
        attribute float aRandom;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          float height = 250.0;
          float fallSpeed = 15.0 + aRandom * 15.0;
          float yOffset = mod(pos.y - uTime * fallSpeed + aRandom * 100.0, height) - (height * 0.5);
          pos.y = yOffset;
          pos.x += sin(uTime * 0.5 + aRandom * 10.0) * (3.0 + aRandom * 2.0);
          pos.z += cos(uTime * 0.3 + aRandom * 20.0) * (1.0 + aRandom * 2.0);
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = uSize * aScale * (60.0 / -mvPosition.z);
          float distY = abs(pos.y);
          float alphaY = 1.0 - smoothstep(100.0, 125.0, distY);
          vAlpha = alphaY * (0.6 + aRandom * 0.4);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;
          float strength = 1.0 - (dist * 2.0);
          strength = pow(strength, 1.2);
          gl_FragColor = vec4(uColor, vAlpha * strength);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsedTime;
      particles.rotation.y = elapsedTime * 0.01;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
      material.uniforms.uSize.value = 6.0 * rendererRef.current.getPixelRatio();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
      }
      if (mountRef.current && rendererRef.current?.domElement) {
        try { mountRef.current.removeChild(rendererRef.current.domElement); } catch(e) {}
      }
    };
  }, []);

  // --- Interaction Animation (Cards) ---
  useEffect(() => {
    const timer = setTimeout(() => {
        const ctx = gsap.context(() => {
            
            // Animate Header
            gsap.to(".services-title-bg", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                },
                y: 100,
                opacity: 0.15
            });

            // Loop cards animation
            const cards = gsap.utils.toArray(".service-card-flipper");
            cards.forEach((card: any, i) => {
                const tl = gsap.timeline({
                    repeat: -1,
                    repeatDelay: 2,
                    delay: i * 0.5 
                });
                // Front -> Back
                tl.to(card, { rotationY: 180, duration: 1.2, ease: "power2.inOut" })
                  .to(card, { duration: 3 })
                  .to(card, { rotationY: 360, duration: 1.2, ease: "power2.inOut" })
                  .set(card, { rotationY: 0 });
            });

            // Reveal List Items
            const rows = gsap.utils.toArray(".service-row");
            rows.forEach((row: any) => {
                gsap.from(row.querySelectorAll(".service-list-item"), {
                    scrollTrigger: {
                        trigger: row,
                        start: "top 70%",
                    },
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out"
                });
            });

        }, containerRef);
        return () => ctx.revert();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={containerRef} id="services" className="relative bg-black py-20 md:py-32 overflow-hidden min-h-screen">
      
      {/* 3D Background */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ 
            opacity: 0.8,
            background: 'linear-gradient(to bottom, black 0%, transparent 20%, transparent 80%, black 100%)' 
        }}
      ></div>
      
      {/* Grain Overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-24 md:mb-32 relative text-center lg:text-left">
          <h2 className="services-title-bg absolute -top-20 -left-10 lg:left-0 w-full text-center lg:text-left text-[6rem] md:text-[12rem] font-display font-bold text-outline opacity-5 select-none pointer-events-none whitespace-nowrap">
            Services
          </h2>
          <div className="relative inline-block lg:block">
            <h3 className="text-white text-4xl md:text-7xl font-display font-medium tracking-tight">
              The <span className="text-gold-500 italic">Menu</span>
            </h3>
            <p className="text-zinc-500 mt-4 max-w-md text-sm md:text-lg font-serif">
              Meticulously crafted services designed for the modern gentleman.
            </p>
          </div>
        </div>

        {/* Categories Layout */}
        <div className="space-y-24 md:space-y-32">
            {detailedServices.map((category) => (
                <div key={category.id} className="service-row grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-white/5 pt-12 md:pt-20">
                    
                    {/* LEFT COLUMN: Sticky Flipping Card */}
                    <div className="lg:col-span-4 relative lg:border-x border-white/10 lg:px-8">
                        <div className="sticky top-32">
                             <div className="service-card-wrapper group relative h-[400px] w-full max-w-sm mx-auto perspective-1000" style={{ perspective: '1000px' }}>
                                <div className="service-card-flipper w-full h-full relative preserve-3d transition-all duration-500" style={{ transformStyle: 'preserve-3d' }}>
                                    
                                    {/* FRONT FACE */}
                                    <div 
                                        className="absolute inset-0 backface-hidden p-8 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 flex flex-col justify-between overflow-hidden"
                                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 via-transparent to-transparent group-hover:from-gold-500/10 transition-all duration-500"></div>
                                        
                                        {/* Corners */}
                                        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-gold-500"></div>
                                        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-gold-500"></div>
                                        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-gold-500"></div>
                                        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-gold-500"></div>

                                        <div className="relative z-10">
                                            <span className="text-[12rem] leading-none font-display font-bold text-white/5 absolute -top-10 -left-10 select-none">
                                                {category.id}
                                            </span>
                                            <div className="mt-20">
                                                <h4 className="text-4xl md:text-5xl font-display text-white group-hover:text-gold-500 transition-colors duration-300 relative z-10 leading-[0.9]">
                                                    {category.title.split(' ')[0]} <br/> 
                                                    <span className="italic text-zinc-500 group-hover:text-white transition-colors duration-300">
                                                        {category.title.split(' ').slice(1).join(' ')}
                                                    </span>
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex items-center gap-3 text-gold-500 mt-8">
                                            <span className="text-xs uppercase tracking-[0.2em] font-bold">View Selection</span>
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>

                                    {/* BACK FACE */}
                                    <div 
                                        className="absolute inset-0 backface-hidden bg-zinc-900 border border-zinc-800 p-8 flex flex-col items-center justify-center text-center rotate-y-180"
                                        style={{ 
                                            backfaceVisibility: 'hidden', 
                                            WebkitBackfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)' 
                                        }}
                                    >
                                        {/* Decorative Corners (Matching Front) */}
                                        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-gold-500"></div>
                                        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-gold-500"></div>
                                        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-gold-500"></div>
                                        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-gold-500"></div>

                                        <img src="https://i.imgur.com/qXNeJbV.png" alt="Mankind" className="h-12 w-auto object-contain opacity-80 mb-4" />
                                        <h5 className="text-3xl font-display font-bold text-white mb-2">MANKIND</h5>
                                        <p className="text-sm font-sans text-zinc-400 mb-8 max-w-[200px]">Book your {category.title} appointment today.</p>
                                        <a href="#book" className="bg-gold-500 text-black px-8 py-3 rounded-sm uppercase tracking-widest text-xs font-bold hover:bg-gold-400 transition-colors">
                                            Book Now
                                        </a>
                                    </div>

                                </div>
                             </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Detailed Editorial List */}
                    <div className="lg:col-span-8">
                        <div className="flex flex-col gap-10">
                            {category.items.map((item, idx) => (
                                <div key={idx} className="service-list-item group flex flex-col md:flex-row gap-4 md:gap-8 pb-10 border-b border-zinc-900/50 last:border-0 hover:bg-zinc-900/20 p-4 rounded-sm transition-colors duration-300">
                                    <div className="md:w-[40%] flex-shrink-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Sparkles size={14} className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <h4 className="text-xl md:text-2xl font-display text-zinc-200 group-hover:text-gold-500 transition-colors duration-300">
                                                {item.name}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="md:w-[60%]">
                                        <p className="text-zinc-500 text-sm md:text-base leading-relaxed font-sans group-hover:text-zinc-400 transition-colors duration-300">
                                            {item.description}
                                        </p>
                                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                                            <a href="#book" className="text-[10px] uppercase tracking-widest text-gold-500 border-b border-gold-500/30 hover:border-gold-500 pb-0.5">
                                                Book This Service
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            ))}
        </div>

      </div>
    </section>
  );
};

export default Services;