import React, { useState } from "react";
import { Venture } from "../types";
import { Plus, Edit2, Trash2, Check, X, Sparkles, FolderPlus, Info } from "lucide-react";

interface VentureManagerProps {
  ventures: Venture[];
  onAddVenture: (v: Omit<Venture, "id">) => void;
  onUpdateVenture: (v: Venture) => void;
  onDeleteVenture: (id: number) => void;
}

export default function VentureManager({
  ventures,
  onAddVenture,
  onUpdateVenture,
  onDeleteVenture
}: VentureManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("EdTech");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("school");
  const [tagsStr, setTagsStr] = useState("");

  const resetForm = () => {
    setName("");
    setCategory("EdTech");
    setDescription("");
    setIcon("school");
    setTagsStr("");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    const tags = tagsStr
      ? tagsStr.split(",").map(t => t.trim()).filter(t => t.length > 0)
      : [category];

    onAddVenture({
      name: name.trim(),
      category,
      description: description.trim(),
      icon,
      tags
    });

    setIsAdding(false);
    resetForm();
  };

  const startEdit = (v: Venture) => {
    setEditingId(v.id);
    setName(v.name);
    setCategory(v.category);
    setDescription(v.description);
    setIcon(v.icon);
    setTagsStr(v.tags.join(", "));
  };

  const handleUpdate = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    const tags = tagsStr
      ? tagsStr.split(",").map(t => t.trim()).filter(t => t.length > 0)
      : [category];

    onUpdateVenture({
      id,
      name: name.trim(),
      category,
      description: description.trim(),
      icon,
      tags
    });

    setEditingId(null);
    resetForm();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8" id="venture-manager-board">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-deep-navy font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-innovation-red" />
            Venture Portfolio Builder
          </h2>
          <p className="text-xs text-slate-500 mt-1">Add, edit, or remove ventures in your portfolio. Your SQL database seed is generated in real-time.</p>
        </div>
        {!isAdding && editingId === null && (
          <button
            onClick={() => { setIsAdding(true); resetForm(); }}
            className="self-start sm:self-auto bg-deep-navy hover:bg-opacity-95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Venture
          </button>
        )}
      </div>

      {/* Adding/Editing Forms */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-slate-50 border border-slate-100 rounded-xl p-6 mb-8 relative">
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-bold text-sm text-deep-navy uppercase tracking-wider mb-4 flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-innovation-red" />
            New Venture Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Venture Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AgriGrow"
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Sector/Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
              >
                <option value="EdTech">EdTech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="Logistics">Logistics</option>
                <option value="FinTech">FinTech</option>
                <option value="AgriTech">AgriTech</option>
                <option value="Incubator">Incubator</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Material Icon Name</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy font-mono"
              >
                <option value="school">school (EdTech)</option>
                <option value="rocket_launch">rocket_launch (Accelerator)</option>
                <option value="directions_bus">directions_bus (Transportation)</option>
                <option value="favorite">favorite (Healthcare)</option>
                <option value="agriculture">agriculture (AgriTech)</option>
                <option value="account_balance">account_balance (FinTech)</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Short Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief explanation of what this venture does and the problems it solves..."
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Core Tags (comma separated)</label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="e.g. Smart Logistics, Safety Tracking, IoT"
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-innovation-red hover:bg-opacity-95 text-white font-semibold text-xs px-4 py-2 rounded-lg"
            >
              Add Venture Profile
            </button>
            <button
              type="button"
              onClick={() => { setIsAdding(false); resetForm(); }}
              className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-xs px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {editingId !== null && (
        <form onSubmit={(e) => handleUpdate(e, editingId)} className="bg-amber-50/50 border border-amber-200 rounded-xl p-6 mb-8 relative">
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-bold text-sm text-deep-navy uppercase tracking-wider mb-4 flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-amber-600" />
            Edit Venture: {ventures.find(v => v.id === editingId)?.name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Venture Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Sector/Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
              >
                <option value="EdTech">EdTech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="Logistics">Logistics</option>
                <option value="FinTech">FinTech</option>
                <option value="AgriTech">AgriTech</option>
                <option value="Incubator">Incubator</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Material Icon Name</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy font-mono"
              >
                <option value="school">school (EdTech)</option>
                <option value="rocket_launch">rocket_launch (Accelerator)</option>
                <option value="directions_bus">directions_bus (Transportation)</option>
                <option value="favorite">favorite (Healthcare)</option>
                <option value="agriculture">agriculture (AgriTech)</option>
                <option value="account_balance">account_balance (FinTech)</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Short Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Core Tags (comma separated)</label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-4 py-2 rounded-lg"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => { setEditingId(null); resetForm(); }}
              className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-xs px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Ventures Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ventures.map(v => (
          <div key={v.id} className="border border-slate-100 rounded-xl p-5 hover:border-slate-200 transition-all bg-white card-shadow flex items-start justify-between gap-4 group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface-ice flex items-center justify-center text-deep-navy shrink-0">
                <span className="material-symbols-outlined text-2xl font-bold">{v.icon}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-deep-navy text-sm font-display">{v.name}</h4>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{v.category}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{v.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {v.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-semibold bg-surface-container-low text-deep-navy/80 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => startEdit(v)}
                className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-amber-600 rounded-lg transition-colors"
                title="Edit Venture"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteVenture(v.id)}
                className="p-1.5 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                title="Delete Venture"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-900 text-xs leading-relaxed">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Real-time DB Generation</span>: Adding or editing ventures updates your custom <code className="bg-white/70 px-1 rounded font-mono text-amber-950">setup.sql</code> schema automatically! Just import the updated SQL script into phpMyAdmin on cPanel to synchronize changes.
        </div>
      </div>
    </div>
  );
}
