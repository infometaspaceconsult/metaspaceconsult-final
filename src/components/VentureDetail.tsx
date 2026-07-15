import React from "react";
import { X, ArrowRight, Star, TrendingUp, Sparkles, BookOpen, Heart, Rocket, Bus, ShieldAlert, CheckCircle } from "lucide-react";
import { Venture } from "../types";

interface VentureDetailProps {
  venture: Venture | null;
  onClose: () => void;
  onBookClick: (ventureName: string) => void;
}

export default function VentureDetail({ venture, onClose, onBookClick }: VentureDetailProps) {
  if (!venture) return null;

  const getVentureIcon = (name: string) => {
    switch (name) {
      case "school":
        return <BookOpen size={24} className="text-white" />;
      case "rocket":
        return <Rocket size={24} className="text-white" />;
      case "bus":
        return <Bus size={24} className="text-white" />;
      case "heart":
        return <Heart size={24} className="text-white" />;
      default:
        return <Sparkles size={24} className="text-white" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with gradient color of the venture */}
        <div className={`p-6 text-white bg-gradient-to-r ${venture.color} relative overflow-hidden`}>
          {/* Grid decorative overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.1] pointer-events-none" />
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
                {getVentureIcon(venture.iconName)}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/15 px-2.5 py-1 rounded-full border border-white/10">
                  Flagship Venture
                </span>
                <h3 className="font-display font-black text-2xl tracking-wide mt-1.5">{venture.name}</h3>
                <p className="text-xs text-white/80 font-sans mt-0.5 font-medium">{venture.tagline}</p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-none"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Short description & founder quote */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-l-2 border-brand-crimson pl-2.5">
              Overview
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              {venture.description}
            </p>
            <p className="text-xs text-gray-700 leading-relaxed font-sans font-medium bg-gray-50 p-4 rounded-xl border border-gray-100/50">
              {venture.fullDetails}
            </p>
          </div>

          {/* Large Stat Metrics Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-l-2 border-brand-crimson pl-2.5">
              Key Growth Metrics
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {venture.stats.map((stat, idx) => (
                <div key={idx} className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl flex flex-col justify-center items-center text-center">
                  <span className="font-display font-black text-brand-blue text-lg sm:text-xl md:text-2xl">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-gray-500 font-sans font-medium text-center leading-tight mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Impact points checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-l-2 border-brand-crimson pl-2.5">
              Structural Value
            </h4>
            <ul className="space-y-2.5">
              {venture.impactPoints.map((point, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs text-gray-600 leading-relaxed">
                  <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Founder Quote */}
          {venture.founderQuote && (
            <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/20 border-l-4 border-blue-900 p-4 rounded-r-xl">
              <p className="text-[11px] italic text-gray-600 leading-relaxed">
                "{venture.founderQuote}"
              </p>
              <p className="text-[9px] font-bold text-blue-950 uppercase tracking-wider mt-2">
                — Principal Architect, Metaspace
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer actions */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Venture actively trading
            </span>
          </div>
          
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => onBookClick(venture.name)}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-brand-blue hover:bg-brand-navy text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition"
            >
              Book Venture Partnership
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
