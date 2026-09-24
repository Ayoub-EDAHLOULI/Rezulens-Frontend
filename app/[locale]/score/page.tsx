import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ScoreView from "./ScoreView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("score");
  return {
    title: `${t("title")} — RezuLens`,
    description: t("subtitle"),
  };
}

export default function ScorePage() {
  return <ScoreView />;
}
