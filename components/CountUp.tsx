"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  /** Decimal places to render (ratios use 2, counts use 0). */
  decimals?: number;
}

/**
 * Tweens from the previous value to the next whenever `value` changes, so a
 * stat reads like a meter settling rather than snapping. With reduced motion
 * the number updates instantly.
 */
export function CountUp({ value, decimals = 0 }: CountUpProps) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    fromRef.current = value;

    if (reduceMotion || from === value) {
      setDisplay(value);
      return;
    }

    const controls = animate(from, value, {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [value, reduceMotion]);

  return <>{display.toFixed(decimals)}</>;
}
