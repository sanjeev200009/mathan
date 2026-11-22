"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import { CartIcon, CloseIcon, MenuIcon, SearchIcon, WhatsAppIcon } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { gsap, motionOK, useGSAP } from "@/lib/gsap";
import { useLang } from "@/lib/i18n";
import { CATEGORIES, type CategoryId } from "@/lib/products";
import { STORE_PHONE_DISPLAY, helloMessage, waLink } from "@/lib/whatsapp";


const toProducts = () => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });

// One clean bar: logo · four links (categories under "Shop") · search · language · WhatsApp · cart.
// Phones: logo · search · cart · menu (the menu holds the links and the language).
export default function Header() {
  const { lang, setLang, t } = useLang();
  const { count, setCartOpen, query, setQuery, category, setCategory, addedTick } = useCart();
  const barRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
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

  const link = (active = false) =>
    `rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-brand ${
      active ? "bg-brand-light font-semibold text-brand-dark" : "text-muted hover:text-brand-dark"
    }`;

  const iconBtn =
    "relative grid size-10 shrink-0 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-brand";

  const search = (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        setSearchOpen(false);
        toProducts();
      }}
      className="flex h-10 min-w-0 items-center gap-2 rounded-full bg-brand-soft px-3 ring-1 ring-line focus-within:ring-brand"
    >
      <SearchIcon className="size-4 shrink-0 text-muted" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("Search products", "பொருட்களைத் தேடுக")}
        aria-label={t("Search for products", "பொருட்களைத் தேடுக")}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
      />
    </form>
  );

  return (
    <header
      ref={barRef}
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow ${scrolled ? "shadow-[0_1px_0_var(--color-line),0_8px_24px_-16px_rgba(16,40,24,0.25)]" : "shadow-[0_1px_0_var(--color-line)]"}`}
    >
      <div className="container-x flex h-16 items-center gap-3 lg:gap-6">
        <Logo />

        <nav aria-label={t("Main", "முதன்மை")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            <li>
              <button type="button" onClick={() => pick("all")} className={link(category === "all")}>
                {t("Home", "முகப்பு")}
              </button>
            </li>
            <li className="group relative">
              <button type="button" aria-haspopup="true" onClick={() => toProducts()} className={link(category !== "all")}>
                {t("Shop", "பொருட்கள்")} <span aria-hidden className="text-[10px]">▾</span>
              </button>
              {/* Categories: hover or keyboard focus */}
              <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <ul className="min-w-52 rounded-2xl border border-black/[0.06] bg-white p-2 shadow-[0_12px_32px_-12px_rgba(16,40,24,0.25)]">
                  {CATEGORIES.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => pick(c.id)}
                        className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2 text-left text-sm whitespace-nowrap hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand"
                      >
                        <span className="font-medium text-ink">{c.name[lang]}</span>
                        <span className="text-xs text-muted">{c.count[lang]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li>
              <a href="#services" className={link()}>
                {t("Services", "சேவைகள்")}
              </a>
            </li>
            <li>
              <a href="#contact" className={link()}>
                {t("Contact", "தொடர்பு")}
              </a>
            </li>
          </ul>
        </nav>

        <div className="ml-auto hidden w-56 md:block xl:w-72">{search}</div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label={t("Search", "தேடு")}
            aria-expanded={searchOpen}
            className={`${iconBtn} text-ink hover:bg-brand-soft md:hidden`}
          >
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>

          <button
            type="button"
            onClick={() => setLang(lang === "ta" ? "en" : "ta")}
            aria-label={t("Switch to Tamil", "Switch to English")}
            className="hidden h-10 shrink-0 rounded-full px-3 text-sm font-semibold text-ink ring-1 ring-line transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand lg:block"
          >
            {lang === "ta" ? "EN" : "தமிழ்"}
          </button>

          <a
            href={waLink(helloMessage(lang))}
            target="_blank"
            rel="noopener noreferrer"
            title={STORE_PHONE_DISPLAY}
            aria-label={t(`Order on WhatsApp, ${STORE_PHONE_DISPLAY}`, `WhatsApp மூலம் ஆர்டர், ${STORE_PHONE_DISPLAY}`)}
            className={`${iconBtn} hidden bg-whatsapp text-white hover:brightness-95 sm:grid`}
          >
            <WhatsAppIcon className="size-5" />
          </a>

          <button
            type="button"
            data-cart-icon
            onClick={() => setCartOpen(true)}
            aria-label={t(`Cart, ${count} items`, `கூடை, ${count} பொருட்கள்`)}
            className={`${iconBtn} text-ink hover:bg-brand-soft`}
          >
            <CartIcon className="size-6" />
            {count > 0 && (
              <span
                ref={badgeRef}
                className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-sale px-1 text-[11px] font-bold text-white"
              >
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("pf:open-menu"))}
            aria-label={t("Open menu", "மெனுவைத் திற")}
            className={`${iconBtn} text-ink hover:bg-brand-soft lg:hidden`}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Phone search: opens under the bar only when asked for */}
      {searchOpen && <div className="container-x pb-3 md:hidden">{search}</div>}
    </header>
  );
}
