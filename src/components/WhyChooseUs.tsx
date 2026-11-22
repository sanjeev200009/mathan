"use client";

import { useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, useGSAP, motionOK, reveal } from "@/lib/gsap";
import { LeafIcon } from "./icons";

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const Svg = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="size-7" aria-hidden {...line}>
    <path d={d} />
  </svg>
);

const ICONS = [
  "M12 21c-5-2-8-6-8-11 4 0 7 2 8 5 1-3 4-5 8-5 0 5-3 9-8 11zM12 15V8m0 0c0-2 1-3.5 3-4.5", // fresh
  "M7 4h10l-3 4h-4zM10 8c-4 2-6 5-6 8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4c0-3-2-6-6-8M12 11v6m-2-1.5c.5.8 3.5.8 4 0 0-1.5-4-1.5-4-3 .5-.8 3.5-.8 4 0", // price bag
  "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 4l3-1M21 4l-3-1", // clock
  "M12 3 5 6v6c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6zm-3 9 2 2 4-4", // shield
  "M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H5a1 1 0 0 1-1-1zm16 0h-3v5h2a1 1 0 0 0 1-1zM17 19c0 1.5-2 2-4 2", // headset
];

export default function WhyChooseUs() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      reveal(ref.current);
      if (!motionOK()) return;
      gsap.from("[data-pop]", {
        scale: 0,
        duration: 0.6,
        ease: "back.out(2.2)",
        stagger: 0.08,
        delay: 0.2,
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );

  const labels = [
    t("Fresh & quality products", "புதிய மற்றும் தரமான பொருட்கள்"),
    t("Fair prices", "நியாயமான விலை"),
    t("Fast service", "விரைவான சேவை"),
    t("Secure payment", "பாதுகாப்பான கொடுப்பனவு"),
    t("Customer support", "வாடிக்கையாளர் ஆதரவு"),
  ];

  return (
    <section ref={ref} className="container-x py-8 md:py-10">
      <h2 data-reveal className="flex items-center gap-2 font-display text-xl font-bold text-ink md:text-2xl">
        <LeafIcon className="size-6 shrink-0 text-leaf" />
        {t("Why choose us?", "எங்களை ஏன் தேர்ந்தெடுக்க வேண்டும்?")}
      </h2>
      <ul className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {labels.map((label, i) => (
          <li key={i} data-reveal className="flex min-w-0 items-center gap-3">
            <span data-pop className="grid size-14 shrink-0 place-items-center rounded-full bg-brand-light text-brand">
              <Svg d={ICONS[i]} />
            </span>
            <span className="min-w-0 text-sm font-medium leading-snug text-ink md:text-base">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
