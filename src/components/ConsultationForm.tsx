import React, { useState } from "react";
import { X, Calendar, Building, Sparkles, Send, Loader2, CheckCircle, ShieldAlert } from "lucide-react";
import { apiCreateConsultation } from "../lib/apiFallback";

interface ConsultationFormProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  onSuccessSubmit?: () => void;
}

export default function ConsultationForm({ isOpen, onClose, preselectedService = "Venture Design Studio", onSuccessSubmit }: ConsultationFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [sector, setSector] = useState("");
  const [service, setService] = useState(preselectedService);
  const [message, setMessage] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const success = await apiCreateConsultation({
        name,
        email,
        organization,
        sector,
        service,
        message,
      });

      if (!success) {
        throw new Error("Failed to log consultation request.");
      }

      setIsSuccess(true);
      if (onSuccessSubmit) onSuccessSubmit();
      
      // Reset fields after some delay or keep success state
      setTimeout(() => {
        // Simple clean up
      }, 5000);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const services = [
    "Venture Design Studio",
    "Digital Transformation",
    "Innovation Ecosystem Builder",
    "Strategy & Advisory",
  ];

  const sectors = [
    "Education & Academics",
    "Government & Public Sector",
    "Healthcare & Life Sciences",
    "Mobility & Logistics",
    "Financial Technology",
    "Agriculture & Agro-tech",
    "Early-stage Startup / Founder",
    "Venture Capital / Investment",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-red-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-brand-red p-2 rounded-xl">
              <Calendar size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base tracking-wide">Book a Consultation</h3>
              <p className="text-[10px] text-gray-300">Set up a session with our principal venture architects.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSuccess ? (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
                <CheckCircle size={36} className="animate-bounce" />
              </div>
              <h4 className="font-display font-extrabold text-lg text-brand-blue">
                Consultation Request Logged!
              </h4>
              <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
                Thank you, <strong className="text-gray-800">{name}</strong>. Your consultation request for <strong className="text-gray-800">{service}</strong> has been secured in our system. An invitation has been sent to <span className="text-blue-900 font-semibold">{email}</span>.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-xl text-left border border-gray-100 w-full max-w-md text-[11px] text-gray-500 leading-relaxed mt-4 space-y-1.5">
                <p><strong>System ID:</strong> REF-{Math.floor(100000 + Math.random() * 900000)}</p>
                <p><strong>Proposed Topic:</strong> {service}</p>
                <p><strong>Status:</strong> Pending Review (Verified in records ledger)</p>
              </div>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  setName("");
                  setEmail("");
                  setOrganization("");
                  setSector("");
                  setMessage("");
                  onClose();
                }}
                className="mt-6 px-6 py-2.5 bg-brand-blue hover:bg-brand-navy text-white text-xs font-bold rounded-lg transition"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs text-brand-red flex items-start gap-2.5">
                  <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Full Name <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Osaze Alabi"
                    className="px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-blue-900 rounded-lg focus:outline-none focus:bg-white transition"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Email Address <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className="px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-blue-900 rounded-lg focus:outline-none focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Organization */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Federal Ministry of Tech"
                    className="px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-blue-900 rounded-lg focus:outline-none focus:bg-white transition"
                  />
                </div>

                {/* Sector Select */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Industry / Sector
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-blue-900 rounded-lg focus:outline-none focus:bg-white transition"
                  >
                    <option value="">Select industry sector...</option>
                    {sectors.map((sec, idx) => (
                      <option key={idx} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service Select */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Requested Service <span className="text-brand-red">*</span>
                </label>
                <select
                  required
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-blue-900 rounded-lg focus:outline-none focus:bg-white transition"
                >
                  {services.map((ser, idx) => (
                    <option key={idx} value={ser}>{ser}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Project Brief & Requirements <span className="text-brand-red">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the challenges you are facing, your goals, and timelines..."
                  className="px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-blue-900 rounded-lg focus:outline-none focus:bg-white transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 bg-brand-red hover:bg-brand-crimson disabled:bg-brand-red/60 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition duration-200 shadow-md flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Transmitting secure session...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Secure Consultation Slot</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
