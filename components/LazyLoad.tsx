import React, { useState, useEffect, useRef, Suspense } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  placeholderClass?: string; // CSS classes for the placeholder dimensions to prevent layout shift
}

const LazyLoad: React.FC<LazyLoadProps> = ({ children, placeholderClass = "min-h-screen" }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { 
        // Start loading when the element is within 50% of the viewport height (aggressive preloading)
        rootMargin: '50% 0px 50% 0px' 
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={!shouldLoad ? placeholderClass : ""}>
      {shouldLoad ? (
         <Suspense fallback={<div className={`${placeholderClass} bg-zinc-950 animate-pulse`} />}>
            {children}
         </Suspense>
      ) : null}
    </div>
  );
};

export default LazyLoad;