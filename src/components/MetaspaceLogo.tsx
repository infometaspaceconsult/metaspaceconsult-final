import React, { useState, useEffect } from "react";

interface MetaspaceLogoProps {
  className?: string;
  size?: number;
  logoUrl?: string; // Optional custom logo passed from App state
}

export default function MetaspaceLogo({ className = "h-8 w-8", size = 32, logoUrl }: MetaspaceLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [currentLogo, setCurrentLogo] = useState<string>("");

  useEffect(() => {
    if (logoUrl) {
      setCurrentLogo(logoUrl);
      setImgFailed(false);
    } else {
      // Fetch from site-config
      fetch("/api/site-config")
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error();
        })
        .then((data) => {
          if (data.logoUrl) {
            setCurrentLogo(data.logoUrl);
            setImgFailed(false);
          } else {
            setCurrentLogo("./download.jpg");
          }
        })
        .catch(() => {
          setCurrentLogo("./download.jpg");
        });
    }
  }, [logoUrl]);

  if (currentLogo && !imgFailed) {
    return (
      <img
        src={currentLogo}
        alt="Metaspace Consulting"
        style={{ width: size, height: size }}
        className={`${className} rounded-full object-cover shadow-sm transition-all duration-300 hover:scale-105 border border-white/10`}
        onError={() => setImgFailed(true)}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Premium, hand-crafted vector SVG representation of the Metaspace Consulting baboon-in-circle logo
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} rounded-full hover:scale-105 transition-all duration-300`}
    >
      {/* Light blue circular background matching the reference logo image */}
      <circle cx="100" cy="100" r="95" fill="#8bcbf1" />
      
      {/* Refined vector path of the baboon silhouette walking right with curved tail on the left */}
      <path
        d="M 45 80 
           C 22 56, 18 108, 30 120 
           C 38 128, 42 123, 44 118 
           C 47 110, 48 95, 58 94 
           C 68 93, 80 103, 102 103 
           C 122 103, 134 85, 142 75 
           C 148 68, 154 56, 162 54 
           C 170 52, 174 56, 174 61 
           C 174 67, 167 71, 163 74 
           C 157 78, 151 84, 147 91 
           C 143 98, 137 118, 141 152 
           C 141 155, 139 157, 136 157 
           C 133 157, 131 153, 132 146 
           L 126 115 
           C 118 115, 112 116, 106 118 
           L 106 152 
           C 106 155, 104 157, 101 157 
           C 98 157, 96 154, 97 148 
           L 95 121 
           C 87 123, 80 124, 73 123 
           L 65 152 
           C 64 155, 62 157, 59 157 
           C 56 157, 54 154, 55 148 
           L 57 121 
           C 50 118, 44 112, 40 104 
           C 38 100, 37 95, 38 91 
           C 41 78, 45 81, 45 80 Z"
        fill="#111111"
      />
    </svg>
  );
}
