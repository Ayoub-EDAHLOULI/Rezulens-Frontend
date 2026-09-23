"use client";

import { useId, useRef, useState } from "react";
import type { ScoreResponse } from "./types";

// Set NEXT_PUBLIC_API_URL to point at a non-default backend (see .env.local.example).
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const MODULE_WEIGHTS: Record<
  "keyword_overlap" | "completeness" | "formatting",
  number
> = {
  keyword_overlap: 0.5,
  completeness: 0.25,
  formatting: 0.25,
};

const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];

// Keep in sync with MAX_UPLOAD_BYTES in rezulens-backend/main.py — checking
// here just avoids a doomed round-trip; the backend's limit is what's
// actually enforced.
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function hasAcceptedExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function formatMegabytes(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputId = useId();
  const jdId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function acceptFile(file: File) {
    setHasInteracted(true);
    if (!hasAcceptedExtension(file.name)) {
      setFileError(`"${file.name}" isn't a PDF or DOCX file.`);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(
        `"${file.name}" is ${formatMegabytes(file.size)}MB — the limit is ${formatMegabytes(MAX_FILE_SIZE_BYTES)}MB.`,
      );
      return;
    }
    setFileError(null);
    setResumeFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!resumeFile || !jobDescription.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jobDescription);

    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/score`, {
        method: "POST",
        body: formData,
      });
    } catch {
      // fetch itself throws (TypeError) when the request never reaches a
      // server at all — backend down, wrong URL, no network.
      setError(
        "Can't reach the scoring service. Make sure the backend is running and try again.",
      );
      setIsSubmitting(false);
      return;
    }

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      // 4xx errors from this API carry a specific, user-facing `detail`
      // (unsupported file type, empty job description, unparseable resume).
      // Anything else is an unexpected server-side failure — don't surface
      // its raw status code or body to the user.
      setError(
        response.status >= 400 && response.status < 500 && body?.detail
          ? body.detail
          : "Something went wrong on our end. Please try again.",
      );
      setIsSubmitting(false);
      return;
    }

    setResult(await response.json());
    setIsSubmitting(false);
  }

  const missingFieldsMessage = !resumeFile
    ? jobDescription.trim()
      ? "Select a resume file to continue."
      : "Select a resume file and paste a job description to continue."
    : !jobDescription.trim()
      ? "Paste a job description to continue."
      : null;
  const canSubmit = !missingFieldsMessage && !isSubmitting;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground font-mono text-sm font-semibold">
            RL
          </span>
          <span className="font-mono text-sm uppercase tracking-widest text-muted">
            RezuLens
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          See exactly why your resume scored what it scored.
        </h1>
        <p className="max-w-prose text-muted leading-relaxed">
          Upload a resume and a job description. Every point is traced to a rule
          you can inspect — keyword matches, structural checks, formatting
          risks. No AI in the loop, nothing stored.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-xl border border-line bg-surface p-6 sm:p-8"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor={fileInputId} className="text-sm font-medium">
              Resume
            </label>
            <button
              type="button"
              onClick={() => {
                setHasInteracted(true);
                fileInputRef.current?.click();
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) acceptFile(file);
              }}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-4 py-8 text-center transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                isDragActive
                  ? "border-accent bg-accent/5"
                  : "border-line bg-background hover:border-accent"
              }`}
            >
              <span className="font-mono text-sm">
                {resumeFile ? resumeFile.name : "Choose or drop a PDF or DOCX"}
              </span>
              <span className="text-xs text-muted">
                {resumeFile
                  ? "Click to replace"
                  : "Parsed, scored, and discarded"}
              </span>
            </button>
            <input
              ref={fileInputRef}
              id={fileInputId}
              type="file"
              accept=".pdf,.docx"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) acceptFile(file);
              }}
            />
            {fileError && <p className="text-sm text-bad">{fileError}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={jdId} className="text-sm font-medium">
              Job description
            </label>
            <textarea
              id={jdId}
              value={jobDescription}
              onChange={(e) => {
                setHasInteracted(true);
                setJobDescription(e.target.value);
              }}
              placeholder="Paste the full job posting text here…"
              rows={6}
              className="flex-1 resize-none rounded-lg border border-line bg-background p-3 text-sm leading-relaxed placeholder:text-muted focus-visible:outline-2 focus-visible:outline-accent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting && <Spinner />}
          {isSubmitting ? "Scoring…" : "Score resume"}
        </button>

        {hasInteracted && missingFieldsMessage && !isSubmitting && (
          <p className="text-sm text-muted">{missingFieldsMessage}</p>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-bad-bg px-4 py-3 text-sm text-bad"
          >
            {error}
          </p>
        )}
      </form>

      {isSubmitting && <ResultSkeleton />}
      {result && <ResultView result={result} />}
    </div>
  );
}

function Spinner() {
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

function ResultSkeleton() {
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

function ResultView({ result }: { result: ScoreResponse }) {
  return (
    <section className="flex flex-col gap-6" aria-label="Score breakdown">
      <div className="flex flex-col gap-6 rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-5xl font-semibold tabular-nums">
            {result.overall_score}
          </span>
          <span className="text-muted">/ 100 overall</span>
        </div>

        <div className="flex h-2 overflow-hidden rounded-full bg-background">
          <div
            className="bg-accent"
            style={{ width: `${MODULE_WEIGHTS.keyword_overlap * 100}%` }}
            title={`Keyword overlap — ${Math.round(MODULE_WEIGHTS.keyword_overlap * 100)}% of overall score`}
          />
          <div
            className="bg-accent/60"
            style={{ width: `${MODULE_WEIGHTS.completeness * 100}%` }}
            title={`Completeness — ${Math.round(MODULE_WEIGHTS.completeness * 100)}% of overall score`}
          />
          <div
            className="bg-accent/30"
            style={{ width: `${MODULE_WEIGHTS.formatting * 100}%` }}
            title={`Formatting — ${Math.round(MODULE_WEIGHTS.formatting * 100)}% of overall score`}
          />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted">
          <span>Keyword overlap · 50%</span>
          <span>Completeness · 25%</span>
          <span>Formatting · 25%</span>
        </div>
      </div>

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

      <ModuleCard title="Completeness" score={result.completeness.score}>
        <CheckList checks={result.completeness.checks} />
      </ModuleCard>

      <ModuleCard title="Formatting" score={result.formatting.score}>
        <CheckList checks={result.formatting.checks} />
      </ModuleCard>
    </section>
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
