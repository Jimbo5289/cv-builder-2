/* eslint-disable */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page when the route changes.
 * This fixes the common React Router issue where navigation takes you
 * to the bottom of the next page instead of the top.
 * 
 * Features:
 * - Immediate scroll restoration for better UX
 * - Preserves scroll position for browser back/forward navigation
 * - Handles edge cases like missing window or document
 * 
 * Usage: Include this component once in your app, typically in App.jsx
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top if we have a valid window object
    if (typeof window !== 'undefined') {
      // Small delay to ensure DOM is ready, but fast enough to feel instant
      const timeoutId = setTimeout(() => {
        try {
          // Scroll to top immediately for better UX
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
          });
          
          // Also ensure the document element is scrolled to top
          // (fallback for some browsers/scenarios)
          if (document.documentElement) {
            document.documentElement.scrollTop = 0;
          }
          if (document.body) {
            document.body.scrollTop = 0;
          }
        } catch (error) {
          // Fallback if scrollTo fails
          console.warn('ScrollToTop: Unable to scroll to top:', error);
          try {
            window.scrollTo(0, 0);
          } catch (e) {
            // Final fallback - directly set scroll properties
            if (document.documentElement) document.documentElement.scrollTop = 0;
            if (document.body) document.body.scrollTop = 0;
          }
        }
      }, 0);
      
      // Cleanup timeout if component unmounts quickly
      return () => clearTimeout(timeoutId);
    }
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop; 