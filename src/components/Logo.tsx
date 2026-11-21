"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

// Leaf mark + "Pasumai Fresh" + the tagline. `light` = white text for the dark footer.
export default function Logo({ light = false }: { light?: boolean }) {
  const { t } = useLang();
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Pasumai Fresh">
      <svg viewBox="0 0 48 48" className="size-10 md:size-11" aria-hidden>
        <path d="M8 40C8 20 22 8 42 6c0 20-12 34-32 34z" fill={light ? "#ffffff" : "#1b7a36"} />
        <path d="M14 34c6-8 13-14 22-20" stroke={light ? "#0f4d22" : "#ffffff"} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M6 30c0-8 5-13 12-15-1 9-5 14-12 15z" fill="#6abf3c" />
      </svg>
      <span className="leading-tight">
        <span className={`block font-display text-xl md:text-2xl font-extrabold ${light ? "text-white" : "text-brand"}`}>
          Pasumai <span className={light ? "text-leaf" : "text-leaf"}>Fresh</span>
        </span>
        <span className={`block text-[11px] md:text-xs ${light ? "text-white/75" : "text-muted"}`}>
          {t("Freshness for your life", "பசுமை.. உங்கள் வாழ்க்கைக்கு")}
        </span>
      </span>
    </Link>
  );
}
