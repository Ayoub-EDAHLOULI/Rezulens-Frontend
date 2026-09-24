import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const GITHUB_URL = "https://github.com/Ayoub-EDAHLOULI/rezulens-frontend";

export default function Navbar() {
  return (
    <header className="border-b border-line">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center overflow-visible">
          <Image
            src="/logo-light.png"
            alt="RezuLens"
            width={140}
            height={72}
            priority
            className="h-16 w-auto -my-6 sm:h-18 sm:-my-8"
          />
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/how-it-works"
            className="hidden text-muted transition-colors hover:text-foreground sm:inline"
          >
            How it works
          </Link>
          <Link
            href="/score"
            className="hidden text-muted transition-colors hover:text-foreground sm:inline"
          >
            Score a resume
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex items-center justify-center rounded-lg border border-line p-2 text-foreground transition-colors hover:border-accent sm:px-3 sm:py-1.5"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4 shrink-0 sm:hidden"
              fill="currentColor"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
