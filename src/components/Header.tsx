"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import { CartIcon, LeafIcon, MenuIcon, SearchIcon, WhatsAppIcon } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { gsap, motionOK, useGSAP } from "@/lib/gsap";
import { useLang } from "@/lib/i18n";
import { CATEGORIES, type CategoryId } from "@/lib/products";
import { STORE_PHONE_DISPLAY, helloMessage, waLink } from "@/lib/whatsapp";

const TruckIcon = ({ className = "size-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M2 6h11v10H2zM13 9h4l3 3v4h-7" />
    <circle cx="6" cy="17.5" r="1.6" />
    <circle cx="17" cy="17.5" r="1.6" />
  </svg>
);

const toProducts = () => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });

export default function Header() {
  const { lang, setLang, t } = useLang();
  const { count, setCartOpen, query, setQuery, category, setCategory, addedTick } = useCart();
  const barRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useGSAP(
    () => {
      if (motionOK()) gsap.from(barRef.current, { yPercent: -100, opacity: 0, duration: 0.6, ease: "power3.out" });
    },
    { scope: barRef },
  );

  useGSAP(
    () => {
      if (addedTick === 0 || !badgeRef.current || !motionOK()) return;
      gsap.fromTo(badgeRef.current, { scale: 1.4 }, { scale: 1, duration: 0.45, ease: "back.out(3)" });
    },
    { dependencies: [addedTick], scope: barRef },
  );

  const pick = (c: CategoryId | "all") => {
    setCategory(c);
    if (c === "all") window.scrollTo({ top: 0, behavior: "smooth" });
    else toProducts();
  };

  const navBtn = (active: boolean) =>
    `rounded-full px-3 lg:px-4 py-1.5 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
      active ? "bg-brand text-white" : "text-ink hover:bg-brand-light hover:text-brand"
    }`;

  const langBtn = (l: "ta" | "en", label: string) => (
    <button
      type="button"
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      className={`px-1 focus-visible:outline-2 focus-visible:outline-white ${lang === l ? "font-bold underline underline-offset-4" : "opacity-80 hover:opacity-100"}`}
    >
      {label}
    </button>
  );

  const veg = CATEGORIES[0];
  const rest = CATEGORIES.slice(1);

  return (
    <>
      {/* Top bar: scrolls away */}
      <div className="bg-brand-dark text-white text-xs">
        <div className="container-x flex items-center justify-between gap-3 py-1.5">
          <p className="hidden md:flex items-center gap-1.5">
            <LeafIcon className="size-3.5 text-leaf" />
            {t("Fresh • Quality • To your home", "புத்துணர்வு • தரமானது • உங்கள் வீட்டிற்கே")}
          </p>
          <p className="flex items-center gap-1.5 min-w-0">
            <TruckIcon className="size-4 shrink-0" />
            <span className="hidden md:inline">{t("Free delivery on orders over Rs. 3,000", "ரூ. 3,000க்கு மேல் ஆர்டர்களுக்கு இலவச விநியோகம்")}</span>
            <span className="md:hidden truncate">{t("Free delivery over Rs. 3,000", "ரூ. 3,000+ இலவச விநியோகம்")}</span>
          </p>
          <div className="flex items-center gap-1 shrink-0" role="group" aria-label={t("Language", "மொழி")}>
            {langBtn("ta", "தமிழ்")}
            <span aria-hidden className="opacity-60">|</span>
            {langBtn("en", "English")}
          </div>
        </div>
      </div>

      {/* Main header + nav: sticky */}
      <div ref={barRef} className={`sticky top-0 z-40 bg-white transition-shadow ${scrolled ? "shadow-md" : ""}`}>
        <div className="container-x flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
          <Logo />

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              toProducts();
            }}
            className="order-last md:order-none w-full md:w-auto md:flex-1 md:max-w-xl md:mx-auto flex"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Search for products...", "எந்த பொருளை தேடுகிறீர்கள்?")}
              aria-label={t("Search for products", "பொருட்களைத் தேடுக")}
              className="min-w-0 flex-1 rounded-l-lg border border-r-0 border-line px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              aria-label={t("Search", "தேடு")}
              className="rounded-r-lg bg-brand px-4 text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <SearchIcon />
            </button>
          </form>

          <div className="ml-auto md:ml-0 flex items-center gap-2 sm:gap-4">
            <a
              href={waLink(helloMessage(lang))}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span className="grid size-10 place-items-center rounded-full bg-whatsapp text-white">
                <WhatsAppIcon className="size-6" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-bold text-ink whitespace-nowrap">{STORE_PHONE_DISPLAY}</span>
                <span className="block text-xs text-muted whitespace-nowrap">{t("Order on WhatsApp", "WhatsApp மூலம் ஆர்டர் செய்ய")}</span>
              </span>
            </a>

            <button
              type="button"
              data-cart-icon
              onClick={() => setCartOpen(true)}
              aria-label={t(`Cart, ${count} items`, `கூடை, ${count} பொருட்கள்`)}
              className="relative flex flex-col items-center rounded-lg px-1 text-brand focus-visible:outline-2 focus-visible:outline-brand"
            >
              <CartIcon className="size-7" />
              <span className="text-[11px] text-ink">{t("Cart", "கூடை")}</span>
              {count > 0 && (
                <span
                  ref={badgeRef}
                  className="absolute -top-1 -right-1 grid min-w-5 h-5 place-items-center rounded-full bg-sale px-1 text-[11px] font-bold text-white"
                >
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("pf:open-menu"))}
              aria-label={t("Open menu", "மெனுவைத் திற")}
              className="md:hidden rounded-lg p-1 text-ink focus-visible:outline-2 focus-visible:outline-brand"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        <nav aria-label={t("Main", "முதன்மை")} className="hidden md:block border-y border-line bg-brand-soft">
          <ul className="container-x flex flex-wrap items-center gap-1 py-1.5 text-[13px] lg:text-sm font-medium">
            <li>
              <button type="button" onClick={() => pick("all")} className={navBtn(category === "all")}>
                {t("Home", "முகப்பு")}
              </button>
            </li>
            <li className="group relative">
              <button
                type="button"
                onClick={() => pick(veg.id)}
                aria-haspopup="true"
                className={navBtn(category === veg.id)}
              >
                {veg.name[lang]} ▾
              </button>
              {/* Dropdown: hover or keyboard focus inside */}
              <ul className="invisible absolute left-0 top-full z-50 min-w-48 pt-1 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <li className="rounded-lg border border-line bg-white p-1 shadow-lg">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => pick(c.id)}
                      className="block w-full rounded-md px-3 py-2 text-left whitespace-nowrap hover:bg-brand-light hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
                    >
                      {c.name[lang]}
                    </button>
                  ))}
                </li>
              </ul>
            </li>
            {rest.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => pick(c.id)} className={navBtn(category === c.id)}>
                  {c.name[lang]}
                </button>
              </li>
            ))}
            <li>
              <a href="#services" className={navBtn(false)}>
                {t("Our Services", "எங்கள் சேவைகள்")}
              </a>
            </li>
            <li>
              <a href="#contact" className={navBtn(false)}>
                {t("Contact", "தொடர்பு கொள்ள")}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
