"use client";

import { motion } from "motion/react";
import type { ScoreResponse } from "../types";
import { AnimatedNumber } from "../components/AnimatedNumber";

const MODULE_WEIGHTS: Record<
  "keyword_overlap" | "completeness" | "formatting",
  number
> = {
  keyword_overlap: 0.5,
  completeness: 0.25,
  formatting: 0.25,
};

export function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin motion-reduce:animate-none"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
      />
    </svg>
  );
}

export function ResultSkeleton() {
  return (
    <div
      className="flex flex-col gap-6 animate-pulse motion-reduce:animate-none"
      aria-hidden="true"
    >
      <div className="h-28 rounded-xl border border-line bg-surface" />
      <div className="h-40 rounded-xl border border-line bg-surface" />
      <div className="h-40 rounded-xl border border-line bg-surface" />
      <div className="h-24 rounded-xl border border-line bg-surface" />
    </div>
  );
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function ResultView({ result }: { result: ScoreResponse }) {
  return (
    <motion.section
      className="flex flex-col gap-6"
      aria-label="Score breakdown"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-6 rounded-xl border border-line bg-surface p-6 sm:p-8"
      >
        <div className="flex items-baseline gap-4">
          <AnimatedNumber
            value={result.overall_score}
            className="font-mono text-5xl font-semibold tabular-nums"
          />
          <span className="text-muted">/ 100 overall</span>
        </div>

        <div className="flex h-2 overflow-hidden rounded-full bg-background">
          <motion.div
            className="bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${MODULE_WEIGHTS.keyword_overlap * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            title={`Keyword overlap — ${Math.round(MODULE_WEIGHTS.keyword_overlap * 100)}% of overall score`}
          />
          <motion.div
            className="bg-accent/60"
            initial={{ width: 0 }}
            animate={{ width: `${MODULE_WEIGHTS.completeness * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            title={`Completeness — ${Math.round(MODULE_WEIGHTS.completeness * 100)}% of overall score`}
          />
          <motion.div
            className="bg-accent/30"
            initial={{ width: 0 }}
            animate={{ width: `${MODULE_WEIGHTS.formatting * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            title={`Formatting — ${Math.round(MODULE_WEIGHTS.formatting * 100)}% of overall score`}
          />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted">
          <span>Keyword overlap · 50%</span>
          <span>Completeness · 25%</span>
          <span>Formatting · 25%</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <ModuleCard title="Keyword overlap" score={result.keyword_overlap.score}>
          {result.keyword_overlap.low_coverage_warning && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-lg bg-warn-bg px-4 py-3 text-sm text-warn"
            >
              <span aria-hidden="true">⚠</span>
              <span>{result.keyword_overlap.low_coverage_warning}</span>
            </p>
          )}
          {result.keyword_overlap.matched.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Matched ({result.keyword_overlap.matched.length})
              </p>
              <ul className="flex flex-wrap gap-2">
                {result.keyword_overlap.matched.map((m) => (
                  <li
                    key={m.skill}
                    className="rounded-full bg-good-bg px-3 py-1 font-mono text-xs text-good"
                    title={`Found in "${m.resume_section}"`}
                  >
                    {m.skill}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.keyword_overlap.missing.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Missing ({result.keyword_overlap.missing.length})
              </p>
              <ul className="flex flex-wrap gap-2">
                {result.keyword_overlap.missing.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full bg-bad-bg px-3 py-1 font-mono text-xs text-bad"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ModuleCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <ModuleCard title="Completeness" score={result.completeness.score}>
          <CheckList checks={result.completeness.checks} />
        </ModuleCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <ModuleCard title="Formatting" score={result.formatting.score}>
          <CheckList checks={result.formatting.checks} />
        </ModuleCard>
      </motion.div>
    </motion.section>
  );
}

function ModuleCard({
  title,
  score,
  children,
}: {
  title: string;
  score: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <span className="font-mono text-sm tabular-nums text-muted">
          {score}/100
        </span>
      </div>
      {children}
    </div>
  );
}

function CheckList({
  checks,
}: {
  checks: { name: string; passed: boolean; detail: string }[];
}) {
  return (
    <ul className="flex flex-col gap-2">
      {checks.map((c) => (
        <li key={c.name} className="flex items-start gap-3 text-sm">
          <span
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
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
