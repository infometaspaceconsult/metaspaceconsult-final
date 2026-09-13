import React, { useEffect, useState, useRef } from "react";
import MetaspaceLogo from "./MetaspaceLogo";

interface PreloaderProps {
  onComplete: () => void;
  isTabTransition?: boolean;
  logoUrl?: string;
}

export function Preloader({ onComplete, isTabTransition = false, logoUrl }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    // Set duration based on whether it is an initial load or a quick tab transition
    const targetDuration = isTabTransition ? 600 : 1800; 
    let currentProgress = 0;

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      if (currentProgress < 100) {
        // Simulate organic loading behavior
        // Fast start, slow down in the middle, then speed up or smooth out
        let increment = 0;
        if (isTabTransition) {
          // Linear and rapid for tab transitions
          increment = (delta / targetDuration) * 100;
        } else {
          if (currentProgress < 40) {
            increment = (delta / (targetDuration * 0.4)) * 40 * (0.8 + Math.random() * 0.4);
          } else if (currentProgress < 85) {
            increment = (delta / (targetDuration * 1.2)) * 45 * (0.4 + Math.random() * 0.4);
          } else {
            increment = (delta / (targetDuration * 0.4)) * 15 * (0.6 + Math.random() * 0.4);
          }
        }

        currentProgress = Math.min(currentProgress + increment, 100);
        setProgress(currentProgress);
        animationFrameId = requestAnimationFrame(tick);
      } else {
        // Trigger fade out
        setIsFadingOut(true);
        const fadeTimeout = setTimeout(() => {
          onComplete();
        }, 500); // matches fade-out transition duration
        return () => clearTimeout(fadeTimeout);
      }
    };

    const initialDelay = setTimeout(() => {
      animationFrameId = requestAnimationFrame(tick);
    }, 100);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(initialDelay);
    };
  }, [isTabTransition, onComplete]);

  // Subtle mouse parallax effect from the user's code
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const x = (window.innerWidth / 2 - e.pageX) / 60;
      const y = (window.innerHeight / 2 - e.pageY) / 60;
      
      const parallaxElements = containerRef.current.querySelectorAll(".parallax-move");
      parallaxElements.forEach((el) => {
        (el as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Dynamic font and symbol imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .flow-line {
          fill: none;
          stroke: #141b77;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-dasharray: 10, 30;
          animation: flow 4s linear infinite;
        }
        @keyframes flow {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -120; }
        }
        .logo-group {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .text-fill {
          fill: #141b77;
          opacity: 0;
          animation: reveal 4s ease-in-out infinite;
        }
        @keyframes reveal {
          0%, 10% { opacity: 0; transform: translateY(5px); }
          20%, 80% { opacity: 1; transform: translateY(0); }
          90%, 100% { opacity: 0; transform: translateY(-5px); }
        }

        .status-pulse {
          animation: statusPulse 2s ease-in-out infinite;
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .loading-dot {
          animation: blink 1.4s infinite both;
        }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }

        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        ref={containerRef}
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f5faff] transition-all duration-500 ease-in-out ${
          isFadingOut ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
        }`}
      >
        {/* Architectural grid background */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />

        {/* Central Animation Canvas */}
        <div className="relative w-full max-w-[550px] aspect-square md:aspect-video flex items-center justify-center px-6">
          <div className="w-full h-full max-h-[350px] flex items-center justify-center z-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Flow Lines */}
              <path
                className="flow-line"
                d="M50 40 Q 150 10 250 40 T 350 40"
                style={{ opacity: 0.2 }}
              />
              <path
                className="flow-line"
                d="M50 80 Q 150 110 250 80 T 350 80"
                style={{ animationDelay: "-2s", opacity: 0.1 }}
              />
              <g className="logo-group">
                {/* Metaspace Logo */}
                <foreignObject x="172" y="32" width="56" height="56">
                  <MetaspaceLogo size={56} logoUrl={logoUrl} className="rounded-full shadow-md bg-white border border-gray-100" />
                </foreignObject>
              </g>
            </svg>
          </div>
          {/* Atmospheric Depth Elements */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(245,250,255,0.4)_50%,rgba(245,250,255,1)_100%)]"></div>
        </div>

        {/* Status Label Container */}
        <div
          className="absolute bottom-16 w-full flex flex-col items-center gap-4 fade-in parallax-move transition-transform duration-200 ease-out"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[#E63946] status-pulse flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </span>
            <p className="font-['Inter'] font-semibold text-xs text-[#141B77] tracking-widest uppercase">
              Connecting to Ecosystem
              <span className="loading-dot">.</span>
              <span className="loading-dot">.</span>
              <span className="loading-dot">.</span>
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#141B77] transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-['Inter'] text-xs text-gray-500 tabular-nums">
              {Math.floor(progress)}%
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
