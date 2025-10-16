/* eslint-disable react/prop-types */
// src/utils/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";



export default function ScrollToTop({ children, smooth = true }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      if (smooth && "scrollBehavior" in document.documentElement.style) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } else {
        window.scrollTo(0, 0);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname, smooth]);

  return children || null;
}
