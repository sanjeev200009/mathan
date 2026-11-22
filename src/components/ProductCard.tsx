"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { formatPrice, type Product } from "@/lib/products";
import { gsap, motionOK } from "@/lib/gsap";
import { CartIcon } from "./icons";

// Flies a small copy of the product picture to the header cart icon.
function flyToCart(img: HTMLElement | null) {
  const target = document.querySelector("[data-cart-icon]");
  if (!img || !target || !motionOK()) return;
  const a = img.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  if (!b.width) return; // cart icon hidden (e.g. phone layout)
  const size = 56;
  const ghost = img.cloneNode(true) as HTMLElement;
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${a.left + a.width / 2 - size / 2}px`,
    top: `${a.top + a.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "9999px",
    overflow: "hidden",
    background: "white",
    boxShadow: "0 8px 24px rgba(0,0,0,.18)",
    zIndex: "100",
    pointerEvents: "none",
  });
  document.body.appendChild(ghost);
  gsap.to(ghost, {
    x: b.left + b.width / 2 - (a.left + a.width / 2),
    y: b.top + b.height / 2 - (a.top + a.height / 2),
    scale: 0.3,
    opacity: 0.6,
    duration: 0.75,
    ease: "power2.in",
    onComplete: () => ghost.remove(),
  });
}

export default function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLang();
  const { add, setQty, qtyOf } = useCart();
  const qty = qtyOf(product.id);
  const imgRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 1200);
    return () => clearTimeout(id);
  }, [added]);

  const onAdd = () => {
    flyToCart(imgRef.current);
    add(product.id);
    setAdded(true);
  };

  // The card's six rules:
  // 1 padding 24px on every side (16px on a phone, where two cards share 375px);
  // 2 one loud thing: the price; 3 inner radius = outer radius - padding (--r and --p);
  // 4 depth = a hairline border + one soft shadow; 5 one full-width button;
  // 6 hover lifts the same card 4px and deepens its shadow, nothing else moves.
  const btn =
    "flex h-11 w-full items-center justify-center gap-2 rounded-[calc(var(--r)-var(--p))] text-sm font-semibold transition-colors";

  return (
    <article
      data-card
      className="flex w-full flex-col rounded-[var(--r)] border border-black/[0.06] bg-white p-[var(--p)] shadow-[0_1px_2px_rgba(16,40,24,0.04),0_8px_24px_-12px_rgba(16,40,24,0.12)] transition-[translate,box-shadow] duration-200 ease-out [--p:16px] [--r:24px] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,40,24,0.05),0_16px_32px_-12px_rgba(16,40,24,0.2)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:[--p:24px] sm:[--r:32px]"
    >
      <div ref={imgRef} className="relative aspect-square overflow-hidden rounded-[calc(var(--r)-var(--p))] bg-brand-soft">
        <Image
          src={product.image}
          alt={product.name[lang]}
          fill
          sizes="(min-width:1280px) 16vw, (min-width:1024px) 22vw, (min-width:768px) 30vw, 46vw"
          className="object-contain p-2"
        />
      </div>

      <h3 className="mt-4 line-clamp-2 text-sm font-medium text-ink">{product.name[lang]}</h3>
      <p className="mt-0.5 text-xs text-muted">{product.unit[lang]}</p>
      <p className="mt-3 font-display text-2xl font-extrabold leading-none text-ink">{formatPrice(product.price)}</p>

      <div className="mt-auto pt-4">
        {qty > 0 && !added ? (
          <div className={`${btn} justify-between bg-brand-light text-brand-dark`}>
            <button
              type="button"
              onClick={() => setQty(product.id, qty - 1)}
              aria-label={t("Remove one", "ஒன்றைக் குறை")}
              className="grid h-full w-11 place-items-center text-lg font-bold"
            >
              −
            </button>
            <span className="font-bold" aria-live="polite">{qty}</span>
            <button
              type="button"
              onClick={() => add(product.id)}
              aria-label={t("Add one", "ஒன்றைச் சேர்")}
              className="grid h-full w-11 place-items-center text-lg font-bold"
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className={`${btn} ${added ? "bg-brand-light text-brand-dark" : "bg-brand text-white hover:bg-brand-dark"}`}
          >
            {added ? (
              <span>{t("Added ✓", "சேர்க்கப்பட்டது ✓")}</span>
            ) : (
              <>
                <CartIcon className="size-4 shrink-0" />
                <span>{t("Add to cart", "கூடையில் சேர்")}</span>
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}
