"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getPathname, usePathname } from "../../../i18n/navigation";
import { routing, type Locale } from "../../../i18n/routing";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  zh: "中文",
  ar: "العربية",
};

export default function LanguageSwitcher() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();

  function switchTo(next: Locale) {
    setOpen(false);
    // A full navigation (not router.replace) so the root layout's lang/dir
    // and the theme-init script re-run as a fresh document load rather than
    // a client-side re-render, which React warns about for raw <script> tags.
    window.location.assign(
      getPathname({
        // @ts-expect-error -- pathname is a dynamic union across all routes here
        href: { pathname, params },
        locale: next,
      }),
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("changeLanguage")}
        aria-expanded={open}
        className="flex h-8 items-center justify-center rounded-lg border border-line px-2 text-xs font-medium uppercase tracking-wide text-foreground transition-colors hover:border-accent"
      >
        {locale}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-e-0 top-full z-50 mt-2 w-40 rounded-lg border border-line bg-surface py-1 shadow-lg"
            >
              {routing.locales.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => switchTo(code)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-start text-sm transition-colors hover:bg-background ${
                    code === locale ? "text-accent" : "text-foreground"
                  }`}
                >
                  {LOCALE_LABELS[code]}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
