import React, { useState } from "react";

interface MetaspaceLogoProps {
  className?: string;
  size?: number;
  logoUrl?: string;
  showText?: boolean; // Set to false when you want ONLY the icon/emblem
  textClassName?: string;
}

export default function MetaspaceLogo({
  className = "",
  size = 36,
  logoUrl,
  showText = false,
  textClassName = "text-slate-900 dark:text-white font-bold tracking-wider",
}: MetaspaceLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const resolvedLogoUrl = (logoUrl && logoUrl.trim() !== "") ? logoUrl : "/images.png";
  const hasValidImage = !imgFailed && Boolean(resolvedLogoUrl && resolvedLogoUrl.trim() !== "");

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* 1. The Logo Icon / Emblem */}
      {hasValidImage ? (
        <img
          src={resolvedLogoUrl}
          alt="Metaspace Consulting Logo"
          style={{ width: size, height: size }}
          className="rounded-full object-cover shadow-sm transition-transform duration-300 hover:scale-105 shrink-0"
          onError={() => setImgFailed(true)}
        />
      ) : (
        /* Fallback Vector Emblem if image fails to load */
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="rounded-full hover:scale-105 transition-transform duration-300 shrink-0"
        >
          <circle cx="100" cy="100" r="95" fill="#8bcbf1" />
          <path
            d="M 45 80 C 22 56, 18 108, 30 120 C 38 128, 42 123, 44 118 C 47 110, 48 95, 58 94 C 68 93, 80 103, 102 103 C 122 103, 134 85, 142 75 C 148 68, 154 56, 162 54 C 170 52, 174 56, 174 61 C 174 67, 167 71, 163 74 C 157 78, 151 84, 147 91 C 143 98, 137 118, 141 152 C 141 155, 139 157, 136 157 C 133 157, 131 153, 132 146 L 126 115 C 118 115, 112 116, 106 118 L 106 152 C 106 155, 104 157, 101 157 C 98 157, 96 154, 97 148 L 95 121 C 87 123, 80 124, 73 123 L 65 152 C 64 155, 62 157, 59 157 C 56 157, 54 154, 55 148 L 57 121 C 50 118, 44 112, 40 104 C 38 100, 37 95, 38 91 C 41 78, 45 81, 45 80 Z"
            fill="#111111"
          />
        </svg>
      )}

      {/* 2. Brand Name Typography */}
      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <span className={`text-base font-extrabold uppercase ${textClassName}`}>
            METASPACE
          </span>
          <span className="text-[10px] tracking-widest font-semibold uppercase text-slate-500 dark:text-slate-400">
            CONSULTING LIMITED
          </span>
        </div>
      )}
    </div>
  );
}