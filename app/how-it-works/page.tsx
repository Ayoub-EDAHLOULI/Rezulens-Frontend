import type { Metadata } from "next";
import HowItWorksView from "./HowItWorksView";

export const metadata: Metadata = {
  title: "How it works — RezuLens",
  description:
    "See exactly how RezuLens scores a resume: keyword overlap, completeness, and formatting checks, each one a rule you can inspect.",
};

export default function HowItWorksPage() {
  return <HowItWorksView />;
}
