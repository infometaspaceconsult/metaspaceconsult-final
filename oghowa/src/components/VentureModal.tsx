import React from 'react';
import { Venture } from '../types';
import { X, ExternalLink, Check, Sparkles, Building } from 'lucide-react';

interface VentureModalProps {
  venture: Venture | null;
  onClose: () => void;
  onConnectVenture: (ventureName: string) => void;
}

export const VentureModal: React.FC<VentureModalProps> = ({
  venture,
  onClose,
  onConnectVenture,
}) => {
  if (!venture) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-bold text-xl">
              {venture.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#0A162B]">
                  {venture.name}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  {venture.sector}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {venture.tagline}
              </p>
            </div>
          </div>

          <div className="py-3 border-y border-slate-100 my-4">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {venture.description}
            </p>
          </div>

          {/* Key Metrics */}
          {venture.metrics && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Ecosystem Metrics
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {venture.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center"
                  >
                    <span className="text-lg font-bold text-[#0A162B] block">
                      {m.value}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onConnectVenture(venture.name);
              }}
              className="flex-1 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#D9232A] hover:bg-[#B9181F] rounded-lg transition-colors text-center"
            >
              Connect with Founders
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
