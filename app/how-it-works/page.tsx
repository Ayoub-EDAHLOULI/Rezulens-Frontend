"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Reveal, RevealGroup, RevealItem } from "../components/Reveal";

const MODULES = [
  {
    name: "Keyword overlap",
    weight: 50,
    weightLabel: "50%",
    summary:
      "The most direct signal of fit: does the resume actually contain what this specific job description asks for.",
    detail:
      'Both the resume and the job description are run through the same rule-based keyword extractor — a curated taxonomy of skills and tools, matched by exact text and fuzzy variants (so "JavaScript" and "JS" count as the same skill, but "Java" never silently matches inside "JavaScript"). Every skill the job description asks for is checked against the resume, and every match or gap is listed by name.',
    examples: [
      '"Python" — matched, found in the Skills section',
      '"Docker" — matched, found in the Experience section',
      '"Kubernetes" — missing',
    ],
  },
  {
    name: "Completeness",
    weight: 25,
    weightLabel: "25%",
    summary:
      "A secondary quality signal, independent of any specific job: is the resume itself well-formed.",
    detail:
      "A fixed set of structural checks — no interpretation, no scoring on writing quality or tone. Each either passes or fails.",
    examples: [
      '"contact_has_email" — a real email address was found in the contact section',
      '"experience_has_dates" — at least one work entry has a date range',
      '"bullets_quantified" — at least half of experience bullets contain a number',
    ],
  },
  {
    name: "Formatting red flags",
    weight: 25,
    weightLabel: "25%",
    summary:
      "A secondary risk signal for real-world ATS parsing, independent of any specific job.",
    detail:
      "Checks for layout choices that are known to break real applicant tracking systems — not because they look bad, but because many ATS parsers read left-to-right, top-to-bottom and can silently scramble or drop content that doesn't follow that shape.",
    examples: [
      '"single_column_layout" — no multi-column or table-based layout detected',
      '"standard_section_headers" — every section header matches a recognized name',
      '"no_embedded_images" — no text is hidden inside an image the parser can\'t read',
    ],
  },
];

const TRACE_STEPS = [
  {
    label: "Job description says",
    content: '"...3+ years of experience with AWS or similar cloud infrastructure..."',
  },
  {
    label: "Extractor scans for known terms",
    content:
      'The taxonomy has "AWS" as a canonical skill with the alias "Amazon Web Services". The word "AWS" appears in the text with a clean word boundary — not buried inside another word.',
  },
  {
    label: "Exact match found",
    content: 'Rule: word-boundary match on "AWS" → canonical skill AWS, added to the job description\'s required-skill list.',
  },
  {
    label: "Resume is checked for the same skill",
    content:
      'Your resume\'s Skills section is scanned with the identical extractor. If "AWS" or any of its aliases appears anywhere in Skills, Experience, or Summary, it\'s recorded as matched — along with which section it came from.',
  },
  {
    label: "Result",
    content: '"AWS" — matched, found in the Experience section. This exact line is what appears in your results.',
    isResult: true,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-20 px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <header className="flex flex-col gap-4">
          <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
            How scoring works
          </h1>
          <p className="max-w-prose text-lg text-muted leading-relaxed">
            Every score breaks down into three independent checks, weighted and
            shown in full. Nothing is hidden, and nothing is inferred by a
            language model — every point traces back to a rule you can read for
            yourself.
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
            {MODULES.map((mod) => (
              <div key={mod.name} className="flex items-baseline gap-2">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {mod.weightLabel}
                </span>
                <span className="text-sm text-muted">{mod.name}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted leading-relaxed">
            The overall score is this weighted average — nothing more. That
            formula lives as plain code (
            <code className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-xs text-accent">
              SCORING_WEIGHTS
            </code>{" "}
            in the backend), not a black-box model call.
          </p>
        </section>
      </Reveal>

      <RevealGroup className="flex flex-col gap-8" stagger={0.12}>
        {MODULES.map((mod) => (
          <RevealItem key={mod.name}>
            <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xl font-semibold">{mod.name}</h2>
                <span className="font-mono text-sm tabular-nums text-accent">
                  {mod.weightLabel} of score
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
              Trace a single point
            </h2>
            <p className="mx-auto max-w-xl text-2xl font-semibold tracking-tight text-balance">
              Not an example of how it works. The actual mechanism, step by step.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="flex flex-col" stagger={0.15}>
          {TRACE_STEPS.map((step, i) => (
            <RevealItem key={step.label}>
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
                  {i < TRACE_STEPS.length - 1 && (
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
          <h2 className="text-lg font-semibold">No AI in the score</h2>
          <p className="text-muted leading-relaxed">
            Nothing above is generated, summarized, or judged by a language
            model. The score and every finding behind it come from
            deterministic rules — the same input always produces the same
            output, and every rule is visible in the source. Your resume is
            parsed, scored, and discarded; nothing is stored.
          </p>
          <Link
            href="/score"
            className="w-fit rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Try it on your resume
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
