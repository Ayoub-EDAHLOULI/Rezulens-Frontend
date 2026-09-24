import { useTranslations } from "next-intl";
import { Link } from "../../i18n/navigation";
import { AnimatedNumber } from "./components/AnimatedNumber";
import { Reveal, RevealGroup, RevealItem } from "./components/Reveal";

const EXAMPLE = {
  overallScore: 78,
  keywordOverlap: {
    score: 82,
    matched: ["Python", "SQL", "AWS", "Docker"],
    missing: ["Kubernetes"],
  },
  completeness: {
    score: 89,
  },
  formatting: {
    score: 67,
  },
};

export default function Home() {
  const t = useTranslations("home");

  const modules = [
    {
      name: t("modules.keywordOverlap.name"),
      weight: "50%",
      description: t("modules.keywordOverlap.description"),
    },
    {
      name: t("modules.completeness.name"),
      weight: "25%",
      description: t("modules.completeness.description"),
    },
    {
      name: t("modules.formatting.name"),
      weight: "25%",
      description: t("modules.formatting.description"),
    },
  ];

  const completenessChecks = [
    { passed: true, detail: t("example.completeness.check1") },
    { passed: true, detail: t("example.completeness.check2") },
    { passed: false, detail: t("example.completeness.check3") },
  ];

  const formattingChecks = [
    { passed: true, detail: t("example.formatting.check1") },
    { passed: false, detail: t("example.formatting.check2") },
  ];

  const comparison = [
    { ai: t("comparison.row1.ai"), rezulens: t("comparison.row1.rezulens") },
    { ai: t("comparison.row2.ai"), rezulens: t("comparison.row2.rezulens") },
    { ai: t("comparison.row3.ai"), rezulens: t("comparison.row3.rezulens") },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-28 px-4 py-16 sm:px-6 sm:py-24">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <Reveal>
            <div className="flex flex-col gap-6">
              <span className="w-fit rounded-full bg-accent-soft px-3 py-1 font-mono text-xs uppercase tracking-widest text-accent">
                {t("badge")}
              </span>
              <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                {t("heroTitle")}
              </h1>
              <p className="max-w-prose text-lg text-muted leading-relaxed">
                {t("heroSubtitle")}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/score"
                  className="rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground transition-opacity hover:opacity-90"
                >
                  {t("scoreYourResume")}
                </Link>
                <Link
                  href="/how-it-works"
                  className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                  {t("seeHowScoringWorks")} →
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-10">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                {t("realScoreStartToFinish")}
              </span>
              <div className="flex items-baseline gap-2">
                <AnimatedNumber
                  value={78}
                  className="font-mono text-8xl font-semibold tabular-nums text-accent"
                />
                <span className="text-2xl text-muted">/ 100</span>
              </div>
              <div className="flex h-2 w-full max-w-56 overflow-hidden rounded-full bg-background">
                <div className="bg-accent" style={{ width: "50%" }} />
                <div className="bg-accent/60" style={{ width: "25%" }} />
                <div className="bg-accent/30" style={{ width: "25%" }} />
              </div>
              <span className="text-center text-xs text-muted">
                {t("weightedFrom")}
              </span>
            </div>
          </Reveal>
        </section>

        <section className="flex flex-col gap-10">
          <Reveal>
            <div className="flex flex-col gap-3 text-center">
              <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
                {t("exampleResult")}
              </h2>
              <p className="mx-auto max-w-xl text-2xl font-semibold tracking-tight text-balance">
                {t("exampleResultSubtitle")}
              </p>
              <p className="mx-auto max-w-prose text-sm text-muted">
                {t("illustrativeData")}{" "}
                <Link
                  href="/score"
                  className="text-accent underline underline-offset-4"
                >
                  /score
                </Link>
                .
              </p>
            </div>
          </Reveal>

          <RevealGroup className="flex flex-col gap-6" stagger={0.1}>
            <RevealItem>
              <div className="flex flex-col gap-6 rounded-xl border border-line bg-surface p-6 sm:p-8">
                <div className="flex items-baseline gap-4">
                  <AnimatedNumber
                    value={EXAMPLE.overallScore}
                    className="font-mono text-5xl font-semibold tabular-nums"
                  />
                  <span className="text-muted">{t("overallOutOf100")}</span>
                </div>
                <div className="flex h-2 overflow-hidden rounded-full bg-background">
                  <div className="bg-accent" style={{ width: "50%" }} />
                  <div className="bg-accent/60" style={{ width: "25%" }} />
                  <div className="bg-accent/30" style={{ width: "25%" }} />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted">
                  <span>{modules[0].name} · 50%</span>
                  <span>{modules[1].name} · 25%</span>
                  <span>{t("modules.formattingShort")} · 25%</span>
                </div>
              </div>
            </RevealItem>

            <div className="grid gap-6 sm:grid-cols-3">
              <RevealItem>
                <ExampleCard
                  title={modules[0].name}
                  score={EXAMPLE.keywordOverlap.score}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {EXAMPLE.keywordOverlap.matched.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-good-bg px-2.5 py-1 font-mono text-[11px] text-good"
                      >
                        {skill}
                      </span>
                    ))}
                    {EXAMPLE.keywordOverlap.missing.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-bad-bg px-2.5 py-1 font-mono text-[11px] text-bad"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </ExampleCard>
              </RevealItem>

              <RevealItem>
                <ExampleCard
                  title={modules[1].name}
                  score={EXAMPLE.completeness.score}
                >
                  <ExampleChecks checks={completenessChecks} />
                </ExampleCard>
              </RevealItem>

              <RevealItem>
                <ExampleCard
                  title={t("modules.formattingShort")}
                  score={EXAMPLE.formatting.score}
                >
                  <ExampleChecks checks={formattingChecks} />
                </ExampleCard>
              </RevealItem>
            </div>
          </RevealGroup>
        </section>

        <section className="flex flex-col gap-10">
          <Reveal>
            <div className="flex flex-col gap-3 text-center">
              <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
                {t("whyNotJustUseAi")}
              </h2>
              <p className="mx-auto max-w-xl text-2xl font-semibold tracking-tight text-balance">
                {t("comparisonSubtitle")}
              </p>
            </div>
          </Reveal>

          <RevealGroup className="flex flex-col gap-4" stagger={0.08}>
            {comparison.map((row) => (
              <RevealItem key={row.ai}>
                <div className="grid gap-4 rounded-xl border border-line bg-surface p-5 sm:grid-cols-2 sm:p-6">
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bad-bg text-[11px] font-bold text-bad">
                      ✗
                    </span>
                    <p className="text-sm text-muted leading-relaxed">
                      {row.ai}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-good-bg text-[11px] font-bold text-good">
                      ✓
                    </span>
                    <p className="text-sm leading-relaxed">{row.rezulens}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        <section className="flex flex-col gap-6">
          <Reveal>
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
              {t("threeModulesOneScore")}
            </h2>
          </Reveal>
          <RevealGroup className="grid gap-4 sm:grid-cols-3" stagger={0.1}>
            {modules.map((mod) => (
              <RevealItem key={mod.name}>
                <div className="flex h-full flex-col gap-2 rounded-xl border border-line bg-surface p-5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-medium">{mod.name}</h3>
                    <span className="font-mono text-xs tabular-nums text-accent">
                      {mod.weight}
                    </span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    {mod.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      </div>
    </div>
  );
}

function ExampleCard({
  title,
  score,
  children,
}: {
  title: string;
  score: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="font-mono text-xs tabular-nums text-muted">
          {score}/100
        </span>
      </div>
      {children}
    </div>
  );
}

function ExampleChecks({
  checks,
}: {
  checks: { passed: boolean; detail: string }[];
}) {
  return (
    <ul className="flex flex-col gap-1.5">
      {checks.map((c) => (
        <li key={c.detail} className="flex items-start gap-2 text-xs">
          <span
            className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
              c.passed ? "bg-good-bg text-good" : "bg-bad-bg text-bad"
            }`}
            aria-hidden="true"
          >
            {c.passed ? "✓" : "✗"}
          </span>
          <span className="text-muted">{c.detail}</span>
        </li>
      ))}
    </ul>
  );
}
