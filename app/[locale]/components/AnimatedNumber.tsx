"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";

export function AnimatedNumber({
  value,
  duration = 1.2,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);

  useMotionValueEvent(motionValue, "change", (latest) => {
    if (ref.current) ref.current.textContent = Math.round(latest).toString();
  });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionValue, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [isInView, value, duration, motionValue]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
