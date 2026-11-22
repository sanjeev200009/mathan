"use client";

import { useRef } from "react";
import { useLang } from "@/lib/i18n";
import { waLink, helloMessage } from "@/lib/whatsapp";
import { gsap, useGSAP, motionOK, reveal } from "@/lib/gsap";
import { WhatsAppIcon } from "./icons";

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const Truck = () => (
  <svg viewBox="0 0 32 32" className="size-9 shrink-0" aria-hidden {...line}>
    <path d="M3 8h16v13H3zM19 13h5l4 4v4h-9" />
    <circle cx="9" cy="23" r="2.4" />
    <circle cx="23" cy="23" r="2.4" />
  </svg>
);
const Shop = () => (
  <svg viewBox="0 0 32 32" className="size-9 shrink-0" aria-hidden {...line}>
    <path d="M5 12 7 5h18l2 7M5 12h22M5 12c0 2 1.5 3 3 3s3-1 3-3c0 2 1.5 3 3 3s3-1 3-3c0 2 1.5 3 3 3s3-1 3-3c0 2 1.5 3 3 3s2-1 2-3" />
    <path d="M7 15v12h18V15M13 27v-7h6v7" />
  </svg>
);
const Shield = () => (
  <svg viewBox="0 0 32 32" className="size-9 shrink-0" aria-hidden {...line}>
    <path d="M16 3 6 7v8c0 6.5 4.3 11.3 10 14 5.7-2.7 10-7.5 10-14V7z" />
    <path d="m11.5 16 3.2 3.2 6-6.4" />
  </svg>
);

export default function ServiceStrip() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      reveal(ref.current);
      if (!motionOK()) return;
      gsap.from("[data-badge]", {
        x: 40,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );

  const items = [
    { icon: <Truck />, title: t("Home Delivery", "வீட்டிற்கு விநியோகம்"), sub: t("Selected areas", "குறிப்பிட்ட பகுதிகள்") },
    { icon: <Shop />, title: t("Store Pickup", "கடையில் வாங்குதல்"), sub: t("Quick service", "உடனடி சேவை") },
    { icon: <Shield />, title: t("Secure Payment", "பாதுகாப்பான கொடுப்பனவு"), sub: "Cash on Delivery" },
  ];

  return (
    <section id="services" ref={ref} className="container-x py-6 md:py-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-brand-light p-4 md:p-5 lg:flex-row lg:items-center">
        <ul className="grid flex-1 gap-3 md:grid-cols-3 md:gap-0">
          {items.map((it, i) => (
            <li
              key={i}
              data-reveal
              className={`flex min-w-0 items-center gap-3 text-brand md:px-4 ${i ? "md:border-l md:border-brand/20" : ""}`}
            >
              {it.icon}
              <span className="min-w-0">
                <span className="block font-semibold leading-snug text-ink">{it.title}</span>
                <span className="block text-sm text-muted">{it.sub}</span>
              </span>
            </li>
          ))}
        </ul>
        <a
          data-badge
          href={waLink(helloMessage(lang))}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-brand px-6 py-3 font-display font-bold text-white shadow-md transition hover:bg-brand-dark lg:-rotate-3 lg:max-w-60"
          style={{ borderRadius: "1.6rem 0.6rem 1.8rem 0.5rem" }}
        >
          <WhatsAppIcon className="size-6 shrink-0" />
          <span className="leading-tight">{t("Order on WhatsApp now!", "இப்போதே ஆர்டர் செய்யுங்கள்!")}</span>
        </a>
      </div>
    </section>
  );
}
