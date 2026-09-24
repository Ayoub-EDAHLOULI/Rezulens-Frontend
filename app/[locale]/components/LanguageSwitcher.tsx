"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "../../../i18n/navigation";
import { routing, type Locale } from "../../../i18n/routing";
import PageTransitionOverlay from "./PageTransitionOverlay";

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
  const [isPending, startTransition] = useTransition();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function switchTo(next: Locale) {
    setOpen(false);
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- pathname is a dynamic union across all routes here
        { pathname, params },
        { locale: next },
      );
    });
  }

  return (
    <div className="relative">
      <PageTransitionOverlay show={isPending} />
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
