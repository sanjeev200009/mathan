"use client";

import Image from "next/image";
import { useRef } from "react";
import { useLang } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { CATEGORIES } from "@/lib/products";
import { useGSAP, reveal } from "@/lib/gsap";

export default function Categories() {
  const { lang, t } = useLang();
  const { setCategory } = useCart();
  const root = useRef<HTMLElement>(null);

  useGSAP(() => reveal(root.current), { scope: root });

  return (
    <section id="categories" ref={root} className="container-x py-8 md:py-10" aria-label={t("Categories", "வகைகள்")}>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:px-0 md:pb-0">
        {CATEGORIES.map((c) => (
          <li key={c.id} data-reveal className="w-[38%] shrink-0 snap-start sm:w-[28%] md:w-auto">
            <button
              type="button"
              onClick={() => {
                setCategory(c.id);
                document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex w-full flex-col items-center rounded-2xl border border-line bg-white p-3 text-center transition hover:border-brand/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-brand md:p-4"
            >
              <span className="relative size-20 overflow-hidden rounded-full bg-brand-light ring-4 ring-brand-soft transition duration-300 group-hover:-translate-y-1 md:size-24">
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </span>
              <span className="mt-3 font-display text-sm font-bold leading-tight text-ink md:text-base">{c.name[lang]}</span>
              <span className="mt-1 text-xs leading-tight text-muted">{c.count[lang]}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
