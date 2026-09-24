import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HowItWorksView from "./HowItWorksView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("howItWorks");
  return {
    title: `${t("title")} — RezuLens`,
    description: t("subtitle"),
  };
}

export default function HowItWorksPage() {
  return <HowItWorksView />;
}
