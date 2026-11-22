"use client";

import { useEffect, useRef, useState } from "react";
import { CloseIcon, WhatsAppIcon } from "@/components/icons";
import { useLang } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { waLink, helloMessage } from "@/lib/whatsapp";
import { gsap, motionOK } from "@/lib/gsap";

// Desktop-only floating WhatsApp button (phones use the bottom bar's).
export default function FloatingWhatsApp() {
  const { t, lang } = useLang();
  const { cartOpen } = useCart();
  const ring = useRef<HTMLSpanElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const [tipShown, setTipShown] = useState(false);

  useEffect(() => {
    if (!ring.current || !motionOK()) return;
    const tw = gsap.fromTo(ring.current, { scale: 1, opacity: 0.55 }, { scale: 1.7, opacity: 0, duration: 1.6, ease: "power1.out", repeat: -1, repeatDelay: 0.6 });
    return () => void tw.kill();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setTipShown(true), 4000);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (tipShown && tip.current && motionOK())
      gsap.fromTo(tip.current, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(2)" });
  }, [tipShown]);

  return (
    <div className={`fixed right-6 bottom-6 z-40 hidden items-end gap-3 ${cartOpen ? "" : "md:flex"}`}>
      {tipShown && (
        <div ref={tip} role="status" className="relative mb-2 flex items-center gap-2 rounded-2xl border border-line bg-white py-2 pr-1 pl-4 text-sm font-medium text-ink shadow-lg">
          {t("Need help? Chat with us", "உதவி வேண்டுமா? எங்களுடன் பேசுங்கள்")}
          <button
            onClick={() => setTipShown(false)}
            className="grid size-8 place-items-center rounded-full text-muted hover:bg-brand-soft"
            aria-label={t("Dismiss", "மூடு")}
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
      )}
      <a
        href={waLink(helloMessage(lang))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("Chat with us on WhatsApp", "வாட்ஸ்அப்பில் எங்களுடன் பேசுங்கள்")}
        onClick={() => setTipShown(false)}
        className="relative grid size-15 place-items-center rounded-full bg-whatsapp text-white shadow-xl transition-transform hover:scale-105"
      >
        <span ref={ring} className="absolute inset-0 rounded-full bg-whatsapp" aria-hidden />
        <WhatsAppIcon className="relative size-8" />
      </a>
    </div>
  );
}
