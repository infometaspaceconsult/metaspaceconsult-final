import React, { useState } from 'react';
import {
  SiteConfig,
  AdvisoryCouncilMemberConfig,
  DealRoomArchitectureConfig,
  ExecutiveMasterclassConfig,
  VenturePavilionConfig,
  PartnershipTierConfig,
  StrategicPillarConfig,
} from '../../data/siteConfig';
import { MediaAssetController } from './MediaAssetController';
import {
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  Store,
  Award,
  Layers,
  Plus,
  Trash2,
  Edit2,
  Check,
  Sparkles,
  ArrowUp,
  ArrowDown,
  X,
} from 'lucide-react';

interface SummitPageCMSProps {
  formData: SiteConfig;
  onChange: (updated: Partial<SiteConfig>) => void;
  activeSubSection?: string;
}

export const SummitPageCMS: React.FC<SummitPageCMSProps> = ({
  formData,
  onChange,
  activeSubSection,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'hero' | 'council' | 'pillars' | 'dealroom' | 'masterclasses' | 'pavilion' | 'tiers'
  >('hero');

  React.useEffect(() => {
    if (activeSubSection) {
      const valid = ['hero', 'council', 'pillars', 'dealroom', 'masterclasses', 'pavilion', 'tiers'];
      if (valid.includes(activeSubSection)) {
        setActiveSubTab(activeSubSection as any);
      }
    }
  }, [activeSubSection]);

  const summitData = formData.summitData;
  const council = formData.advisoryCouncil || [];
  const pillars = summitData.pillars || [];
  const dealRooms = formData.dealRoomArchitecture || [];
  const masterclasses = formData.executiveMasterclasses || [];
  const pavilion = formData.venturePavilion || [];
  const tiers = formData.partnershipTiers || [];

  // Council Member state (Add & Edit)
  const [newMember, setNewMember] = useState<AdvisoryCouncilMemberConfig>({
    id: `c-${Date.now()}`,
    name: '',
    title: '',
    affiliation: '',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: '',
  });
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<AdvisoryCouncilMemberConfig | null>(null);

  const handleSaveNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;
    onChange({
      advisoryCouncil: [
        ...council,
        { ...newMember, id: `c-${Date.now()}` },
      ],
    });
    setIsAddingMember(false);
    setNewMember({
      id: `c-${Date.now()}`,
      name: '',
      title: '',
      affiliation: '',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: '',
    });
  };

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name.trim()) return;
    const updated = council.map((m) => (m.id === editingMember.id ? editingMember : m));
    onChange({ advisoryCouncil: updated });
    setEditingMember(null);
  };

  const handleMoveMember = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= council.length) return;
    const updated = [...council];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange({ advisoryCouncil: updated });
  };

  const handleRemoveMember = (id: string) => {
    onChange({
      advisoryCouncil: council.filter((m) => m.id !== id),
    });
  };

  return (
    <div className="space-y-8">
      {/* SECTION HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-[#06132b] flex items-center gap-2">
          <Building2 className="w-5 h-5 text-red-600" />
          <span>Oghowa Business Week Summit Page CMS (`/business-week`)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Institutional steering committee, 4 strategic pillars, bilateral deal-room agendas, executive masterclasses, venture pavilion, and partnership tiers.
        </p>
      </div>

      {/* SUB-SECTION TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'hero', label: '1. Summit Hero & Agendas', icon: Sparkles },
          { id: 'council', label: '2. Advisory Council Roster', icon: Users },
          { id: 'pillars', label: '3. 4 Strategic Pillars', icon: Layers },
          { id: 'dealroom', label: '4. Deal-Room Architecture', icon: Briefcase },
          { id: 'masterclasses', label: '5. Executive Masterclasses', icon: GraduationCap },
          { id: 'pavilion', label: '6. Venture Pavilion', icon: Store },
          { id: 'tiers', label: '7. Partnership Tiers', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. SUMMIT HERO & AGENDAS */}
      {activeSubTab === 'hero' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>Summit Strategic Copy & Agendas Overview</span>
            </h3>
            <p className="text-xs text-slate-500">
              Institutional executive overviews displayed on the Business Week Summit page.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Advisory Council Roster Overview Description
              </label>
              <textarea
                rows={3}
                value={summitData.advisoryCouncilText}
                onChange={(e) =>
                  onChange({
                    summitData: { ...summitData, advisoryCouncilText: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sovereign Anchors & Industrial Sponsors Overview
              </label>
              <textarea
                rows={3}
                value={summitData.ecosystemAnchorsText}
                onChange={(e) =>
                  onChange({
                    summitData: { ...summitData, ecosystemAnchorsText: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                The Deal-Room Agendas & Syndicate Scope
              </label>
              <textarea
                rows={3}
                value={summitData.dealRoomAgendasText}
                onChange={(e) =>
                  onChange({
                    summitData: { ...summitData, dealRoomAgendasText: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. ADVISORY COUNCIL ROSTER */}
      {activeSubTab === 'council' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-red-600" />
                <span>Advisory Council & Steering Committee Roster</span>
              </h3>
              <p className="text-xs text-slate-500">
                Institutional dignitaries, chairmen, managing directors, and academic deans.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingMember(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Council Member</span>
            </button>
          </div>

          {/* Add Member Form */}
          {isAddingMember && (
            <form onSubmit={handleSaveNewMember} className="p-4 bg-red-50/50 border border-red-200 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-red-900">Add Steering Committee Dignitary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name & Title</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="e.g. Dr. Osahon Imasuen"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Institutional Position</label>
                  <input
                    type="text"
                    value={newMember.title}
                    onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
                    placeholder="e.g. Chairman, Edo Economic Council"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Affiliation / Organization</label>
                  <input
                    type="text"
                    value={newMember.affiliation}
                    onChange={(e) => setNewMember({ ...newMember, affiliation: e.target.value })}
                    placeholder="e.g. Former Deputy Governor, Central Bank Technical Group"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <MediaAssetController
                    label="Headshot Portrait Photo URL"
                    value={newMember.photoUrl}
                    onChange={(url) => setNewMember({ ...newMember, photoUrl: url })}
                    recommendedAspect="1:1 Square"
                    helperText="High-res portrait headshot for the official advisory roster."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Brief Bio Note</label>
                  <textarea
                    rows={2}
                    value={newMember.bio || ''}
                    onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Save Member
                </button>
              </div>
            </form>
          )}

          {/* Edit Member Modal */}
          {editingMember && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Edit Steering Committee Member: {editingMember.name}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateMember} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name & Title</label>
                      <input
                        type="text"
                        value={editingMember.name}
                        onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Institutional Position</label>
                      <input
                        type="text"
                        value={editingMember.title}
                        onChange={(e) => setEditingMember({ ...editingMember, title: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Affiliation / Organization</label>
                      <input
                        type="text"
                        value={editingMember.affiliation}
                        onChange={(e) => setEditingMember({ ...editingMember, affiliation: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <MediaAssetController
                        label="Headshot Portrait Photo URL / File Upload"
                        value={editingMember.photoUrl}
                        onChange={(url) => setEditingMember({ ...editingMember, photoUrl: url })}
                        recommendedAspect="1:1 Square"
                        helperText="Upload or drag-and-drop a portrait photo. Changes apply immediately to the summit roster."
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Brief Bio Note</label>
                      <textarea
                        rows={3}
                        value={editingMember.bio || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingMember(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                    >
                      Update Member
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Members List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {council.map((mem, idx) => (
              <div key={mem.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex gap-3 items-start relative hover:border-slate-300 transition-colors">
                <img
                  src={mem.photoUrl}
                  alt={mem.name}
                  className="w-16 h-16 rounded-lg object-cover border border-slate-300 shrink-0 bg-white"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-slate-900 truncate">{mem.name}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveMember(idx, 'up')}
                        className={`p-1 rounded text-slate-400 hover:text-slate-800 cursor-pointer ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === council.length - 1}
                        onClick={() => handleMoveMember(idx, 'down')}
                        className={`p-1 rounded text-slate-400 hover:text-slate-800 cursor-pointer ${idx === council.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingMember({ ...mem })}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
                        title="Edit member details & picture"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(mem.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-red-600 leading-tight">{mem.title}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{mem.affiliation}</div>
                  {mem.bio && <p className="text-[10px] text-slate-600 line-clamp-2 mt-1">{mem.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 4 STRATEGIC PILLARS */}
      {activeSubTab === 'pillars' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-600" />
              <span>4 Strategic Pillars Editor</span>
            </h3>
            <p className="text-xs text-slate-500">
              Capital Deployment, Industrialization & Value Chains, Cultural Commerce, and Infrastructure Transition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pillars.map((pillar, idx) => (
              <div key={pillar.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                    Pillar #{idx + 1}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{pillar.id}</span>
                </div>
                <input
                  type="text"
                  value={pillar.title}
                  onChange={(e) => {
                    const updated = [...pillars];
                    updated[idx] = { ...pillar, title: e.target.value };
                    onChange({ summitData: { ...summitData, pillars: updated } });
                  }}
                  className="w-full px-2.5 py-1 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                />
                <textarea
                  rows={3}
                  value={pillar.desc}
                  onChange={(e) => {
                    const updated = [...pillars];
                    updated[idx] = { ...pillar, desc: e.target.value };
                    onChange({ summitData: { ...summitData, pillars: updated } });
                  }}
                  className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white text-slate-600"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. THE DEAL-ROOM ARCHITECTURE */}
      {activeSubTab === 'dealroom' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-red-600" />
              <span>The Deal-Room Architecture</span>
            </h3>
            <p className="text-xs text-slate-500">
              Private Institutional LP/GP Boardrooms, Series A+ Venture Showcase, Sovereign-Private Industrial Roundtables.
            </p>
          </div>

          <div className="space-y-4">
            {dealRooms.map((room, idx) => (
              <div key={room.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                  <span>{room.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{room.id}</span>
                </div>
                <textarea
                  rows={2}
                  value={room.description}
                  onChange={(e) => {
                    const updated = [...dealRooms];
                    updated[idx] = { ...room, description: e.target.value };
                    onChange({ dealRoomArchitecture: updated });
                  }}
                  className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                />
                <div>
                  <span className="text-[10px] font-bold text-slate-700">Target Participants:</span>
                  <input
                    type="text"
                    value={room.participants}
                    onChange={(e) => {
                      const updated = [...dealRooms];
                      updated[idx] = { ...room, participants: e.target.value };
                      onChange({ dealRoomArchitecture: updated });
                    }}
                    className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white mt-0.5"
                  />
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {room.deliverables.map((del, dIdx) => (
                    <span key={dIdx} className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                      ✓ {del}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. EXECUTIVE MASTERCLASSES */}
      {activeSubTab === 'masterclasses' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-red-600" />
              <span>Executive Masterclasses</span>
            </h3>
            <p className="text-xs text-slate-500">
              Corporate Governance & Board Architecture, AfCFTA Trade Facilitation, Industrial Automation & ERPs.
            </p>
          </div>

          <div className="space-y-4">
            {masterclasses.map((mc, idx) => (
              <div key={mc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <input
                  type="text"
                  value={mc.title}
                  onChange={(e) => {
                    const updated = [...masterclasses];
                    updated[idx] = { ...mc, title: e.target.value };
                    onChange({ executiveMasterclasses: updated });
                  }}
                  className="w-full px-2.5 py-1 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                />
                <input
                  type="text"
                  value={mc.targetAudience}
                  onChange={(e) => {
                    const updated = [...masterclasses];
                    updated[idx] = { ...mc, targetAudience: e.target.value };
                    onChange({ executiveMasterclasses: updated });
                  }}
                  className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white text-slate-600"
                />
                <div className="space-y-1 pt-1">
                  {mc.curriculum.map((curr, cIdx) => (
                    <div key={cIdx} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{curr}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. VENTURE PAVILION */}
      {activeSubTab === 'pavilion' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-red-600" />
              <span>Oghowa Venture Pavilion</span>
            </h3>
            <p className="text-xs text-slate-500">
              Startup Alley, Executive Talent Hub & Developer Lounge, Industrial Tech & Clean Energy Showcase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {pavilion.map((pav, idx) => (
              <div key={pav.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <input
                  type="text"
                  value={pav.title}
                  onChange={(e) => {
                    const updated = [...pavilion];
                    updated[idx] = { ...pav, title: e.target.value };
                    onChange({ venturePavilion: updated });
                  }}
                  className="w-full px-2 py-1 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                />
                <textarea
                  rows={3}
                  value={pav.description}
                  onChange={(e) => {
                    const updated = [...pavilion];
                    updated[idx] = { ...pav, description: e.target.value };
                    onChange({ venturePavilion: updated });
                  }}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white text-slate-600"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {pav.innovations.map((inn, iIdx) => (
                    <span key={iIdx} className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded">
                      {inn}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. PARTNERSHIP TIERS */}
      {activeSubTab === 'tiers' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-red-600" />
              <span>Partnership Tiers & Deliverables Matrix</span>
            </h3>
            <p className="text-xs text-slate-500">
              Sovereign Anchor, Strategic Industrial Partner, and Ecosystem Enabler deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((tier, idx) => (
              <div key={tier.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                    {tier.badgeText}
                  </span>
                </div>
                <input
                  type="text"
                  value={tier.tierName}
                  onChange={(e) => {
                    const updated = [...tiers];
                    updated[idx] = { ...tier, tierName: e.target.value };
                    onChange({ partnershipTiers: updated });
                  }}
                  className="w-full px-2.5 py-1 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                />
                <input
                  type="text"
                  value={tier.investmentTier}
                  onChange={(e) => {
                    const updated = [...tiers];
                    updated[idx] = { ...tier, investmentTier: e.target.value };
                    onChange({ partnershipTiers: updated });
                  }}
                  className="w-full px-2.5 py-1 text-xs font-mono font-bold text-red-700 border border-slate-300 rounded-lg bg-white"
                />
                <div className="space-y-1">
                  {tier.deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
