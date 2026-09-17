import React from 'react';
import { SummitHero } from './SummitHero';
import { SummitGovernance } from './SummitGovernance';
import { SummitPillars } from './SummitPillars';
import { SummitDealRoom } from './SummitDealRoom';
import { SummitSplitMasterclassesPavilion } from './SummitSplitMasterclassesPavilion';
import { SummitPartnership } from './SummitPartnership';
import { SummitFAQ } from './SummitFAQ';
import { SummitInquiries } from './SummitInquiries';

interface SummitPageProps {
  onRequestExecutiveAccess: (role?: string) => void;
  onDownloadProspectus: () => void;
}

export const SummitPage: React.FC<SummitPageProps> = ({
  onRequestExecutiveAccess,
  onDownloadProspectus,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      {/* 1. Summit Header with Carousel Background & 3-Button Quick Action Bar */}
      <SummitHero
        onRequestExecutiveAccess={() => onRequestExecutiveAccess('Executive Delegate')}
        onDownloadProspectus={onDownloadProspectus}
        onViewDealRoomSchedule={() => scrollToSection('deal-room')}
        onExplorePillars={() => scrollToSection('pillars')}
      />

      {/* 2. Advisory Council & Institutional Governance (EIN Alignment) */}
      <SummitGovernance
        onRequestAdvisoryBrief={() => onRequestExecutiveAccess('Advisory Council Liaison')}
      />

      {/* 3. Core Strategic Pillars (4-Column Matrix) */}
      <SummitPillars
        onSelectPillar={() => onRequestExecutiveAccess('Pillar Working Group')}
      />

      {/* 4. Deal-Room & Investment Architecture (3 Panels: Private Deal Rooms, Venture Showcase, Sovereign-Private Dialogues) */}
      <SummitDealRoom
        onRequestDealRoomAccess={() => onRequestExecutiveAccess('Institutional Investor')}
      />

      {/* 5. Executive Masterclasses & Innovation Pavilion (Split Layout: Masterclasses on Left, Pavilion on Right) */}
      <SummitSplitMasterclassesPavilion
        onRegisterMasterclass={(className) =>
          onRequestExecutiveAccess(`Masterclass Delegate: ${className}`)
        }
        onRegisterExhibitor={(pavilionName) =>
          onRequestExecutiveAccess(`Pavilion Exhibitor: ${pavilionName}`)
        }
      />

      {/* 6. Partnership Tiers (Thought Leadership, C-Suite Access, Brand Equity) */}
      <SummitPartnership
        onInquirePartnership={(tierTitle) =>
          onRequestExecutiveAccess(`Institutional Partner: ${tierTitle}`)
        }
      />

      {/* 7. Accessible Summit FAQ Accordion */}
      <SummitFAQ />

      {/* 8. Official Inquiries Channel & Formspree API */}
      <SummitInquiries
        onRequestExecutiveAccess={() => onRequestExecutiveAccess('Executive Delegate')}
      />
    </div>
  );
};
