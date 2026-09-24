import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import "./globals.css";

// Runs before paint to apply any saved theme preference immediately —
// avoids a flash from the system-default theme to the saved one. Inline and
// tiny on purpose; anything more belongs in a real module.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var theme = localStorage.getItem("theme");
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  } catch (e) {}
})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RezuLens — Transparent ATS Resume Scoring",
  description:
    "See exactly why your resume scored what it scored. Deterministic, rule-based resume scoring — no AI in the loop, nothing stored.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // The inline script below sets data-theme on this element before React
      // hydrates, based on a saved preference the server can't know about —
      // an intentional, expected mismatch for a flash-free theme toggle, not
      // a real bug. This tells React not to warn about it.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
