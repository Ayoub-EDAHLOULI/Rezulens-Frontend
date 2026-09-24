import { SkeletonBlock } from "./components/SkeletonBlock";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col" aria-hidden="true">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-28 px-4 py-16 sm:px-6 sm:py-24">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="flex flex-col gap-6">
            <SkeletonBlock className="h-6 w-40" />
            <div className="flex flex-col gap-3">
              <SkeletonBlock className="h-14 w-full" />
              <SkeletonBlock className="h-14 w-4/5" />
              <SkeletonBlock className="h-14 w-3/5" />
            </div>
            <div className="flex flex-col gap-2">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
            <div className="flex gap-4 pt-2">
              <SkeletonBlock className="h-12 w-44" />
              <SkeletonBlock className="h-12 w-40" />
            </div>
          </div>
          <SkeletonBlock className="h-80 w-full rounded-2xl" />
        </section>

        <section className="flex flex-col gap-10">
          <div className="flex flex-col items-center gap-3">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-8 w-96 max-w-full" />
          </div>
          <div className="flex flex-col gap-6">
            <SkeletonBlock className="h-40 w-full rounded-xl" />
            <div className="grid gap-6 sm:grid-cols-3">
              <SkeletonBlock className="h-48 w-full rounded-xl" />
              <SkeletonBlock className="h-48 w-full rounded-xl" />
              <SkeletonBlock className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
