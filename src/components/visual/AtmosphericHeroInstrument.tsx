import React, { useState, useEffect, useRef } from 'react';
import { Wind, Shield, Compass, Sparkles, AlertTriangle } from 'lucide-react';

export const AtmosphericHeroInstrument: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'ground' | 'boundary' | 'stratosphere'>('ground');
  const [isAdapted, setIsAdapted] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId = 0;
    const width = (canvas.width = 440);
    const height = (canvas.height = 440);

    const particleCount = isAdapted ? 40 : 130;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: isAdapted ? Math.random() * 1.5 + 0.8 : Math.random() * 2.8 + 1,
      speedX: (Math.random() - 0.5) * (isAdapted ? 0.3 : 0.8),
      speedY: (Math.random() - 0.5) * (isAdapted ? 0.2 : 0.9) - (isAdapted ? 0.2 : 0),
      opacity: Math.random() * 0.7 + 0.2,
      color: isAdapted ? '#C7F36B' : '#F28B36'
    }));

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.speedX;
          p.y += p.speedY;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = isAdapted ? 4 : 2;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isAdapted]);

  return (
    <div className="relative w-full max-w-[480px] mx-auto flex flex-col items-center">
      {/* Glow Backdrop */}
      <div 
        className={`absolute -inset-4 rounded-full blur-3xl opacity-25 transition-colors duration-1000 ${
          isAdapted ? 'bg-[#C7F36B]' : 'bg-[#E64848]'
        }`} 
      />

      {/* Main Circular Instrument */}
      <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border border-[#91B49A]/20 bg-gradient-to-b from-[#11231B] via-[#0B1914] to-[#07110E] p-4 shadow-2xl flex items-center justify-center overflow-hidden">
        {/* Canvas Particle Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10 opacity-70"
        />

        {/* Concentric Atmospheric Rings */}
        <div className="absolute inset-3 rounded-full border border-dashed border-[#91B49A]/15 animate-spin duration-[60s]" />
        <div className="absolute inset-8 rounded-full border border-[#91B49A]/10" />
        <div className="absolute inset-16 rounded-full border border-[#C7F36B]/15" />
        
        {/* Horizon & Compass Markers */}
        <div className="absolute top-3 font-mono text-[9px] uppercase tracking-widest text-[#91B49A]/60 flex items-center gap-1">
          <Compass className="w-2.5 h-2.5 text-[#C7F36B]" />
          <span>Tropospheric Sensor Array</span>
        </div>
        <div className="absolute bottom-3 font-mono text-[9px] text-[#A3B1A6]/50">
          BOUNDARY LAYER: {isAdapted ? '1,200m (DISPERSED)' : '320m (THERMAL TRAP)'}
        </div>

        {/* Center Instrument Core */}
        <div className="relative z-20 w-[210px] h-[210px] sm:w-[240px] sm:h-[240px] rounded-full bg-[#07110E]/90 border border-[#91B49A]/30 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center shadow-inner">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#A3B1A6]">
            {isAdapted ? 'Protected Exposure Dose' : 'Ambient Urban Air'}
          </span>
          
          <div className="flex items-baseline gap-1 my-1">
            <span 
              className={`font-editorial text-6xl sm:text-7xl font-bold tracking-tight transition-colors duration-700 ${
                isAdapted ? 'text-[#C7F36B]' : 'text-[#E64848]'
              }`}
            >
              {isAdapted ? '42' : '284'}
            </span>
            <span className="text-xs font-mono text-[#A3B1A6]">AQI</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-500 mb-2"
            style={{
              backgroundColor: isAdapted ? 'rgba(61, 214, 140, 0.12)' : 'rgba(230, 72, 72, 0.12)',
              borderColor: isAdapted ? 'rgba(61, 214, 140, 0.35)' : 'rgba(230, 72, 72, 0.35)',
              color: isAdapted ? '#3DD68C' : '#E64848'
            }}
          >
            {isAdapted ? (
              <>
                <Shield className="w-3.5 h-3.5" />
                <span>Safeguarded (-85%)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Severe Inversion</span>
              </>
            )}
          </div>

          <p className="text-[11px] text-[#A3B1A6] leading-tight max-w-[180px]">
            {isAdapted
              ? 'Metro commute + indoor workout + timed aeration applied.'
              : 'Roadway particulate inhalation at critical threshold.'}
          </p>
        </div>
      </div>

      {/* Interactive Switch to Demonstrate Value */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 p-1 rounded-full bg-[#11231B] border border-[#91B49A]/20">
          <button
            onClick={() => setIsAdapted(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              !isAdapted
                ? 'bg-[#E64848]/20 text-[#E64848] border border-[#E64848]/40 shadow-sm'
                : 'text-[#A3B1A6] hover:text-[#F0F3EA]'
            }`}
          >
            Unmitigated Exposure
          </button>
          <button
            onClick={() => setIsAdapted(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              isAdapted
                ? 'bg-[#C7F36B] text-[#07110E] font-semibold shadow-md'
                : 'text-[#A3B1A6] hover:text-[#F0F3EA]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Airwise Decision Active
          </button>
        </div>
        <span className="text-[11px] font-mono text-[#A3B1A6]/70">
          Interactive instrument: Toggle to simulate personal decision adaptation
        </span>
      </div>
    </div>
  );
};
