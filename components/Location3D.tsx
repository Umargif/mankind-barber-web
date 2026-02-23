import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MapPin, Globe, Scan, Navigation, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Location3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // Abu Dhabi Coordinates
  const LAT = 24.4980;
  const LON = 54.4054;

  useEffect(() => {
    // --- Transition Animation ---
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom", // Start when top of section hits bottom of viewport
          end: "center center", // End when center of section hits center of viewport
          scrub: 1.5,
        }
      });

      // 1. Text Parallax (Moves fast)
      tl.fromTo(".loc-transition-text", 
        { y: 100, opacity: 0, scale: 0.9 },
        { y: -50, opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
      );
      
      // 2. Text Fade Out (Zoom effect)
      tl.to(".loc-transition-text", {
         opacity: 0,
         scale: 1.5,
         filter: 'blur(10px)',
         duration: 0.5,
         ease: "power2.in"
      }, ">-0.2");

      // 3. Earth Entrance (Scale up from back)
      tl.from(".loc-earth-canvas", {
        scale: 0.8, // Start slightly larger
        opacity: 0,
        z: -10, // Move from far back
        duration: 1.5,
        ease: "power3.out"
      }, "<");

      // 4. Info Panel Entrance (Slide from left)
      tl.from(".loc-info-panel", {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=1.0"); // Start appearing as earth settles

    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Detect Mobile for optimization
    const isMobile = window.innerWidth < 768;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    // Pure black fog
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.01, 1000);
    camera.position.z = 28; // Standard distance

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    mountRef.current.appendChild(renderer.domElement);

    // --- Lighting ---
    // Increased intensity and changed color to white to fix dark earth issue on mobile
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); 
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(10, 5, 15);
    scene.add(sunLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 50); // White accent light
    pointLight.position.set(-5, 0, 10);
    scene.add(pointLight);

    // --- Earth Group ---
    const earthGroup = new THREE.Group();
    // Position Shift: Move earth to the right on desktop to balance the UI on the left
    earthGroup.position.x = isMobile ? 0 : 6; 
    
    // Initial rotation to bring Middle East closer to view
    earthGroup.rotation.y = -1.5; 
    earthGroup.rotation.x = 0.3;
    scene.add(earthGroup);

    // Earth Sphere - Reduce segments on mobile for performance
    const earthRadius = 8.5;
    const segments = isMobile ? 32 : 64; 
    const earthGeometry = new THREE.SphereGeometry(earthRadius, segments, segments);
    
    const textureLoader = new THREE.TextureLoader();
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'),
      specularMap: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'),
      normalMap: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg'),
      specular: new THREE.Color(0x333333),
      shininess: 5
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);

    // Clouds
    const cloudGeometry = new THREE.SphereGeometry(earthRadius + 0.08, segments, segments);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earthGroup.add(clouds);

    // Atmosphere Glow
    const atmosGeometry = new THREE.SphereGeometry(earthRadius + 2.2, segments, segments);
    const atmosMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 3.5);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmos = new THREE.Mesh(atmosGeometry, atmosMaterial);
    earthGroup.add(atmos);

    // --- Convert Lat/Lon to Vector3 ---
    const latRad = LAT * (Math.PI / 180);
    const lonRad = -LON * (Math.PI / 180); // Invert lon for three.js texture mapping

    const x = Math.cos(latRad) * Math.cos(lonRad) * earthRadius;
    const y = Math.sin(latRad) * earthRadius;
    const z = Math.cos(latRad) * Math.sin(lonRad) * earthRadius;

    const targetPosition = new THREE.Vector3(x, y, z);

    // --- Marker/Pin ---
    const pinGroup = new THREE.Group();
    pinGroup.position.copy(targetPosition);
    pinGroup.lookAt(new THREE.Vector3(0, 0, 0)); // Point outwards normal
    earthGroup.add(pinGroup);

    // White Pin Mesh
    const pinGeo = new THREE.ConeGeometry(0.35, 1.2, 16); 
    pinGeo.rotateX(Math.PI / 2); // Point out
    const pinMat = new THREE.MeshStandardMaterial({ 
      color: 0xD66D46, // Gold
      emissive: 0xD66D46,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.8
    });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.z = 0.6; 
    pinGroup.add(pin);

    // Pulse Ring
    const ringGeo = new THREE.RingGeometry(0.5, 0.7, 32);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: 0x3b82f6, 
      transparent: true, 
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.z = 0.1;
    pinGroup.add(ring);
    
    // --- Stars Background ---
    if (!isMobile) {
        const starsGeo = new THREE.BufferGeometry();
        const starsCount = 2000;
        const posArray = new Float32Array(starsCount * 3);
        for(let i = 0; i < starsCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 100;
        }
        starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const starsMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.8 });
        const stars = new THREE.Points(starsGeo, starsMat);
        scene.add(stars);
    }

    // --- Animation Loop ---
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Continuous Rotation - Speed increased
      earthGroup.rotation.y += 0.003; 
      clouds.rotation.y += 0.0035;

      // Pulse Ring
      const scale = 1 + Math.sin(time * 3) * 0.5;
      ring.scale.set(scale, scale, 1);
      ringMat.opacity = 0.5 - Math.sin(time * 3) * 0.4;

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize ---
    const handleResize = () => {
      if (!mountRef.current) return;
      // Update camera aspect
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      
      // Update responsive earth position
      const isMobileNow = window.innerWidth < 768;
      earthGroup.position.x = isMobileNow ? 0 : 6;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      cancelAnimationFrame(frameId);
      earthGeometry.dispose();
      earthMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden border-t border-zinc-900 flex items-center justify-center">
      
      {/* 
         --- TRANSITION TEXT ---
         Appears during scroll, then fades out as UI enters
      */}
      <div 
        ref={textRef} 
        className="loc-transition-text absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none mix-blend-difference"
      >
          <div className="flex items-center gap-3 mb-4">
              <Globe className="text-white w-6 h-6 animate-pulse" />
              <span className="text-white text-xs font-bold tracking-[0.5em] uppercase">Global Presence</span>
          </div>
          <h2 className="text-[10vw] md:text-[8vw] leading-none font-display font-bold text-white tracking-tighter text-center">
              COORDINATES
          </h2>
      </div>

      {/* 3D Canvas */}
      <div ref={mountRef} className="loc-earth-canvas absolute inset-0 z-10" />
      
      {/* 
         --- NEW UNIFIED LAYOUT ---
         Left side Panel containing Info + Map
      */}
      <div className="absolute inset-0 z-30 flex flex-col md:flex-row pointer-events-none">
          
          {/* Left Panel Container */}
          <div className="w-full md:w-[45%] h-full flex items-end md:items-center justify-center md:justify-end p-4 md:pr-12 pb-24 md:pb-0">
               
               <div className="loc-info-panel w-full max-w-sm md:max-w-md bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-sm overflow-hidden shadow-2xl pointer-events-auto relative group">
                    
                    {/* Top Decorative Line */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-gold-500 via-white/20 to-zinc-900"></div>

                    {/* Header Info */}
                    <div className="p-6 md:p-8 relative">
                        {/* Background grid pattern for tech feel */}
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                             <Scan className="w-12 h-12 text-zinc-500" />
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                             <span className="text-gold-500 text-[10px] font-bold tracking-widest uppercase border border-gold-500/30 px-2 py-0.5 rounded-sm">HQ</span>
                             <span className="w-1 h-1 bg-zinc-500 rounded-full"></span>
                             <span className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">AE-AUH</span>
                        </div>
                        
                        <h3 className="text-white font-display text-4xl md:text-5xl font-bold tracking-tight mb-2">ABU DHABI</h3>
                        <p className="text-zinc-400 text-sm font-sans flex items-center gap-2">
                            <MapPin size={14} className="text-gold-500" />
                            Al Rayfah St, Al Karamah
                        </p>
                    </div>

                    {/* Map Integration - Height reduced */}
                    <div className="relative w-full h-32 md:h-40 border-y border-zinc-800 bg-zinc-900 group-hover:border-zinc-700 transition-colors">
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                             <span className="bg-black/60 backdrop-blur-sm text-[9px] text-white px-2 py-1 rounded-sm border border-white/10 flex items-center gap-1.5 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                Live Feed
                             </span>
                        </div>
                        
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3630.6365591532253!2d54.4054845!3d24.4980465!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e670c1c7a8867%3A0x6a29da3a8fd499a7!2sMankind%20Gentlemen%20Barbershop!5e0!3m2!1sen!2sng!4v1771013184612!5m2!1sen!2sng" 
                            width="100%" 
                            height="100%" 
                            style={{border:0}} 
                            allowFullScreen={true} 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale-[0.3] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                        ></iframe>

                        {/* Tech Corners on Map */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-l border-t border-zinc-500 bg-zinc-900 z-10"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-zinc-500 z-10"></div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 bg-zinc-900/50 flex flex-col gap-3">
                         <div className="flex justify-between items-center px-2">
                             <div className="flex flex-col">
                                 <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">Lat</span>
                                 <span className="text-xs text-zinc-300 font-mono">24.4980° N</span>
                             </div>
                             <div className="flex flex-col text-right">
                                 <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">Lon</span>
                                 <span className="text-xs text-zinc-300 font-mono">54.4054° E</span>
                             </div>
                         </div>
                         
                         <a 
                            href="https://maps.google.com/?q=Mankind+Gentlemen+Barbershop+Abu+Dhabi" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-white hover:bg-gold-500 text-black font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs py-4 rounded-sm transition-all duration-300 group/btn"
                         >
                            <Navigation size={14} className="group-hover/btn:rotate-45 transition-transform" />
                            Initiate Navigation
                         </a>
                    </div>
               </div>
          </div>

          {/* Right Panel (Spacer for Earth) */}
          <div className="hidden md:block w-[55%] h-full"></div>

      </div>

    </div>
  );
};

export default Location3D;