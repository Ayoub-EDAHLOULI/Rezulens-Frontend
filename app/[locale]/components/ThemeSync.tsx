"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

// A client-side navigation re-renders <html>, and since data-theme is set
// imperatively (not from JSX), React's reconciler strips it on that
// re-render. This re-applies the saved preference after every navigation so
// the theme survives soft (client-side) route changes, not just hard loads.
export default function ThemeSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    try {
      const theme = localStorage.getItem("theme");
      if (theme === "light" || theme === "dark") {
        document.documentElement.setAttribute("data-theme", theme);
      }
    } catch {
      // Best-effort only.
    }
  }, [pathname]);

  return null;
}
