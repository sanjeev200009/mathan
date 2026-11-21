"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import { CloseIcon, WhatsAppIcon } from "@/components/icons";
import { useLang } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { CATEGORIES, type CategoryId } from "@/lib/products";
import { waLink, helloMessage, STORE_PHONE_DISPLAY } from "@/lib/whatsapp";
import { gsap, motionOK } from "@/lib/gsap";

// Phone-only side menu. Opened by window event "pf:open-menu" (header hamburger, bottom bar).
const DOT: Record<CategoryId, string> = {
  vegetables: "#1b7a36",
  fruits: "#f59e0b",
  coconut: "#8b5e34",
  greens: "#6abf3c",
  grocery: "#d97706",
};

const scrollTo = (id: string) => {
  if (id === "top") window.scrollTo({ top: 0, behavior: "smooth" });
  else document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function MobileMenu() {
  const { t, lang, setLang } = useLang();
  const { setCategory } = useCart();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const after = useRef<(() => void) | null>(null);

  useEffect(() => {
    const onOpen = () => {
      opener.current = document.activeElement;
      setMounted(true);
      setOpen(true);
    };
    window.addEventListener("pf:open-menu", onOpen);
    return () => window.removeEventListener("pf:open-menu", onOpen);
  }, []);

  // Animate in / out; unmount only after the out animation ends.
  useEffect(() => {
    if (!mounted || !panel.current || !backdrop.current) return;
    const p = panel.current;
    const b = backdrop.current;
    const items = p.querySelectorAll("[data-item]");
    const ok = motionOK();
    if (open) {
      document.body.style.overflow = "hidden";
      p.focus();
      if (ok) {
        gsap.fromTo(b, { opacity: 0 }, { opacity: 1, duration: 0.25 });
        gsap.fromTo(p, { xPercent: -100 }, { xPercent: 0, duration: 0.4, ease: "power3.out" });
        gsap.fromTo(items, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, stagger: 0.04, delay: 0.12, ease: "power2.out" });
      }
      return;
    }
    const done = () => {
      document.body.style.overflow = "";
      setMounted(false);
      (opener.current as HTMLElement | null)?.focus?.();
      after.current?.();
      after.current = null;
    };
    if (!ok) return done();
    gsap.to(b, { opacity: 0, duration: 0.25 });
    gsap.to(p, { xPercent: -100, duration: 0.3, ease: "power3.in", onComplete: done });
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => void (document.body.style.overflow = ""), []);

  // Close first, then scroll (the body is unlocked by then).
  const go = (id: string, cat?: CategoryId) => {
    if (cat) setCategory(cat);
    after.current = () => scrollTo(id);
    setOpen(false);
  };

  if (!mounted) return null;

  const link = "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[15px] font-medium text-ink hover:bg-brand-soft";

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div ref={backdrop} className="absolute inset-0 bg-black/45" onClick={() => setOpen(false)} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={t("Menu", "மெனு")}
        tabIndex={-1}
        className="absolute inset-y-0 left-0 flex w-[85%] max-w-[360px] flex-col overflow-y-auto bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <Logo />
          <button
            onClick={() => setOpen(false)}
            className="grid size-11 place-items-center rounded-full text-ink hover:bg-brand-soft"
            aria-label={t("Close menu", "மெனுவை மூடு")}
          >
            <CloseIcon className="size-6" />
          </button>
        </div>

        <div data-item className="grid grid-cols-2 gap-2 px-4 pt-4">
          {(["ta", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`min-h-11 rounded-full border text-sm font-semibold ${
                lang === l ? "border-brand bg-brand text-white" : "border-line bg-white text-ink"
              }`}
            >
              {l === "ta" ? "தமிழ்" : "English"}
            </button>
          ))}
        </div>

        <nav className="flex flex-col gap-0.5 px-2 pt-3" aria-label={t("Main", "முதன்மை")}>
          <button data-item className={link} onClick={() => go("top")}>
            {t("Home", "முகப்பு")}
          </button>
          <p data-item className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted">
            {t("Categories", "வகைகள்")}
          </p>
          {CATEGORIES.map((c) => (
            <button key={c.id} data-item className={link} onClick={() => go("products", c.id)}>
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: DOT[c.id] }} aria-hidden />
              {c.name[lang]}
            </button>
          ))}
          <div data-item className="my-2 border-t border-line" />
          <button data-item className={link} onClick={() => go("services")}>
            {t("Our Services", "எங்கள் சேவைகள்")}
          </button>
          <button data-item className={link} onClick={() => go("contact")}>
            {t("Contact", "தொடர்பு")}
          </button>
        </nav>

        <div data-item className="mt-auto px-4 pt-5 pb-5">
          <a
            href={waLink(helloMessage(lang))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-4 font-semibold text-white"
          >
            <WhatsAppIcon className="size-6" />
            <span className="leading-tight">
              <span className="block">{t("Order on WhatsApp", "வாட்ஸ்அப்பில் ஆர்டர்")}</span>
              <span className="block text-xs font-normal opacity-90">{STORE_PHONE_DISPLAY}</span>
            </span>
          </a>
          <p className="mt-3 text-center text-xs text-muted">
            {t("Open every day · 7 AM – 9 PM", "தினமும் திறந்திருக்கும் · காலை 7 – இரவு 9")}
          </p>
        </div>
      </div>
    </div>
  );
}
