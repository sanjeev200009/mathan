"use client";

// Import GSAP only from here so the plugins are registered once.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

/** Respect the visitor's "reduce motion" setting. */
export const motionOK = () =>
  typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Standard scroll reveal: children marked [data-reveal] inside `scope` rise in, staggered.
 * Use: useGSAP(() => reveal(ref.current), { scope: ref })
 */
export function reveal(scope: Element | null, opts: { y?: number; stagger?: number } = {}) {
  if (!scope || !motionOK()) return;
  const items = scope.querySelectorAll("[data-reveal]");
  if (!items.length) return;
  gsap.from(items, {
    y: opts.y ?? 28,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out",
    stagger: opts.stagger ?? 0.08,
    scrollTrigger: { trigger: scope, start: "top 88%", once: true },
  });
}
