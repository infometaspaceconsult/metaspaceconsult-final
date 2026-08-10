import React from 'react';
import { ThemeConfig } from '../types';

interface MetaspaceLogoProps {
  theme?: ThemeConfig;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const MetaspaceLogo: React.FC<MetaspaceLogoProps> = ({
  theme,
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const primaryColor = theme?.primaryNavy || '#141B77';

  const heightClass = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-14' : 'h-10';
  const textScale = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const subTextScale = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-[11px]' : 'text-[10px]';

  const logoSrc = (theme?.customLogoUrl && theme.customLogoUrl.length > 0)
    ? theme.customLogoUrl
    : '/baboon-icon.svg';

  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Baboon Icon in Sky Blue Circle / Custom uploaded logo */}
      <div className={`relative flex items-center justify-center ${heightClass} aspect-square rounded-full overflow-hidden shadow-sm border border-slate-100 bg-white p-0.5 group-hover:scale-105 transition-transform duration-300 shrink-0`}>
        <img
          src={logoSrc}
          alt="Metaspace Logo"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <div className="flex flex-col justify-center leading-none select-none">
        <span
          className={`font-black tracking-tight font-headline-md ${textScale}`}
          style={{ color: primaryColor }}
        >
          METASPACE
        </span>
        {showSubtitle && (
          <span
            className={`font-semibold tracking-[0.22em] uppercase text-slate-600 mt-0.5 ${subTextScale}`}
          >
            CONSULTING LIMITED
          </span>
        )}
      </div>
    </div>
  );
};
