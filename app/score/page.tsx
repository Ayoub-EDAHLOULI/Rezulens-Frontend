"use client";

import { useId, useRef, useState } from "react";
import type { ScoreResponse } from "../types";
import { ResultSkeleton, ResultView, Spinner } from "./components";

// Set NEXT_PUBLIC_API_URL to point at a non-default backend (see .env.local.example).
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

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

export default function ScorePage() {
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
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-14 px-4 py-16 sm:px-6 sm:py-20">
      <header className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Score your resume
        </h1>
        <p className="max-w-prose text-lg text-muted leading-relaxed">
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
