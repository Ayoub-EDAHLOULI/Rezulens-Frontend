import { SkeletonBlock } from "../components/SkeletonBlock";

export default function Loading() {
  return (
    <div
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-20 px-4 py-16 sm:px-6 sm:py-24"
      aria-hidden="true"
    >
      <div className="flex flex-col gap-4">
        <SkeletonBlock className="h-14 w-3/4" />
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-2/3" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SkeletonBlock className="h-2 w-full rounded-full" />
        <div className="flex gap-8">
          <SkeletonBlock className="h-5 w-32" />
          <SkeletonBlock className="h-5 w-32" />
          <SkeletonBlock className="h-5 w-32" />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <SkeletonBlock className="h-44 w-full rounded-xl" />
        <SkeletonBlock className="h-44 w-full rounded-xl" />
        <SkeletonBlock className="h-44 w-full rounded-xl" />
      </div>
    </div>
  );
}
