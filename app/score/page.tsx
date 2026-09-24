import type { Metadata } from "next";
import ScoreView from "./ScoreView";

export const metadata: Metadata = {
  title: "Score your resume — RezuLens",
  description:
    "Upload a resume and a job description to get a deterministic, rule-based ATS score with every point traced to a check you can inspect.",
};

export default function ScorePage() {
  return <ScoreView />;
}
