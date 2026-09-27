import { useTranslations } from "next-intl";

const GITHUB_URL = "https://github.com/Ayoub-EDAHLOULI/Rezulens-Frontend";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          {t.rich("openSource", {
            link: (chunks) => (
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
        <p className="font-mono text-xs uppercase tracking-widest">
          {t("tagline")}
        </p>
      </div>
    </footer>
  );
}
