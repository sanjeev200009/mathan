"use client";

import Image from "next/image";
import { useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, useGSAP, motionOK, reveal } from "@/lib/gsap";
import { LeafIcon } from "./icons";

// Green rider on a scooter with a delivery box.
const Scooter = () => (
  <svg viewBox="0 0 200 150" className="h-auto w-full" aria-hidden>
    <ellipse cx="100" cy="140" rx="80" ry="5" fill="#1b7a36" opacity="0.12" />
    {/* box */}
    <rect x="28" y="52" width="46" height="40" rx="5" fill="#1b7a36" />
    <path d="M28 66h46" stroke="#0f4d22" strokeWidth="2" />
    <path d="M44 74c4-6 10-7 14-4-3 5-9 7-14 4z" fill="#6abf3c" />
    {/* scooter body */}
    <path d="M30 96h70l14-22h18l10 30H48a18 18 0 0 1-18-8z" fill="#1b7a36" />
    <path d="M132 74 142 40h12" stroke="#0f4d22" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M140 108h28" stroke="#1b7a36" strokeWidth="8" strokeLinecap="round" />
    {/* wheels */}
    <circle cx="56" cy="118" r="15" fill="#1d2a1f" />
    <circle cx="56" cy="118" r="6" fill="#e3eae3" />
    <circle cx="158" cy="118" r="15" fill="#1d2a1f" />
    <circle cx="158" cy="118" r="6" fill="#e3eae3" />
    {/* rider */}
    <path d="M88 92 96 58h18l8 22-16 4z" fill="#1b7a36" />
    <path d="M110 64 136 46" stroke="#1b7a36" strokeWidth="7" strokeLinecap="round" />
    <path d="M96 90 116 98 118 108" stroke="#0f4d22" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="106" cy="44" r="11" fill="#f2c9a0" />
    <path d="M94 42a12 12 0 0 1 24 0v3H94z" fill="#0f4d22" />
    <path d="M116 44h6" stroke="#0f4d22" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export default function PromoBanners() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      reveal(ref.current, { stagger: 0.15 });
      if (!motionOK()) return;
      const bob = gsap.to("[data-scooter]", { y: -4, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true });
      gsap.from("[data-scooter]", {
        x: -260,
        opacity: 0,
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        onComplete: () => void bob.play(),
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="container-x grid gap-4 py-6 md:grid-cols-2 md:gap-6">
      <div data-reveal className="relative min-h-56 overflow-hidden rounded-2xl bg-brand-light md:min-h-64">
        <Image
          src="/images/promo/basket.jpg"
          alt={t("Basket of fresh vegetables", "புதிய காய்கறிகள் கூடை")}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/55 via-black/20 to-transparent" />
        <div className="relative flex h-full min-h-56 flex-col items-end justify-center gap-4 p-5 text-right md:min-h-64 md:p-8">
          <p className="max-w-[16rem] font-display text-2xl font-bold leading-snug text-white drop-shadow md:text-3xl">
            {t("Good food, good life...", "நல்ல உணவு, நல்ல வாழ்க்கை...")}
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 font-display font-bold text-white shadow">
            <LeafIcon className="size-4 text-leaf" />
            Pasumai Fresh
          </span>
        </div>
      </div>

      <div data-reveal className="flex flex-col overflow-hidden rounded-2xl bg-brand-light p-5 md:p-8">
        <div className="flex flex-1 flex-col items-center gap-4 sm:flex-row">
          <div data-scooter className="w-40 shrink-0 sm:w-44 lg:w-52">
            <Scooter />
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <h3 className="font-display text-xl font-bold leading-snug text-brand-dark md:text-2xl">
              {t("Your order is our responsibility", "உங்கள் ஆர்டர் எங்கள் பொறுப்பு")}
            </h3>
            <p className="mt-2 text-muted">
              {t("Fresh products, straight to your home", "பசுமையான பொருட்கள் நேரடியாக உங்கள் வீட்டிற்கு")}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
          {[t("Home delivery", "வீட்டிற்கு விநியோகம்"), t("Store pickup", "கடையில் வாங்குதல்")].map((c) => (
            <span key={c} className="rounded-full border border-brand/25 bg-white px-3 py-1.5 text-sm font-medium text-brand">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
