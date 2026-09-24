import { SkeletonBlock } from "../components/SkeletonBlock";

export default function Loading() {
  return (
    <div
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-14 px-4 py-16 sm:px-6 sm:py-20"
      aria-hidden="true"
    >
      <div className="flex flex-col gap-4">
        <SkeletonBlock className="h-14 w-2/3" />
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-1/2" />
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <SkeletonBlock className="h-32 w-full rounded-lg" />
          <SkeletonBlock className="h-32 w-full rounded-lg" />
        </div>
        <SkeletonBlock className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}
