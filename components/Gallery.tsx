import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Maximize2, MoveUpRight, ArrowDownRight } from 'lucide-react';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const allImages = [
  "https://i.imgur.com/QZUr0Yz.jpeg",
  "https://i.imgur.com/aalcE21.jpeg",
  "https://i.imgur.com/hz04S8l.jpeg",
  "https://i.imgur.com/crzWxvl.jpeg",
  "https://i.imgur.com/sWA18oz.jpeg",
  "https://i.imgur.com/mbSXERU.jpeg",
  "https://i.imgur.com/YFGRt4B.jpeg",
  "https://i.imgur.com/I2eWHz0.jpeg",
  "https://i.imgur.com/GAV8a94.jpeg",
  "https://i.imgur.com/spY9gLr.jpeg",
  "https://i.imgur.com/HvRfpf0.jpeg",
  "https://i.imgur.com/OewjCRO.jpeg",
  "https://i.imgur.com/hr02tA4.jpeg",
  "https://i.imgur.com/9j6NsB4.jpeg",
  "https://i.imgur.com/9llh76p.jpeg",
  "https://i.imgur.com/Zk2yNS6.jpeg",
  "https://i.imgur.com/dpywdWW.jpeg",
  "https://i.imgur.com/p7dvfjA.jpeg"
];

const Gallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mountRef = useRef<HTMLDivElement>(null);

  // Filter valid images and split into 3 columns for desktop parallax
  const columns = useMemo(() => {
    const validImages = allImages.filter(img => img && !img.includes("undefined"));
    const cols: string[][] = [[], [], []];
    validImages.forEach((img, i) => {
        cols[i % 3].push(img);
    });
    return cols;
  }, []);

  // --- 3D Snow Effect (Optimized for both Desktop & Mobile) ---
  useEffect(() => {
    if (!mountRef.current) return;

    // Detect environment
    const isMobile = window.innerWidth < 768;

    // Scene Setup
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 30; // Closer camera for more visible particles

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: !isMobile, // Disable antialiasing on mobile for performance
      powerPreference: "high-performance"
    });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    // CRITICAL PERFORMANCE FIX: Cap pixel ratio on mobile to avoid GPU overload
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    mountRef.current.appendChild(renderer.domElement);

    // Particles Data - Reduce count on mobile
    const particleCount = isMobile ? 400 : 1000; 
    
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

    // Shader Material for Soft Snow
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('#FFFFFF') },
            uSize: { value: 8.0 * renderer.getPixelRatio() } // Increased size
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
                float fallSpeed = 8.0 + aRandom * 12.0; 
                float yOffset = mod(pos.y - uTime * fallSpeed + aRandom * 100.0, height) - (height * 0.5);
                pos.y = yOffset;
                
                // Gentle swaying
                pos.x += sin(uTime * 0.5 + aRandom * 10.0) * (2.0 + aRandom * 2.0);
                pos.z += cos(uTime * 0.3 + aRandom * 20.0) * (1.0 + aRandom * 2.0);
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                gl_PointSize = uSize * aScale * (60.0 / -mvPosition.z);
                
                // Fade out at top/bottom edges
                float distY = abs(pos.y);
                float alphaY = 1.0 - smoothstep(100.0, 125.0, distY);
                vAlpha = alphaY * (0.6 + aRandom * 0.4); // Increased base opacity
            }
        `,
        fragmentShader: `
            uniform vec3 uColor;
            varying float vAlpha;
            void main() {
                vec2 coord = gl_PointCoord - vec2(0.5);
                float dist = length(coord);
                if (dist > 0.5) discard;
                
                // Soft gradient
                float strength = 1.0 - (dist * 2.0);
                strength = pow(strength, 1.5);
                
                gl_FragColor = vec4(uColor, vAlpha * strength);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation Loop
    const clock = new THREE.Clock();
    let frameId: number;
    
    const animate = () => {
        frameId = requestAnimationFrame(animate);
        const time = clock.getElapsedTime();
        material.uniforms.uTime.value = time;
        particles.rotation.y = time * 0.03; // Slowly rotate the whole system
        renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
        if (!mountRef.current) return;
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(frameId);
        
        if (mountRef.current && renderer.domElement) {
             mountRef.current.removeChild(renderer.domElement);
        }
        
        geometry.dispose();
        material.dispose();
        renderer.dispose();
    };
  }, []);

  // --- GSAP Animations ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Ambient Background Orbs Floating
      gsap.to(".ambient-orb", {
        x: "random(-100, 100)",
        y: "random(-50, 50)",
        duration: "random(10, 20)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
            amount: 5,
            from: "random"
        }
      });

      // 2. Parallax Columns Logic (Desktop Only)
      const mm = gsap.matchMedia();
      
      mm.add("(min-width: 768px)", () => {
          // Middle Column: Moves FASTER (pushes up more aggressively)
          if (columnsRef.current[1]) {
            gsap.to(columnsRef.current[1], {
                y: -150, // Moves up relative to scroll
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5 // Smooth catchup
                }
            });
          }

          // Outer Columns: Move SLOWER (lag behind)
          [0, 2].forEach(idx => {
            if (columnsRef.current[idx]) {
                gsap.to(columnsRef.current[idx], {
                    y: 50, // Moves down slightly (resisting scroll)
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                });
            }
          });
      });

      // 3. Scroll-Driven "Awakening" Effect for Images
      // Instead of hover, we use ScrollTrigger to animate state when in viewport center
      const items = gsap.utils.toArray('.gallery-item-wrapper');
      
      items.forEach((item: any) => {
        const img = item.querySelector('.gallery-img');
        const overlay = item.querySelector('.gallery-overlay');
        const border = item.querySelector('.gallery-border');
        const meta = item.querySelector('.gallery-meta');
        const icon = item.querySelector('.gallery-icon');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 80%",   // Start earlier on mobile
            end: "bottom 20%",
            toggleActions: "play reverse play reverse", 
          }
        });

        tl.to(img, {
          filter: "grayscale(0%) contrast(100%) brightness(100%)",
          scale: 1.1, // Reduced scale for smoother mobile performance
          duration: 0.8,
          ease: "power2.out"
        })
        .to(overlay, {
            opacity: 0.3,
            duration: 0.8
        }, "<") 
        .to(border, {
            borderColor: "rgba(214, 109, 70, 0.6)", 
            scale: 1,
            duration: 0.6
        }, "<")
        .to(meta, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)"
        }, "-=0.4")
        .to(icon, {
            opacity: 1,
            duration: 0.4
        }, "<");
      });

      // 4. Reveal Text Section
      gsap.from(".gallery-reveal-text", {
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%"
        },
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.15
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-zinc-950 py-20 md:py-32 overflow-hidden min-h-screen">
        
        {/* --- Background Ambience --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="ambient-orb absolute top-[10%] left-[20%] w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-gold-500/5 rounded-full blur-[60px] md:blur-[120px]"></div>
            <div className="ambient-orb absolute bottom-[20%] right-[10%] w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-zinc-800/20 rounded-full blur-[60px] md:blur-[100px]"></div>
        </div>
        
        {/* --- 3D Snow Container --- */}
        <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none"></div>

        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-32 px-2 md:px-4 relative z-20">
                <div className="w-full">
                    <div className="gallery-reveal-text flex items-center gap-3 mb-4">
                         <div className="h-[1px] w-8 bg-gold-500"></div>
                         <p className="text-gold-500 text-xs font-bold tracking-[0.3em] uppercase">The Portfolio</p>
                    </div>

                    <h2 className="font-display leading-[0.8] tracking-tighter">
                        <span className="gallery-reveal-text block text-white text-[4rem] md:text-[9rem] lg:text-[11rem]">SELECTED</span>
                        <div className="flex flex-wrap items-center gap-4 md:ml-24">
                             <span className="gallery-reveal-text font-serif italic text-zinc-500 text-xl md:text-3xl mt-2 md:mt-8 tracking-wide">
                                (vol. 01)
                             </span>
                             <span className="gallery-reveal-text block text-transparent text-[4rem] md:text-[9rem] lg:text-[11rem] transition-colors duration-500 hover:text-white/10" style={{WebkitTextStroke: '1px #D66D46'}}>WORKS</span>
                        </div>
                    </h2>
                </div>
                
                <div className="max-w-xs mt-12 md:mb-6 md:text-right shrink-0">
                    <p className="gallery-reveal-text text-zinc-400 text-sm leading-relaxed font-sans">
                        A visual dialogue between <span className="text-gold-500 font-semibold">tradition</span> and modern precision. 
                    </p>
                    <div className="gallery-reveal-text mt-4 flex justify-end">
                        <ArrowDownRight className="text-gold-500" size={24} />
                    </div>
                </div>
            </div>

            {/* --- MOBILE LAYOUT: Compact Grid (Capture Everything) --- */}
            <div className="grid md:hidden grid-cols-2 gap-3 relative z-10">
                {allImages.map((src, imgIndex) => (
                    <div 
                        key={`mob-${imgIndex}`} 
                        className="gallery-item-wrapper relative aspect-[3/4] overflow-hidden rounded-sm bg-zinc-900"
                    >
                        <img 
                            src={src} 
                            alt="Mankind Gallery"
                            className="gallery-img w-full h-full object-cover filter grayscale contrast-125 brightness-75"
                            loading="lazy"
                        />
                        <div className="gallery-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                        <div className="gallery-border absolute inset-2 border border-transparent scale-95 pointer-events-none"></div>
                        {/* Simplified Metadata for Mobile */}
                         <div className="gallery-meta absolute bottom-0 left-0 w-full p-3 translate-y-4 opacity-0">
                            <div className="flex justify-end">
                                <div className="bg-white/90 text-black p-1.5 rounded-full scale-75">
                                    <MoveUpRight size={14} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- DESKTOP LAYOUT: Parallax Columns --- */}
            <div className="hidden md:flex flex-row gap-8 justify-center items-start relative z-10">
                {columns.map((colImages, colIndex) => (
                    <div 
                        key={colIndex} 
                        ref={el => { columnsRef.current[colIndex] = el; }}
                        className={`flex flex-col gap-8 w-1/3 ${colIndex === 1 ? 'pt-48' : ''}`}
                    >
                        {colImages.map((src, imgIndex) => (
                            <div 
                                key={imgIndex} 
                                className="gallery-item-wrapper relative aspect-[3/4] overflow-hidden rounded-sm bg-zinc-900"
                            >
                                <img 
                                    src={src} 
                                    alt="Mankind Gallery"
                                    className="gallery-img w-full h-full object-cover filter grayscale contrast-125 brightness-75 scale-[1.15]"
                                    loading="lazy"
                                />
                                <div className="gallery-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80"></div>
                                <div className="gallery-border absolute inset-4 border border-transparent scale-95 pointer-events-none"></div>
                                <div className="gallery-meta absolute bottom-0 left-0 w-full p-6 translate-y-8 opacity-0">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-gold-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Mankind Series</p>
                                            <p className="text-white text-xl font-serif italic">The Art of Detail</p>
                                        </div>
                                        <div className="bg-white text-black p-2 rounded-full">
                                            <MoveUpRight size={16} />
                                        </div>
                                    </div>
                                </div>
                                <div className="gallery-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 pointer-events-none">
                                    <Maximize2 size={32} strokeWidth={1} />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

        </div>
    </section>
  );
};

export default Gallery;