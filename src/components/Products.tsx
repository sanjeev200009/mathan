"use client";

import { useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { CATEGORIES, PRODUCTS, VEG_GROUPS } from "@/lib/products";
import { gsap, motionOK, reveal, useGSAP } from "@/lib/gsap";
import { CloseIcon, LeafIcon } from "./icons";
import ProductCard from "./ProductCard";

export default function Products() {
  const { t } = useLang();
  const { query, setQuery, category, setCategory, group } = useCart();
  const [showAll, setShowAll] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const first = useRef(true);

  const q = query.trim().toLowerCase();
  const grp = VEG_GROUPS.find((g) => g.id === group);
  const filtering = category !== "all" || q !== "" || !!grp;
  const list = PRODUCTS.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (!grp || grp.ids.includes(p.id)) &&
      (!q || p.name.en.toLowerCase().includes(q) || p.name.ta.toLowerCase().includes(q)),
  );
  const shown = filtering || showAll ? list : list.filter((p) => p.featured);
  const cat = CATEGORIES.find((c) => c.id === category);

  const heading = q
    ? t(`Results for '${query.trim()}'`, `'${query.trim()}' க்கான முடிவுகள்`)
    : grp
      ? t(grp.name.en, grp.name.ta)
      : cat
      ? t(cat.name.en, cat.name.ta)
      : showAll
        ? t("All Products", "அனைத்து பொருட்கள்")
        : t("Featured Products", "சிறப்பு பொருட்கள்");

  const clear = () => {
    setCategory("all");
    setQuery("");
  };

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        reveal(ref.current, { stagger: 0.06 });
        return;
      }
      if (!motionOK()) return;
      gsap.from("[data-card]", { y: 20, opacity: 0, duration: 0.45, ease: "power2.out", stagger: 0.04 });
    },
    { scope: ref, dependencies: [category, q, showAll, group] },
  );

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
      active ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-brand hover:text-brand"
    }`;

  return (
    <section id="products" ref={ref} className="container-x scroll-mt-24 py-8 sm:py-10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold text-ink sm:text-2xl">
          <LeafIcon className="size-5 text-leaf" />
          {heading}
        </h2>
        {filtering ? (
          <button
            type="button"
            onClick={clear}
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark"
          >
            <CloseIcon className="size-4" />
            {t("Clear filter", "வடிகட்டியை நீக்கு")}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="shrink-0 text-sm font-semibold text-brand hover:text-brand-dark"
          >
            {showAll ? t("Show less ↑", "குறைவாகக் காண ↑") : t("View all →", "அனைத்தையும் காண →")}
          </button>
        )}
      </div>

      <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label={t("Categories", "வகைகள்")}>
        <button type="button" onClick={() => setCategory("all")} className={chip(category === "all")} aria-pressed={category === "all"}>
          {t("All", "அனைத்தும்")}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={chip(category === c.id)}
            aria-pressed={category === c.id}
          >
            {t(c.name.en, c.name.ta)}
          </button>
        ))}
      </div>

      {shown.length ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {shown.map((p) => (
            <div key={p.id} data-reveal className="flex">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-line bg-brand-soft px-4 py-10 text-center">
          <p className="font-semibold text-ink">{t("Nothing found", "எதுவும் கிடைக்கவில்லை")}</p>
          <p className="mt-1 text-sm text-muted">
            {t("Try another word, or ask us on WhatsApp - we may have it in the shop.", "வேறு சொல்லில் தேடுங்கள், அல்லது WhatsApp இல் கேளுங்கள் - கடையில் இருக்கலாம்.")}
          </p>
          <button
            type="button"
            onClick={clear}
            className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            {t("Show all products", "அனைத்து பொருட்களையும் காண")}
          </button>
        </div>
      )}
    </section>
  );
}
