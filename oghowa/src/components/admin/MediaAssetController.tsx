import React, { useState, useRef } from 'react';
import { Image, ExternalLink, Check, RefreshCw, Eye, Sparkles, Upload, X } from 'lucide-react';

interface MediaAssetControllerProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  altText?: string;
  onAltChange?: (alt: string) => void;
  recommendedAspect?: string;
  presets?: { title: string; url: string }[];
  helperText?: string;
}

const DEFAULT_PRESETS = [
  {
    title: 'Benin City Heritage & Industrial Gateway',
    url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Executive Plenary Convention Hall',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Bilateral Deal-Room & Syndicate Boardroom',
    url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Technical Builders & Code Hackathon',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Corridor Logistics & Agro-Processing',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Corporate Governance & Skyline',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
  },
];

export const MediaAssetController: React.FC<MediaAssetControllerProps> = ({
  label,
  value,
  onChange,
  altText,
  onAltChange,
  recommendedAspect = '16:9 Landscape',
  presets = DEFAULT_PRESETS,
  helperText,
}) => {
  const [showPresets, setShowPresets] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setImageError(false);
        onChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5 text-red-600" />
            <span>{label}</span>
          </label>
          {helperText && <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>}
        </div>
        <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
          Target: {recommendedAspect}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
        {/* Thumbnail Preview with Live Fallback & Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative aspect-video rounded-lg overflow-hidden bg-slate-900/90 border-2 transition-all flex items-center justify-center group cursor-pointer ${
            isDragging ? 'border-red-500 bg-red-950/40' : 'border-slate-300 hover:border-slate-400'
          }`}
          title="Click or drag & drop to upload image"
        >
          {value && !imageError ? (
            <img
              src={value}
              alt={altText || 'Media Asset Preview'}
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400">
              <Upload className="w-5 h-5 mb-1 text-slate-400 group-hover:text-red-400 transition-colors" />
              <span className="text-[10px] font-medium text-slate-300">
                {isDragging ? 'Drop to upload' : 'Click / drop image'}
              </span>
            </div>
          )}

          {value && !imageError && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-[10px] text-white font-bold bg-black/60 px-2 py-0.5 rounded">
                Click to change
              </span>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 bg-black/70 hover:bg-black text-white rounded text-[10px]"
                title="Open full image in new tab"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="md:col-span-3 space-y-2">
          {/* File Picker input (hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-700">Image Asset URL or Upload</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] text-slate-700 hover:text-red-600 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload File</span>
                </button>
                {presets && presets.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    className="text-[11px] text-[#D9232A] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{showPresets ? 'Close' : 'Presets'}</span>
                  </button>
                )}
                {value && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageError(false);
                      onChange('');
                    }}
                    className="text-[11px] text-slate-400 hover:text-red-600 flex items-center gap-0.5 cursor-pointer ml-1"
                    title="Clear image"
                  >
                    <X className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setImageError(false);
                onChange(e.target.value);
              }}
              placeholder="Paste image URL (https://...) or upload file from device"
              className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>

          {onAltChange !== undefined && (
            <div>
              <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                Alt Text & Caption (Institutional Compliance)
              </span>
              <input
                type="text"
                value={altText || ''}
                onChange={(e) => onAltChange(e.target.value)}
                placeholder="Descriptive caption for screen-readers and executive audits"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Preset Gallery */}
      {showPresets && presets && presets.length > 0 && (
        <div className="pt-2 border-t border-slate-200">
          <p className="text-[11px] font-bold text-slate-600 mb-2">
            Curated High-Resolution Presets:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setImageError(false);
                  setShowPresets(false);
                }}
                className={`p-2 rounded-lg border text-left transition-all flex items-start gap-2 cursor-pointer ${
                  value === preset.url
                    ? 'border-red-500 bg-red-50/50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.title}
                  className="w-12 h-8 object-cover rounded shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-slate-800 truncate">
                    {preset.title}
                  </div>
                  <div className="text-[9px] text-slate-500">Click to apply</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
