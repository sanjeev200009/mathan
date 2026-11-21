"use client";

import { useEffect, useRef } from "react";
import { CartIcon, MenuIcon, WhatsAppIcon } from "@/components/icons";
import { useLang } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { waLink, helloMessage } from "@/lib/whatsapp";
import { gsap, motionOK } from "@/lib/gsap";

// Phone-only tab bar. Slides away while scrolling down, back on scrolling up.
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-6" aria-hidden>
    <path d="M3 10.5 12 3l9 7.5M5 9v11h5v-6h4v6h5V9" />
  </svg>
);
const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="size-6" aria-hidden>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </svg>
);

export default function MobileBottomBar() {
  const { t, lang } = useLang();
  const { count, subtotal, setCartOpen, cartOpen, addedTick } = useCart();
  const bar = useRef<HTMLDivElement>(null);
  const badge = useRef<HTMLSpanElement>(null);
  const hidden = useRef(false);

  const show = (v: boolean) => {
    if (!bar.current || hidden.current === !v) return;
    hidden.current = !v;
    gsap.to(bar.current, { yPercent: v ? 0 : 110, duration: motionOK() ? 0.3 : 0, ease: "power2.out" });
  };

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const d = y - last;
      last = y;
      if (y < 80 || d < -6) show(true);
      else if (d > 12) show(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (addedTick && badge.current && motionOK())
      gsap.fromTo(badge.current, { scale: 1.6 }, { scale: 1, duration: 0.45, ease: "back.out(3)" });
    if (addedTick) show(true);
  }, [addedTick]);

  const tab = "flex min-h-14 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 text-[10.5px] font-medium text-muted";
  const label = "max-w-full truncate px-0.5";

  return (
    <div
      ref={bar}
      className={`fixed inset-x-0 bottom-0 z-40 md:hidden ${cartOpen ? "pointer-events-none invisible" : ""}`}
    >
      {count > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="flex min-h-11 w-full items-center justify-between bg-brand-dark px-4 text-sm font-semibold text-white"
        >
          <span className="truncate">
            {count} {t(count === 1 ? "item" : "items", "பொருட்கள்")} · {formatPrice(subtotal)}
          </span>
          <span className="shrink-0">{t("View cart", "கூடையைப் பார்")} →</span>
        </button>
      )}
      <nav
        aria-label={t("Quick links", "விரைவு இணைப்புகள்")}
        className="flex items-end border-t border-line bg-white px-1 pb-[env(safe-area-inset-bottom)]"
      >
        <button className={tab} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <HomeIcon />
          <span className={label}>{t("Home", "முகப்பு")}</span>
        </button>
        <button
          className={tab}
          onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}
        >
          <GridIcon />
          <span className={label}>{t("Categories", "வகைகள்")}</span>
        </button>
        <a
          href={waLink(helloMessage(lang))}
          target="_blank"
          rel="noopener noreferrer"
          className={`${tab} text-whatsapp`}
          aria-label={t("Order on WhatsApp", "வாட்ஸ்அப்பில் ஆர்டர்")}
        >
          <span className="-mt-5 grid size-13 place-items-center rounded-full bg-whatsapp text-white shadow-lg ring-4 ring-white">
            <WhatsAppIcon className="size-7" />
          </span>
          <span className={`${label} font-semibold`}>{t("WhatsApp", "வாட்ஸ்அப்")}</span>
        </a>
        <button className={tab} onClick={() => setCartOpen(true)} aria-label={t(`Cart, ${count} items`, `கூடை, ${count} பொருட்கள்`)}>
          <span className="relative">
            <CartIcon />
            {count > 0 && (
              <span
                ref={badge}
                className="absolute -top-1.5 -right-2 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white"
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </span>
          <span className={label}>{t("Cart", "கூடை")}</span>
        </button>
        <button className={tab} onClick={() => window.dispatchEvent(new Event("pf:open-menu"))}>
          <MenuIcon />
          <span className={label}>{t("Menu", "மெனு")}</span>
        </button>
      </nav>
    </div>
  );
}
