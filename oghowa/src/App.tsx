import React, { useState, useEffect } from 'react';
import { NavigationTab, ProgramId } from './types';
import { Header } from './components/Header';
import { EcosystemHome } from './components/EcosystemHome';
import { SummitPage } from './components/SummitPage';
import { ProgramDetailView } from './components/ProgramDetailView';
import { AdminDashboard } from './components/AdminDashboard';
import { EventsHub } from './components/EventsHub';
import { EventRegistrationModal } from './components/EventRegistrationModal';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { EventItem, AttendeeTrack } from './types';

// Interactive Summit Modals
import { ExecutiveAccessModal } from './components/ExecutiveAccessModal';
import { ProspectusModal } from './components/ProspectusModal';
import { JoinModal } from './components/JoinModal';
import { LoginModal } from './components/LoginModal';
import { Preloader } from './components/Preloader';
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext';

function AppContent() {
  const { config } = useSiteConfig();

  // Initial tab detection based on URL pathname or hash
  const getInitialTab = (): { tab: NavigationTab; prog: ProgramId | null } => {
    if (typeof window === 'undefined') return { tab: 'home', prog: null };
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase().replace('#', '');

    if (path.includes('/admin') || hash === 'admin') {
      return { tab: 'admin', prog: null };
    }
    if (path.includes('/events') || hash === 'events') {
      return { tab: 'events', prog: null };
    }
    if (path.includes('/business-week') || hash === 'business-week' || hash === 'summit') {
      return { tab: 'summit', prog: null };
    }
    if (path.includes('/programs/innovation-weekend') || hash === 'innovation-weekend') {
      return { tab: 'programs', prog: 'innovation-weekend' };
    }
    if (path.includes('/programs/incubation') || hash === 'incubation-program') {
      return { tab: 'programs', prog: 'incubation-program' };
    }
    if (path.includes('/programs/venture-studio') || hash === 'venture-studio') {
      return { tab: 'programs', prog: 'venture-studio' };
    }
    if (path.includes('/programs/capital-network') || hash === 'capital-network') {
      return { tab: 'programs', prog: 'capital-network' };
    }
    return { tab: 'home', prog: null };
  };

  const initial = getInitialTab();
  const [activeTab, setActiveTab] = useState<NavigationTab>(initial.tab);
  const [selectedProgramId, setSelectedProgramId] = useState<ProgramId | null>(initial.prog);

  // Preloader state
  const [showPreloader, setShowPreloader] = useState(() => config.settings.enablePreloader);

  // Modals state
  const [executiveAccessModalOpen, setExecutiveAccessModalOpen] = useState(false);
  const [executiveAccessRole, setExecutiveAccessRole] = useState('Institutional Investor');
  const [prospectusModalOpen, setProspectusModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [initialJoinRole, setInitialJoinRole] = useState('founder');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Event Registration Modal (Prompt 7)
  const [eventRegistrationModalOpen, setEventRegistrationModalOpen] = useState(false);
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState<EventItem | null>(null);
  const [defaultRegistrationTrack, setDefaultRegistrationTrack] = useState<AttendeeTrack | undefined>(undefined);

  const handleOpenEventRegistration = (event: EventItem, defaultTrack?: AttendeeTrack) => {
    setSelectedEventForRegistration(event);
    setDefaultRegistrationTrack(defaultTrack);
    setEventRegistrationModalOpen(true);
  };

  // Sync with browser URL changes
  useEffect(() => {
    const handlePopState = () => {
      const state = getInitialTab();
      setActiveTab(state.tab);
      setSelectedProgramId(state.prog);
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  };

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);

    if (tab === 'admin') {
      setSelectedProgramId(null);
      window.history.pushState(null, '', '#admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (tab === 'events') {
      setSelectedProgramId(null);
      window.history.pushState(null, '', '#events');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (tab === 'home') {
      setSelectedProgramId(null);
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (tab === 'summit') {
      setSelectedProgramId(null);
      window.history.pushState(null, '', '#summit');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (tab === 'programs') {
      setSelectedProgramId('innovation-weekend');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Direct section navigation (Summit features)
    setSelectedProgramId(null);
    setActiveTab('summit');
    if (tab === 'governance') {
      scrollToSection('governance');
    } else if (tab === 'pillars') {
      scrollToSection('pillars');
    } else if (tab === 'deal-room') {
      scrollToSection('deal-room');
    } else if (tab === 'masterclasses') {
      scrollToSection('masterclasses-and-pavilion');
    } else if (tab === 'pavilion') {
      scrollToSection('masterclasses-and-pavilion');
    } else if (tab === 'impact') {
      scrollToSection('impact');
    } else if (tab === 'partnership') {
      scrollToSection('partnership');
    } else if (tab === 'inquiries') {
      scrollToSection('inquiries');
    } else if (tab === 'ventures' || tab === 'ecosystem') {
      scrollToSection('featured-ventures');
    }
  };

  const handleSelectProgram = (programId: ProgramId) => {
    if (programId === 'business-week') {
      setSelectedProgramId(null);
      setActiveTab('summit');
      window.history.pushState(null, '', '#summit');
    } else {
      setSelectedProgramId(programId);
      setActiveTab('programs');
      window.history.pushState(null, '', `#${programId}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedProgramId(null);
    setActiveTab('home');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenExecutiveAccess = (role?: string) => {
    if (role) setExecutiveAccessRole(role);
    setExecutiveAccessModalOpen(true);
  };

  const handleOpenProspectus = () => {
    setProspectusModalOpen(true);
  };

  const handleOpenJoinModal = (roleOrProgram?: string) => {
    const roleLower = (roleOrProgram || '').toLowerCase();
    if (
      roleLower.includes('innovation') ||
      roleLower.includes('weekend')
    ) {
      const iwEvent = config.events?.find(
        (e) =>
          e.id === 'event-innovation-weekend' ||
          e.title.toLowerCase().includes('innovation weekend')
      ) || config.events?.[0];

      if (iwEvent) {
        handleOpenEventRegistration(iwEvent, 'Entrepreneur / Founder');
        return;
      }
    }
    setInitialJoinRole(roleOrProgram || 'founder');
    setJoinModalOpen(true);
  };

  // If user navigated to /admin or clicked Admin Portal:
  if (activeTab === 'admin') {
    const isEvents =
      typeof window !== 'undefined' &&
      (window.location.pathname.includes('/events') ||
        window.location.hash.includes('events'));
    return (
      <AdminDashboard
        onExit={handleBackToHome}
        initialTab={isEvents ? 'events' : 'global'}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-[#D9232A] selection:text-white relative">
      {/* Animated Emblem Preloader with orbital light follower */}
      {showPreloader && (
        <Preloader
          brandName="ÓGHOWA"
          tagline="Oghowa Business Week: Institutional Leadership & Economic Summit"
          onComplete={() => setShowPreloader(false)}
        />
      )}

      {/* Header with Summit Navigation matching reference image */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onSelectProgram={handleSelectProgram}
        onOpenJoinModal={handleOpenJoinModal}
        onOpenLoginModal={() => setLoginModalOpen(true)}
        onRequestExecutiveAccess={() => handleOpenExecutiveAccess('Executive Delegate')}
        onDownloadProspectus={handleOpenProspectus}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {selectedProgramId ? (
          /* Prompt 4: Program Subpages (Innovation Weekend, Incubation, Venture Studio, Capital Network) */
          <ProgramDetailView
            programId={selectedProgramId}
            onSelectProgram={handleSelectProgram}
            onBackToHome={handleBackToHome}
            onOpenJoinModal={handleOpenJoinModal}
            onOpenEventRegistration={handleOpenEventRegistration}
          />
        ) : activeTab === 'events' ? (
          /* Prompt 6: Interactive Events Hub (/events) */
          <EventsHub
            onRegisterEvent={handleOpenEventRegistration}
            onDownloadProspectus={handleOpenProspectus}
            onRequestExecutiveAccess={() => handleOpenExecutiveAccess('Executive Delegate')}
          />
        ) : activeTab === 'summit' ? (
          /* Prompt 3: Oghowa Business Week Summit Page (/business-week) */
          <SummitPage
            onRequestExecutiveAccess={handleOpenExecutiveAccess}
            onDownloadProspectus={handleOpenProspectus}
          />
        ) : (
          /* Prompt 2: Ecosystem Homepage (/) */
          <EcosystemHome
            onRequestExecutiveAccess={() => handleOpenExecutiveAccess('Executive Delegate')}
            onDownloadProspectus={handleOpenProspectus}
            onSelectRole={(roleId) => {
              if (roleId === 'investor') {
                handleOpenExecutiveAccess('Institutional Investor');
              } else if (roleId === 'corporate') {
                handleOpenExecutiveAccess('Corporate Sponsor');
              } else if (roleId === 'government') {
                handleOpenExecutiveAccess('Sovereign Partner');
              } else {
                handleOpenJoinModal(roleId);
              }
            }}
            onSelectProgram={handleSelectProgram}
            onSelectVenture={() => handleOpenExecutiveAccess('Venture Deal-Room')}
            onNavigateSummit={() => handleSelectTab('summit')}
          />
        )}
      </main>

      {/* Footer with Summit Architecture & Inquiries */}
      <Footer
        onSelectTab={handleSelectTab}
        onSelectProgram={handleSelectProgram}
      />

      {/* Floating Back to Top Button (appears once user scrolls past hero section) */}
      <BackToTop />

      {/* Summit Executive Modals */}
      <ExecutiveAccessModal
        isOpen={executiveAccessModalOpen}
        onClose={() => setExecutiveAccessModalOpen(false)}
        defaultRole={executiveAccessRole}
      />

      <ProspectusModal
        isOpen={prospectusModalOpen}
        onClose={() => setProspectusModalOpen(false)}
        onRequestExecutiveAccess={() => {
          setProspectusModalOpen(false);
          handleOpenExecutiveAccess('Executive Delegate');
        }}
      />

      {/* Auxiliary Modals */}
      <JoinModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        initialRole={initialJoinRole}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToJoin={() => handleOpenExecutiveAccess('Executive Delegate')}
        onLoginSuccess={(authData) => {
          setLoginModalOpen(false);
          if (authData.role === 'superadmin' || authData.role === 'admin' || authData.role === 'secretariat') {
            setActiveTab('admin');
            window.history.pushState(null, '', '/admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (authData.role === 'investor' || authData.role === 'founder') {
            setActiveTab('deal-room');
            window.history.pushState(null, '', '/#deal-room');
            scrollToSection('deal-room');
          }
        }}
      />

      {/* Prompt 7: Multi-Step Event Registration & Accreditation Modal */}
      <EventRegistrationModal
        isOpen={eventRegistrationModalOpen}
        onClose={() => setEventRegistrationModalOpen(false)}
        event={selectedEventForRegistration}
        defaultTrack={defaultRegistrationTrack}
      />
    </div>
  );
}

export default function App() {
  return (
    <SiteConfigProvider>
      <AppContent />
    </SiteConfigProvider>
  );
}
