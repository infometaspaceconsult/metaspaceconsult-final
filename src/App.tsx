import React, { useState, useEffect } from 'react';
import { initialSiteConfig } from './data/initialData';
import { SiteConfig, Venture, ServiceItem, LayoutSection } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { MetagenShowcase } from './components/MetagenShowcase';
import { VenturesSection } from './components/VenturesSection';
import { WhoWeAreSection } from './components/WhoWeAreSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CompanionChatbot } from './components/CompanionChatbot';
import { SuperadminLoginModal } from './components/SuperadminLoginModal';
import { SuperadminDashboard } from './components/SuperadminDashboard';
import { ConsultationModal } from './components/ConsultationModal';
import { Preloader } from './components/Preloader';

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [config, setConfig] = useState<SiteConfig>(initialSiteConfig);
  const [superadminToken, setSuperadminToken] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [dashboardOpen, setDashboardOpen] = useState<boolean>(false);
  const [companionChatOpen, setCompanionChatOpen] = useState<boolean>(false);
  const [consultationModalOpen, setConsultationModalOpen] = useState<boolean>(false);
  const [consultationService, setConsultationService] = useState<string>('Venture Design Studio');
  const [prefillInterest, setPrefillInterest] = useState<string>('');

  const openConsultation = (serviceName?: string) => {
    if (serviceName) {
      setConsultationService(serviceName);
    }
    setConsultationModalOpen(true);
  };

  // Fetch dynamic site config on mount
  useEffect(() => {
    fetchSiteConfig();
    const token = localStorage.getItem('metaspace_superadmin_token');
    if (token) {
      setSuperadminToken(token);
    }
  }, []);

  const fetchSiteConfig = async () => {
    try {
      const res = await fetch('/api/site-config');
      const data = await res.json();
      if (data) {
        if (data.config) {
          setConfig(data.config);
        } else if (data.sections) {
          setConfig(data);
        }
      }
    } catch (err) {
      console.log('Using initial site configuration.');
    }
  };

  const handleLoginSuccess = (token: string) => {
    setSuperadminToken(token);
    localStorage.setItem('metaspace_superadmin_token', token);
    setDashboardOpen(true);
  };

  const handleLogout = () => {
    setSuperadminToken(null);
    localStorage.removeItem('metaspace_superadmin_token');
    setDashboardOpen(false);
  };

  const handleOpenSuperadmin = () => {
    if (superadminToken) {
      setDashboardOpen(true);
    } else {
      setLoginModalOpen(true);
    }
  };

  const scrollToContact = (interestText?: string) => {
    if (interestText) {
      setPrefillInterest(interestText);
    }
    const elem = document.getElementById('contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToVentures = () => {
    const elem = document.getElementById('ventures');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sort sections dynamically and ensure unique section IDs
  const sortedSections = Array.from(
    new Map<string, LayoutSection>(
      (config.sections || [])
        .filter((s) => s.enabled)
        .sort((a, b) => a.order - b.order)
        .map((sec, idx) => [sec.id || `sec-${idx}`, sec])
    ).values()
  );

  // Apply custom CSS variable dynamic theme styles
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-navy', config.theme.primaryNavy || '#141B77');
    document.documentElement.style.setProperty('--secondary-red', config.theme.secondaryRed || '#E63946');
  }, [config.theme]);

  return (
    <div
      className="min-h-screen text-slate-800 font-body-md antialiased selection:bg-[#E63946] selection:text-white"
      style={{ backgroundColor: config.theme.backgroundColor || '#f5faff' }}
    >
      {/* Ecosystem Preloader */}
      {loading && (
        <Preloader
          onComplete={() => setLoading(false)}
          logoUrl={config.theme.customLogoUrl}
        />
      )}

      {/* Navbar Header */}
      <Header
        config={config}
        onOpenConsultation={() => openConsultation('Venture Design Studio')}
        onOpenSuperadmin={handleOpenSuperadmin}
        onOpenCompanionChat={() => setCompanionChatOpen(true)}
        isSuperadmin={!!superadminToken}
      />

      {/* Dynamic Rendered Homepage Sections according to Superadmin drag-and-drop order */}
      <main>
        {sortedSections.map((sec, idx) => {
          const sectionKey = `${sec.id}-${idx}`;
          switch (sec.id) {
            case 'hero':
              return (
                <HeroSection
                  key={sectionKey}
                  config={config}
                  onExploreVentures={scrollToVentures}
                  onPartnerWithUs={() => openConsultation('Venture Design Studio')}
                />
              );
            case 'services':
              return (
                <ServicesSection
                  key={sectionKey}
                  config={config}
                  onSelectService={(service: ServiceItem) =>
                    openConsultation(service.title)
                  }
                />
              );
            case 'metagen':
              return <MetagenShowcase key={sectionKey} />;
            case 'ventures':
              return (
                <VenturesSection
                  key={sectionKey}
                  config={config}
                  onSelectVentureForInquiry={(venture: Venture) =>
                    openConsultation(`Inquiry for ${venture.title}`)
                  }
                />
              );
            case 'whoweare':
              return (
                <WhoWeAreSection
                  key={sectionKey}
                  config={config}
                  onLearnMore={() => scrollToContact('About Metaspace Inquiries')}
                />
              );
            case 'cta':
              return (
                <section key={sectionKey} className="py-12 bg-[#f5faff]">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#141B77] text-white rounded-2xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#E63946] rounded-xl flex items-center justify-center font-extrabold text-2xl text-white shrink-0 shadow-md">
                          M
                        </div>
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                            Let's build something extraordinary together.
                          </h3>
                          <p className="text-slate-300 text-sm sm:text-base mt-2">
                            Whether you're a government, investor, organization, or entrepreneur, we're ready to partner with you.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => openConsultation('Venture Design Studio')}
                        className="px-8 py-4 bg-[#E63946] hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-md shrink-0 transition shadow-lg cursor-pointer"
                      >
                        Book a Consultation
                      </button>
                    </div>
                  </div>
                </section>
              );
            case 'contact':
              return (
                <ContactSection
                  key={sectionKey}
                  config={config}
                  prefillInterest={prefillInterest}
                  onOpenCompanionChat={() => setCompanionChatOpen(true)}
                />
              );
            default:
              return null;
          }
        })}
      </main>

      {/* Footer */}
      <Footer
        config={config}
        onOpenSuperadmin={handleOpenSuperadmin}
        isSuperadmin={!!superadminToken}
      />

      {/* Book a Consultation Modal Popup matching Image 2 */}
      <ConsultationModal
        isOpen={consultationModalOpen}
        onClose={() => setConsultationModalOpen(false)}
        config={config}
        prefillService={consultationService}
      />

      {/* Floating In-Site Companion Support AI Chatbot */}
      <CompanionChatbot
        config={config}
        isOpen={companionChatOpen}
        onToggle={() => setCompanionChatOpen(!companionChatOpen)}
        onOpenConsultation={() => scrollToContact('Companion AI Consultation')}
      />

      {/* Hidden Superadmin Login Gateway Modal */}
      <SuperadminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Superadmin Drag & Drop Layout & Studio Drawer */}
      {dashboardOpen && (
        <SuperadminDashboard
          config={config}
          onUpdateConfig={(newConfig) => setConfig(newConfig)}
          onClose={() => setDashboardOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
