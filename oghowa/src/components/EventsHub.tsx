import React, { useState, useMemo } from 'react';
import { EventItem, EventCategory, AttendeeTrack } from '../types';
import { useSiteConfig } from '../context/SiteConfigContext';
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  ListTree,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  FileText,
  Users,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface EventsHubProps {
  onRegisterEvent: (event: EventItem, defaultTrack?: AttendeeTrack) => void;
  onDownloadProspectus: () => void;
  onRequestExecutiveAccess: () => void;
}

export const EventsHub: React.FC<EventsHubProps> = ({
  onRegisterEvent,
  onDownloadProspectus,
  onRequestExecutiveAccess,
}) => {
  const { config } = useSiteConfig();
  const events = config.events || [];

  // Filter and search state
  const [selectedCategory, setSelectedCategory] = useState<string>('All Convenings');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  const categories = [
    'All Convenings',
    'Summit & Deal-Rooms',
    'Founder Sprints',
    'Masterclasses & Workshops',
    'Investor Roundtables',
  ];

  // Find Featured Spotlight event (Flagship Summit)
  const featuredEvent = useMemo(() => {
    return (
      events.find((e) => e.isFeatured) ||
      events.find((e) => e.id.includes('summit')) ||
      events[0]
    );
  }, [events]);

  // Filtered roster of events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesCat =
        selectedCategory === 'All Convenings' || ev.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q) ||
        ev.track.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  return (
    <div id="events-hub-page" className="bg-slate-50 min-h-screen pb-24 text-slate-900">
      {/* 1. Header & Navigation Integration Section */}
      <section className="bg-gradient-to-b from-[#0A162B] via-[#0D1C38] to-[#0A162B] text-white pt-16 pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Overline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-red-950/80 text-red-300 border border-red-800/80 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Ecosystem Gatherings & Convenings • Edo State</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Where Policy, Capital, and Enterprise Converge
            </h1>

            {/* Subheadline */}
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Explore high-level roundtables, hackathons, venture showcases, and the flagship Oghowa Business Week Summit in Benin City.
            </p>
          </div>

          {/* Quick Filter & Search Bar */}
          <div className="mt-10 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/15 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#D9232A] text-white shadow-sm'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input & View Mode Toggle */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conveneings, tracks, keywords..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D9232A]"
                />
              </div>

              {/* View Switcher: Grid vs Chronological Timeline */}
              <div className="flex items-center bg-slate-900/80 border border-slate-700 rounded-xl p-0.5 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid View"
                  title="Grid View"
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#D9232A] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  aria-label="Timeline View"
                  title="Chronological Timeline View"
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    viewMode === 'timeline'
                      ? 'bg-[#D9232A] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ListTree className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Event Spotlight (Banner Card) */}
      {featuredEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Spotlight details (8 cols) */}
              <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D9232A] text-white">
                      [Flagship Summit]
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 text-white">
                      [By Invitation & Accreditation]
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#0022D6] border border-blue-200">
                      Benin City, Edo State
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A162B] tracking-tight leading-snug">
                    {featuredEvent.title}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm font-semibold text-slate-600">
                    <div className="flex items-center gap-1.5 text-[#D9232A]">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>{featuredEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Clock className="w-4 h-4 shrink-0 text-slate-400" />
                      <span>{featuredEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                      <span>{featuredEvent.location}</span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-2xl">
                    {featuredEvent.description}
                  </p>
                </div>

                {/* Spotlight Action Buttons */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() =>
                      onRegisterEvent(featuredEvent, 'Institutional Investor / GP / LP')
                    }
                    className="px-6 py-3 bg-[#D9232A] hover:bg-[#B9181F] active:scale-[0.98] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Request Executive Access</span>
                  </button>

                  <button
                    onClick={onDownloadProspectus}
                    className="px-5 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Download Prospectus</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Hero Visual & Metrics (4 cols) */}
              <div className="lg:col-span-4 bg-gradient-to-br from-[#0A162B] to-[#16274B] text-white p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold block mb-2">
                    Ecosystem Capital Mobilization
                  </span>
                  <div className="text-3xl font-extrabold text-white">
                    ≥ $50M
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Committed target for active venture & infrastructure syndication in Benin City.
                  </p>

                  <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Edo Investors Network (EIN) Alignment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Strict LP/GP Accreditation Protocol</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>150+ Enterprises & Policy Stakeholders</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-6 mt-6 border-t border-slate-700/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Capacity Status:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {featuredEvent.registeredCount}/{featuredEvent.capacityLimit} Registered
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Events Grid / Timeline View Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#0A162B] tracking-tight">
              {selectedCategory === 'All Convenings'
                ? 'All Ecosystem Events & Roundtables'
                : selectedCategory}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredEvents.length} scheduled convening{filteredEvents.length !== 1 ? 's' : ''} in Edo State
            </p>
          </div>
        </div>

        {/* Empty state */}
        {filteredEvents.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-[#0A162B]">No convenings found</h4>
            <p className="text-xs text-slate-500 mt-1">
              No events matched your current search filters. Try selecting another category or clearing search terms.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All Convenings');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#D9232A] text-white text-xs font-semibold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* VIEW 1: GRID VIEW (Card Matrix) */}
        {viewMode === 'grid' && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => {
              const isLimited = ev.status === 'Limited Seats';
              const isVetting = ev.status === 'Vetting Required';
              const isOpen = ev.status === 'Registration Open';

              return (
                <div
                  key={ev.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Banner / Image */}
                  <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                    {ev.bannerImageUrl ? (
                      <img
                        src={ev.bannerImageUrl}
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                    {/* Top Status & Category Badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                          isLimited
                            ? 'bg-amber-500 text-white'
                            : isVetting
                            ? 'bg-purple-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {ev.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 text-slate-200 backdrop-blur-xs border border-white/20">
                        {ev.category}
                      </span>
                    </div>

                    {/* Bottom Date Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-xs text-white flex items-center justify-between font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-300">
                        <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                        <span className="truncate max-w-[130px]">{ev.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Target Track */}
                      <div className="text-[11px] font-bold text-[#D9232A] uppercase tracking-wider mb-1.5">
                        Track: {ev.track}
                      </div>

                      {/* Title */}
                      <h4 className="text-base font-bold text-[#0A162B] group-hover:text-[#0022D6] transition-colors leading-snug line-clamp-2">
                        {ev.title}
                      </h4>

                      {/* Description */}
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {ev.description}
                      </p>
                    </div>

                    {/* Footer CTA & Capacity */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">
                          {ev.registeredCount || 0}
                        </span>
                        {ev.capacityLimit ? ` / ${ev.capacityLimit}` : ''} registered
                      </div>

                      <button
                        onClick={() => onRegisterEvent(ev)}
                        className="px-4 py-2 bg-[#0A162B] hover:bg-[#D9232A] text-white text-xs font-bold rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer group-hover:bg-[#D9232A]"
                      >
                        <span>Register / Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: CHRONOLOGICAL TIMELINE VIEW */}
        {viewMode === 'timeline' && filteredEvents.length > 0 && (
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-200 pl-2">
            {filteredEvents.map((ev, idx) => (
              <div key={ev.id} className="relative flex items-start gap-4 sm:gap-6 group">
                {/* Timeline node icon */}
                <div className="w-9 h-9 rounded-full bg-white border-2 border-[#D9232A] shadow-md flex items-center justify-center shrink-0 z-10 mt-1">
                  <span className="text-xs font-mono font-bold text-[#0A162B]">
                    {idx + 1}
                  </span>
                </div>

                {/* Timeline content card */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#D9232A] text-white">
                        {ev.status}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {ev.category}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-600 flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[#0022D6]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{ev.date}</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{ev.time}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    <div className="lg:col-span-9">
                      <h4 className="text-base sm:text-lg font-bold text-[#0A162B] group-hover:text-[#0022D6] transition-colors">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {ev.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1 text-slate-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-red-500" />
                          <span>{ev.location}</span>
                        </span>
                        <span>•</span>
                        <span className="font-medium text-slate-700">
                          Target Track: <strong className="text-slate-900">{ev.track}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="lg:col-span-3 flex lg:justify-end">
                      <button
                        onClick={() => onRegisterEvent(ev)}
                        className="w-full lg:w-auto px-5 py-2.5 bg-[#D9232A] hover:bg-[#B9181F] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Register / Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
