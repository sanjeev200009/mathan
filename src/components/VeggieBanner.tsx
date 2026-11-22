"use client";

import Image from "next/image";
import { useRef } from "react";
import { useLang } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { VEG_GROUPS, formatPrice, productById, type VegGroupId } from "@/lib/products";
import { gsap, motionOK, reveal, useGSAP } from "@/lib/gsap";
import { LeafIcon } from "./icons";

// The "farm fresh" banner under the hero: why our vegetables are different
// (picked daily from local farms), and the vegetable groups to shop from.
export default function VeggieBanner() {
  const { lang, t } = useLang();
  const { setGroup, setCategory } = useCart();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      reveal(root.current, { stagger: 0.07 });
      if (!motionOK()) return;
      // The "picked today" stamp drops in and settles with a small turn.
      gsap.from("[data-stamp]", {
        scale: 1.6,
        rotate: -30,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(2)",
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
      // Leaves drift slowly behind the text.
      gsap.to("[data-leaf]", { y: -10, rotate: 8, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.6 });
    },
    { scope: root },
  );

  const go = (g: VegGroupId | null) => {
    if (g) setGroup(g);
    else setCategory("vegetables");
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const points = [
    { en: "From local farms near you", ta: "உங்கள் அருகிலுள்ள பண்ணைகளிலிருந்து" },
    { en: "Picked every morning — no cold storage", ta: "தினமும் காலையில் பறிக்கப்படுகிறது — குளிர் சேமிப்பு இல்லை" },
    { en: "Order today, at your door tomorrow", ta: "இன்று ஆர்டர், நாளை உங்கள் வீட்டில்" },
  ];

  return (
    <section ref={root} className="container-x pt-10 md:pt-14" aria-labelledby="veg-banner-title">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand to-brand-dark p-5 text-white md:p-8 lg:p-10">
        {/* soft decoration */}
        <LeafIcon className="pointer-events-none absolute -left-6 top-6 size-28 text-white/5" />
        <span data-leaf className="pointer-events-none absolute right-[42%] top-4 hidden text-leaf/30 lg:block">
          <LeafIcon className="size-10" />
        </span>
        <span data-leaf className="pointer-events-none absolute bottom-6 left-[38%] hidden text-leaf/25 lg:block">
          <LeafIcon className="size-8" />
        </span>

        <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_1.35fr] lg:gap-10">
          {/* Why we are different */}
          <div>
            <p data-reveal className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-leaf md:text-sm">
              <LeafIcon className="size-4" />
              {t("Farm fresh, picked daily", "பண்ணையிலிருந்து, தினமும் பறித்தவை")}
            </p>
            <h2 id="veg-banner-title" data-reveal className="mt-3 text-2xl font-extrabold leading-snug md:text-3xl lg:text-4xl">
              {t("Vegetables picked today, not weeks ago", "வாரங்களுக்கு முன் அல்ல, இன்று பறித்த காய்கறிகள்")}
            </h2>
            <p data-reveal className="mt-3 max-w-md text-sm text-white/80 md:text-base">
              {t(
                "Supermarket vegetables can sit in cold rooms for days. Ours come from the farm to your kitchen while they are still crisp.",
                "கடைகளின் காய்கறிகள் பல நாட்கள் குளிர் அறையில் இருக்கலாம். எங்களுடையவை புதியதாக இருக்கும்போதே பண்ணையிலிருந்து உங்கள் சமையலறைக்கு வருகின்றன.",
              )}
            </p>
            <ul className="mt-5 space-y-2.5">
              {points.map((p) => (
                <li key={p.en} data-reveal className="flex items-start gap-2.5 text-sm md:text-base">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-leaf text-brand-dark">
                    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden>
                      <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t(p.en, p.ta)}
                </li>
              ))}
            </ul>
            <button
              type="button"
              data-reveal
              onClick={() => go(null)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("Shop all vegetables →", "அனைத்து காய்கறிகளும் →")}
            </button>
          </div>

          {/* Vegetable groups */}
          <div className="relative">
            <span
              data-stamp
              className="absolute -top-3 right-2 z-10 grid size-20 -rotate-12 place-items-center rounded-full border-2 border-dashed border-brand-dark bg-leaf text-center text-[10px] font-extrabold uppercase leading-tight text-brand-dark shadow-lg md:-top-5 md:size-24 md:text-xs"
            >
              {t("Picked today", "இன்று பறித்தது")}
            </span>
            <ul className="grid grid-cols-2 gap-3 md:gap-4">
              {VEG_GROUPS.map((g) => {
                const from = Math.min(...g.ids.map((id) => productById(id)?.price ?? Infinity));
                return (
                  <li key={g.id} data-reveal>
                    <button
                      type="button"
                      onClick={() => go(g.id)}
                      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white text-left text-ink shadow-md transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <span className="relative block aspect-[4/3] w-full overflow-hidden bg-brand-light">
                        <Image src={g.image} alt="" fill sizes="(min-width: 1024px) 280px, 45vw" className="object-cover transition duration-500 group-hover:scale-110" />
                        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-brand md:text-xs">
                          {t(`${g.ids.length} types`, `${g.ids.length} வகைகள்`)}
                        </span>
                      </span>
                      <span className="flex flex-1 flex-col p-3">
                        <span className="font-display text-sm font-bold leading-tight md:text-base">{g.name[lang]}</span>
                        <span className="mt-1 text-xs text-muted">{g.note[lang]}</span>
                        <span className="mt-auto flex items-center justify-between gap-2 pt-2 text-xs">
                          <span className="font-semibold text-brand">
                            {t("from", "முதல்")} {formatPrice(from)}
                          </span>
                          <span aria-hidden className="text-brand transition group-hover:translate-x-1">→</span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
