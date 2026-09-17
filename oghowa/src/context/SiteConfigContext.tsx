import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteConfig, defaultSiteConfig } from '../data/siteConfig';
import { EventItem, EventRegistration } from '../types';

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  updateSection: <K extends keyof SiteConfig>(sectionKey: K, value: SiteConfig[K]) => void;
  updateBrand: (brand: Partial<SiteConfig['brand']>) => void;
  updateGlobal: (global: Partial<SiteConfig['global']>) => void;
  updateHero: (hero: Partial<SiteConfig['hero']>) => void;
  updateSummitData: (summitData: Partial<SiteConfig['summitData']>) => void;
  updateImpactMetrics: (metrics: Partial<SiteConfig['impactMetrics']>) => void;
  updateFlagshipPrograms: (programs: SiteConfig['flagshipPrograms']) => void;
  updateFeaturedVentures: (ventures: SiteConfig['featuredVentures']) => void;
  updateEvents: (events: EventItem[]) => void;
  addEvent: (event: EventItem) => void;
  deleteEvent: (eventId: string) => void;
  addEventCategory: (category: string | { name: string; id?: string; badgeColor?: string }) => void;
  deleteEventCategory: (category: string) => void;
  updateContact: (contact: Partial<SiteConfig['contact']>) => void;
  updateSettings: (settings: Partial<SiteConfig['settings']>) => void;
  saveToCloud: (newConfig?: SiteConfig) => Promise<{ success: boolean; message: string }>;
  resetToDefault: () => Promise<void>;
  exportConfigJson: () => string;
  isCloudSyncing: boolean;
  cloudSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  
  // Delegate & Accreditation Registrations
  registrations: EventRegistration[];
  addRegistration: (regData: Partial<EventRegistration>) => Promise<EventRegistration>;
  updateRegistrationStatus: (
    id: string,
    status: 'Approved' | 'Declined' | 'Pending' | 'APPROVED' | 'DECLINED',
    options?: { reason?: string; passCode?: string }
  ) => Promise<boolean>;
  bulkUpdateRegistrationStatus: (
    ids: string[],
    status: 'Approved' | 'Declined' | 'Pending',
    reason?: string
  ) => Promise<boolean>;
  deleteRegistration: (id: string, passcode?: string) => Promise<{ success: boolean; message?: string }>;
  refreshRegistrations: () => Promise<void>;
  isLoadingRegistrations: boolean;
}

const STORAGE_KEY = 'oghowa_site_config_cloud_v4';
const REGISTRATIONS_STORAGE_KEY = 'oghowa_registrations_local_backup';

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSiteConfig,
          ...parsed,
          brand: { ...defaultSiteConfig.brand, ...(parsed.brand || {}) },
          global: { ...defaultSiteConfig.global, ...(parsed.global || {}) },
          hero: { ...defaultSiteConfig.hero, ...(parsed.hero || {}) },
          summitData: { ...defaultSiteConfig.summitData, ...(parsed.summitData || {}) },
          impactMetrics: { ...defaultSiteConfig.impactMetrics, ...(parsed.impactMetrics || {}) },
          flagshipPrograms: parsed.flagshipPrograms || defaultSiteConfig.flagshipPrograms,
          featuredVentures: parsed.featuredVentures || defaultSiteConfig.featuredVentures,
          strategicPartners: parsed.strategicPartners || defaultSiteConfig.strategicPartners,
          advisoryCouncil: parsed.advisoryCouncil || defaultSiteConfig.advisoryCouncil,
          innovationWeekend: { ...defaultSiteConfig.innovationWeekend, ...(parsed.innovationWeekend || {}) },
          incubationProgram: { ...defaultSiteConfig.incubationProgram, ...(parsed.incubationProgram || {}) },
          ventureStudio: { ...defaultSiteConfig.ventureStudio, ...(parsed.ventureStudio || {}) },
          capitalNetwork: { ...defaultSiteConfig.capitalNetwork, ...(parsed.capitalNetwork || {}) },
          eventCategories: parsed.eventCategories || defaultSiteConfig.eventCategories,
          events: parsed.events || defaultSiteConfig.events,
          contact: { ...defaultSiteConfig.contact, ...(parsed.contact || {}) },
          socials: { ...defaultSiteConfig.socials, ...(parsed.socials || {}) },
          settings: { ...defaultSiteConfig.settings, ...(parsed.settings || {}) },
          typographyPalette: { ...defaultSiteConfig.typographyPalette, ...(parsed.typographyPalette || {}) },
          headerNav: parsed.headerNav || defaultSiteConfig.headerNav,
          footerConfig: { ...defaultSiteConfig.footerConfig, ...(parsed.footerConfig || {}) },
        };
      }
    } catch {
      // ignore
    }
    return defaultSiteConfig;
  });

  // Apply dynamic typography and brand palette to root document styles
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const p = config.typographyPalette;
    if (p) {
      if (p.primaryNavy) root.style.setProperty('--brand-primary-navy', p.primaryNavy);
      if (p.accentRed) root.style.setProperty('--brand-accent-red', p.accentRed);
      if (p.darkBg) root.style.setProperty('--brand-dark-bg', p.darkBg);
      if (p.lightBg) root.style.setProperty('--brand-light-bg', p.lightBg);
      if (p.displayFont) root.style.setProperty('--brand-display-font', p.displayFont);
      if (p.bodyFont) root.style.setProperty('--brand-body-font', p.bodyFont);
    }
  }, [config.typographyPalette]);

  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(true);
  const [cloudSaveStatus, setCloudSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Registrations state
  const [registrations, setRegistrations] = useState<EventRegistration[]>(() => {
    try {
      const saved = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState<boolean>(false);

  // Load from Cloud Server on mount
  useEffect(() => {
    let mounted = true;
    async function fetchCloudData() {
      try {
        const res = await fetch('/api/site-config');
        if (res.ok) {
          const data = await res.json();
          if (data && data.config && mounted) {
            console.log('[Oghowa Cloud Sync] Loaded remote cloud configuration');
            setConfig((prev) => ({
              ...defaultSiteConfig,
              ...prev,
              ...data.config,
              brand: { ...defaultSiteConfig.brand, ...(data.config.brand || {}) },
              global: { ...defaultSiteConfig.global, ...(data.config.global || {}) },
              hero: { ...defaultSiteConfig.hero, ...(data.config.hero || {}) },
              summitData: { ...defaultSiteConfig.summitData, ...(data.config.summitData || {}) },
              impactMetrics: { ...defaultSiteConfig.impactMetrics, ...(data.config.impactMetrics || {}) },
              flagshipPrograms: data.config.flagshipPrograms || defaultSiteConfig.flagshipPrograms,
              featuredVentures: data.config.featuredVentures || defaultSiteConfig.featuredVentures,
              strategicPartners: data.config.strategicPartners || defaultSiteConfig.strategicPartners,
              advisoryCouncil: data.config.advisoryCouncil || defaultSiteConfig.advisoryCouncil,
              innovationWeekend: { ...defaultSiteConfig.innovationWeekend, ...(data.config.innovationWeekend || {}) },
              incubationProgram: { ...defaultSiteConfig.incubationProgram, ...(data.config.incubationProgram || {}) },
              ventureStudio: { ...defaultSiteConfig.ventureStudio, ...(data.config.ventureStudio || {}) },
              capitalNetwork: { ...defaultSiteConfig.capitalNetwork, ...(data.config.capitalNetwork || {}) },
              eventCategories: data.config.eventCategories || defaultSiteConfig.eventCategories,
              events: data.config.events || defaultSiteConfig.events,
              contact: { ...defaultSiteConfig.contact, ...(data.config.contact || {}) },
              socials: { ...defaultSiteConfig.socials, ...(data.config.socials || {}) },
              settings: { ...defaultSiteConfig.settings, ...(data.config.settings || {}) },
              typographyPalette: { ...defaultSiteConfig.typographyPalette, ...(data.config.typographyPalette || {}) },
              headerNav: data.config.headerNav || defaultSiteConfig.headerNav,
              footerConfig: { ...defaultSiteConfig.footerConfig, ...(data.config.footerConfig || {}) },
            }));
          }
        }
      } catch (err) {
        console.warn('[Oghowa Cloud Sync] Running with cached/default configuration', err);
      } finally {
        if (mounted) setIsCloudSyncing(false);
      }

      // Fetch Registrations
      try {
        const regRes = await fetch('/api/registrations');
        if (regRes.ok) {
          const regData = await regRes.json();
          if (regData && regData.registrations && mounted) {
            setRegistrations(regData.registrations);
            localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(regData.registrations));
          }
        }
      } catch (err) {
        console.warn('[Oghowa Cloud Sync] Error fetching registrations:', err);
      }
    }

    fetchCloudData();
    return () => {
      mounted = false;
    };
  }, []);

  // Sync config to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  // Sync registrations to local storage
  useEffect(() => {
    try {
      localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(registrations));
    } catch {
      // ignore
    }
  }, [registrations]);

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...newConfig,
    }));
  };

  const updateBrand = (brand: Partial<SiteConfig['brand']>) => {
    setConfig((prev) => ({
      ...prev,
      brand: { ...prev.brand, ...brand },
    }));
  };

  const updateGlobal = (global: Partial<SiteConfig['global']>) => {
    setConfig((prev) => ({
      ...prev,
      global: { ...prev.global, ...global },
    }));
  };

  const updateHero = (hero: Partial<SiteConfig['hero']>) => {
    setConfig((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...hero },
    }));
  };

  const updateSummitData = (summitData: Partial<SiteConfig['summitData']>) => {
    setConfig((prev) => ({
      ...prev,
      summitData: { ...prev.summitData, ...summitData },
    }));
  };

  const updateImpactMetrics = (metrics: Partial<SiteConfig['impactMetrics']>) => {
    setConfig((prev) => ({
      ...prev,
      impactMetrics: { ...prev.impactMetrics, ...metrics },
    }));
  };

  const updateFlagshipPrograms = (programs: SiteConfig['flagshipPrograms']) => {
    setConfig((prev) => ({
      ...prev,
      flagshipPrograms: programs,
    }));
  };

  const updateFeaturedVentures = (ventures: SiteConfig['featuredVentures']) => {
    setConfig((prev) => ({
      ...prev,
      featuredVentures: ventures,
    }));
  };

  const updateEvents = (events: EventItem[]) => {
    setConfig((prev) => ({
      ...prev,
      events,
    }));
  };

  const addEvent = (event: EventItem) => {
    setConfig((prev) => ({
      ...prev,
      events: [event, ...prev.events],
    }));
  };

  const deleteEvent = (eventId: string) => {
    setConfig((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== eventId),
    }));
  };

  const updateSection = <K extends keyof SiteConfig>(sectionKey: K, value: SiteConfig[K]) => {
    setConfig((prev) => ({
      ...prev,
      [sectionKey]: value,
    }));
  };

  const addEventCategory = (category: string | { name: string; id?: string; badgeColor?: string }) => {
    const rawName = typeof category === 'string' ? category : category?.name;
    const trimmed = (rawName || '').trim();
    if (!trimmed) return;
    const badgeColor = typeof category === 'object' && category.badgeColor ? category.badgeColor : undefined;

    const itemToStore = badgeColor
      ? { id: (typeof category === 'object' && category.id) || `cat-${Date.now()}`, name: trimmed, badgeColor }
      : trimmed;

    setConfig((prev) => {
      const existing = prev.eventCategories || [];
      const exists = existing.some((c) => (typeof c === 'string' ? c : c.name).toLowerCase() === trimmed.toLowerCase());
      if (exists) return prev;
      return { ...prev, eventCategories: [...existing, itemToStore as any] };
    });
  };

  const deleteEventCategory = (categoryOrId: string) => {
    if (!categoryOrId) return;
    const target = categoryOrId.trim().toLowerCase();
    setConfig((prev) => {
      const existing = prev.eventCategories || [];
      return {
        ...prev,
        eventCategories: existing.filter((c) => {
          if (typeof c === 'string') {
            return c.toLowerCase() !== target;
          }
          return (c.name || '').toLowerCase() !== target && (c.id || '').toLowerCase() !== target;
        }),
      };
    });
  };

  const updateContact = (contact: Partial<SiteConfig['contact']>) => {
    setConfig((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...contact },
    }));
  };

  const updateSettings = (settings: Partial<SiteConfig['settings']>) => {
    setConfig((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  };

  // Persist to Cloud Server for all users to see
  const saveToCloud = async (newConfig?: SiteConfig): Promise<{ success: boolean; message: string }> => {
    const targetConfig = newConfig || config;
    setCloudSaveStatus('saving');
    try {
      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetConfig),
      });

      if (res.ok) {
        if (newConfig) setConfig(newConfig);
        setCloudSaveStatus('saved');
        setTimeout(() => setCloudSaveStatus('idle'), 3000);
        return { success: true, message: 'Configuration successfully saved to cloud for all users.' };
      } else {
        setCloudSaveStatus('error');
        setTimeout(() => setCloudSaveStatus('idle'), 4000);
        return { success: false, message: 'Server returned error while persisting cloud config.' };
      }
    } catch (err: any) {
      setCloudSaveStatus('error');
      setTimeout(() => setCloudSaveStatus('idle'), 4000);
      return { success: false, message: err?.message || 'Network error saving to cloud.' };
    }
  };

  const resetToDefault = async () => {
    try {
      await fetch('/api/site-config/reset', { method: 'POST' });
    } catch {
      // ignore
    }
    setConfig(defaultSiteConfig);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const exportConfigJson = () => {
    return JSON.stringify(config, null, 2);
  };

  // Registrations Management (Prompt 7 & 8)
  const refreshRegistrations = async () => {
    setIsLoadingRegistrations(true);
    try {
      const res = await fetch('/api/registrations');
      if (res.ok) {
        const data = await res.json();
        if (data.registrations) {
          setRegistrations(data.registrations);
          localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(data.registrations));
        }
      }
    } catch (err) {
      console.error('Error refreshing registrations:', err);
    } finally {
      setIsLoadingRegistrations(false);
    }
  };

  const addRegistration = async (regData: Partial<EventRegistration>): Promise<EventRegistration> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReg: EventRegistration = {
      id: regData.id || `reg-${Date.now()}`,
      eventId: regData.eventId || 'event-summit-2026',
      eventTitle: regData.eventTitle || 'Oghowa Business Week',
      fullName: regData.fullName || 'Delegate',
      email: regData.email || '',
      phone: regData.phone || '',
      organization: regData.organization || 'Organization',
      professionalTitle: regData.professionalTitle || 'Executive',
      track: (regData.track as any) || 'Founder / Industrialist',
      qualifications: regData.qualifications,
      attendanceMode: regData.attendanceMode || 'In-Person (Benin City)',
      linkedInUrl: regData.linkedInUrl,
      accommodations: regData.accommodations,
      consent: regData.consent !== undefined ? regData.consent : true,
      accreditationStatus: regData.accreditationStatus || 'Pending',
      accreditationCode: regData.accreditationCode || `OGH-2026-${randomSuffix}`,
      createdAt: regData.createdAt || new Date().toISOString(),
    };

    // Update local state immediately for instant feedback
    setRegistrations((prev) => [newReg, ...prev]);

    // Also update event registeredCount if matching event exists
    if (newReg.eventId) {
      setConfig((prev) => ({
        ...prev,
        events: prev.events.map((ev) =>
          ev.id === newReg.eventId
            ? { ...ev, registeredCount: (ev.registeredCount || 0) + 1 }
            : ev
        ),
      }));
    }

    // Persist to backend server
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReg),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.registration) {
          setRegistrations((prev) =>
            prev.map((r) => (r.id === newReg.id ? data.registration : r))
          );
          return data.registration;
        }
      }
    } catch (err) {
      console.warn('Backend registration API offline, cached in local state:', err);
    }

    return newReg;
  };

  const updateRegistrationStatus = async (
    id: string,
    status: 'Approved' | 'Declined' | 'Pending' | 'APPROVED' | 'DECLINED',
    options?: { reason?: string; passCode?: string }
  ): Promise<boolean> => {
    const normalizedStatus = (
      status.toUpperCase() === 'APPROVED' ? 'Approved' :
      status.toUpperCase() === 'DECLINED' ? 'Declined' : 'Pending'
    ) as 'Approved' | 'Declined' | 'Pending';

    setRegistrations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const generatedCode = r.accreditationCode || `OGH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const passCode = options?.passCode || r.passCode || generatedCode;
          return {
            ...r,
            accreditationStatus: normalizedStatus,
            accreditationCode: generatedCode,
            passCode: normalizedStatus === 'Approved' ? passCode : r.passCode,
            declineReason: normalizedStatus === 'Declined' ? (options?.reason || r.declineReason || 'Capacity reached') : undefined,
            reviewer: 'usiobaifovictory245@gmail.com',
            reviewed_at: new Date().toISOString(),
          };
        }
        return r;
      })
    );

    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          declineReason: options?.reason,
          passCode: options?.passCode,
        }),
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to update registration status on server:', err);
      return false;
    }
  };

  const bulkUpdateRegistrationStatus = async (
    ids: string[],
    status: 'Approved' | 'Declined' | 'Pending',
    reason?: string
  ): Promise<boolean> => {
    const normalized = (
      status.toUpperCase() === 'APPROVED' ? 'Approved' :
      status.toUpperCase() === 'DECLINED' ? 'Declined' : 'Pending'
    ) as 'Approved' | 'Declined' | 'Pending';

    setRegistrations((prev) =>
      prev.map((r) => {
        if (ids.includes(r.id)) {
          const generatedCode = r.accreditationCode || `OGH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const passCode = r.passCode || generatedCode;
          return {
            ...r,
            accreditationStatus: normalized,
            accreditationCode: generatedCode,
            passCode: normalized === 'Approved' ? passCode : r.passCode,
            declineReason: normalized === 'Declined' ? (reason || 'Bulk administrative action') : undefined,
            reviewer: 'usiobaifovictory245@gmail.com',
            reviewed_at: new Date().toISOString(),
          };
        }
        return r;
      })
    );

    try {
      const res = await fetch('/api/registrations/bulk-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status, reason }),
      });
      return res.ok;
    } catch (err) {
      console.error('Failed bulk status update on server:', err);
      return false;
    }
  };

  const deleteRegistration = async (id: string, passcode?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode || '',
        },
        body: JSON.stringify({ passcode: passcode || '' }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setRegistrations((prev) => prev.filter((r) => r.id !== id));
        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || 'Deletion prohibited without administrative confirmation.',
        };
      }
    } catch (err: any) {
      console.error('Failed to delete registration on server:', err);
      return { success: false, message: err.message };
    }
  };

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        updateConfig,
        updateSection,
        updateBrand,
        updateGlobal,
        updateHero,
        updateSummitData,
        updateImpactMetrics,
        updateFlagshipPrograms,
        updateFeaturedVentures,
        updateEvents,
        addEvent,
        deleteEvent,
        addEventCategory,
        deleteEventCategory,
        updateContact,
        updateSettings,
        saveToCloud,
        resetToDefault,
        exportConfigJson,
        isCloudSyncing,
        cloudSaveStatus,
        registrations,
        addRegistration,
        updateRegistrationStatus,
        bulkUpdateRegistrationStatus,
        deleteRegistration,
        refreshRegistrations,
        isLoadingRegistrations,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
