import { useState, useEffect, useRef, useCallback } from "react";
import videoSource from "@assets/generated_videos/Dec_11__0958_31s_202512111144_8qsab.mp4";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (prefersReducedMotion || !heroRef.current) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      setMousePosition({ x: x * 20, y: y * 15 });
    });
  }, [prefersReducedMotion]);

  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement || prefersReducedMotion) return;

    heroElement.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      heroElement.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, prefersReducedMotion]);

  const parallaxStyle = prefersReducedMotion 
    ? {} 
    : { transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` };

  const getParallaxTransform = (multiplier: number) => {
    if (prefersReducedMotion) return {};
    return {
      transform: `translate(${mousePosition.x * multiplier}px, ${mousePosition.y * multiplier}px)`,
    };
  };

  return (
    <section ref={heroRef} className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={videoSource} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" /> 
      </div>

      {/* Ultra-Luxury Content with Parallax Effect */}
      <div className="relative z-10 container mx-auto h-full flex items-center justify-center px-4">
        <div 
          className="max-w-4xl text-center text-white transition-transform duration-300 ease-out"
          style={parallaxStyle}
        >
          {/* Main Headline */}
          <h1 
            className="text-3xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight tracking-wide"
            style={{
              ...getParallaxTransform(0.5),
              textShadow: '2px 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            Más que una propiedad, un legado frente al Mediterráneo: Donde el lujo y la calma se encuentran.
          </h1>
          
          {/* Decorative Line */}
          <div 
            className="w-24 h-px bg-[#C9A961] mx-auto mb-6"
            style={getParallaxTransform(0.3)}
          />
          
          {/* Subtitle */}
          <h2 
            className="text-lg md:text-xl lg:text-2xl font-light mb-8 text-gray-100"
            style={{
              ...getParallaxTransform(0.4),
              textShadow: '1px 1px 10px rgba(0,0,0,0.4)',
            }}
          >
            Privacidad, diseño y arquitectura en la Costa del Sol.
            <br className="hidden md:block" />
            <span className="text-[#C9A961]">Viva donde otros sueñan vacacionar.</span>
          </h2>

          {/* Body Text */}
          <div 
            className="max-w-3xl mx-auto"
            style={getParallaxTransform(0.25)}
          >
            <p className="text-sm md:text-base text-gray-300 leading-relaxed font-light">
              Despertar con vistas panorámicas al Mediterráneo, en espacios donde la luz natural define la arquitectura. 
              Nuestra selección curada no ofrece solo metros cuadrados, sino un refugio de serenidad diseñado para 
              elevar su calidad de vida y asegurar su legado patrimonial.
            </p>
          </div>

          {/* Scroll Indicator */}
          <div 
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${prefersReducedMotion ? '' : 'animate-bounce'}`}
            style={getParallaxTransform(0.2)}
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
              <div className={`w-1 h-3 bg-[#C9A961] rounded-full ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
