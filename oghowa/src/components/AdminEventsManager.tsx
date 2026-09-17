import React, { useState, useMemo, useEffect } from 'react';
import { EventItem, EventRegistration, EventCategoryItem } from '../types';
import { useSiteConfig } from '../context/SiteConfigContext';
import { MediaAssetController } from './admin/MediaAssetController';
import {
  Calendar,
  Users,
  ShieldCheck,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  MapPin,
  Lock,
  Eye,
  FileText,
  ShieldAlert,
  KeyRound,
  X,
  Sparkles,
  Tag,
  Check,
  QrCode,
  Printer,
  ChevronDown,
  CloudUpload,
} from 'lucide-react';

export interface AdminEventsManagerProps {
  initialSubTab?: 'roster' | 'events' | 'categories' | string;
  onSubTabChange?: (tab: 'roster' | 'events' | 'categories') => void;
}

export const AdminEventsManager: React.FC<AdminEventsManagerProps> = ({
  initialSubTab = 'roster',
  onSubTabChange,
}) => {
  const {
    config,
    updateEvents,
    addEvent,
    deleteEvent,
    addEventCategory,
    deleteEventCategory,
    registrations,
    updateRegistrationStatus,
    bulkUpdateRegistrationStatus,
    deleteRegistration,
    refreshRegistrations,
    isLoadingRegistrations,
    saveToCloud,
  } = useSiteConfig();

  const events = config.events || [];
  
  // Normalize categories so whether config.eventCategories has strings or objects, it always conforms to EventCategoryItem with stable unique keys
  const categories: EventCategoryItem[] = useMemo(() => {
    const raw = config.eventCategories && config.eventCategories.length > 0
      ? config.eventCategories
      : [
          'Summit & Deal-Rooms',
          'Founder Sprints',
          'Masterclasses & Workshops',
          'Investor Roundtables',
        ];

    return (raw as any[]).map((c: any, index: number) => {
      if (typeof c === 'string') {
        const id = `cat-${index}-${c.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        let badgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
        const lower = c.toLowerCase();
        if (lower.includes('summit') || lower.includes('deal')) {
          badgeColor = 'bg-red-50 text-[#D9232A] border-red-200';
        } else if (lower.includes('sprint') || lower.includes('founder') || lower.includes('hackathon')) {
          badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
        } else if (lower.includes('masterclass') || lower.includes('workshop')) {
          badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
        } else if (lower.includes('investor') || lower.includes('roundtable')) {
          badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        }
        return {
          id,
          name: c,
          badgeColor,
        };
      }
      return {
        id: c.id || `cat-${index}-${(c.name || 'category').toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: c.name || `Category ${index + 1}`,
        badgeColor: c.badgeColor || 'bg-purple-50 text-purple-700 border-purple-200',
        isDefault: c.isDefault,
      };
    });
  }, [config.eventCategories]);

  // Active sub-view within manager: 'roster' | 'events' | 'categories'
  const [subTab, setSubTab] = useState<'roster' | 'events' | 'categories'>(() => {
    if (initialSubTab === 'categories' || initialSubTab === 'events' || initialSubTab === 'roster') {
      return initialSubTab as 'roster' | 'events' | 'categories';
    }
    return 'roster';
  });

  useEffect(() => {
    if (initialSubTab === 'categories' || initialSubTab === 'events' || initialSubTab === 'roster') {
      setSubTab(initialSubTab as 'roster' | 'events' | 'categories');
    }
  }, [initialSubTab]);

  const handleSubTabSwitch = (newTab: 'roster' | 'events' | 'categories') => {
    setSubTab(newTab);
    if (onSubTabChange) {
      onSubTabChange(newTab);
    }
  };

  // Multi-selection for bulk accreditation
  const [selectedRegIds, setSelectedRegIds] = useState<string[]>([]);

  // Category Manager modal / panel state
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('bg-purple-50 text-purple-700 border-purple-200');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isSavingCategories, setIsSavingCategories] = useState(false);

  // Protected Namespace Deletion State (Non-Destructive Policy)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'registration' | 'event';
    id: string;
    title: string;
  } | null>(null);
  const [deletePasscode, setDeletePasscode] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Decline Reason Modal State
  const [declineModalTarget, setDeclineModalTarget] = useState<{
    id?: string;
    isBulk?: boolean;
    name?: string;
  } | null>(null);
  const [declinePresetReason, setDeclinePresetReason] = useState(
    'Capacity limit reached for requested attendee track'
  );
  const [declineCustomNote, setDeclineCustomNote] = useState('');

  // Verifiable Pass View Modal
  const [viewingPassDelegate, setViewingPassDelegate] = useState<EventRegistration | null>(null);

  // Roster filters & search
  const [rosterSearch, setRosterSearch] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('ALL');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [viewingDelegate, setViewingDelegate] = useState<EventRegistration | null>(null);

  // Notification Banner
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Convenings Category Filter
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('ALL');

  const filteredEvents = useMemo(() => {
    if (eventCategoryFilter === 'ALL') return events;
    return events.filter((e) => e.category === eventCategoryFilter);
  }, [events, eventCategoryFilter]);

  // Event Edit / Create Form state
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Structured Date & Time Picker State
  const [dateSelectionMode, setDateSelectionMode] = useState<'single' | 'range'>('range');
  const [formStartDate, setFormStartDate] = useState('2026-11-18');
  const [formEndDate, setFormEndDate] = useState('2026-11-21');
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('17:30');
  const [formTimezone, setFormTimezone] = useState('WAT');

  const [eventForm, setEventForm] = useState<{
    title: string;
    category: string;
    badge: string;
    date: string;
    startDate?: string;
    endDate?: string;
    time: string;
    startTime?: string;
    endTime?: string;
    timezone?: string;
    location: string;
    track: string;
    description: string;
    capacityLimit: number;
    status: 'Registration Open' | 'Limited Seats' | 'Vetting Required' | 'Registration Closed';
    bannerImageUrl: string;
    isFeatured: boolean;
  }>({
    title: '',
    category: 'Summit & Deal-Rooms',
    badge: 'Registration Open',
    date: 'November 18–21, 2026',
    startDate: '2026-11-18',
    endDate: '2026-11-21',
    time: '09:00 AM - 05:30 PM WAT',
    startTime: '09:00',
    endTime: '17:30',
    timezone: 'WAT',
    location: 'The Heritage Hall & Innovation Hub, Benin City',
    track: 'Institutional Investors & Founders',
    description: '',
    capacityLimit: 150,
    status: 'Registration Open',
    bannerImageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80',
    isFeatured: true,
  });

  // Helper to compile date string
  const compileDateString = (start: string, end: string, mode: 'single' | 'range') => {
    if (!start) return '';
    try {
      const s = new Date(start);
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const startMonth = months[s.getUTCMonth()];
      const startDay = s.getUTCDate();
      const startYear = s.getUTCFullYear();

      if (mode === 'single' || !end || start === end) {
        return `${startMonth} ${startDay}, ${startYear}`;
      }

      const e = new Date(end);
      const endMonth = months[e.getUTCMonth()];
      const endDay = e.getUTCDate();
      const endYear = e.getUTCFullYear();

      if (startYear === endYear && startMonth === endMonth) {
        return `${startMonth} ${startDay}–${endDay}, ${startYear}`;
      } else if (startYear === endYear) {
        return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
      } else {
        return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
      }
    } catch {
      return start;
    }
  };

  // Helper to compile time string
  const compileTimeString = (start: string, end: string, tz: string) => {
    const formatTime = (timeStr: string) => {
      if (!timeStr) return '';
      const [hStr, mStr] = timeStr.split(':');
      let h = parseInt(hStr, 10);
      const m = mStr || '00';
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      if (h === 0) h = 12;
      return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
    };

    const formattedStart = formatTime(start);
    const formattedEnd = formatTime(end);

    if (formattedStart && formattedEnd) {
      return `${formattedStart} - ${formattedEnd} ${tz}`;
    }
    return `${formattedStart || start} ${tz}`;
  };

  // Automated Metrics
  const metrics = useMemo(() => {
    const totalDelegates = registrations.length;
    const pendingDealRoom = registrations.filter(
      (r) => r.qualifications?.requestDealRoom && r.accreditationStatus === 'Pending'
    ).length;
    const totalApproved = registrations.filter((r) => r.accreditationStatus === 'Approved').length;
    const totalDeclined = registrations.filter((r) => r.accreditationStatus === 'Declined').length;
    const totalPending = registrations.filter((r) => r.accreditationStatus === 'Pending').length;

    return {
      totalDelegates,
      pendingDealRoom,
      totalApproved,
      totalDeclined,
      totalPending,
    };
  }, [registrations]);

  // Extract distinct tracks for filter
  const distinctTracks = useMemo(() => {
    const tracks = new Set<string>();
    registrations.forEach((r) => {
      if (r.track) tracks.add(r.track);
    });
    return Array.from(tracks);
  }, [registrations]);

  // Filtered Roster
  const filteredRoster = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesEvent =
        selectedEventFilter === 'ALL' || reg.eventId === selectedEventFilter;
      const matchesTrack =
        selectedTrackFilter === 'ALL' || reg.track === selectedTrackFilter;
      const matchesStatus =
        selectedStatusFilter === 'ALL' || reg.accreditationStatus === selectedStatusFilter;

      const q = rosterSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        reg.fullName.toLowerCase().includes(q) ||
        reg.email.toLowerCase().includes(q) ||
        (reg.organization || '').toLowerCase().includes(q) ||
        (reg.accreditationCode || '').toLowerCase().includes(q) ||
        (reg.eventTitle || '').toLowerCase().includes(q);

      return matchesEvent && matchesTrack && matchesStatus && matchesSearch;
    });
  }, [registrations, selectedEventFilter, selectedTrackFilter, selectedStatusFilter, rosterSearch]);

  // Select all filtered handler
  const handleToggleSelectAll = () => {
    if (selectedRegIds.length === filteredRoster.length) {
      setSelectedRegIds([]);
    } else {
      setSelectedRegIds(filteredRoster.map((r) => r.id));
    }
  };

  // Toggle single delegate selection
  const handleToggleSelect = (id: string) => {
    setSelectedRegIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Approve single pass
  const handleApprovePass = async (reg: EventRegistration) => {
    const passCode = reg.accreditationCode || `OGH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const success = await updateRegistrationStatus(reg.id, 'Approved', { passCode });
    if (success) {
      showNotification('success', `Accreditation pass approved for ${reg.fullName} (${passCode}).`);
    } else {
      showNotification('error', 'Could not sync accreditation pass to server.');
    }
  };

  // Open decline modal
  const handleOpenDeclineModal = (reg: EventRegistration) => {
    setDeclineModalTarget({ id: reg.id, name: reg.fullName, isBulk: false });
    setDeclineCustomNote('');
  };

  // Open bulk decline modal
  const handleOpenBulkDeclineModal = () => {
    if (selectedRegIds.length === 0) return;
    setDeclineModalTarget({ isBulk: true });
    setDeclineCustomNote('');
  };

  // Confirm decline submission
  const handleConfirmDecline = async () => {
    const finalReason = declineCustomNote.trim()
      ? `${declinePresetReason}: ${declineCustomNote.trim()}`
      : declinePresetReason;

    if (declineModalTarget?.isBulk) {
      const success = await bulkUpdateRegistrationStatus(selectedRegIds, 'Declined', finalReason);
      if (success) {
        showNotification('success', `Declined ${selectedRegIds.length} delegate passes.`);
        setSelectedRegIds([]);
      } else {
        showNotification('error', 'Failed to update passes in bulk.');
      }
    } else if (declineModalTarget?.id) {
      const success = await updateRegistrationStatus(declineModalTarget.id, 'Declined', {
        reason: finalReason,
      });
      if (success) {
        showNotification('success', `Accreditation declined for ${declineModalTarget.name}.`);
      } else {
        showNotification('error', 'Could not sync decline status.');
      }
    }

    setDeclineModalTarget(null);
  };

  // Bulk Approve Handler
  const handleBulkApprove = async () => {
    if (selectedRegIds.length === 0) return;
    const success = await bulkUpdateRegistrationStatus(selectedRegIds, 'Approved');
    if (success) {
      showNotification('success', `Approved passes for ${selectedRegIds.length} delegates.`);
      setSelectedRegIds([]);
    } else {
      showNotification('error', 'Bulk approval failed to sync.');
    }
  };

  // Export to CSV
  const handleExportCSV = (recordsToExport: EventRegistration[] = filteredRoster) => {
    if (recordsToExport.length === 0) {
      alert('No registration records available to export.');
      return;
    }

    const headers = [
      'Accreditation Code',
      'Delegate Name',
      'Email',
      'Phone',
      'Organization',
      'Role / Title',
      'Event Title',
      'Track Category',
      'Business Week Days',
      'Innovation Weekend (BTF 2.0)',
      'Accreditation Status',
      'Reviewer',
      'Decline Reason',
      'Registration Date',
    ];

    const rows = recordsToExport.map((r) => [
      `"${r.accreditationCode || ''}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${(r.organization || '').replace(/"/g, '""')}"`,
      `"${(r.professionalTitle || '').replace(/"/g, '""')}"`,
      `"${r.eventTitle.replace(/"/g, '""')}"`,
      `"${r.track}"`,
      `"${(r.selectedDays || []).join('; ')}"`,
      `"${(r.innovationWeekendDays || []).join('; ')}"`,
      `"${r.accreditationStatus}"`,
      `"${r.reviewer || 'Secretariat'}"`,
      `"${(r.declineReason || '').replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `oghowa-delegates-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add category handler
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    addEventCategory({
      id: `cat-${Date.now()}`,
      name: trimmed,
      badgeColor: newCatColor,
    });
    setEventForm((prev) => ({ ...prev, category: trimmed }));
    setNewCatName('');
    showNotification('success', `Added category "${trimmed}" with selected badge styling.`);
  };

  // Remove category handler - sets target for in-app safe confirmation modal
  const handleRemoveCategory = (id: string, name: string) => {
    setCategoryToDelete({ id, name });
  };

  // Confirm delete category without iframe-blocking window.confirm
  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    deleteEventCategory(categoryToDelete.name);
    showNotification('success', `Removed category "${categoryToDelete.name}".`);
    setCategoryToDelete(null);
  };

  // Immediate Cloud Sync for Categories
  const handleSaveCategoriesToCloud = async () => {
    setIsSavingCategories(true);
    try {
      const res = await saveToCloud();
      if (res.success) {
        showNotification('success', 'Event categories saved and synced to cloud successfully.');
      } else {
        showNotification('error', res.message || 'Failed to sync categories to cloud.');
      }
    } catch {
      showNotification('error', 'Cloud sync failed. Local state preserved.');
    } finally {
      setIsSavingCategories(false);
    }
  };

  // Open Create Event Form
  const handleOpenCreateEvent = () => {
    setEditingEventId(null);
    setFormStartDate('2026-11-18');
    setFormEndDate('2026-11-21');
    setDateSelectionMode('range');
    setFormStartTime('09:00');
    setFormEndTime('17:30');
    setFormTimezone('WAT');

    setEventForm({
      title: '',
      category: categories[0]?.name || 'Summit & Deal-Rooms',
      badge: 'Registration Open',
      date: 'November 18–21, 2026',
      startDate: '2026-11-18',
      endDate: '2026-11-21',
      time: '09:00 AM - 05:30 PM WAT',
      startTime: '09:00',
      endTime: '17:30',
      timezone: 'WAT',
      location: 'The Heritage Hall & Innovation Hub, Benin City',
      track: 'Institutional Investors & Founders',
      description: '',
      capacityLimit: 150,
      status: 'Registration Open',
      bannerImageUrl:
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80',
      isFeatured: false,
    });
    setIsEditingEvent(true);
  };

  // Open Edit Event Form
  const handleOpenEditEvent = (ev: EventItem) => {
    setEditingEventId(ev.id);
    const startD = ev.startDate || '2026-11-18';
    const endD = ev.endDate || startD;
    setFormStartDate(startD);
    setFormEndDate(endD);
    setDateSelectionMode(startD === endD ? 'single' : 'range');

    const startT = ev.startTime || '09:00';
    const endT = ev.endTime || '17:30';
    setFormStartTime(startT);
    setFormEndTime(endT);
    setFormTimezone(ev.timezone || 'WAT');

    setEventForm({
      title: ev.title,
      category: ev.category,
      badge: ev.badge,
      date: ev.date,
      startDate: startD,
      endDate: endD,
      time: ev.time,
      startTime: startT,
      endTime: endT,
      timezone: ev.timezone || 'WAT',
      location: ev.location,
      track: ev.track,
      description: ev.description,
      capacityLimit: ev.capacityLimit || 100,
      status: ev.status,
      bannerImageUrl: ev.bannerImageUrl || '',
      isFeatured: !!ev.isFeatured,
    });
    setIsEditingEvent(true);
  };

  // Save Event Form
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim()) {
      alert('Event title is required');
      return;
    }

    const finalDate = compileDateString(formStartDate, formEndDate, dateSelectionMode);
    const finalTime = compileTimeString(formStartTime, formEndTime, formTimezone);

    const payload: EventItem = {
      ...(editingEventId ? { id: editingEventId } : { id: `event-${Date.now()}` }),
      ...eventForm,
      date: finalDate || eventForm.date,
      startDate: formStartDate,
      endDate: dateSelectionMode === 'range' ? formEndDate : formStartDate,
      time: finalTime || eventForm.time,
      startTime: formStartTime,
      endTime: formEndTime,
      timezone: formTimezone,
      registeredCount: editingEventId
        ? events.find((ev) => ev.id === editingEventId)?.registeredCount || 0
        : 0,
    };

    if (editingEventId) {
      const updated = events.map((ev) => (ev.id === editingEventId ? payload : ev));
      updateEvents(updated);
      showNotification('success', `Updated event "${payload.title}".`);
    } else {
      addEvent(payload);
      showNotification('success', `Added new convening "${payload.title}".`);
    }

    setIsEditingEvent(false);
    setEditingEventId(null);
  };

  // Quick event status toggle
  const handleToggleEventStatus = (eventId: string, newStatus: EventItem['status']) => {
    const updated = events.map((ev) =>
      ev.id === eventId ? { ...ev, status: newStatus } : ev
    );
    updateEvents(updated);
  };

  // Confirm delete with passcode
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError('');

    try {
      if (deleteTarget.type === 'registration') {
        const result = await deleteRegistration(deleteTarget.id, deletePasscode);
        if (result.success) {
          showNotification('success', `Successfully deleted registration: ${deleteTarget.title}`);
          setDeleteTarget(null);
          setDeletePasscode('');
        } else {
          setDeleteError(result.message || 'Deletion prohibited without authorization.');
        }
      } else if (deleteTarget.type === 'event') {
        deleteEvent(deleteTarget.id);
        showNotification('success', `Deleted convening: ${deleteTarget.title}`);
        setDeleteTarget(null);
        setDeletePasscode('');
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Delete operation failed.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-md transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP HEADER & METRICS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <h2 className="text-lg font-extrabold text-[#0A162B]">
                Events & Delegate Accreditation Controller
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage ecosystem convenings, configure event categories, and issue verifiable VIP accreditation passes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refreshRegistrations()}
              disabled={isLoadingRegistrations}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh database records"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoadingRegistrations ? 'animate-spin text-red-600' : ''}`}
              />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => saveToCloud()}
              className="px-4 py-1.5 bg-[#D9232A] hover:bg-[#B9181F] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Registrations
            </div>
            <div className="text-2xl font-extrabold text-[#0A162B] mt-0.5">
              {metrics.totalDelegates}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Accredited & Issued
            </div>
            <div className="text-2xl font-extrabold text-emerald-900 mt-0.5">
              {metrics.totalApproved}
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              Pending Review
            </div>
            <div className="text-2xl font-extrabold text-amber-900 mt-0.5">
              {metrics.totalPending}
            </div>
          </div>

          <div className="p-3 bg-red-50/70 rounded-xl border border-red-200">
            <div className="text-[11px] font-bold text-red-800 uppercase tracking-wider">
              Declined / Waitlisted
            </div>
            <div className="text-2xl font-extrabold text-red-900 mt-0.5">
              {metrics.totalDeclined}
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS (ROSTER VS CONVENINGS VS CATEGORIES) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubTabSwitch('roster')}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'roster'
                ? 'bg-[#0A162B] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-red-400" />
            <span>Delegate Accreditation Roster ({filteredRoster.length})</span>
          </button>

          <button
            onClick={() => handleSubTabSwitch('events')}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'events'
                ? 'bg-[#0A162B] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-red-400" />
            <span>Ecosystem Convenings ({events.length})</span>
          </button>

          <button
            onClick={() => handleSubTabSwitch('categories')}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'categories'
                ? 'bg-[#0A162B] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-red-400" />
            <span>Event Categories ({categories.length})</span>
          </button>
        </div>

        {subTab === 'events' && (
          <button
            onClick={handleOpenCreateEvent}
            className="px-3.5 py-1.5 bg-[#D9232A] hover:bg-[#B9181F] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Convening</span>
          </button>
        )}
      </div>

      {/* ========================================================== */}
      {/* 1. DELEGATE ACCREDITATION ROSTER VIEW */}
      {/* ========================================================== */}
      {subTab === 'roster' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-5">
          {/* Search, Filter Bar & Export */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                placeholder="Search by name, email, organization, pass code..."
                className="w-full pl-9 pr-8 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
              {rosterSearch && (
                <button
                  onClick={() => setRosterSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Event Filter */}
              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white text-slate-700"
              >
                <option value="ALL">All Convenings</option>
                {events.map((ev, evIdx) => (
                  <option key={ev.id ? `${ev.id}-${evIdx}` : `ev-opt-${evIdx}`} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>

              {/* Track Filter */}
              <select
                value={selectedTrackFilter}
                onChange={(e) => setSelectedTrackFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white text-slate-700"
              >
                <option value="ALL">All Tracks</option>
                {distinctTracks.map((trk, trkIdx) => (
                  <option key={`trk-opt-${trkIdx}-${trk}`} value={trk}>
                    {trk}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
                {['ALL', 'Pending', 'Approved', 'Declined'].map((st, stIdx) => (
                  <button
                    key={`status-btn-${stIdx}-${st}`}
                    onClick={() => setSelectedStatusFilter(st)}
                    className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                      selectedStatusFilter === st
                        ? 'bg-[#0A162B] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Export Button */}
              <button
                onClick={() => handleExportCSV(filteredRoster)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-[#0A162B] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-red-400" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* BULK ACTIONS FLOATING BAR */}
          {selectedRegIds.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                  {selectedRegIds.length}
                </span>
                <span className="text-xs font-bold text-red-900">
                  {selectedRegIds.length} Delegate{selectedRegIds.length > 1 ? 's' : ''} Selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkApprove}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Selected</span>
                </button>

                <button
                  onClick={handleOpenBulkDeclineModal}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Decline Selected</span>
                </button>

                <button
                  onClick={() =>
                    handleExportCSV(registrations.filter((r) => selectedRegIds.includes(r.id)))
                  }
                  className="px-3 py-1 bg-slate-800 hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Selection</span>
                </button>

                <button
                  onClick={() => setSelectedRegIds([])}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer ml-1"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* ROSTER TABLE */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredRoster.length > 0 &&
                        selectedRegIds.length === filteredRoster.length
                      }
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      title="Select all filtered"
                    />
                  </th>
                  <th className="p-3">Delegate & Title</th>
                  <th className="p-3">Organization</th>
                  <th className="p-3">Event Registered</th>
                  <th className="p-3">Track & Category</th>
                  <th className="p-3">Accreditation Code</th>
                  <th className="p-3">Pass Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoster.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No delegate registrations match your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredRoster.map((reg, regIdx) => {
                    const isApproved =
                      reg.accreditationStatus === 'Approved' ||
                      (reg.accreditationStatus as any) === 'APPROVED';
                    const isDeclined =
                      reg.accreditationStatus === 'Declined' ||
                      (reg.accreditationStatus as any) === 'DECLINED';
                    const isSelected = selectedRegIds.includes(reg.id);

                    return (
                      <tr
                        key={reg.id ? `${reg.id}-${regIdx}` : `reg-${regIdx}`}
                        className={`transition-colors ${
                          isSelected ? 'bg-red-50/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(reg.id)}
                            className="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                          />
                        </td>

                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => setViewingDelegate(reg)}
                            className="font-bold text-[#0A162B] hover:text-[#D9232A] text-left transition-colors cursor-pointer"
                          >
                            {reg.fullName}
                          </button>
                          <div className="text-[11px] text-slate-500">
                            {reg.professionalTitle || 'Attendee'}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{reg.email}</div>
                        </td>

                        <td className="p-3">
                          <div className="font-medium text-slate-800">
                            {reg.organization || 'Independent'}
                          </div>
                          <div className="text-[11px] text-slate-500">{reg.phone}</div>
                        </td>

                        <td className="p-3 max-w-xs">
                          <div className="font-medium text-[#0A162B] truncate" title={reg.eventTitle}>
                            {reg.eventTitle}
                          </div>
                          {reg.selectedDays && reg.selectedDays.length > 0 && (
                            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                              <span className="text-[10px] bg-red-50 text-[#D9232A] px-1.5 py-0.2 rounded font-bold border border-red-200">
                                {reg.selectedDays.length} BW Days
                              </span>
                              {reg.innovationWeekendDays &&
                                reg.innovationWeekendDays.length > 0 && (
                                  <span className="text-[10px] bg-blue-50 text-[#0022D6] px-1.5 py-0.2 rounded font-bold border border-blue-200">
                                    +BTF 2.0
                                  </span>
                                )}
                            </div>
                          )}
                        </td>

                        <td className="p-3">
                          <span className="text-[11px] font-semibold text-slate-700 block">
                            {reg.track}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {reg.accreditationCode || 'OGH-2026-PEND'}
                            </span>
                            {isApproved && (
                              <button
                                onClick={() => setViewingPassDelegate(reg)}
                                className="text-red-600 hover:text-red-800 cursor-pointer"
                                title="View & Print Verifiable Pass"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(reg.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isApproved
                                ? 'bg-emerald-100 text-emerald-800'
                                : isDeclined
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {reg.accreditationStatus}
                          </span>
                          {reg.declineReason && (
                            <div
                              className="text-[9px] text-red-600 mt-0.5 truncate max-w-[120px]"
                              title={reg.declineReason}
                            >
                              {reg.declineReason}
                            </div>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewingDelegate(reg)}
                              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                              title="View Full Registration Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* APPROVE PASS ACTION BUTTON */}
                            {!isApproved && (
                              <button
                                onClick={() => handleApprovePass(reg)}
                                className="p-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                                title="Approve & Issue Accreditation Pass"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            {/* DECLINE PASS ACTION BUTTON */}
                            {!isDeclined && (
                              <button
                                onClick={() => handleOpenDeclineModal(reg)}
                                className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer"
                                title="Decline Pass (with Reason)"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}

                            {/* DELETE BUTTON */}
                            <button
                              onClick={() => {
                                setDeleteTarget({
                                  type: 'registration',
                                  id: reg.id,
                                  title: `Delegate: ${reg.fullName} (${reg.accreditationCode || 'Pending'})`,
                                });
                                setDeletePasscode('');
                                setDeleteError('');
                              }}
                              className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete Record (Protected)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. ECOSYSTEM CONVENINGS VIEW */}
      {/* ========================================================== */}
      {subTab === 'events' && (
        <div className="space-y-6">
          {/* EVENT EDIT / CREATE FORM MODAL OR INLINE CARD */}
          {isEditingEvent && (
            <div className="bg-white rounded-2xl border-2 border-red-500/30 p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-600" />
                  <h3 className="text-base font-extrabold text-[#0A162B]">
                    {editingEventId ? 'Edit Ecosystem Convening' : 'Create New Ecosystem Convening'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingEvent(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      placeholder="e.g. Óghowa Business Week Summit & Deal-Room 2026"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-bold text-slate-900"
                      required
                    />
                  </div>

                  {/* Category Selection with Quick Add */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Event Category *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCategoryManager(true)}
                        className="text-[11px] text-red-600 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Manage / Add Categories</span>
                      </button>
                    </div>
                    <select
                      value={eventForm.category}
                      onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      {categories.map((cat, catIdx) => (
                        <option key={cat.id ? `${cat.id}-${catIdx}` : `cat-opt-${catIdx}`} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Location / Venue *
                    </label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      placeholder="e.g. The Heritage Hall, Benin City"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      required
                    />
                  </div>

                  {/* ======================================================== */}
                  {/* POPUP CALENDAR DATE PICKER (SINGLE OR MULTI-DAY) */}
                  {/* ======================================================== */}
                  <div className="md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-red-600" />
                        <span>Date Selection (Native Calendar Popups) *</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="dateMode"
                            checked={dateSelectionMode === 'range'}
                            onChange={() => setDateSelectionMode('range')}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span>Multi-Day Range</span>
                        </label>
                        <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="dateMode"
                            checked={dateSelectionMode === 'single'}
                            onChange={() => setDateSelectionMode('single')}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span>Single Day</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {dateSelectionMode === 'range' ? 'Start Date' : 'Event Date'}
                        </label>
                        <input
                          type="date"
                          value={formStartDate}
                          onChange={(e) => {
                            setFormStartDate(e.target.value);
                            if (dateSelectionMode === 'single') {
                              setFormEndDate(e.target.value);
                            }
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono text-slate-800"
                          required
                        />
                      </div>

                      {dateSelectionMode === 'range' && (
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={formEndDate}
                            min={formStartDate}
                            onChange={(e) => setFormEndDate(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono text-slate-800"
                            required
                          />
                        </div>
                      )}
                    </div>

                    {/* Live Preview of formatted date string */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-500">Formatted Schedule Date:</span>
                      <span className="font-bold text-red-700 bg-white px-2.5 py-1 rounded border border-red-200">
                        {compileDateString(formStartDate, formEndDate, dateSelectionMode) || 'Select Dates'}
                      </span>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-semibold self-center">
                        Convening Presets:
                      </span>
                      {[
                        { label: 'Summit 2026 (Nov 18–21)', start: '2026-11-18', end: '2026-11-21', mode: 'range' as const },
                        { label: 'BTF Hackathon (Oct 9–11)', start: '2026-10-09', end: '2026-10-11', mode: 'range' as const },
                        { label: 'Masterclass (Oct 24)', start: '2026-10-24', end: '2026-10-24', mode: 'single' as const },
                        { label: 'Roundtable (Nov 5)', start: '2026-11-05', end: '2026-11-05', mode: 'single' as const },
                      ].map((p, pIdx) => (
                        <button
                          key={`conv-preset-${pIdx}`}
                          type="button"
                          onClick={() => {
                            setFormStartDate(p.start);
                            setFormEndDate(p.end);
                            setDateSelectionMode(p.mode);
                          }}
                          className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 text-[10px] font-semibold cursor-pointer"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* POPUP CLOCK TIME / SCHEDULE BUILDER */}
                  {/* ======================================================== */}
                  <div className="md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-red-600" />
                        <span>Schedule & Time Selector (Native Clock Popups) *</span>
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">Format: HH:MM AM/PM</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={formStartTime}
                          onChange={(e) => setFormStartTime(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={formEndTime}
                          onChange={(e) => setFormEndTime(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Timezone
                        </label>
                        <select
                          value={formTimezone}
                          onChange={(e) => setFormTimezone(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="WAT">WAT (West Africa Time, GMT+1)</option>
                          <option value="GMT">GMT (Greenwich Mean Time)</option>
                          <option value="UTC">UTC (Coordinated Universal Time)</option>
                          <option value="EST">EST (Eastern Standard Time)</option>
                        </select>
                      </div>
                    </div>

                    {/* Compiled schedule preview */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-500">Live Formatted Schedule:</span>
                      <span className="font-bold text-[#0A162B] bg-white px-2.5 py-1 rounded border border-slate-200">
                        {compileTimeString(formStartTime, formEndTime, formTimezone)}
                      </span>
                    </div>

                    {/* Quick schedule presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-semibold self-center">
                        Schedule Presets:
                      </span>
                      {[
                        { label: 'Full Day (09:00 AM - 05:30 PM)', start: '09:00', end: '17:30' },
                        { label: 'Morning Plenary (09:00 AM - 01:00 PM)', start: '09:00', end: '13:00' },
                        { label: 'Afternoon Deal-Room (02:00 PM - 06:00 PM)', start: '14:00', end: '18:00' },
                      ].map((sp, sIdx) => (
                        <button
                          key={`sched-preset-${sIdx}`}
                          type="button"
                          onClick={() => {
                            setFormStartTime(sp.start);
                            setFormEndTime(sp.end);
                          }}
                          className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 text-[10px] font-semibold cursor-pointer"
                        >
                          {sp.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* CAPACITY TRACKER FIELD & PREVIEW */}
                  {/* ======================================================== */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Capacity Limit (Seats) *
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={5000}
                      value={eventForm.capacityLimit}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          capacityLimit: parseInt(e.target.value, 10) || 100,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      required
                    />
                  </div>

                  {/* Registration Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registration Status
                    </label>
                    <select
                      value={eventForm.status}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Registration Open">Registration Open</option>
                      <option value="Limited Seats">Limited Seats</option>
                      <option value="Vetting Required">Vetting Required</option>
                      <option value="Registration Closed">Registration Closed</option>
                    </select>
                  </div>

                  {/* Target Track */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Stakeholder Track
                    </label>
                    <input
                      type="text"
                      value={eventForm.track}
                      onChange={(e) => setEventForm({ ...eventForm, track: e.target.value })}
                      placeholder="e.g. Founders, Investors & Sovereign Partners"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  {/* Badge Text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Promotional Ribbon Badge
                    </label>
                    <input
                      type="text"
                      value={eventForm.badge}
                      onChange={(e) => setEventForm({ ...eventForm, badge: e.target.value })}
                      placeholder="e.g. Flagship Convening"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  {/* Banner Image with Controller */}
                  <div className="md:col-span-2">
                    <MediaAssetController
                      label="Event Banner Image Asset"
                      value={eventForm.bannerImageUrl}
                      onChange={(url) => setEventForm({ ...eventForm, bannerImageUrl: url })}
                      recommendedAspect="16:9 Banner"
                      helperText="High-res banner photo for event cards and detail headers."
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Description & Strategic Objectives
                    </label>
                    <textarea
                      rows={3}
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingEvent(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#D9232A] hover:bg-[#B9181F] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                  >
                    {editingEventId ? 'Save Convening Updates' : 'Publish Convening'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CATEGORY FILTER BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700 mr-1.5 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Filter by Category:</span>
              </span>
              <button
                type="button"
                onClick={() => setEventCategoryFilter('ALL')}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                  eventCategoryFilter === 'ALL'
                    ? 'bg-[#0A162B] text-white border-[#0A162B]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Convenings ({events.length})
              </button>
              {categories.map((cat, idx) => {
                const count = events.filter((e) => e.category === cat.name).length;
                return (
                  <button
                    key={cat.id || `filter-cat-${idx}`}
                    type="button"
                    onClick={() => setEventCategoryFilter(cat.name)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                      eventCategoryFilter === cat.name
                        ? 'bg-[#D9232A] text-white border-[#D9232A] shadow-xs'
                        : `${cat.badgeColor} hover:opacity-80`
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleSubTabSwitch('categories')}
              className="text-xs font-bold text-[#D9232A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Tag className="w-3 h-3" />
              <span>Manage Categories</span>
            </button>
          </div>

          {/* EVENTS LIST WITH CAPACITY TRACKERS */}
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No convenings found in this category</p>
              <p className="text-xs text-slate-500 mt-1">
                {eventCategoryFilter !== 'ALL'
                  ? `There are no active convenings currently categorized under "${eventCategoryFilter}".`
                  : 'No ecosystem convenings have been published yet.'}
              </p>
              {eventCategoryFilter !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setEventCategoryFilter('ALL')}
                  className="mt-3 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Clear Filter</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((ev, evIdx) => {
                const regCount = ev.registeredCount || 0;
                const capLimit = ev.capacityLimit || 100;
                const percentage = Math.min(100, Math.round((regCount / capLimit) * 100));

                let capColor = 'bg-emerald-500';
                let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                if (percentage >= 90) {
                  capColor = 'bg-red-500';
                  badgeColor = 'text-red-700 bg-red-50 border-red-200';
                } else if (percentage >= 70) {
                  capColor = 'bg-amber-500';
                  badgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
                }

                return (
                  <div
                    key={ev.id ? `${ev.id}-${evIdx}` : `ev-card-${evIdx}`}
                    className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all"
                  >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {ev.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          ev.status === 'Registration Open'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-[#0A162B] line-clamp-2">
                      {ev.title}
                    </h4>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span className="font-semibold">{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{ev.time || 'Schedule announced upon pass issue'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>

                    {/* CAPACITY PROGRESS BAR TRACKER */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700">Capacity Tracker:</span>
                        <span className={`font-bold px-2 py-0.2 rounded border text-[10px] ${badgeColor}`}>
                          {regCount} / {capLimit} seats ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full ${capColor} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <select
                        value={ev.status}
                        onChange={(e) =>
                          handleToggleEventStatus(ev.id, e.target.value as EventItem['status'])
                        }
                        className="px-2 py-1 text-[11px] font-semibold border border-slate-300 rounded bg-white"
                      >
                        <option value="Registration Open">Registration Open</option>
                        <option value="Limited Seats">Limited Seats</option>
                        <option value="Vetting Required">Vetting Required</option>
                        <option value="Registration Closed">Registration Closed</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditEvent(ev)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer"
                        title="Edit Convening"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget({
                            type: 'event',
                            id: ev.id,
                            title: ev.title,
                          });
                          setDeletePasscode('');
                          setDeleteError('');
                        }}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
                        title="Delete Convening"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* ========================================================== */}
      {/* 3. EVENT CATEGORIES MANAGER VIEW (IN-TAB) */}
      {/* ========================================================== */}
      {subTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-red-600" />
                <span>Event Categories Manager</span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {categories.length} Active {categories.length === 1 ? 'Category' : 'Categories'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure convening taxonomies and custom badge styles reflected across all ecosystem event listings and filters.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveCategoriesToCloud}
                disabled={isSavingCategories}
                className="px-3.5 py-1.5 bg-[#0A162B] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <CloudUpload className={`w-3.5 h-3.5 text-red-400 ${isSavingCategories ? 'animate-spin' : ''}`} />
                <span>{isSavingCategories ? 'Syncing...' : 'Save & Sync Cloud'}</span>
              </button>
            </div>
          </div>

          {/* ADD CATEGORY FORM */}
          <form onSubmit={handleAddCategory} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-red-600" />
                <span>Create New Convening Category</span>
              </h4>
              <span className="text-[11px] text-slate-500">
                Immediately applies to convening filters & creation dropdown
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Deal-Room & Venture Showcase, Founder Sprints..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Badge Color Style
                </label>
                <select
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-red-500 font-medium"
                >
                  <option value="bg-red-50 text-[#D9232A] border-red-200">Red Accent (Summit/Deal)</option>
                  <option value="bg-blue-50 text-blue-700 border-blue-200">Blue Corporate (Tech/Code)</option>
                  <option value="bg-emerald-50 text-emerald-800 border-emerald-200">Emerald Green (Capital/Growth)</option>
                  <option value="bg-amber-50 text-amber-800 border-amber-200">Amber Gold (Workshops)</option>
                  <option value="bg-purple-50 text-purple-700 border-purple-200">Purple Royal (Ecosystem)</option>
                  <option value="bg-slate-100 text-slate-800 border-slate-300">Slate Neutral (General)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Live Badge Preview:</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-2xs ${newCatColor}`}>
                  {newCatName || 'Sample Category Badge'}
                </span>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#D9232A] hover:bg-[#B9181F] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add & Save Category</span>
              </button>
            </div>
          </form>

          {/* ACTIVE CATEGORIES LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800">
                Active Convening Categories ({categories.length})
              </h4>
              <span className="text-[11px] text-slate-500">
                All categories are available on the public convenings calendar
              </span>
            </div>

            {categories.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <Tag className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No categories currently configured</p>
                <button
                  type="button"
                  onClick={() => {
                    const defaultCats = [
                      { name: 'Summit & Deal-Rooms', badgeColor: 'bg-red-50 text-[#D9232A] border-red-200' },
                      { name: 'Founder Sprints', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
                      { name: 'Masterclasses & Workshops', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' },
                      { name: 'Investor Roundtables', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                    ];
                    defaultCats.forEach((c) => addEventCategory(c));
                    showNotification('success', 'Restored default summit convening categories.');
                  }}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Default Categories</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat, catIdx) => {
                  const assignedCount = events.filter((e) => e.category === cat.name).length;
                  return (
                    <div
                      key={cat.id ? `${cat.id}-${catIdx}` : `cat-list-${catIdx}`}
                      className="p-3.5 bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200 rounded-xl flex items-center justify-between gap-2.5 transition-all shadow-2xs group"
                    >
                      <div className="min-w-0 flex-1">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border truncate inline-block ${cat.badgeColor}`}>
                          {cat.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[11px] text-slate-500">
                            {assignedCount} convening{assignedCount !== 1 ? 's' : ''} assigned
                          </span>
                          {assignedCount > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setEventCategoryFilter(cat.name);
                                handleSubTabSwitch('events');
                              }}
                              className="text-[10px] text-red-600 hover:text-red-700 font-semibold cursor-pointer underline"
                            >
                              View convenings
                            </button>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(cat.id, cat.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                        title="Remove category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DEDICATED MODAL FOR CATEGORY MANAGER (TRIGGERED FROM EVENT FORM OR ROSTER) */}
      {showCategoryManager && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-w-xl w-full space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-red-600" />
                  <span>Manage / Add Convening Categories</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Quickly create categories. New categories will be auto-selected for your event.
                </p>
              </div>
              <button
                onClick={() => setShowCategoryManager(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ADD CATEGORY FORM */}
            <form onSubmit={handleAddCategory} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Add New Category</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Masterclasses & Workshops"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Badge Color Style
                  </label>
                  <select
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="bg-red-50 text-[#D9232A] border-red-200">Red Accent</option>
                    <option value="bg-blue-50 text-blue-700 border-blue-200">Blue Corporate</option>
                    <option value="bg-emerald-50 text-emerald-800 border-emerald-200">Emerald Green</option>
                    <option value="bg-amber-50 text-amber-800 border-amber-200">Amber Gold</option>
                    <option value="bg-purple-50 text-purple-700 border-purple-200">Purple Royal</option>
                    <option value="bg-slate-100 text-slate-800 border-slate-300">Slate Neutral</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Preview:</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${newCatColor}`}>
                    {newCatName || 'Category Badge Preview'}
                  </span>
                </div>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#D9232A] hover:bg-[#B9181F] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Save & Select
                </button>
              </div>
            </form>

            {/* EXISTING CATEGORIES */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Existing Categories ({categories.length})</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {categories.map((cat, catIdx) => (
                  <div
                    key={cat.id ? `${cat.id}-${catIdx}` : `cat-modal-${catIdx}`}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setEventForm((prev) => ({ ...prev, category: cat.name }));
                        setShowCategoryManager(false);
                      }}
                      className="text-left cursor-pointer hover:opacity-80 truncate"
                      title="Click to select for this event"
                    >
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border truncate inline-block ${cat.badgeColor}`}>
                        {cat.name}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat.id, cat.name)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                      title="Remove category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCategoryManager(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* DECLINE REASON MODAL */}
      {/* ========================================================== */}
      {declineModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {declineModalTarget.isBulk
                    ? `Decline ${selectedRegIds.length} Selected Passes`
                    : `Decline Pass: ${declineModalTarget.name}`}
                </h3>
              </div>
              <button
                onClick={() => setDeclineModalTarget(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select an administrative reason for declining accreditation. This reason will be recorded in the audit log and displayed to the secretariat.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Reason Preset</label>
              {[
                'Capacity limit reached for requested attendee track',
                'Applicant credentials do not meet deal-room accreditation requirements',
                'Duplicate application received',
                'Incomplete enterprise or professional background',
                'Outside geographical / sector focus area',
              ].map((reason, rIdx) => (
                <label
                  key={`decline-reason-${rIdx}`}
                  className={`flex items-start gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                    declinePresetReason === reason
                      ? 'border-red-500 bg-red-50/50 text-red-900 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="declineReason"
                    checked={declinePresetReason === reason}
                    onChange={() => setDeclinePresetReason(reason)}
                    className="text-red-600 focus:ring-red-500 mt-0.5"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Custom Reviewer Note (Optional)
              </label>
              <textarea
                rows={2}
                value={declineCustomNote}
                onChange={(e) => setDeclineCustomNote(e.target.value)}
                placeholder="Additional details or instructions..."
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeclineModalTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* VERIFIABLE QR PASS PREVIEW MODAL */}
      {/* ========================================================== */}
      {viewingPassDelegate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full shadow-2xl overflow-hidden space-y-4">
            {/* PASS BADGE HEADER */}
            <div className="bg-[#0A162B] p-5 text-white text-center relative">
              <button
                onClick={() => setViewingPassDelegate(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-10 h-10 rounded-full bg-red-600 text-white font-extrabold flex items-center justify-center mx-auto mb-2 text-sm shadow-md">
                Ó
              </div>
              <h3 className="font-extrabold text-sm tracking-wide">ÓGHOWA ACCELERATOR</h3>
              <p className="text-[10px] text-red-400 uppercase tracking-widest font-semibold mt-0.5">
                Official Executive Accreditation Pass
              </p>
            </div>

            {/* BADGE BODY */}
            <div className="p-5 space-y-4 text-center">
              <div>
                <h4 className="font-extrabold text-lg text-slate-900">
                  {viewingPassDelegate.fullName}
                </h4>
                <p className="text-xs font-semibold text-red-600">
                  {viewingPassDelegate.professionalTitle || 'Executive Delegate'}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {viewingPassDelegate.organization || 'Independent Ecosystem Partner'}
                </p>
              </div>

              {/* QR CODE CONTAINER */}
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 inline-block mx-auto">
                <div className="w-36 h-36 bg-white rounded-xl shadow-inner border border-slate-200 flex flex-col items-center justify-center p-2 relative">
                  <QrCode className="w-28 h-28 text-slate-900" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-md bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                      Ó
                    </div>
                  </div>
                </div>
                <div className="font-mono font-extrabold text-xs text-slate-900 mt-2 tracking-wider">
                  {viewingPassDelegate.accreditationCode || 'OGH-2026-8142'}
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5">
                  METASPACE VERIFIED • SECURE QR
                </div>
              </div>

              {/* PASS DETAILS */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Convening:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[170px]">
                    {viewingPassDelegate.eventTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Track:</span>
                  <span className="font-bold text-red-600">{viewingPassDelegate.track}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-600">ACCREDITED / VIP</span>
                </div>
              </div>

              {/* PRINT & CLOSE */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-red-400" />
                  <span>Print Pass</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingPassDelegate(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* DELEGATE FULL DETAILS MODAL */}
      {/* ========================================================== */}
      {viewingDelegate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Delegate Registration Dossier
                </h3>
              </div>
              <button
                onClick={() => setViewingDelegate(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Name</span>
                  <span className="font-bold text-slate-900 text-sm">{viewingDelegate.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Pass Code</span>
                  <span className="font-mono font-bold text-red-600">{viewingDelegate.accreditationCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Email</span>
                  <span className="font-mono text-slate-800">{viewingDelegate.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone</span>
                  <span className="text-slate-800">{viewingDelegate.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Organization</span>
                  <span className="font-semibold text-slate-800">{viewingDelegate.organization || 'Independent'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Title</span>
                  <span className="text-slate-800">{viewingDelegate.professionalTitle || 'Attendee'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">
                  Registered Convening & Track
                </span>
                <div className="font-bold text-slate-900">{viewingDelegate.eventTitle}</div>
                <div className="text-red-600 font-semibold">{viewingDelegate.track}</div>
              </div>

              {viewingDelegate.qualifications && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-900">Accreditation Qualifications</div>
                  <div className="text-slate-700">
                    Deal-Room Requested:{' '}
                    <span className="font-bold">
                      {viewingDelegate.qualifications.requestDealRoom ? 'YES (Bilateral)' : 'No'}
                    </span>
                  </div>
                  {viewingDelegate.qualifications.ventureStage && (
                    <div className="text-slate-700">
                      Stage: <span className="font-semibold">{viewingDelegate.qualifications.ventureStage}</span>
                    </div>
                  )}
                  {viewingDelegate.qualifications.capitalDeployed && (
                    <div className="text-slate-700">
                      Capital Deployed: <span className="font-semibold">{viewingDelegate.qualifications.capitalDeployed}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewingDelegate(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* PROTECTED DELETION PASSCODE MODAL */}
      {/* ========================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-red-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-600 border-b border-red-100 pb-3">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900">
                Protected Deletion Authorization
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              You are requesting to remove{' '}
              <strong className="text-slate-900">{deleteTarget.title}</strong>. Under the non-destructive isolation policy, administrative authorization is required.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Master Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={deletePasscode}
                  onChange={(e) => setDeletePasscode(e.target.value)}
                  placeholder="Enter passcode (e.g. oghowa2026)"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
              {deleteError && (
                <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{deleteError}</span>
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting || !deletePasscode}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-50 flex items-center gap-1"
              >
                {isDeleting ? 'Authorizing...' : 'Confirm Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* SAFE CATEGORY DELETION CONFIRMATION MODAL (NO WINDOW.CONFIRM) */}
      {/* ========================================================== */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-600 border-b border-slate-100 pb-3">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900">
                Remove Event Category
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove the convening category{' '}
              <strong className="text-slate-900 font-bold">"{categoryToDelete.name}"</strong>?
              Existing events using this category will remain intact.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
