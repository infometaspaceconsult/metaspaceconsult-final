import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Check, Sparkles, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface EventCalendarMultiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDays: string[]; // e.g. ['Mon 16', 'Tue 17', ...]
  onSaveDays: (days: string[]) => void;
  title?: string;
  subtitle?: string;
  highlightDays?: string[]; // days that belong to this event
}

// Business Week Day definitions for November 2026
export interface DayOption {
  dayStr: string; // e.g. 'Mon 16'
  dayNumber: number; // 16
  dayOfWeek: string; // 'Mon'
  fullDate: string; // '2026-11-16'
  programTitle?: string;
  isBusinessWeek?: boolean;
  isInnovationWeekend?: boolean;
}

export const BUSINESS_WEEK_DAYS: DayOption[] = [
  { dayStr: 'Mon 16', dayNumber: 16, dayOfWeek: 'Mon', fullDate: '2026-11-16', programTitle: 'Opening Ceremonies & Policy Keynotes', isBusinessWeek: true },
  { dayStr: 'Tue 17', dayNumber: 17, dayOfWeek: 'Tue', fullDate: '2026-11-17', programTitle: 'Capital Network & Deal-Room Syndication', isBusinessWeek: true },
  { dayStr: 'Wed 18', dayNumber: 18, dayOfWeek: 'Wed', fullDate: '2026-11-18', programTitle: 'Industrial Renaissance & Infrastructure', isBusinessWeek: true },
  { dayStr: 'Thu 19', dayNumber: 19, dayOfWeek: 'Thu', fullDate: '2026-11-19', programTitle: 'Creative Economy, AI & Tech Pavilion', isBusinessWeek: true },
  { dayStr: 'Fri 20', dayNumber: 20, dayOfWeek: 'Fri', fullDate: '2026-11-20', programTitle: 'Executive Masterclasses & AfCFTA', isBusinessWeek: true },
  { dayStr: 'Sat 21', dayNumber: 21, dayOfWeek: 'Sat', fullDate: '2026-11-21', programTitle: 'Grand Economic Gala & Awards', isBusinessWeek: true },
];

export const INNOVATION_WEEKEND_DAYS: DayOption[] = [
  { dayStr: 'Thu 5', dayNumber: 5, dayOfWeek: 'Thu', fullDate: '2026-11-05', programTitle: 'BTF 2.0 Ideation & Problem Validation', isInnovationWeekend: true },
  { dayStr: 'Fri 6', dayNumber: 6, dayOfWeek: 'Fri', fullDate: '2026-11-06', programTitle: 'BTF 2.0 Rapid Prototyping & Mentorship', isInnovationWeekend: true },
  { dayStr: 'Sat 7', dayNumber: 7, dayOfWeek: 'Sat', fullDate: '2026-11-07', programTitle: 'BTF 2.0 Pitch Showcase & Accelerator Trials', isInnovationWeekend: true },
];

export const EventCalendarMultiPicker: React.FC<EventCalendarMultiPickerProps> = ({
  isOpen,
  onClose,
  selectedDays,
  onSaveDays,
  title = 'Select Attendance Days',
  subtitle = 'Click on days to select multiple attendance dates for Óghowa Business Week',
}) => {
  // Local working copy of selected days so user can confirm or cancel
  const [tempSelectedDays, setTempSelectedDays] = useState<string[]>(selectedDays);

  // Sync with prop when opened
  React.useEffect(() => {
    if (isOpen) {
      setTempSelectedDays(selectedDays);
    }
  }, [isOpen, selectedDays]);

  if (!isOpen) return null;

  const toggleDay = (dayStr: string) => {
    if (tempSelectedDays.includes(dayStr)) {
      setTempSelectedDays(tempSelectedDays.filter((d) => d !== dayStr));
    } else {
      setTempSelectedDays([...tempSelectedDays, dayStr]);
    }
  };

  const selectAllBusinessWeek = () => {
    const allBw = BUSINESS_WEEK_DAYS.map((d) => d.dayStr);
    const set = new Set([...tempSelectedDays, ...allBw]);
    setTempSelectedDays(Array.from(set));
  };

  const selectWeekdaysOnly = () => {
    const weekdays = ['Mon 16', 'Tue 17', 'Wed 18', 'Thu 19', 'Fri 20'];
    setTempSelectedDays(weekdays);
  };

  const clearSelection = () => {
    setTempSelectedDays([]);
  };

  const handleApply = () => {
    onSaveDays(tempSelectedDays);
    onClose();
  };

  // November 2026 Calendar Grid:
  // Starts on Sunday Nov 1 (index 0).
  // Total 30 days.
  const weekDaysHeader = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Matrix of 30 days
  const novDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#0A162B] text-white p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D9232A] flex items-center justify-center text-white shrink-0 shadow-sm">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] bg-red-900/60 text-red-200 font-mono px-2 py-0.5 rounded-full border border-red-700/50">
                  Multiple Selection
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close calendar"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Month Indicator & Presets */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#0A162B] tracking-tight">
                November 2026
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                · Benin City Convening
              </span>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={selectAllBusinessWeek}
                className="px-2.5 py-1 text-[11px] font-bold rounded bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-[#D9232A] border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
              >
                All 6 Days
              </button>
              <button
                type="button"
                onClick={selectWeekdaysOnly}
                className="px-2.5 py-1 text-[11px] font-bold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                Mon–Fri
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="px-2 py-1 text-[11px] font-medium rounded text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekDaysHeader.map((d) => (
              <div
                key={d}
                className={`text-[11px] font-bold py-1 ${
                  d === 'Sun' || d === 'Sat' ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid (Nov 1, 2026 is Sunday, index 0) */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {novDays.map((dayNum) => {
              // Day of week for Nov `dayNum`, 2026:
              // Nov 1 is Sunday.
              const dObj = new Date(2026, 10, dayNum); // Month 10 is November
              const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const dow = dayOfWeekNames[dObj.getDay()];
              const dayStr = `${dow} ${dayNum}`;

              // Is this part of Business Week? (Nov 16-21)
              const isBW = dayNum >= 16 && dayNum <= 21;
              // Is this part of Innovation Weekend BTF 2.0? (Nov 5-7)
              const isBTF = dayNum >= 5 && dayNum <= 7;

              const isSelected = tempSelectedDays.includes(dayStr);

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => toggleDay(dayStr)}
                  className={`relative p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center min-h-[46px] border ${
                    isSelected
                      ? 'bg-[#D9232A] text-white border-[#B9181F] shadow-sm scale-[1.02]'
                      : isBW
                      ? 'bg-red-50/70 hover:bg-red-100 text-[#0A162B] border-red-200/80'
                      : isBTF
                      ? 'bg-blue-50/70 hover:bg-blue-100 text-[#0A162B] border-blue-200/80'
                      : 'bg-white hover:bg-slate-100 text-slate-500 border-slate-100'
                  }`}
                >
                  <span className="text-[13px]">{dayNum}</span>
                  <span
                    className={`text-[9px] uppercase tracking-wider font-semibold ${
                      isSelected ? 'text-red-100' : 'text-slate-400'
                    }`}
                  >
                    {dow}
                  </span>

                  {/* Indicator Dot/Badge for Event Days */}
                  {isBW && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9232A] absolute bottom-1" />
                  )}
                  {isBTF && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0022D6] absolute bottom-1" />
                  )}
                  {isSelected && (
                    <Check className="w-3 h-3 text-white absolute top-1 right-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend and Program Summary */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#D9232A]" />
                <strong className="text-slate-700">Business Week (Nov 16–21)</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0022D6]" />
                <span className="text-slate-600">BTF 2.0 (Nov 5–7)</span>
              </span>
            </div>

            {/* Currently selected days list */}
            <div className="pt-1.5 border-t border-slate-200">
              <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Selected Days ({tempSelectedDays.length}):</span>
                {tempSelectedDays.length === 0 && (
                  <span className="text-red-600 text-[10px] font-normal">None selected yet</span>
                )}
              </div>
              {tempSelectedDays.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {tempSelectedDays.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D9232A] text-white text-[11px] font-bold shadow-2xs"
                    >
                      <span>{d}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDay(d);
                        }}
                        className="hover:text-red-200 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">
                  Tap the dates on the calendar above to select multiple days.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 text-xs font-bold text-white bg-[#D9232A] hover:bg-[#B9181F] rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Confirm Selected Dates ({tempSelectedDays.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
