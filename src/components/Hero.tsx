"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { waLink, helloMessage } from "@/lib/whatsapp";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { WhatsAppIcon } from "./icons";

const SLIDES = ["/images/hero/hero-1.jpg", "/images/hero/hero-2.jpg", "/images/hero/hero-3.jpg"];
const EVERY = 5000;

export default function Hero() {
  const { lang, t } = useLang();
  const root = useRef<HTMLElement>(null);
  const [cur, setCur] = useState(0);
  const paused = useRef(false);
  const touchX = useRef<number | null>(null);

  // Entrance: lines rise, buttons pop.
  useGSAP(
    () => {
      if (!motionOK()) return;
      gsap.from("[data-line]", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.12 });
      gsap.from("[data-pop]", { scale: 0.8, opacity: 0, duration: 0.6, ease: "back.out(1.8)", stagger: 0.1, delay: 0.45 });
      gsap.from("[data-badge]", { scale: 0, rotate: -40, duration: 0.7, ease: "back.out(1.6)", delay: 0.6 });
    },
    { scope: root },
  );

  // Crossfade + slow Ken Burns on every slide change.
  useGSAP(
    () => {
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]");
      slides.forEach((el, i) => {
        const on = i === cur;
        if (!motionOK()) return gsap.set(el, { opacity: on ? 1 : 0, scale: 1 });
        gsap.to(el, { opacity: on ? 1 : 0, duration: 1.1, ease: "power2.inOut", overwrite: "auto" });
        if (on) gsap.fromTo(el, { scale: 1 }, { scale: 1.08, duration: EVERY / 1000 + 1.2, ease: "none" });
      });
    },
    { scope: root, dependencies: [cur] },
  );

  // Autoplay; restarts after any manual change.
  useGSAP(
    () => {
      const id = window.setInterval(() => {
        if (!paused.current) setCur((c) => (c + 1) % SLIDES.length);
      }, EVERY);
      return () => window.clearInterval(id);
    },
    { dependencies: [cur] },
  );

  const go = (d: number) => setCur((c) => (c + d + SLIDES.length) % SLIDES.length);

  return (
    <section ref={root} className="container-x pt-4 md:pt-6">
      <div
        className="relative h-[520px] overflow-hidden rounded-3xl bg-brand-dark md:h-[420px]"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {SLIDES.map((src, i) => (
          <div key={src} data-slide className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }} aria-hidden={i !== cur}>
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover object-center"
            />
          </div>
        ))}

        {/* Dark green wash: left on desktop, top on phones, so the text always reads. */}
        <div className="absolute inset-0 bg-linear-to-b from-brand-dark/95 via-brand-dark/70 to-brand-dark/10 md:bg-linear-to-r md:from-brand-dark/95 md:via-brand-dark/65 md:to-transparent" />

        <div className="relative flex h-full max-w-xl flex-col justify-start gap-3 p-6 pt-10 text-white sm:p-10 md:justify-center md:pt-10">
          <p data-line className="font-display text-xl font-bold leading-snug sm:text-2xl md:text-[1.7rem]">
            {t("Fresh Vegetables • Fruits • Tender Coconut", "பசுமையான காய்கறிகள் • பழங்கள் • இளநீர்")}
          </p>
          <h1 data-line className="font-display text-3xl font-extrabold leading-tight text-leaf sm:text-4xl md:text-5xl">
            {t("To your home!", "உங்கள் வீட்டிற்கே!")}
          </h1>
          <p data-line className="text-base text-white/90 sm:text-lg">
            {t("Order today... delivered tomorrow!", "இன்றே ஆர்டர் செய்யுங்கள்... நாளை உங்கள் கதவில்!")}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              data-pop
              href={waLink(helloMessage(lang))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-95 sm:text-base"
            >
              <WhatsAppIcon className="size-5" />
              {t("Order on WhatsApp", "WhatsApp மூலம் ஆர்டர்")}
            </a>
            <a
              data-pop
              href="#products"
              className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-dark shadow-lg transition hover:bg-brand-light sm:text-base"
            >
              {t("Shop in store", "கடையில் வாங்க")}
            </a>
          </div>
        </div>

        <div
          data-badge
          className="absolute right-4 top-4 hidden size-24 -rotate-12 flex-col items-center justify-center rounded-full border-4 border-white/80 bg-brand text-center text-white shadow-xl sm:flex md:right-8 md:top-6 md:size-28"
        >
          <span className="font-display text-2xl font-extrabold leading-none">100%</span>
          <span className="mt-1 px-2 text-[0.65rem] font-semibold leading-tight">
            {t("Fresh & Quality", "புதியதும் தரமானதும்")}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {SLIDES.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setCur(i)}
              aria-label={t(`Slide ${i + 1}`, `படம் ${i + 1}`)}
              aria-current={i === cur}
              className={`h-2.5 rounded-full transition-all ${i === cur ? "w-7 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
