import Link from "next/link";
import { AnimatedNumber } from "./components/AnimatedNumber";
import { Reveal, RevealGroup, RevealItem } from "./components/Reveal";

const MODULES = [
  {
    name: "Keyword overlap",
    weight: "50%",
    description: "Does the resume actually contain what this job description asks for.",
  },
  {
    name: "Completeness",
    weight: "25%",
    description: "Missing sections, missing dates, missing contact info, unquantified bullets.",
  },
  {
    name: "Formatting red flags",
    weight: "25%",
    description: "Layout and structure that real ATS parsers choke on.",
  },
];

const EXAMPLE = {
  overallScore: 78,
  keywordOverlap: { score: 82, matched: ["Python", "SQL", "AWS", "Docker"], missing: ["Kubernetes"] },
  completeness: {
    score: 89,
    checks: [
      { passed: true, detail: "'contact' section is present" },
      { passed: true, detail: "experience section contains at least one date range" },
      { passed: false, detail: "no email address found in contact section" },
    ],
  },
  formatting: {
    score: 67,
    checks: [
      { passed: true, detail: "single-column layout, no side-by-side content detected" },
      { passed: false, detail: "non-standard section header(s) found: strengths" },
    ],
  },
};

const COMPARISON = [
  {
    ai: "Score comes from a prompt — ask twice, get two different numbers.",
    rezulens: "Score comes from fixed rules — the same input always produces the same output.",
  },
  {
    ai: "\"Why did I get a 62?\" has no real answer beyond what the model felt like saying.",
    rezulens: "Every point traces to a named rule you can read in the source, right now.",
  },
  {
    ai: "Your resume is sent to a third-party model, and what happens to it next isn't up to you.",
    rezulens: "Your resume is parsed, scored, and discarded. Nothing is stored, nothing leaves for training.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-28 px-4 py-16 sm:px-6 sm:py-24">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <Reveal>
            <div className="flex flex-col gap-6">
              <span className="w-fit rounded-full bg-accent-soft px-3 py-1 font-mono text-xs uppercase tracking-widest text-accent">
                Free · Open source
              </span>
              <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                See exactly why your resume scored what it scored.
              </h1>
              <p className="max-w-prose text-lg text-muted leading-relaxed">
                Upload a resume and a job description. Every point is traced to a
                rule you can inspect — keyword matches, structural checks,
                formatting risks. No AI in the loop, nothing stored.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/score"
                  className="rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground transition-opacity hover:opacity-90"
                >
                  Score your resume
                </Link>
                <Link
                  href="/how-it-works"
                  className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                  See how scoring works →
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-10">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                A real score, start to finish
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
                Weighted from keyword overlap, completeness, and formatting
              </span>
            </div>
          </Reveal>
        </section>

        <section className="flex flex-col gap-10">
          <Reveal>
            <div className="flex flex-col gap-3 text-center">
              <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
                Example result
              </h2>
              <p className="mx-auto max-w-xl text-2xl font-semibold tracking-tight text-balance">
                A resume scored against a real job description looks like this.
              </p>
              <p className="mx-auto max-w-prose text-sm text-muted">
                Illustrative data, not a live score — run your own at{" "}
                <Link href="/score" className="text-accent underline underline-offset-4">
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
                  <span className="text-muted">/ 100 overall</span>
                </div>
                <div className="flex h-2 overflow-hidden rounded-full bg-background">
                  <div className="bg-accent" style={{ width: "50%" }} />
                  <div className="bg-accent/60" style={{ width: "25%" }} />
                  <div className="bg-accent/30" style={{ width: "25%" }} />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted">
                  <span>Keyword overlap · 50%</span>
                  <span>Completeness · 25%</span>
                  <span>Formatting · 25%</span>
                </div>
              </div>
            </RevealItem>

            <div className="grid gap-6 sm:grid-cols-3">
              <RevealItem>
                <ExampleCard title="Keyword overlap" score={EXAMPLE.keywordOverlap.score}>
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
                <ExampleCard title="Completeness" score={EXAMPLE.completeness.score}>
                  <ExampleChecks checks={EXAMPLE.completeness.checks} />
                </ExampleCard>
              </RevealItem>

              <RevealItem>
                <ExampleCard title="Formatting" score={EXAMPLE.formatting.score}>
                  <ExampleChecks checks={EXAMPLE.formatting.checks} />
                </ExampleCard>
              </RevealItem>
            </div>
          </RevealGroup>
        </section>

        <section className="flex flex-col gap-10">
          <Reveal>
            <div className="flex flex-col gap-3 text-center">
              <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
                Why not just use AI
              </h2>
              <p className="mx-auto max-w-xl text-2xl font-semibold tracking-tight text-balance">
                Most resume scorers are a prompt with a number attached.
              </p>
            </div>
          </Reveal>

          <RevealGroup className="flex flex-col gap-4" stagger={0.08}>
            {COMPARISON.map((row) => (
              <RevealItem key={row.ai}>
                <div className="grid gap-4 rounded-xl border border-line bg-surface p-5 sm:grid-cols-2 sm:p-6">
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bad-bg text-[11px] font-bold text-bad">
                      ✗
                    </span>
                    <p className="text-sm text-muted leading-relaxed">{row.ai}</p>
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
              Three modules, one weighted score
            </h2>
          </Reveal>
          <RevealGroup className="grid gap-4 sm:grid-cols-3" stagger={0.1}>
            {MODULES.map((mod) => (
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
        <span className="font-mono text-xs tabular-nums text-muted">{score}/100</span>
      </div>
      {children}
    </div>
  );
}

function ExampleChecks({ checks }: { checks: { passed: boolean; detail: string }[] }) {
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
