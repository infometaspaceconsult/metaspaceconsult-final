import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface PreloaderProps {
  onComplete: () => void;
  brandName?: string;
  tagline?: string;
}

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  brandName: propBrandName,
  tagline: propTagline,
}) => {
  const { config } = useSiteConfig();
  const brandName = propBrandName || config?.brand?.name || 'ÓGHOWA';
  const tagline = propTagline || config?.brand?.tagline || "Building Africa's Innovation Economy";
  const logoUrl = config?.brand?.logoUrl || '';

  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const loadingPhases = [
    'Initializing venture pipeline...',
    'Connecting founders and capital networks...',
    'Loading ecosystem infrastructure...',
    'Ready to build Africa’s future.',
  ];

  useEffect(() => {
    // Smooth progress increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const jump = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + jump, 100);
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Update loading phase based on progress
  useEffect(() => {
    if (progress < 30) setPhaseIndex(0);
    else if (progress < 65) setPhaseIndex(1);
    else if (progress < 92) setPhaseIndex(2);
    else setPhaseIndex(3);

    if (progress >= 100 && !isExiting) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        const completeTimer = setTimeout(() => {
          onComplete();
        }, 550);
        return () => clearTimeout(completeTimer);
      }, 400);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, isExiting, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050D1E] text-white select-none transition-all duration-500 ${
        isExiting ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Logo Showcase */}
      <div className="relative flex flex-col items-center justify-center max-w-sm w-full px-6 text-center z-10">
        
        {/* Animated Emblem Container with Following Aura Animation */}
        <div className="relative mb-6 flex items-center justify-center">
          
          {/* Orbiting light particle following the perimeter of the logo */}
          <div className="absolute w-28 h-28 rounded-full border border-red-500/20 pointer-events-none flex items-center justify-center animate-spin-slow">
            <div className="absolute -top-1 w-2.5 h-2.5 bg-[#D9232A] rounded-full shadow-[0_0_12px_#D9232A] animate-pulse" />
            <div className="absolute -bottom-1 w-1.5 h-1.5 bg-white/80 rounded-full shadow-[0_0_8px_#ffffff]" />
          </div>

          {/* Secondary rotating counter-ring */}
          <div className="absolute w-24 h-24 rounded-full border border-dashed border-blue-400/20 pointer-events-none [animation:spin-slow_24s_linear_infinite_reverse]" />

          {/* Central Logo with animated strokes / custom logo */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center drop-shadow-[0_0_24px_rgba(217,35,42,0.45)]">
            {logoUrl ? (
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#07132B] p-2 border-2 border-[#D9232A] flex items-center justify-center shadow-[0_0_20px_rgba(217,35,42,0.4)]">
                <img
                  src={logoUrl}
                  alt={brandName}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
            ) : (
              <svg
                viewBox="0 0 40 40"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer Royal Beaded Circle (Animated Stroke) */}
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="#D9232A"
                  strokeWidth="2.5"
                  strokeDasharray="2 2"
                  className="animate-spin-slow origin-center"
                />

                {/* Inner Medallion */}
                <circle
                  cx="20"
                  cy="20"
                  r="14"
                  fill="#07132B"
                  stroke="#D9232A"
                  strokeWidth="1.2"
                />

                {/* Royal Ivory Arch */}
                <path
                  d="M13 24C13 24 15 15 20 15C25 15 27 24 27 24"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  className="transition-all duration-700"
                  style={{
                    strokeDasharray: 50,
                    strokeDashoffset: progress < 40 ? 50 - (progress / 40) * 50 : 0,
                  }}
                />

                {/* Spikes */}
                <path
                  d="M16 14L15 11"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M20 13L20 9.5"
                  stroke="#D9232A"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M24 14L25 11"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                {/* Central Glowing Gem / Royal Coral Bead */}
                <circle
                  cx="20"
                  cy="19"
                  r="2.8"
                  fill="#D9232A"
                  className="animate-pulse-glow"
                />

                {/* Base Pedestal */}
                <rect x="15" y="25" width="10" height="2.5" rx="1" fill="#FFFFFF" />
              </svg>
            )}
          </div>
        </div>

        {/* Brand Name Typography Reveal */}
        <div className="space-y-1 mb-8">
          <div className="flex items-center justify-center gap-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-widest text-white font-sans drop-shadow-sm">
              {brandName}
            </h1>
            <span className="w-2 h-2 rounded-full bg-[#D9232A] inline-block mb-1 shadow-[0_0_8px_#D9232A] animate-ping" />
          </div>
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
            Accelerator
          </p>
          <p className="text-xs text-slate-400 font-normal pt-1 max-w-xs">
            {tagline}
          </p>
        </div>

        {/* Progress Bar & Counter */}
        <div className="w-full max-w-xs space-y-2.5">
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 p-0.5 overflow-hidden border border-slate-700/60 shadow-inner">
            <div
              className="bg-gradient-to-r from-red-600 to-[#D9232A] h-full rounded-full transition-all duration-150 ease-out shadow-[0_0_10px_rgba(217,35,42,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-3 h-3 text-[#D9232A] animate-spin" />
              <span className="truncate max-w-[200px] text-left">
                {loadingPhases[phaseIndex]}
              </span>
            </span>
            <span className="font-bold text-white tabular-nums">{progress}%</span>
          </div>
        </div>

        {/* Skip button for quick inspection */}
        <button
          type="button"
          onClick={() => {
            setIsExiting(true);
            setTimeout(onComplete, 200);
          }}
          className="mt-8 text-[11px] font-medium text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider py-1 px-3 rounded-full hover:bg-slate-800/40"
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
};
