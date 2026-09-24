"use client";

import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { useSyncExternalStore } from "react";
import { SkeletonBlock } from "./SkeletonBlock";

function subscribe() {
  return () => {};
}

// react-dom's createPortal needs document.body, which doesn't exist during
// SSR — mounted is false on the server and on the first client render
// (matching, so no hydration mismatch), then true on every render after,
// via useSyncExternalStore's client/server snapshot split.
function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function PageTransitionOverlay({ show }: { show: boolean }) {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-100 flex flex-col bg-background"
          aria-hidden="true"
        >
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-16 sm:px-6 sm:py-24">
            <SkeletonBlock className="h-10 w-2/3" />
            <SkeletonBlock className="h-10 w-1/2" />
            <div className="mt-6 flex flex-col gap-3">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
            <SkeletonBlock className="mt-6 h-40 w-full rounded-xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
