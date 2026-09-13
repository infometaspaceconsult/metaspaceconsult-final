import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BackToTopProps {
  threshold?: number;
}

export default function BackToTop({ threshold = 320 }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    // Check initial scroll on mount
    checkScroll();

    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll back to top"
          title="Back to Top"
          className="fixed bottom-24 right-5 sm:right-7 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-brand-blue text-brand-blue hover:text-white border border-gray-200/90 hover:border-brand-blue shadow-lg hover:shadow-xl flex items-center justify-center transition-colors duration-200 backdrop-blur-md group focus:outline-none focus:ring-2 focus:ring-brand-blue/30 cursor-pointer"
        >
          <ArrowUp
            size={18}
            className="sm:w-5 sm:h-5 transition-transform duration-200 group-hover:-translate-y-0.5"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
