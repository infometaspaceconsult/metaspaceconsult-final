import React from 'react';
import { Hero } from './Hero';
import { WhoWeServe } from './WhoWeServe';
import { OghowaJourney } from './OghowaJourney';
import { FlagshipPlatforms } from './FlagshipPlatforms';
import { SummitImpact } from './SummitImpact';
import { FeaturedVentures } from './FeaturedVentures';
import { PartnersSection } from './PartnersSection';
import { ProgramId, Venture } from '../types';

interface EcosystemHomeProps {
  onRequestExecutiveAccess: () => void;
  onDownloadProspectus: () => void;
  onSelectRole: (roleId: string) => void;
  onSelectProgram: (programId: ProgramId) => void;
  onSelectVenture?: (venture: Venture) => void;
  onNavigateSummit?: () => void;
}

/**
 * Prompt 2: Homepage (Ecosystem Hub)
 * Harmonizing the ecosystem visual layout with the institutional summit details:
 * 1. Hero Section (with carousel background, Audience Track Strip, Badge, Headline, Subheadline, CTAs)
 * 2. Who We Serve (6-Card Grid: Founders, Investors, Corporates, Government, Universities, Ecosystem Partners)
 * 3. Strategic Journey (6-step roadmap: Discover → Build → Validate → Fund → Scale → Exit & Reinvest)
 * 4. Flagship Platforms Grid (Innovation Weekend, Venture Studio, Incubation, Capital Network, Business Week Summit, Research & Policy Lab)
 * 5. Measurable Impact Commitments Banner (Target 1: ≥ $50M, Target 2: 150+, Target 3: 1 Actionable Economic White Paper)
 * 6. Featured Ventures Showcase (Ugbekun, EduRide, Cysma Medicare, Future Ventures)
 * 7. Institutional Anchors & Partners Carousel (Edo State Government, EIN, financial institutions, multinational partners)
 */
export const EcosystemHome: React.FC<EcosystemHomeProps> = ({
  onRequestExecutiveAccess,
  onDownloadProspectus,
  onSelectRole,
  onSelectProgram,
  onSelectVenture,
}) => {
  return (
    <div className="w-full">
      {/* 1. Hero Section with Carousel & Audience Track Strip */}
      <Hero
        onRequestExecutiveAccess={onRequestExecutiveAccess}
        onDownloadProspectus={onDownloadProspectus}
        onSelectRoleFilter={onSelectRole}
      />

      {/* 2. Who We Serve (6-Card Grid) */}
      <WhoWeServe onSelectRole={onSelectRole} />

      {/* 3. Strategic Journey (6-Step Roadmap) */}
      <OghowaJourney onExploreStep={() => onRequestExecutiveAccess()} />

      {/* 4. Flagship Platforms Grid (6 Platforms) */}
      <FlagshipPlatforms onSelectProgram={onSelectProgram} />

      {/* 5. Measurable Impact Commitments Banner */}
      <SummitImpact onDownloadWhitepaperBrief={onDownloadProspectus} />

      {/* 6. Featured Ventures Showcase */}
      <FeaturedVentures onSelectVenture={onSelectVenture} />

      {/* 7. Institutional Anchors & Partners Carousel */}
      <PartnersSection />
    </div>
  );
};
