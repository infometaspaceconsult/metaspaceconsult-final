import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show only once user has scrolled past hero section (approx 450px)
      const heroElement = document.getElementById('summit-hero') || document.getElementById('ecosystem-hero');
      if (heroElement) {
        const heroBottom = heroElement.getBoundingClientRect().bottom;
        setIsVisible(heroBottom < 0 || window.scrollY > 450);
      } else {
        setIsVisible(window.scrollY > 450);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      id="back-to-top-btn"
      onClick={scrollToTop}
      aria-label="Back to top of page"
      title="Back to top"
      className="fixed bottom-6 right-6 z-40 p-3 bg-[#0A162B] hover:bg-[#0022D6] text-white rounded-full shadow-lg border border-slate-700/50 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0022D6] focus:ring-offset-2 group"
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
      <span className="sr-only">Back to top</span>
    </button>
  );
};
