# 📘 ÓGHOWA Platform — Editing & Customization Guide

This guide details exactly **where to change everything** on the ÓGHOWA web application.

---

## ⚡ Option 1: Fast In-Browser Customizer (No Code Needed!)

We built an interactive **"⚡ Customize Site / Edit Content"** button located at the bottom-right of the screen.
- Click it at any time to edit:
  - **Hero Title & Headlines**
  - **Subtitles & Mission Descriptions**
  - **Button Action Texts**
  - **Brand Name & Tagline**
  - **Contact Email, Phone & Address**
  - **Animation Settings & Preloader Replay**
- Your edits **save automatically to browser storage** so you can see them live immediately.
- You can click **"Copy Current Edits"** inside the editor to copy the clean TypeScript code directly to your clipboard!

---

## 💻 Option 2: Codebase Direct File Map

If you are modifying code in Git / VS Code, here is where each element lives:

### 1. Main Headlines, Taglines, Contact Info, & Settings
📁 **File:** `/src/data/siteConfig.ts`
- **Brand name**: change `name: 'ÓGHOWA'`
- **Tagline**: change `tagline: "Building Africa's Innovation Economy"`
- **Hero Eyebrow**: change `eyebrow: 'The Venture Building Ecosystem for Africa'`
- **Hero Headline**: change `headlineLine1` and `headlineLine2`
- **Hero Description**: change `description`
- **Contact Details**: change `email`, `phone`, `location`, and social handles

---

### 2. Audience Roles ("Who We Serve" Section)
📁 **File:** `/src/data/mockData.ts` (Lines 11–90, `AUDIENCE_ROLES`)
- Change the 6 audience categories:
  - Founders
  - Investors
  - Corporates
  - Government
  - Universities
  - Ecosystem Partners
- Edit titles, descriptions, and bullet points.

---

### 3. The 6 Venture Journey Steps ("Discover, Build, Validate, Fund, Scale, Exit")
📁 **File:** `/src/data/mockData.ts` (Lines 92–180, `JOURNEY_STEPS`)
- Edit the step numbers, stage titles, descriptions, and detailed milestone checklists.
- `isHighlighted: true` sets the special brand red card (currently on *Step 4: Fund*).

---

### 4. The 6 Flagship Platforms & Dedicated Program Pages
📁 **File:** `/src/data/mockData.ts` (Lines 182–407, `FLAGSHIP_PROGRAMS`)
- Customize full program profiles:
  - **Oghowa Innovation Weekend**
  - **Oghowa Incubation Program**
  - **Oghowa Venture Studio**
  - **Oghowa Capital Network**
  - **Oghowa Business Week**
  - **Oghowa Research & Policy Lab**
- Edit sprint durations, target audience, key statistics, benefits, and banner imagery.

---

### 5. Infrastructure Capabilities Matrix ("Infrastructure That Builds Businesses")
📁 **File:** `/src/data/mockData.ts` (Lines 409–422, `INFRASTRUCTURE_ITEMS`)
- Customize the 12 capability cards:
  - Cloud Infrastructure, AI Platforms, Payments, Legal & Compliance, BI, Logistics, Talent, Marketing, Software Tools, Cybersecurity, Enterprise, and Global Networks.

---

### 6. Verified Impact Numbers ("Our Impact" Section)
📁 **File:** `/src/data/mockData.ts` (Lines 424–431, `IMPACT_STATS`)
- Edit the headline metrics:
  - `100+` Ventures Supported
  - `₦500M+` Capital Facilitated
  - `5,000+` Community Members
  - `50+` Strategic Partners
  - `12` Innovation Sectors
  - `20+` Programs & Initiatives

---

### 7. Featured Portfolio Startups ("Featured Ventures" Section)
📁 **File:** `/src/data/mockData.ts` (Lines 433–486, `FEATURED_VENTURES`)
- Add or edit portfolio companies:
  - Ugbokhun (EdTech)
  - Edulida (Transit Tech)
  - Cyena Medicare (HealthTech)
  - Future Ventures (Coming Soon)
- Customize sectors, metrics, and descriptions.

---

### 8. Institutional Partners & Logo Badges ("Our Partners" Section)
📁 **File:** `/src/data/mockData.ts` (Lines 488–500, `PARTNERS`)
- Add or edit partners (Edo State Government, University of Benin, Sterling Bank, Microsoft, AWS, MTN, Dangote, GIZ, Standard Chartered, AFD).

---

### 9. Company Logo & Animations
📁 **File:** `/src/components/Logo.tsx`
- Contains the SVG emblem of the Benin Royal Ivory Crown / Coral Bead Medallion with the glowing ruby gem and orbital light tracer.

📁 **File:** `/src/components/Preloader.tsx`
- Contains the full-screen intro animation with progress tracker, rotating beaded emblem, and loading sequence.

---

### 10. Scroll Animations (IntersectionObserver)
📁 **File:** `/src/components/ScrollReveal.tsx`
- Component handling smooth intersection-observer based scroll reveals with custom `direction`, `delay`, `duration`, and `distance`.
