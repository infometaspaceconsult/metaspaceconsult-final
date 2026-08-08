import React, { useState, useEffect } from 'react';
import { SiteConfig, LayoutSection, Venture, Lead } from '../types';
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
  EyeOff
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
  const [activeTab, setActiveTab] = useState<'layout' | 'design' | 'content' | 'leads' | 'integrations'>('layout');
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  // Fetch leads when opening leads tab
  useEffect(() => {
    if (activeTab === 'leads') {
      fetchLeads();
    }
  }, [activeTab]);

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

  const handleSaveConfig = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: localConfig }),
      });

      if (res.ok) {
        onUpdateConfig(localConfig);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2500);
      }
    } catch (err) {
      console.error('Error saving config:', err);
      // Local state update fallback
      onUpdateConfig(localConfig);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }
  };

  // Section Reordering Helpers (Click & Drag simulation + Up/Down buttons)
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...localConfig.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Recalculate order numbers
    newSections.forEach((sec, idx) => {
      sec.order = idx + 1;
    });

    setLocalConfig({ ...localConfig, sections: newSections });
  };

  const toggleSectionEnabled = (id: string) => {
    const newSections = localConfig.sections.map((sec) =>
      sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
    );
    setLocalConfig({ ...localConfig, sections: newSections });
  };

  // Preset Color Palettes
  const applyColorPreset = (preset: 'metaspace' | 'emerald' | 'indigo' | 'cyber') => {
    let themeObj = { ...localConfig.theme };
    if (preset === 'metaspace') {
      themeObj.primaryNavy = '#141B77';
      themeObj.secondaryRed = '#E63946';
      themeObj.backgroundColor = '#f5faff';
      themeObj.textColor = '#151d22';
    } else if (preset === 'emerald') {
      themeObj.primaryNavy = '#064E3B';
      themeObj.secondaryRed = '#10B981';
      themeObj.backgroundColor = '#F0FDF4';
      themeObj.textColor = '#022C22';
    } else if (preset === 'indigo') {
      themeObj.primaryNavy = '#312E81';
      themeObj.secondaryRed = '#6366F1';
      themeObj.backgroundColor = '#EEF2FF';
      themeObj.textColor = '#1E1B4B';
    } else if (preset === 'cyber') {
      themeObj.primaryNavy = '#0F172A';
      themeObj.secondaryRed = '#F43F5E';
      themeObj.backgroundColor = '#F8FAFC';
      themeObj.textColor = '#020617';
    }
    setLocalConfig({ ...localConfig, theme: themeObj });
  };

  // Export leads as CSV
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
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[540px] bg-slate-900 text-white shadow-2xl flex flex-col border-l border-slate-700 animate-slideLeft">
      {/* Top Header Bar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-500/20 text-red-400 rounded-lg">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Superadmin Layout & Studio</h3>
            <span className="text-[10px] text-emerald-400 font-mono">Regulated Control Active</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveConfig}
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

      {/* Navigation Tabs */}
      <div className="flex bg-slate-950/60 border-b border-slate-800 text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('layout')}
          className={`flex items-center gap-1.5 px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === 'layout' ? 'border-red-500 text-white bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Click & Drag Layout</span>
        </button>

        <button
          onClick={() => setActiveTab('design')}
          className={`flex items-center gap-1.5 px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === 'design' ? 'border-red-500 text-white bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Color & Typography</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-1.5 px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === 'content' ? 'border-red-500 text-white bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Site Content & Ventures</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-1.5 px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === 'leads' ? 'border-red-500 text-white bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Leads & Messages</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        {/* TAB 1: LAYOUT REORDERING */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-900/30 border border-blue-700/50 rounded-xl text-xs text-blue-200 leading-relaxed">
              <span className="font-bold block mb-1">Interactive Layout Editor:</span>
              Superadmin can reorder homepage sections up or down or toggle section visibility. Click <b>"Save Live"</b> to publish changes across all visitors.
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
                    {/* Up/Down Reorder Buttons */}
                    <button
                      onClick={() => moveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 rounded text-slate-200"
                      title="Move Section Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => moveSection(idx, 'down')}
                      disabled={idx === localConfig.sections.length - 1}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 rounded text-slate-200"
                      title="Move Section Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Enable/Disable Section Toggle */}
                    <button
                      onClick={() => toggleSectionEnabled(section.id)}
                      className={`p-1.5 rounded text-xs font-bold transition ${
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

        {/* TAB 2: COLOR & TYPOGRAPHY */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            {/* Color Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Quick Color Theme Presets:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applyColorPreset('metaspace')}
                  className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-left hover:border-red-500 transition text-xs"
                >
                  <span className="font-bold block text-white">Metaspace Classic</span>
                  <div className="flex gap-1 mt-1">
                    <span className="w-3 h-3 rounded-full bg-[#141B77]" />
                    <span className="w-3 h-3 rounded-full bg-[#E63946]" />
                    <span className="w-3 h-3 rounded-full bg-[#f5faff]" />
                  </div>
                </button>

                <button
                  onClick={() => applyColorPreset('emerald')}
                  className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-left hover:border-emerald-500 transition text-xs"
                >
                  <span className="font-bold block text-white">Corporate Emerald</span>
                  <div className="flex gap-1 mt-1">
                    <span className="w-3 h-3 rounded-full bg-[#064E3B]" />
                    <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                    <span className="w-3 h-3 rounded-full bg-[#F0FDF4]" />
                  </div>
                </button>

                <button
                  onClick={() => applyColorPreset('indigo')}
                  className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-left hover:border-indigo-500 transition text-xs"
                >
                  <span className="font-bold block text-white">Royal Indigo</span>
                  <div className="flex gap-1 mt-1">
                    <span className="w-3 h-3 rounded-full bg-[#312E81]" />
                    <span className="w-3 h-3 rounded-full bg-[#6366F1]" />
                    <span className="w-3 h-3 rounded-full bg-[#EEF2FF]" />
                  </div>
                </button>

                <button
                  onClick={() => applyColorPreset('cyber')}
                  className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-left hover:border-rose-500 transition text-xs"
                >
                  <span className="font-bold block text-white">Cyber Dark</span>
                  <div className="flex gap-1 mt-1">
                    <span className="w-3 h-3 rounded-full bg-[#0F172A]" />
                    <span className="w-3 h-3 rounded-full bg-[#F43F5E]" />
                    <span className="w-3 h-3 rounded-full bg-[#F8FAFC]" />
                  </div>
                </button>
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Custom Color Pickers</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Primary Navy Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localConfig.theme.primaryNavy}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          theme: { ...localConfig.theme, primaryNavy: e.target.value },
                        })
                      }
                      className="w-8 h-8 rounded border border-slate-600 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300">{localConfig.theme.primaryNavy}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Innovation Red Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localConfig.theme.secondaryRed}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          theme: { ...localConfig.theme, secondaryRed: e.target.value },
                        })
                      }
                      className="w-8 h-8 rounded border border-slate-600 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300">{localConfig.theme.secondaryRed}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Customizer */}
            <div className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Logo Selection</h4>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="logoType"
                    checked={localConfig.theme.logoType === 'default-image3'}
                    onChange={() =>
                      setLocalConfig({
                        ...localConfig,
                        theme: { ...localConfig.theme, logoType: 'default-image3' },
                      })
                    }
                  />
                  <span>Default Image 3 Logo (Official METASPACE M Vector)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="logoType"
                    checked={localConfig.theme.logoType === 'custom-image'}
                    onChange={() =>
                      setLocalConfig({
                        ...localConfig,
                        theme: { ...localConfig.theme, logoType: 'custom-image' },
                      })
                    }
                  />
                  <span>Custom Image URL Logo</span>
                </label>

                {localConfig.theme.logoType === 'custom-image' && (
                  <input
                    type="text"
                    value={localConfig.theme.customLogoUrl || ''}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        theme: { ...localConfig.theme, customLogoUrl: e.target.value },
                      })
                    }
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SITE CONTENT & VENTURES */}
        {activeTab === 'content' && (
          <div className="space-y-5 text-xs">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">Main Headlines</h4>

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
                <label className="block text-slate-400 mb-1">Hero Main Headline</label>
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

            {/* Ventures Editor */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">Ventures Portfolio</h4>
              </div>

              {localConfig.ventures.map((venture, vIdx) => (
                <div key={venture.id} className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{venture.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{venture.category}</span>
                  </div>

                  <input
                    type="text"
                    value={venture.tagline}
                    onChange={(e) => {
                      const newV = [...localConfig.ventures];
                      newV[vIdx].tagline = e.target.value;
                      setLocalConfig({ ...localConfig, ventures: newV });
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LEADS & MESSAGES */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Captured Customer Leads ({leads.length})
              </h4>
              <button
                onClick={exportLeadsCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {loadingLeads ? (
              <p className="text-xs text-slate-400">Loading leads database...</p>
            ) : leads.length === 0 ? (
              <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
                No customer inquiries logged yet. Try testing the Companion AI chatbot or Contact form!
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
        <span>Metaspace Superadmin Studio</span>
        <button onClick={onLogout} className="text-red-400 hover:underline font-bold">
          Logout
        </button>
      </div>
    </div>
  );
};
