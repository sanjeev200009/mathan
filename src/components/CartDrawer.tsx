"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { formatPrice, productById } from "@/lib/products";
import { FREE_DELIVERY_FROM } from "@/lib/whatsapp";
import { gsap, motionOK } from "@/lib/gsap";
import { CartIcon, CloseIcon } from "./icons";

// The cart: slides in from the right over a dimmed page. Stays mounted until it has slid out.
export default function CartDrawer() {
  const { lines, count, subtotal, setQty, remove, cartOpen, setCartOpen } = useCart();
  const { lang, t } = useLang();
  const router = useRouter();
  const [shown, setShown] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  if (cartOpen && !shown) setShown(true);

  // Slide in / out (layout effect: placed off-screen before the first paint).
  useLayoutEffect(() => {
    if (!shown) return;
    const p = panel.current, b = backdrop.current;
    if (!p || !b) return;
    const fast = !motionOK();
    if (cartOpen) {
      opener.current = document.activeElement;
      document.body.style.overflow = "hidden";
      p.querySelector<HTMLElement>("[data-close]")?.focus();
      const tl = gsap.timeline();
      tl.fromTo(b, { opacity: 0 }, { opacity: 1, duration: fast ? 0 : 0.25 })
        .fromTo(p, { xPercent: 100 }, { xPercent: 0, duration: fast ? 0 : 0.4, ease: "power3.out" }, 0);
      if (!fast) tl.from(p.querySelectorAll("[data-line]"), { x: 24, opacity: 0, stagger: 0.05, duration: 0.3 }, 0.15);
      return () => void tl.kill();
    }
    const tl = gsap.timeline({
      onComplete: () => {
        setShown(false);
        document.body.style.overflow = "";
        (opener.current as HTMLElement | null)?.focus?.();
      },
    });
    tl.to(p, { xPercent: 100, duration: fast ? 0 : 0.3, ease: "power2.in" }).to(b, { opacity: 0, duration: fast ? 0 : 0.2 }, 0.1);
    return () => void tl.kill();
  }, [cartOpen, shown]);

  // Safety: never leave the page scroll-locked if the drawer unmounts mid-animation.
  useEffect(() => () => void (document.body.style.overflow = ""), []);

  if (!shown) return null;

  const close = () => setCartOpen(false);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return close();
    if (e.key !== "Tab" || !panel.current) return;
    // Keep Tab inside the drawer.
    const f = panel.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
    const first = f[0], last = f[f.length - 1];
    const to = e.shiftKey ? (document.activeElement === first ? last : null) : document.activeElement === last ? first : null;
    if (to) {
      e.preventDefault();
      to.focus();
    }
  };
  const toShop = () => {
    close();
    const el = document.getElementById("products");
    if (el) setTimeout(() => el.scrollIntoView({ behavior: motionOK() ? "smooth" : "auto" }), 320);
    else router.push("/#products");
  };
  const missing = Math.max(0, FREE_DELIVERY_FROM - subtotal);

  return (
    <div className="fixed inset-0 z-[60]" onKeyDown={onKey}>
      <div ref={backdrop} className="absolute inset-0 bg-ink/50 opacity-0" onClick={close} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={t("Your cart", "உங்கள் கூடை")}
        className="absolute right-0 top-0 flex h-full w-full flex-col bg-white shadow-2xl sm:w-[420px]"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold">
            {t("Your cart", "உங்கள் கூடை")} <span className="text-muted font-normal">({count})</span>
          </h2>
          <button
            data-close
            onClick={close}
            className="grid size-10 place-items-center rounded-full text-muted hover:bg-brand-soft hover:text-ink"
            aria-label={t("Close cart", "கூடையை மூடு")}
          >
            <CloseIcon />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid size-20 place-items-center rounded-full bg-brand-light text-brand">
              <CartIcon className="size-10" />
            </div>
            <p className="font-semibold">{t("Your cart is empty", "உங்கள் கூடை காலியாக உள்ளது")}</p>
            <p className="text-sm text-muted">{t("Add fresh products to get started.", "புதிய பொருட்களைச் சேர்க்கவும்.")}</p>
            <button onClick={toShop} className="rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">
              {t("Start shopping", "வாங்கத் தொடங்குங்கள்")}
            </button>
          </div>
        ) : (
          <>
            <div className="border-b border-line bg-brand-soft px-5 py-3 text-sm">
              <p className="text-brand-dark">
                {missing > 0
                  ? t(`Add ${formatPrice(missing)} more for free delivery`, `இலவச விநியோகத்திற்கு இன்னும் ${formatPrice(missing)}`)
                  : t("You get free delivery!", "உங்களுக்கு இலவச விநியோகம்!")}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-leaf transition-[width] duration-500"
                  style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_FROM) * 100)}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((l) => {
                const p = productById(l.id);
                if (!p) return null;
                return (
                  <li key={l.id} data-line className="flex gap-3 py-4">
                    <Image src={p.image} alt="" width={72} height={72} className="size-18 shrink-0 rounded-xl bg-brand-soft object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{p.name[lang]}</p>
                          <p className="text-xs text-muted">{p.unit[lang]} · {formatPrice(p.price)}</p>
                        </div>
                        <button
                          onClick={() => remove(l.id)}
                          className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-sale/10 hover:text-sale"
                          aria-label={t(`Remove ${p.name.en}`, `${p.name.ta} நீக்கு`)}
                        >
                          <CloseIcon className="size-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            onClick={() => setQty(l.id, l.qty - 1)}
                            className="grid size-8 place-items-center rounded-full text-lg hover:bg-brand-soft"
                            aria-label={t("Decrease quantity", "அளவைக் குறை")}
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{l.qty}</span>
                          <button
                            onClick={() => setQty(l.id, l.qty + 1)}
                            className="grid size-8 place-items-center rounded-full text-lg hover:bg-brand-soft"
                            aria-label={t("Increase quantity", "அளவைக் கூட்டு")}
                          >
                            +
                          </button>
                        </div>
                        <p className="font-bold text-brand">{formatPrice(p.price * l.qty)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-3 border-t border-line px-5 py-4">
              <div className="flex justify-between text-base">
                <span className="text-muted">{t("Subtotal", "மொத்தம்")}</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted">
                {t("Pay cash on delivery or at the store. Delivery fee at checkout.", "விநியோகத்தின் போது அல்லது கடையில் பணம் செலுத்துங்கள்.")}
              </p>
              <Link
                href="/checkout"
                onClick={close}
                className="block rounded-full bg-brand py-3 text-center font-semibold text-white hover:bg-brand-dark"
              >
                {t("Checkout", "ஆர்டர் செய்ய")}
              </Link>
              <button onClick={close} className="block w-full rounded-full border border-line py-3 font-semibold hover:bg-brand-soft">
                {t("Continue shopping", "தொடர்ந்து வாங்கவும்")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
