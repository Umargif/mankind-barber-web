import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  // --- Background Particles Logic (Snow Effect - Optimized for all devices) ---
  useEffect(() => {
    if (!mountRef.current) return;

    const isMobile = window.innerWidth < 768;

    // Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02); 

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile, 
        alpha: true 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    // CRITICAL PERFORMANCE FIX: Cap pixel ratio on mobile
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    mountRef.current.appendChild(renderer.domElement);

    // Particles Setup - Reduced count for mobile
    const particleCount = isMobile ? 300 : 1000;

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

    // Shader Material (Falling Snow)
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
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      material.uniforms.uTime.value = time;
      particles.rotation.y = time * 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!mountRef.current) return;
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        material.uniforms.uSize.value = 6.0 * renderer.getPixelRatio();
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(frameId);
        mountRef.current?.removeChild(renderer.domElement);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
    };
  }, []);

  return (
    <footer id="contact" className="relative bg-black border-t border-zinc-900 pt-20 pb-10 overflow-hidden">
      
      {/* 3D Particle Background (Visible on all devices) */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ 
            opacity: 0.6,
            background: 'linear-gradient(to bottom, black 0%, transparent 20%, transparent 80%, black 100%)' 
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-serif font-bold text-white tracking-wider">MANKIND</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              A sanctuary for the modern man. We combine traditional barbering techniques with contemporary style to ensure you leave looking and feeling your best.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-500 hover:text-gold-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-zinc-500 hover:text-gold-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-zinc-500 hover:text-gold-500 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Opening Hours</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex justify-between border-b border-zinc-900 pb-2">
                <span>Monday - Friday</span>
                <span className="text-gold-500">10:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-zinc-900 pb-2">
                <span>Saturday</span>
                <span className="text-gold-500">10:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-zinc-900 pb-2">
                <span>Sunday</span>
                <span className="text-gold-500">12:00 PM - 9:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact & Map */}
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-zinc-400 mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="text-gold-500 shrink-0" size={18} />
                <span>Mankind Barbershop, Al Rayfah St,<br/>Al Karamah, Abu Dhabi, UAE</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-gold-500 shrink-0" size={18} />
                <span>+971 2 444 1234</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-gold-500 shrink-0" size={18} />
                <span>Mankindgentsalon@gmail.com</span>
              </li>
            </ul>
            
            {/* Embedded Map */}
            <div className="w-full h-40 rounded-sm overflow-hidden border border-zinc-800 relative group">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3630.6365591532253!2d54.4054845!3d24.4980465!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e670c1c7a8867%3A0x6a29da3a8fd499a7!2sMankind%20Gentlemen%20Barbershop!5e0!3m2!1sen!2sng!4v1771013184612!5m2!1sen!2sng" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="opacity-70 group-hover:opacity-100 transition-all duration-500"
                ></iframe>
                {/* Overlay text for interaction hint */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                    <span className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white uppercase tracking-widest border border-white/10">
                        View Map
                    </span>
                </div>
            </div>
          </div>

        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
          <p>&copy; 2024 Mankind Gentlemen Barber Shop. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-400">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;