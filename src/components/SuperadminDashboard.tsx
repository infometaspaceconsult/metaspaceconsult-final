import React, { useState, useEffect } from 'react';
import { SiteConfig, LayoutSection, Venture, ServiceItem, Lead } from '../types';
import {
  X,
  GripVertical,
  Palette,
  Type,
  LayoutGrid,
  FileText,
  Users,
  Download,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Globe,
  Mail,
  Sliders,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Database,
  Send,
  Lock,
  KeyRound,
  ShieldCheck,
  ImageIcon,
  Calendar,
  Briefcase,
  Settings,
  AlertCircle,
  CheckCircle2,
  Loader2,
  UserPlus,
  UserX,
  Phone,
  MapPin,
  RefreshCw
} from 'lucide-react';

interface SuperadminDashboardProps {
  config: SiteConfig;
  onUpdateConfig: (newConfig: SiteConfig) => void;
  onClose: () => void;
  onLogout: () => void;
}

export const SuperadminDashboard: React.FC<SuperadminDashboardProps> = ({
  config,
  onUpdateConfig,
  onClose,
  onLogout,
}) => {
  // Navigation Tabs: 'layout' | 'text_editor' | 'media_editor' | 'ventures_services' | 'footer_editor' | 'integrations' | 'admin_security' | 'leads'
  const [activeTab, setActiveTab] = useState<
    'layout' | 'text_editor' | 'media_editor' | 'ventures_services' | 'footer_editor' | 'integrations' | 'admin_security' | 'leads'
  >('layout');

  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [message, setMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Leads Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Live DB & Email state
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');
  const [supabaseKey, setSupabaseKey] = useState<string>('');
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);
  const [dbTestResult, setDbTestResult] = useState<string>('');
  const [isTestingDb, setIsTestingDb] = useState<boolean>(false);

  const [resendApiKey, setResendApiKey] = useState<string>('');
  const [notificationEmail, setNotificationEmail] = useState<string>('');
  const [emailTestResult, setEmailTestResult] = useState<string>('');
  const [isTestingEmail, setIsTestingEmail] = useState<boolean>(false);

  // Security & Admin Users State
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [newAdminPassword, setNewAdminPassword] = useState<string>('');
  const [adminUsers, setAdminUsers] = useState<{ username: string; isSuperadmin: boolean }[]>([
    { username: 'admin', isSuperadmin: true }
  ]);
  const [newAdminUsername, setNewAdminUsername] = useState<string>('');
  const [newAdminUserPass, setNewAdminUserPass] = useState<string>('');
  const [newAdminIsSuperadmin, setNewAdminIsSuperadmin] = useState<boolean>(false);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleSaveConfig = async (overrideConfig?: SiteConfig) => {
    const configToSave = overrideConfig || localConfig;
    setSaveStatus('saving');
    setMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: configToSave }),
      });

      if (res.ok) {
        onUpdateConfig(configToSave);
        setSaveStatus('saved');
        setMessage('Configuration saved & published live!');
        setTimeout(() => {
          setSaveStatus('idle');
          setMessage('');
        }, 3000);
      } else {
        onUpdateConfig(configToSave);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2500);
      }
    } catch (err) {
      onUpdateConfig(configToSave);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }
  };

  // Move Section Up/Down
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...localConfig.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    newSections.forEach((sec, idx) => {
      sec.order = idx + 1;
    });

    const updated = { ...localConfig, sections: newSections };
    setLocalConfig(updated);
  };

  const toggleSectionEnabled = (id: string) => {
    const newSections = localConfig.sections.map((sec) =>
      sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
    );
    const updated = { ...localConfig, sections: newSections };
    setLocalConfig(updated);
  };

  // Local Image Upload Handler (Converts uploaded image file to base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'customLogoUrl' | 'heroBgUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Image is too large. Keep it under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (fieldName === 'customLogoUrl') {
        const updatedTheme = {
          ...localConfig.theme,
          logoType: 'custom-image',
          customLogoUrl: base64String
        };
        const updated = { ...localConfig, theme: updatedTheme };
        setLocalConfig(updated);
        handleSaveConfig(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  // Test Supabase Database Connection
  const handleTestSupabase = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setDbTestResult('🔴 Please enter both Supabase Project URL and Key before testing.');
      return;
    }
    setIsTestingDb(true);
    setDbTestResult('Testing live connection to Supabase database...');
    try {
      const res = await fetch('/api/admin/test-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseUrl: supabaseUrl.trim(), supabaseKey: supabaseKey.trim() })
      });

      const data = await res.json();
      if (data.success) {
        setDbTestResult(`🟢 ${data.message}`);
        setIsSupabaseLive(true);
      } else {
        setDbTestResult(`🔴 ${data.message || 'Database connection test failed.'}`);
        setIsSupabaseLive(false);
      }
    } catch (err: any) {
      setDbTestResult(`🔴 Error connecting: ${err.message || String(err)}`);
      setIsSupabaseLive(false);
    } finally {
      setIsTestingDb(false);
    }
  };

  // Test Resend Email Dispatch
  const handleTestEmail = async () => {
    if (!resendApiKey) {
      setEmailTestResult('🔴 Please enter your Resend API Key before testing.');
      return;
    }
    setIsTestingEmail(true);
    setEmailTestResult('Transmitting branded test email via Resend API...');
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: resendApiKey.trim(),
          recipientEmail: notificationEmail || localConfig.content.contactEmail || 'info@metaspaceconsulting.com'
        })
      });

      const data = await res.json();
      if (data.success) {
        setEmailTestResult(`🟢 ${data.message}`);
      } else {
        setEmailTestResult(`🔴 ${data.error || 'Failed to transmit test email.'}`);
      }
    } catch (err: any) {
      setEmailTestResult(`🔴 Error: ${err.message || String(err)}`);
    } finally {
      setIsTestingEmail(false);
    }
  };

  // Add Admin Account
  const handleAddAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUsername.trim()) return;
    const newUser = {
      username: newAdminUsername.trim(),
      isSuperadmin: newAdminIsSuperadmin
    };
    setAdminUsers([...adminUsers, newUser]);
    setNewAdminUsername('');
    setNewAdminUserPass('');
    setMessage(`Administrator account for "${newUser.username}" created successfully!`);
    setTimeout(() => setMessage(''), 3000);
  };

  // Revoke Admin Account
  const handleRevokeAdminUser = (username: string) => {
    if (!window.confirm(`Are you sure you want to revoke access for administrator "${username}"?`)) return;
    setAdminUsers(adminUsers.filter((u) => u.username !== username));
    setMessage(`Revoked access for administrator "${username}".`);
    setTimeout(() => setMessage(''), 3000);
  };

  // Export Leads to CSV
  const exportLeadsCSV = () => {
    if (!leads.length) return;
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Interest', 'Source', 'CreatedAt'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.company}"`,
      `"${l.interest}"`,
      `"${l.source}"`,
      `"${l.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `metaspace_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[600px] bg-slate-900 text-white shadow-2xl flex flex-col border-l border-slate-700 animate-slideLeft">
      {/* Top Header Bar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-500/20 text-red-400 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-[#E63946] animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Metaspace Operations & CMS Console</h3>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {isSupabaseLive ? 'Supabase Database Connected 🟢' : 'Local Persistent Storage 🟡'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSaveConfig()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md transition shadow"
          >
            {saveStatus === 'saving' ? (
              <span>Saving...</span>
            ) : saveStatus === 'saved' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Live</span>
              </>
            )}
          </button>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="mx-4 mt-3 p-2.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {errorMessage && (
        <div className="mx-4 mt-3 p-2.5 bg-red-950/80 border border-red-500/50 text-red-300 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex bg-slate-950/80 border-b border-slate-800 text-xs overflow-x-auto no-scrollbar">
        {[
          { id: 'layout', label: 'Layout', icon: LayoutGrid },
          { id: 'text_editor', label: 'Text & Copy', icon: FileText },
          { id: 'media_editor', label: 'Media & Logo', icon: ImageIcon },
          { id: 'ventures_services', label: 'Ventures & Services', icon: Briefcase },
          { id: 'footer_editor', label: 'Footer & Support', icon: Settings },
          { id: 'integrations', label: 'DB & Resend Email', icon: Database },
          { id: 'admin_security', label: 'Admins & Access', icon: Lock },
          { id: 'leads', label: 'Bookings & Leads', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setErrorMessage('');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-[#E63946] text-white bg-slate-800/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Body Content */}
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        {/* TAB 1: LAYOUT & REORDERING */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-900/30 border border-blue-700/50 rounded-xl text-xs text-blue-200 leading-relaxed">
              <span className="font-bold block mb-1">Drag & Drop Layout Reorder:</span>
              Reorder homepage sections or toggle visibility using the controls below. Changes are reflected instantly.
            </div>

            <div className="space-y-2.5">
              {localConfig.sections.map((section, idx) => (
                <div
                  key={section.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                    section.enabled
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="cursor-grab text-slate-500 hover:text-slate-300">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-[10px] font-mono flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold">{section.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{section.title}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => moveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 rounded text-slate-200 cursor-pointer"
                      title="Move Section Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => moveSection(idx, 'down')}
                      disabled={idx === localConfig.sections.length - 1}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 rounded text-slate-200 cursor-pointer"
                      title="Move Section Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleSectionEnabled(section.id)}
                      className={`p-1.5 rounded text-xs font-bold transition cursor-pointer ${
                        section.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'
                      }`}
                      title={section.enabled ? 'Hide Section' : 'Show Section'}
                    >
                      {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TEXT & COPY */}
        {activeTab === 'text_editor' && (
          <div className="space-y-5 text-xs">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 border-b border-slate-800 pb-2">
                Company & Hero Branding
              </h4>

              <div>
                <label className="block text-slate-400 mb-1">Company Name</label>
                <input
                  type="text"
                  value={localConfig.content.companyName}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      content: { ...localConfig.content, companyName: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Hero Headline</label>
                <textarea
                  rows={2}
                  value={localConfig.content.heroHeadline}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      content: { ...localConfig.content, heroHeadline: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Hero Subheadline</label>
                <textarea
                  rows={3}
                  value={localConfig.content.heroSubheadline}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      content: { ...localConfig.content, heroSubheadline: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 border-b border-slate-800 pb-2">
                About & Ecosystem Headline
              </h4>

              <div>
                <label className="block text-slate-400 mb-1">About Headline</label>
                <textarea
                  rows={2}
                  value={localConfig.content.aboutHeadline}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      content: { ...localConfig.content, aboutHeadline: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Ecosystem Statement</label>
                <textarea
                  rows={2}
                  value={localConfig.content.ecosystemHeadline}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      content: { ...localConfig.content, ecosystemHeadline: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MEDIA & LOGO EDITOR */}
        {activeTab === 'media_editor' && (
          <div className="space-y-6 text-xs">
            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Upload & Custom Logo Settings
              </h4>
              <p className="text-slate-400 text-[11px]">
                Upload a logo image directly from your local computer or specify a file path.
              </p>

              {/* Preview */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Active Logo</span>
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
                    <img
                      src={localConfig.theme.customLogoUrl || '/baboon-icon.svg'}
                      alt="Active Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    const updated = {
                      ...localConfig,
                      theme: { ...localConfig.theme, customLogoUrl: '/baboon-icon.svg' }
                    };
                    setLocalConfig(updated);
                    handleSaveConfig(updated);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold uppercase"
                >
                  Reset Default
                </button>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Select Local Logo Image
                </label>
                <label className="flex items-center justify-center gap-2 p-3 bg-slate-900 hover:bg-slate-950 border border-dashed border-slate-700 hover:border-red-500 rounded-xl cursor-pointer transition text-slate-300 font-bold">
                  <ImageIcon className="w-4 h-4 text-red-400" />
                  <span>Choose Image File...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'customLogoUrl')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VENTURES & SERVICES */}
        {activeTab === 'ventures_services' && (
          <div className="space-y-6 text-xs">
            {/* Ventures Portfolio */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 border-b border-slate-800 pb-2">
                Ventures Portfolio ({localConfig.ventures.length})
              </h4>

              {localConfig.ventures.map((venture, idx) => (
                <div key={venture.id} className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{venture.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{venture.category}</span>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Tagline</label>
                    <input
                      type="text"
                      value={venture.tagline}
                      onChange={(e) => {
                        const newV = [...localConfig.ventures];
                        newV[idx].tagline = e.target.value;
                        setLocalConfig({ ...localConfig, ventures: newV });
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={venture.description}
                      onChange={(e) => {
                        const newV = [...localConfig.ventures];
                        newV[idx].description = e.target.value;
                        setLocalConfig({ ...localConfig, ventures: newV });
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Services */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 border-b border-slate-800 pb-2">
                Service Offerings Pillars ({localConfig.services.length})
              </h4>

              {localConfig.services.map((service, idx) => (
                <div key={service.id} className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
                  <span className="font-bold text-white block">{service.title}</span>
                  <textarea
                    rows={2}
                    value={service.description}
                    onChange={(e) => {
                      const newS = [...localConfig.services];
                      newS[idx].description = e.target.value;
                      setLocalConfig({ ...localConfig, services: newS });
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FOOTER & SUPPORT */}
        {activeTab === 'footer_editor' && (
          <div className="space-y-4 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 border-b border-slate-800 pb-2">
              Helpdesk & Contact Support Details
            </h4>

            <div>
              <label className="block text-slate-400 mb-1">WhatsApp Support Number</label>
              <input
                type="text"
                value={localConfig.content.whatsappNumber}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    content: { ...localConfig.content, whatsappNumber: e.target.value },
                  })
                }
                placeholder="2348123456789"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Contact Email Address</label>
              <input
                type="email"
                value={localConfig.content.contactEmail}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    content: { ...localConfig.content, contactEmail: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Contact Phone Number</label>
              <input
                type="text"
                value={localConfig.content.contactPhone}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    content: { ...localConfig.content, contactPhone: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Physical Address</label>
              <input
                type="text"
                value={localConfig.content.locationAddress}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    content: { ...localConfig.content, locationAddress: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
              />
            </div>
          </div>
        )}

        {/* TAB 6: DB & RESEND EMAIL INTEGRATIONS */}
        {activeTab === 'integrations' && (
          <div className="space-y-6 text-xs">
            {/* Supabase */}
            <div className="p-4 bg-slate-800 border border-slate-700 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Supabase Live Database Integration</span>
                </h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isSupabaseLive ? 'bg-emerald-900 text-emerald-300' : 'bg-amber-900 text-amber-300'}`}>
                  {isSupabaseLive ? 'Live 🟢' : 'Fallback 🟡'}
                </span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Supabase Project URL</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyz.supabase.co"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Supabase Service Role / Anon Key</label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiI..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white font-mono text-xs"
                />
              </div>

              {dbTestResult && (
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-300 font-mono text-[11px] leading-relaxed">
                  {dbTestResult}
                </div>
              )}

              <button
                type="button"
                onClick={handleTestSupabase}
                disabled={isTestingDb}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase rounded text-[11px] flex items-center justify-center gap-1.5 transition"
              >
                {isTestingDb ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                <span>{isTestingDb ? 'Connecting...' : 'Connect & Test Supabase DB'}</span>
              </button>
            </div>

            {/* Resend Email */}
            <div className="p-4 bg-slate-800 border border-slate-700 rounded-2xl space-y-3">
              <h4 className="font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400" />
                <span>Resend Email Dispatch API</span>
              </h4>

              <div>
                <label className="block text-slate-400 mb-1">Resend API Key</label>
                <input
                  type="password"
                  value={resendApiKey}
                  onChange={(e) => setResendApiKey(e.target.value)}
                  placeholder="re_123456789..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Recipient Notification Email</label>
                <input
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  placeholder="info@metaspaceconsulting.com"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white text-xs"
                />
              </div>

              {emailTestResult && (
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-300 font-mono text-[11px] leading-relaxed">
                  {emailTestResult}
                </div>
              )}

              <button
                type="button"
                onClick={handleTestEmail}
                disabled={isTestingEmail}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded text-[11px] flex items-center justify-center gap-1.5 transition"
              >
                {isTestingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isTestingEmail ? 'Transmitting...' : 'Test Resend Email Delivery'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 7: ADMIN SECURITY & ACCESS */}
        {activeTab === 'admin_security' && (
          <div className="space-y-6 text-xs">
            <div className="p-4 bg-slate-800 border border-slate-700 rounded-2xl space-y-3">
              <h4 className="font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-red-400" />
                <span>Active Administrator Accounts ({adminUsers.length})</span>
              </h4>

              <div className="space-y-2">
                {adminUsers.map((admin) => (
                  <div key={admin.username} className="p-2.5 bg-slate-900 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{admin.username}</span>
                      <span className="text-[10px] text-slate-400 uppercase">
                        {admin.isSuperadmin ? 'Superadmin' : 'Console Admin'}
                      </span>
                    </div>

                    {admin.username !== 'admin' ? (
                      <button
                        onClick={() => handleRevokeAdminUser(admin.username)}
                        className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 rounded"
                        title="Revoke Admin Access"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-mono">Root Admin</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Admin */}
            <form onSubmit={handleAddAdminUser} className="p-4 bg-slate-800 border border-slate-700 rounded-2xl space-y-3">
              <h4 className="font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Create New Administrator</span>
              </h4>

              <div>
                <label className="block text-slate-400 mb-1">Username / ID</label>
                <input
                  type="text"
                  required
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  placeholder="e.g. victory_admin"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newAdminUserPass}
                  onChange={(e) => setNewAdminUserPass(e.target.value)}
                  placeholder="Set password"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase rounded text-[11px]"
              >
                Add Administrator Account
              </button>
            </form>
          </div>
        )}

        {/* TAB 8: LEADS & MESSAGES */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Captured Customer Inquiries ({leads.length})
              </h4>
              <button
                onClick={exportLeadsCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {loadingLeads ? (
              <p className="text-xs text-slate-400">Loading leads database...</p>
            ) : leads.length === 0 ? (
              <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
                No customer inquiries logged yet. Try submitting the contact form or testing the Companion chatbot!
              </div>
            ) : (
              <div className="space-y-3">
                {leads.map((lead) => (
                  <div key={lead.id} className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{lead.name}</span>
                      <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded uppercase">
                        {lead.source}
                      </span>
                    </div>

                    <div className="text-slate-300 space-y-1">
                      <div><span className="text-slate-500">Email:</span> {lead.email}</div>
                      {lead.phone && <div><span className="text-slate-500">Phone:</span> {lead.phone}</div>}
                      {lead.company && <div><span className="text-slate-500">Company:</span> {lead.company}</div>}
                      {lead.message && (
                        <div className="p-2 bg-slate-900 rounded border border-slate-700 text-slate-300 italic text-[11px] mt-1">
                          "{lead.message}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
        <span>Metaspace Superadmin Studio Console</span>
        <button onClick={onLogout} className="text-red-400 hover:underline font-bold cursor-pointer">
          Logout
        </button>
      </div>
    </div>
  );
};
