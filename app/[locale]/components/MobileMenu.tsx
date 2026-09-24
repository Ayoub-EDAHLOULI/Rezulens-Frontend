"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "../../../i18n/navigation";

export default function MobileMenu() {
  const nav = useTranslations("nav");
  const menu = useTranslations("menu");
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/how-it-works" as const, label: nav("howItWorks") },
    { href: "/score" as const, label: nav("scoreResume") },
  ];

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? menu("closeMenu") : menu("openMenu")}
        aria-expanded={open}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line text-foreground transition-colors hover:border-accent"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          aria-hidden="true"
        >
          {open ? (
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="M6 6l12 12M18 6L6 18"
            />
          ) : (
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="M4 7h16M4 12h16M4 17h16"
            />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-0 top-full border-b border-line bg-surface px-4 py-4 shadow-lg"
          >
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-background hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
