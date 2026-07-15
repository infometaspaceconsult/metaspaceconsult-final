import React, { useState } from "react";
import { Venture, ContactMessage } from "../types";
import { Send, MapPin, Mail, Phone, ChevronRight, CheckCircle, Info } from "lucide-react";

interface MetaspacePreviewProps {
  ventures: Venture[];
  onSendMessage: (msg: ContactMessage) => void;
  messages: ContactMessage[];
}

export default function MetaspacePreview({ ventures, onSendMessage, messages }: MetaspacePreviewProps) {
  // Category filters
  const [activeCategory, setActiveCategory] = useState("All");

  // Contact form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Filter ventures
  const categories = ["All", "EdTech", "HealthTech", "Logistics", "Incubator"];
  const filteredVentures = activeCategory === "All"
    ? ventures
    : ventures.filter(v => v.category.toLowerCase() === activeCategory.toLowerCase());

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formSubject || !formMessage) return;

    onSendMessage({
      name: formName,
      email: formEmail,
      subject: formSubject,
      message: formMessage,
      created_at: new Date().toLocaleTimeString()
    });

    setFormSuccess(true);
    setFormName("");
    setFormEmail("");
    setFormSubject("");
    setFormMessage("");

    setTimeout(() => {
      setFormSuccess(false);
    }, 5000);
  };

  return (
    <div className="bg-surface text-on-surface font-sans" id="metaspace-live-preview">
      {/* Top Banner indicating this is a Live Site Preview */}
      <div className="bg-deep-navy text-indigo-100 text-[11px] py-2 px-4 text-center font-semibold flex items-center justify-center gap-2 border-b border-white/5">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        <span>Metaspace Consulting Live Preview - This simulates database-driven PHP rendering</span>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[640px] flex items-center py-20 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3e4azAGUiyLmHkcYq3MXXy2uq4kgU0dVDFXB-rCSWcakzrU7rkJV_m63h2d2rixCTEhqBHmTaabsZYjZS3x0QJTD5Sjalf3ldqfbhFolRnlUjJtZxeSS7u_siP967QzYI39fWjL6AjrTdu4Njhz4y1BuJojpnH1OBmW15851fYlTn0OjziyMMs6qQaMXPD2akUaZ5dHKkqSDni3PpgFhFW2clFdsRNj4QD8yG1e6_IwffEqtlWI10-7_L2dkMwOP5c7vltWbCBaE')",
            opacity: 0.15
          }}
        ></div>
        {/* Gradients */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-surface via-surface/90 to-transparent"></div>
        <div className="absolute inset-0 z-10 hero-bg-pattern"></div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-3xl">
            <div className="border-l-4 border-innovation-red pl-4 mb-6">
              <p className="font-sans font-semibold text-slate-gray tracking-wider uppercase text-xs md:text-sm">
                Building Systems. Empowering People.
              </p>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-deep-navy leading-none mb-6">
              Building Systems.<br />
              Empowering People.<br />
              <span className="text-innovation-red">Transforming Africa.</span>
            </h1>
            <p className="font-sans text-base md:text-lg text-slate-gray mb-10 max-w-xl leading-relaxed">
              We design, build and scale innovative ventures and digital solutions that solve real problems and drive sustainable economic transformation across Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#live-portfolio"
                className="bg-innovation-red hover:bg-opacity-95 text-white font-bold text-xs py-4 px-8 rounded-lg flex items-center justify-center gap-2 tracking-wider uppercase shadow-lg shadow-innovation-red/10 group transition-all"
              >
                Explore Ventures
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#live-contact"
                className="bg-transparent border border-deep-navy text-deep-navy hover:bg-surface-ice font-bold text-xs py-4 px-8 rounded-lg flex items-center justify-center gap-2 tracking-wider uppercase transition-all"
              >
                Partner With Us
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Services Pillars */}
      <section className="bg-deep-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-innovation-red transform skew-x-12 translate-x-20 opacity-90 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="p-8 md:p-12 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-white text-4xl mb-4 group-hover:scale-110 transition-transform">
                tips_and_updates
              </span>
              <h3 className="font-display font-bold text-lg mb-2">Venture Design Studio</h3>
              <p className="text-xs text-indigo-200/80 leading-relaxed mt-1">Co-creating scalable startups optimized for systemic impact and rapid market entry.</p>
            </div>
            <div className="p-8 md:p-12 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-white text-4xl mb-4 group-hover:scale-110 transition-transform">
                integration_instructions
              </span>
              <h3 className="font-display font-bold text-lg mb-2">Digital Transformation</h3>
              <p className="text-xs text-indigo-200/80 leading-relaxed mt-1">Infusing industry-leading technologies and cloud infrastructures into enterprise workflows.</p>
            </div>
            <div className="p-8 md:p-12 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-white text-4xl mb-4 group-hover:scale-110 transition-transform">
                hub
              </span>
              <h3 className="font-display font-bold text-lg mb-2">Innovation Ecosystem Builder</h3>
              <p className="text-xs text-indigo-200/80 leading-relaxed mt-1">Connecting governments, institutional funds, and outstanding creators across boundaries.</p>
            </div>
            <div className="p-8 md:p-12 hover:bg-white/5 transition-colors cursor-pointer group lg:bg-transparent bg-innovation-red/90">
              <span className="material-symbols-outlined text-white text-4xl mb-4 group-hover:scale-110 transition-transform">
                moving
              </span>
              <h3 className="font-display font-bold text-lg mb-2">Strategy & Advisory</h3>
              <p className="text-xs text-indigo-200/80 leading-relaxed mt-1">Navigating regulatory horizons, investment dynamics, and growth paths in Africa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Ventures Section */}
      <section className="py-24 px-6 md:px-12 bg-white" id="live-portfolio">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-innovation-red uppercase tracking-wider">Dynamic Portfolio</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-deep-navy mt-2">Active Ventures Portfolio</h2>
            <p className="font-sans text-sm md:text-base text-slate-gray max-w-2xl mx-auto mt-3">
              Purpose-built enterprises tackling Africa's critical challenges in real-time.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${activeCategory === cat ? "bg-deep-navy text-white border-deep-navy" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVentures.map(v => (
              <div
                key={v.id}
                className="bg-white rounded-xl p-8 border border-slate-100 card-shadow hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-surface-ice flex items-center justify-center text-deep-navy mb-6">
                    <span className="material-symbols-outlined text-2xl">{v.icon}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-deep-navy mb-2">{v.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">{v.description}</p>
                </div>
                <div className="flex justify-between items-center mt-auto border-t border-slate-50 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-surface-ice text-deep-navy px-2.5 py-1 rounded">
                    {v.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">id: {v.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info & Stats Bento */}
      <section className="py-24 px-6 md:px-12 bg-slate-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Who We Are */}
          <div className="bg-surface-ice rounded-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden border border-slate-100">
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-deep-navy/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <span className="text-xs font-bold text-innovation-red uppercase tracking-wider">Ecosystem Builders</span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-deep-navy mt-2 mb-4">Empowering Generations</h2>
              <p className="font-sans text-xs md:text-sm text-slate-gray leading-relaxed mb-6">
                Metaspace Consulting Limited combines customized regional studies with leading technological frameworks. We design and launch self-sustaining pipelines across logistics, technology, healthcare, and educational management.
              </p>
              <a href="#live-contact" className="text-xs font-bold text-deep-navy hover:text-innovation-red flex items-center gap-1 transition-colors w-max">
                Learn how to partner with us <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 md:p-12 flex flex-col justify-center card-shadow">
            <h2 className="font-display text-2xl font-extrabold text-deep-navy mb-8">
              We don't just build companies.<br />
              <span className="text-innovation-red">We construct lasting systems.</span>
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="font-display text-2xl md:text-3xl font-extrabold text-deep-navy">{ventures.length}</div>
                <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Ventures</div>
              </div>
              <div className="text-center border-x border-slate-100">
                <div className="font-display text-2xl md:text-3xl font-extrabold text-deep-navy">30+</div>
                <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Ecosystem Partners</div>
              </div>
              <div className="text-center">
                <div className="font-display text-2xl md:text-3xl font-extrabold text-deep-navy">1000+</div>
                <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Lives Impacted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Contact Form Section */}
      <section className="py-24 px-6 md:px-12 bg-white" id="live-contact">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-innovation-red uppercase tracking-wider">Secure Channel</span>
            <h2 className="font-display text-3xl font-extrabold text-[#141B77] mt-2 mb-4">Partner With Metaspace</h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              Ready to construct Africa's digital roadmap? Tell us about your organization and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Form side */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-8 card-shadow">
              {formSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-deep-navy">Message Logged Successfully!</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm">
                    Your contact attempt was simulated. In cPanel hosting, this executes a MySQL Prepared Statement in <code className="bg-slate-100 px-1 rounded font-mono text-red-600">contact.php</code> to log this securely.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      placeholder="Partnership Opportunity"
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Your Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Discussing regional infrastructure, technology acceleration..."
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-deep-navy hover:bg-opacity-95 text-white font-bold text-xs py-3.5 rounded-lg uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Proposal
                  </button>
                </form>
              )}
            </div>

            {/* Information side */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-deep-navy text-sm font-display mb-4">Contact Directory</h4>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <MapPin className="w-4 h-4 text-innovation-red shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-700">Office Location</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">Benin City, Edo State, Nigeria</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Mail className="w-4 h-4 text-innovation-red shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-700">Email Address</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">info@metaspaceconsulting.com</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone className="w-4 h-4 text-innovation-red shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-700">Phone Hotline</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">+234 XXX XXX XXXX</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-100 rounded-xl mt-6 lg:mt-0">
                <h5 className="text-xs font-bold text-deep-navy flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-innovation-red" />
                  Database Logs
                </h5>
                <p className="text-[10px] text-slate-500 leading-normal mt-1">
                  Submissions are recorded in standard PHP variables in this sandbox view. Check the dashboard logs panel to verify submissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator Log Table */}
      {messages.length > 0 && (
        <section className="py-12 bg-slate-50 px-6 border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <h4 className="text-xs font-bold text-deep-navy font-display uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              Live Simulated MySQL Database - `contact_messages` Table
            </h4>
            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden card-shadow">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-bold text-deep-navy">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {messages.map((m, idx) => (
                    <tr key={idx} className="text-slate-600 hover:bg-slate-50/50">
                      <td className="p-4 font-semibold">{m.name}</td>
                      <td className="p-4 font-mono text-[11px]">{m.email}</td>
                      <td className="p-4">{m.subject}</td>
                      <td className="p-4 text-slate-400 text-[10px]">{m.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#141B77] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-xs text-indigo-200/40">
          © 2026 Metaspace Consulting Limited. All rights reserved. Deployed via cPanel PHP/MySQL Exporter.
        </div>
      </footer>
    </div>
  );
}
