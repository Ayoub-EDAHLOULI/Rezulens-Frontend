"use client";

import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/navigation";
import { motion } from "motion/react";
import { Reveal, RevealGroup, RevealItem } from "../components/Reveal";

const MODULE_KEYS = ["keywordOverlap", "completeness", "formatting"] as const;
const TRACE_STEP_KEYS = ["step1", "step2", "step3", "step4", "step5"] as const;

export default function HowItWorksView() {
  const t = useTranslations("howItWorks");

  const modules = MODULE_KEYS.map((key) => ({
    key,
    name: t(`modules.${key}.name`),
    weightLabel: t(`modules.${key}.weightLabel`),
    summary: t(`modules.${key}.summary`),
    detail: t(`modules.${key}.detail`),
    examples: [
      t(`modules.${key}.example1`),
      t(`modules.${key}.example2`),
      t(`modules.${key}.example3`),
    ],
  }));

  const traceSteps = TRACE_STEP_KEYS.map((key, i) => ({
    key,
    label: t(`trace.${key}.label`),
    content: t(`trace.${key}.content`),
    isResult: i === TRACE_STEP_KEYS.length - 1,
  }));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-20 px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <header className="flex flex-col gap-4">
          <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
            {t("title")}
          </h1>
          <p className="max-w-prose text-lg text-muted leading-relaxed">
            {t("subtitle")}
          </p>
        </header>
      </Reveal>

      <Reveal>
        <section className="flex flex-col gap-4">
          <div className="flex h-2 overflow-hidden rounded-full bg-background">
            <motion.div
              className="bg-accent"
              initial={{ width: 0 }}
              whileInView={{ width: "50%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.div
              className="bg-accent/60"
              initial={{ width: 0 }}
              whileInView={{ width: "25%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            />
            <motion.div
              className="bg-accent/30"
              initial={{ width: 0 }}
              whileInView={{ width: "25%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {modules.map((mod) => (
              <div key={mod.key} className="flex items-baseline gap-2">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {mod.weightLabel}
                </span>
                <span className="text-sm text-muted">{mod.name}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted leading-relaxed">
            {t("weightedAverageIntro")}{" "}
            <code className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-xs text-accent">
              SCORING_WEIGHTS
            </code>{" "}
            {t("weightedAverageOutro")}
          </p>
        </section>
      </Reveal>

      <RevealGroup className="flex flex-col gap-8" stagger={0.12}>
        {modules.map((mod) => (
          <RevealItem key={mod.key}>
            <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xl font-semibold">{mod.name}</h2>
                <span className="font-mono text-sm tabular-nums text-accent">
                  {t("weightOfScore", { weight: mod.weightLabel })}
                </span>
              </div>
              <p className="text-muted leading-relaxed">{mod.summary}</p>
              <p className="text-sm text-muted leading-relaxed">{mod.detail}</p>
              <ul className="mt-2 flex flex-col gap-1.5 border-t border-line pt-4">
                {mod.examples.map((example) => (
                  <li key={example} className="font-mono text-xs text-muted">
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <section className="flex flex-col gap-10">
        <Reveal>
          <div className="flex flex-col gap-3 text-center">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
              {t("traceHeading")}
            </h2>
            <p className="mx-auto max-w-xl text-2xl font-semibold tracking-tight text-balance">
              {t("traceSubtitle")}
            </p>
          </div>
        </Reveal>

        <RevealGroup className="flex flex-col" stagger={0.15}>
          {traceSteps.map((step, i) => (
            <RevealItem key={step.key}>
              <div className="flex gap-4 sm:gap-6">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold ${
                      step.isResult
                        ? "bg-accent text-accent-foreground"
                        : "bg-accent-soft text-accent"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {i < traceSteps.length - 1 && (
                    <span className="my-1 w-px flex-1 bg-line" />
                  )}
                </div>
                <div className="flex flex-col gap-1 pb-8">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted">
                    {step.label}
                  </span>
                  <p
                    className={
                      step.isResult
                        ? "rounded-lg bg-good-bg px-3 py-2 font-mono text-sm text-good"
                        : "font-mono text-sm leading-relaxed text-foreground"
                    }
                  >
                    {step.content}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <Reveal>
        <section className="flex flex-col gap-4 rounded-xl bg-accent-soft p-6 sm:p-8">
          <h2 className="text-lg font-semibold">{t("noAiHeading")}</h2>
          <p className="text-muted leading-relaxed">{t("noAiBody")}</p>
          <Link
            href="/score"
            className="w-fit rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            {t("tryItOnYourResume")}
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
