import React, { useState, useId } from 'react';
import { ChevronDown, HelpCircle, Search, Sparkles, Mail, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { SUMMIT_INQUIRIES } from '../data/summitData';

interface FAQItem {
  id: string;
  category: 'all' | 'summit' | 'deal-room' | 'ventures' | 'governance';
  question: string;
  answer: string;
}

const SUMMIT_FAQS: FAQItem[] = [
  {
    id: 'what-is-oghowa-business-week',
    category: 'summit',
    question: 'What is Oghowa Business Week, and what is its primary economic mandate?',
    answer:
      'Oghowa Business Week is Edo State’s premier institutional leadership and economic summit. Convened by Oghowa Accelerator in strategic alignment with the Edo Investors Network (EIN), the summit gathers policymakers, financial sector leaders, industrial pioneers, and institutional investors in Benin City to mobilize syndication capital (≥ $50M target), modernize industrial corridors, integrate regional value-chains, and publish a statutory economic white paper submitted directly to state development authorities.',
  },
  {
    id: 'who-can-attend-and-accreditation',
    category: 'summit',
    question: 'Who is eligible to attend, and how does executive summit accreditation work?',
    answer:
      'The summit welcomes institutional investors, venture capital and private equity LPs/GPs, industrial manufacturers, high-growth enterprise founders, commercial and development bankers, and senior government policymakers. While plenary sessions and the Innovation Pavilion accommodate registered delegates, access to Closed-Door Deal Rooms and Sovereign-Private Dialogues is strictly restricted to accredited executives via verified accreditation dossiers.',
  },
  {
    id: 'summit-dates-and-venue-security',
    category: 'summit',
    question: 'Where does the summit take place, and what logistics and security protocols are in place?',
    answer:
      'The summit takes place in Benin City, Edo State, Nigeria. Accredited delegates receive a comprehensive concierge briefing including curated executive hotel accommodations, dedicated private transit shuttles between the airport and summit grounds, and round-the-clock security coordination managed in liaison with state and regional authorities.',
  },
  {
    id: 'how-does-deal-room-operate',
    category: 'deal-room',
    question: 'How does the Private Deal Room operate, and what ticket sizes are considered?',
    answer:
      'The Deal Room facilitates curated, closed-door bilateral investment sessions governed by institutional non-disclosure agreements (NDAs). Deal transactions focus on syndicated debt, growth equity, and mezzanine capital ranging between $1M and $10M+ per enterprise. Each venture presentation is pre-cleared by the Oghowa Syndicate steering committee.',
  },
  {
    id: 'vetting-startups-and-pavilion',
    category: 'ventures',
    question: 'How are startups and mid-market enterprises vetted for the Innovation Pavilion & Venture Showcase?',
    answer:
      'Enterprises applying for the Venture Showcase and Innovation Pavilion undergo rigorous diligence by our investment committee. Criteria include verified audited financials, product-market validation with scalable unit economics, corporate governance maturity, and demonstrable capacity to anchor employment and industrial value creation within Edo State and the South-South economic corridor.',
  },
  {
    id: 'ein-alignment-and-accelerator',
    category: 'governance',
    question: 'What is the relationship between Oghowa Accelerator and the Edo Investors Network (EIN)?',
    answer:
      'Oghowa Accelerator operates as the institutional execution engine driving startup acceleration, venture studio incubation, and summit management. The Edo Investors Network (EIN) functions as an ecosystem anchor and angel/syndicate partner, providing capital liquidity, investor mentorship, due diligence syndication, and high-level policy advocacy.',
  },
  {
    id: 'executive-masterclasses-scope',
    category: 'summit',
    question: 'What do the Executive Masterclasses cover, and who are the instructors?',
    answer:
      'The masterclasses are intensive executive capacity modules focusing on: 1) Corporate Governance & Board Scaling (audit-readiness and fiduciary structuring for mid-sized firms); 2) Export Compliance & Trade Logistics (leveraging AfCFTA frameworks and continental standards); and 3) Technology & Enterprise Automation (ERP modernization for legacy businesses). Sessions are led by seasoned market practitioners, legal advisors, and financial regulators.',
  },
  {
    id: 'institutional-sponsorship-tiers',
    category: 'governance',
    question: 'How can corporate bodies and financial institutions participate as official sponsors?',
    answer:
      'Institutional partners can engage through our Platinum, Gold, Silver, and Working Group sponsorship tiers. Benefits include keynote presentations, private deal-room hosting rights, thought leadership white paper co-authorship, brand prominence across all broadcast and print dossiers, and guaranteed C-suite ministerial roundtables. Inquiries should be sent to ogho@metaspaceconsult.com.',
  },
];

export const SummitFAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'what-is-oghowa-business-week': true, // open first by default
  });

  const baseId = useId();

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = SUMMIT_FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="summit-faq"
      className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80"
      aria-labelledby={`${baseId}-faq-heading`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#D9232A] text-xs font-semibold uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Institutional Clarifications</span>
            </div>
            <h2
              id={`${baseId}-faq-heading`}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A162B] tracking-tight"
            >
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              Essential guidance regarding summit accreditation, private deal-room access, capital syndication, and institutional participation in Benin City.
            </p>
          </div>
        </ScrollReveal>

        {/* Search & Category Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search summit questions (e.g. accreditation, deal room, EIN)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0022D6] focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
              aria-label="Filter frequently asked questions"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'summit', label: 'Summit & Attendance' },
              { id: 'deal-room', label: 'Deal Room & Capital' },
              { id: 'ventures', label: 'Ventures & Pavilion' },
              { id: 'governance', label: 'Governance & EIN' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0A162B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Component */}
        <div className="space-y-3" role="region" aria-label="Summit Frequently Asked Questions List">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 p-6">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No matching questions found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for broader terms or reach out directly to the Secretariat at{' '}
                <a href={`mailto:${SUMMIT_INQUIRIES.email}`} className="text-[#D9232A] underline">
                  {SUMMIT_INQUIRIES.email}
                </a>.
              </p>
            </div>
          ) : (
            filteredFaqs.map((item, index) => {
              const isOpen = !!openIds[item.id];
              const buttonId = `${baseId}-btn-${item.id}`;
              const panelId = `${baseId}-panel-${item.id}`;

              return (
                <div
                  key={item.id}
                  className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-[#0022D6]/30 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleAccordion(item.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0022D6]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-[#0A162B]">
                          {item.question}
                        </span>
                      </div>
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-200 ${
                          isOpen
                            ? 'rotate-180 bg-[#0022D6] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`transition-all duration-200 ease-in-out ${
                      isOpen ? 'block px-5 pb-5 pt-1' : 'hidden'
                    }`}
                  >
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Direct Advisory Assistance Banner */}
        <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-[#D9232A] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0A162B]">
                Have a customized inquiry or diplomatic delegation request?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct all confidential correspondence to the executive secretariat at <strong className="text-slate-800">{SUMMIT_INQUIRIES.email}</strong>.
              </p>
            </div>
          </div>

          <a
            href="#inquiries"
            className="w-full sm:w-auto px-4 py-2.5 bg-[#0A162B] hover:bg-[#0022D6] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Dispatch Inquiry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
