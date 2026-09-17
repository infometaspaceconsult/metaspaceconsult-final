import React, { useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  onClick?: () => void;
  brandName?: string;
  subTitle?: string;
  showSubtitle?: boolean;
  logoUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'light',
  onClick,
  brandName: propBrandName,
  subTitle: propSubTitle,
  showSubtitle = true,
  logoUrl: propLogoUrl,
}) => {
  const isDark = variant === 'dark';
  const { config } = useSiteConfig();
  const [imageError, setImageError] = useState(false);

  const brandName = propBrandName || config?.brand?.name || 'ÒGHOWA';
  const subTitle = propSubTitle || config?.brand?.subTitle || 'Oghowa Accelerator';
  const activeLogoUrl = propLogoUrl !== undefined ? propLogoUrl : (config?.brand?.logoUrl || '');

  return (
    <div
      id="brand-logo"
      onClick={onClick}
      className={`flex items-center gap-2.5 sm:gap-3 select-none cursor-pointer group relative ${className}`}
      title={`${brandName} - ${subTitle}`}
    >
      {/* 
        Official ÒGHOWA Emblem / Custom Uploaded Brand Logo:
      */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
        {activeLogoUrl && !imageError ? (
          <img
            src={activeLogoUrl}
            alt={brandName}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-105 rounded-md"
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Crown Bar / Arch */}
            <path
              d="M26 14H74L68 6H32L26 14Z"
              fill="#0022D6"
            />
            <rect x="28" y="7" width="44" height="6" rx="1.5" fill="#0022D6" />

            {/* Main Blue Ring */}
            <circle
              cx="50"
              cy="54"
              r="42"
              fill="#0022D6"
              stroke="#001BB5"
              strokeWidth="1.5"
            />

            {/* Inner Light Disc for Bronze Head */}
            <circle
              cx="50"
              cy="54"
              r="28.5"
              fill="#FFF9F5"
              stroke="#E2E8F0"
              strokeWidth="0.8"
            />

            {/* Text Along Curves */}
            <defs>
              {/* Top Arc for "Oghowa" */}
              <path
                id="top-oghowa-arc"
                d="M 18 54 A 32 32 0 0 1 82 54"
                fill="none"
              />
              {/* Bottom Arc for "OUR OWN" */}
              <path
                id="bottom-our-own-arc"
                d="M 82 54 A 32 32 0 0 1 18 54"
                fill="none"
              />
              {/* Radial gradient for Oba Head */}
              <linearGradient id="bronzeGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E2943A" />
                <stop offset="50%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <linearGradient id="coralGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#B91C1C" />
              </linearGradient>
            </defs>

            {/* Arched Text: Oghowa */}
            <text
              fill="#FFFFFF"
              fontSize="10.5"
              fontWeight="800"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="0.05em"
            >
              <textPath
                href="#top-oghowa-arc"
                startOffset="50%"
                textAnchor="middle"
              >
                Oghowa
              </textPath>
            </text>

            {/* Arched Text: OUR OWN */}
            <text
              fill="#FFFFFF"
              fontSize="9.5"
              fontWeight="800"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="0.08em"
            >
              <textPath
                href="#bottom-our-own-arc"
                startOffset="50%"
                textAnchor="middle"
              >
                OUR OWN
              </textPath>
            </text>

            {/* Benin Bronze Head Representation (Oba / Queen Idia mask) */}
            <g id="oba-head" transform="translate(0, 2)">
              {/* Beaded Choker / High Collar */}
              <path
                d="M40 68C40 65 60 65 60 68V73C60 74.5 40 74.5 40 73V68Z"
                fill="url(#coralGradient)"
                stroke="#7F1D1D"
                strokeWidth="0.8"
              />
              <line x1="41" y1="69.5" x2="59" y2="69.5" stroke="#FECACA" strokeWidth="0.6" strokeDasharray="1 1" />
              <line x1="41" y1="71.5" x2="59" y2="71.5" stroke="#FECACA" strokeWidth="0.6" strokeDasharray="1 1" />

              {/* Face Contour */}
              <path
                d="M41 47C41 41 59 41 59 47C59 56 57 66 50 67C43 66 41 56 41 47Z"
                fill="url(#bronzeGradient)"
              />

              {/* Coral Bead Crown & Headdress */}
              <path
                d="M38 45C38 37 43 35 50 35C57 35 62 37 62 45C62 46.5 38 46.5 38 45Z"
                fill="url(#coralGradient)"
              />
              {/* Crown Spikes / Bead crest */}
              <circle cx="50" cy="33.5" r="2" fill="#E2943A" stroke="#78350F" strokeWidth="0.5" />
              <circle cx="44" cy="35" r="1.5" fill="#E2943A" />
              <circle cx="56" cy="35" r="1.5" fill="#E2943A" />

              {/* Facial Features (Eyes, Nose, Lips) */}
              <path
                d="M45 52C46 51 48 51 49 52"
                stroke="#451A03"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
              <path
                d="M51 52C52 51 54 51 55 52"
                stroke="#451A03"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
              {/* Eyes */}
              <circle cx="47" cy="53" r="0.9" fill="#1C1917" />
              <circle cx="53" cy="53" r="0.9" fill="#1C1917" />
              {/* Nose */}
              <path
                d="M50 51V58H51.5"
                stroke="#451A03"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
              {/* Lips */}
              <path
                d="M47.5 61C48.5 62 51.5 62 52.5 61"
                stroke="#451A03"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Traditional Scarification Marks on Forehead */}
              <line x1="48" y1="46" x2="48" y2="48" stroke="#78350F" strokeWidth="0.8" />
              <line x1="50" y1="46" x2="50" y2="48" stroke="#78350F" strokeWidth="0.8" />
              <line x1="52" y1="46" x2="52" y2="48" stroke="#78350F" strokeWidth="0.8" />

              {/* Side Coral Tassels / Braids */}
              <path d="M38 46V57" stroke="url(#coralGradient)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1.5 1" />
              <path d="M62 46V57" stroke="url(#coralGradient)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1.5 1" />
            </g>
          </svg>
        )}
      </div>

      {/* 
        Official Typography:
        ÒGHOWA (Royal Blue Serif with grave accent) + Our own (Red Italic Serif)
      */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline">
          <span
            className={`text-2xl sm:text-[26px] font-black tracking-tight font-serif ${
              isDark ? 'text-white' : 'text-[#0022D6]'
            }`}
            style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
          >
            {brandName}
          </span>
        </div>

        {/* Red Italic "Our own" Tagline */}
        <div className="flex items-center gap-1.5 -mt-0.5">
          <span
            className="text-xs sm:text-[13px] font-bold italic text-[#D9232A]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Our own
          </span>

          {showSubtitle && subTitle && (
            <span
              className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider pl-1 border-l ${
                isDark ? 'text-slate-400 border-slate-700' : 'text-slate-500 border-slate-300'
              }`}
            >
              {subTitle.replace('Oghowa ', '')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
