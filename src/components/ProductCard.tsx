"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { formatPrice, type Product } from "@/lib/products";
import { productMessage, waLink } from "@/lib/whatsapp";
import { gsap, motionOK } from "@/lib/gsap";
import { CartIcon, WhatsAppIcon } from "./icons";

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

  const btn = "flex min-h-9 w-full items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-center text-[11px] leading-tight font-semibold sm:text-xs";

  return (
    <article data-card className="group flex w-full flex-col rounded-lg border border-line bg-white p-2.5 transition-shadow hover:shadow-md sm:p-3">
      <div ref={imgRef} className="relative aspect-square overflow-hidden rounded-md bg-brand-soft">
        <Image
          src={product.image}
          alt={product.name[lang]}
          fill
          sizes="(min-width:1280px) 16vw, (min-width:1024px) 22vw, (min-width:768px) 30vw, 46vw"
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <h3 className="mt-2.5 line-clamp-2 text-sm font-semibold text-ink">{product.name[lang]}</h3>
      <p className="text-xs text-muted">{product.unit[lang]}</p>
      <p className="mt-1 text-base font-bold text-brand">{formatPrice(product.price)}</p>

      <div className="mt-auto flex flex-col gap-1.5 pt-2.5">
        <a
          href={waLink(productMessage(product.id, qty || 1, lang))}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} bg-brand text-white hover:bg-brand-dark`}
        >
          <WhatsAppIcon className="size-4 shrink-0" />
          <span>{t("Order on WhatsApp", "WhatsApp மூலம் ஆர்டர்")}</span>
        </a>

        {qty > 0 && !added ? (
          <div className="flex min-h-9 items-center justify-between rounded-md border border-brand text-brand">
            <button
              type="button"
              onClick={() => setQty(product.id, qty - 1)}
              aria-label={t("Remove one", "ஒன்றைக் குறை")}
              className="h-9 w-9 text-lg font-bold hover:bg-brand-light"
            >
              −
            </button>
            <span className="text-sm font-bold" aria-live="polite">{qty}</span>
            <button
              type="button"
              onClick={() => add(product.id)}
              aria-label={t("Add one", "ஒன்றைச் சேர்")}
              className="h-9 w-9 text-lg font-bold hover:bg-brand-light"
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className={`${btn} border ${added ? "border-brand bg-brand-light text-brand" : "border-line text-ink hover:border-brand hover:text-brand"}`}
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
