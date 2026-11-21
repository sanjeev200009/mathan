"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import { WhatsAppIcon } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { formatPrice, productById } from "@/lib/products";
import { gsap, motionOK } from "@/lib/gsap";
import { deliveryFeeOf, orderMessage, STORE_PHONE_DISPLAY, waLink, type Customer } from "@/lib/whatsapp";

// Checkout: the customer's details, then the order goes to the shop as a WhatsApp message.
// No online payment - cash on delivery or at the store.
const SAVED = "pf-customer";
const TIMES = [
  { id: "morning", en: "Morning (8am - 12pm)", ta: "காலை (8 - 12)" },
  { id: "afternoon", en: "Afternoon (12pm - 4pm)", ta: "மதியம் (12 - 4)" },
  { id: "evening", en: "Evening (4pm - 8pm)", ta: "மாலை (4 - 8)" },
];
type Form = Omit<Customer, "time"> & { time: string }; // time = a TIMES id
type Field = "name" | "phone" | "address" | "area";
type Errors = Partial<Record<Field, [string, string]>>;
const EMPTY: Form = { name: "", phone: "", method: "delivery", address: "", area: "", time: "", notes: "" };

// Sri Lankan mobile: 07XXXXXXXX, +947XXXXXXXX or 947XXXXXXXX (spaces and dashes ignored).
const validPhone = (p: string) => /^(?:0|\+?94)7\d{8}$/.test(p.replace(/[\s-]/g, ""));

function check(f: Form): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = ["Please enter your name", "உங்கள் பெயரை உள்ளிடவும்"];
  if (!validPhone(f.phone)) e.phone = ["Enter a mobile number like 0771234567", "0771234567 போன்ற கைபேசி எண்ணை உள்ளிடவும்"];
  if (f.method === "delivery") {
    if (f.address.trim().length < 5) e.address = ["Please enter your delivery address", "விநியோக முகவரியை உள்ளிடவும்"];
    if (!f.area.trim()) e.area = ["Please enter your area / town", "உங்கள் பகுதி / நகரத்தை உள்ளிடவும்"];
  }
  return e;
}

const orderNumber = () => {
  const d = new Date();
  const ymd = [d.getFullYear() % 100, d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, "0")).join("");
  return `PF-${ymd}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
};

// WhatsApp shows *text* as bold; do the same in the preview.
const Bold = ({ text }: { text: string }) => (
  <>{text.split(/\*([^*\n]+)\*/).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))}</>
);

export default function CheckoutPage() {
  const { lines, subtotal, clear, loaded } = useCart();
  const { lang, setLang, t } = useLang();
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState<{ no: string; message: string } | null>(null);
  const [orderNo, setOrderNo] = useState("PF-…");
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Browser-only: last order's details and a fresh order number. The cart's own `loaded`
    // flag (below) stops an empty cart flashing before it is read from the browser.
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED) ?? "null") as Partial<Form> | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setForm((f) => ({ ...f, ...saved, notes: "" }));
    } catch {}
    setOrderNo(orderNumber());
    setReady(true);
  }, []);

  // Clear the cart only once the success screen is showing.
  useEffect(() => {
    if (done) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const view = !ready || !loaded ? "wait" : done ? "done" : lines.length ? "form" : "empty";

  // Sections rise in; the success tick draws itself.
  useLayoutEffect(() => {
    const el = root.current;
    if (view === "wait" || !el || !motionOK()) return;
    const ctx = gsap.context(() => {
      if (view === "done") {
        const tl = gsap.timeline();
        tl.from("[data-tick-ring]", { scale: 0.6, opacity: 0, duration: 0.4, ease: "back.out(2)", transformOrigin: "50% 50%" })
          .fromTo("[data-tick]", { strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" })
          .from("[data-reveal]", { y: 16, opacity: 0, stagger: 0.08, duration: 0.4 }, "-=0.2");
      } else {
        gsap.from("[data-reveal]", { y: 24, opacity: 0, stagger: 0.08, duration: 0.55, ease: "power3.out" });
      }
    }, el);
    return () => ctx.revert();
  }, [view]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k in errors) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const customer = (): Customer => {
    const time = TIMES.find((x) => x.id === form.time);
    return { ...form, name: form.name.trim(), phone: form.phone.trim(), time: time ? time[lang] : "" };
  };
  const message = orderMessage(lines, customer(), lang, orderNo);
  const fee = deliveryFeeOf(subtotal, form.method);

  const place = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = check(form);
    setErrors(errs);
    const first = (["name", "phone", "address", "area"] as Field[]).find((k) => errs[k]);
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const url = waLink(message);
    const w = window.open(url, "_blank");
    if (w) w.opener = null;
    else window.location.href = url; // pop-up blocked: open WhatsApp in this tab
    try {
      const { name, phone, method, address, area, time } = form;
      localStorage.setItem(SAVED, JSON.stringify({ name, phone, method, address, area, time }));
    } catch {}
    setDone({ no: orderNo, message });
    window.scrollTo({ top: 0 });
  };

  const err = (k: Field) =>
    errors[k] && (
      <p id={`${k}-err`} className="mt-1 text-sm text-sale">
        {t(...errors[k]!)}
      </p>
    );
  const input = (k: Field) => ({
    name: k,
    id: k,
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, e.target.value),
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `${k}-err` : undefined,
    className: `mt-1.5 w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 ${
      errors[k] ? "border-sale" : "border-line"
    }`,
  });
  const label = "block text-sm font-semibold";
  const card = "rounded-2xl border border-line bg-white p-5 md:p-6";

  return (
    <div ref={root} className="min-h-dvh bg-brand-soft">
      <header className="border-b border-line bg-white">
        <div className="container-x flex items-center justify-between gap-3 py-3">
          <Logo />
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="hidden rounded-full px-3 py-2 font-medium text-brand hover:bg-brand-light sm:block">
              ← {t("Back to shop", "கடைக்குத் திரும்பு")}
            </Link>
            <div className="flex rounded-full border border-line p-0.5" role="group" aria-label={t("Language", "மொழி")}>
              {(["ta", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={`rounded-full px-3 py-1.5 font-medium ${lang === l ? "bg-brand text-white" : "text-muted hover:text-ink"}`}
                >
                  {l === "ta" ? "தமிழ்" : "EN"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container-x py-6 md:py-10">
        {view === "wait" ? null : done ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-line bg-white p-8 text-center">
            <svg viewBox="0 0 64 64" className="mx-auto size-20" aria-hidden>
              <circle data-tick-ring cx="32" cy="32" r="30" className="fill-brand-light" />
              <path data-tick d="M20 33l8 8 16-17" fill="none" stroke="var(--color-brand)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" />
            </svg>
            <h1 data-reveal className="mt-5 text-2xl font-bold">{t("Order sent!", "ஆர்டர் அனுப்பப்பட்டது!")}</h1>
            <p data-reveal className="mt-2 text-muted">
              {t("Order number", "ஆர்டர் எண்")}: <strong className="text-ink">{done.no}</strong>
            </p>
            <p data-reveal className="mt-4 text-muted">
              {t(
                "We received your order on WhatsApp, we will confirm shortly.",
                "உங்கள் ஆர்டர் WhatsApp மூலம் கிடைத்தது, விரைவில் உறுதிப்படுத்துவோம்.",
              )}
            </p>
            <p data-reveal className="mt-1 text-sm text-muted">
              {t("WhatsApp did not open?", "WhatsApp திறக்கவில்லையா?")} {STORE_PHONE_DISPLAY}
            </p>
            <div data-reveal className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={waLink(done.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-semibold text-white hover:brightness-95"
              >
                <WhatsAppIcon /> {t("Send again on WhatsApp", "மீண்டும் WhatsApp-இல் அனுப்பு")}
              </a>
              <Link href="/" className="rounded-full border border-line px-6 py-3 font-semibold hover:bg-brand-soft">
                {t("Back to shop", "கடைக்குத் திரும்பு")}
              </Link>
            </div>
          </div>
        ) : lines.length === 0 ? (
          <div data-reveal className="mx-auto max-w-md rounded-2xl border border-line bg-white p-8 text-center">
            <h1 className="text-xl font-bold">{t("Your cart is empty", "உங்கள் கூடை காலியாக உள்ளது")}</h1>
            <p className="mt-2 text-muted">{t("Add some fresh products first.", "முதலில் சில புதிய பொருட்களைச் சேர்க்கவும்.")}</p>
            <Link href="/#products" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">
              {t("Back to shop", "கடைக்குத் திரும்பு")}
            </Link>
          </div>
        ) : (
          <>
            <h1 data-reveal className="mb-6 text-2xl font-bold md:text-3xl">{t("Checkout", "ஆர்டர் விவரங்கள்")}</h1>
            <form onSubmit={place} noValidate className="grid items-start gap-6 lg:grid-cols-[1fr_420px]">
              <div className="space-y-6">
                <section data-reveal className={card}>
                  <h2 className="mb-4 text-lg font-bold">{t("Your details", "உங்கள் விவரங்கள்")}</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={label}>{t("Name", "பெயர்")}</label>
                      <input {...input("name")} autoComplete="name" />
                      {err("name")}
                    </div>
                    <div>
                      <label htmlFor="phone" className={label}>{t("Mobile number", "கைபேசி எண்")}</label>
                      <input {...input("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="07X XXX XXXX" />
                      {err("phone")}
                    </div>
                  </div>
                </section>

                <section data-reveal className={card}>
                  <h2 className="mb-4 text-lg font-bold">{t("How would you like it?", "எப்படி பெற விரும்புகிறீர்கள்?")}</h2>
                  <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
                    {([
                      ["delivery", t("Home delivery", "வீட்டுக்கு விநியோகம்"), t("To your door", "உங்கள் வீட்டு வாசலுக்கு")],
                      ["pickup", t("Store pickup", "கடையில் பெறுதல்"), t("Collect from our store, no fee", "எங்கள் கடையில் பெறுங்கள், கட்டணம் இல்லை")],
                    ] as const).map(([id, title, sub]) => (
                      <label
                        key={id}
                        className={`flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition-colors ${
                          form.method === id ? "border-brand bg-brand-light" : "border-line hover:border-brand/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="method"
                          value={id}
                          checked={form.method === id}
                          onChange={() => set("method", id)}
                          className="mt-1 accent-[var(--color-brand)]"
                        />
                        <span>
                          <span className="block font-semibold">{title}</span>
                          <span className="block text-sm text-muted">{sub}</span>
                        </span>
                      </label>
                    ))}
                  </div>

                  {form.method === "delivery" && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-[2fr_1fr]">
                      <div>
                        <label htmlFor="address" className={label}>{t("Delivery address", "விநியோக முகவரி")}</label>
                        <input {...input("address")} autoComplete="street-address" placeholder={t("House no, street", "வீட்டு எண், தெரு")} />
                        {err("address")}
                      </div>
                      <div>
                        <label htmlFor="area" className={label}>{t("Area / town", "பகுதி / நகரம்")}</label>
                        <input {...input("area")} autoComplete="address-level2" />
                        {err("area")}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="time" className={label}>{t("Preferred time", "விரும்பும் நேரம்")}</label>
                      <select
                        id="time"
                        value={form.time}
                        onChange={(e) => set("time", e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                      >
                        <option value="">{t("Any time", "எந்த நேரமும்")}</option>
                        {TIMES.map((x) => (
                          <option key={x.id} value={x.id}>{x[lang]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="notes" className={label}>{t("Notes (optional)", "குறிப்பு (விருப்பம்)")}</label>
                      <textarea
                        id="notes"
                        rows={1}
                        value={form.notes}
                        onChange={(e) => set("notes", e.target.value)}
                        className="mt-1.5 w-full resize-y rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                  </div>
                </section>

                <section data-reveal className={card}>
                  <h2 className="mb-3 text-lg font-bold">{t("Payment", "கட்டணம்")}</h2>
                  <div className="flex items-start gap-3 rounded-xl border-2 border-brand bg-brand-light p-4">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-xs text-white" aria-hidden>✓</span>
                    <div>
                      <p className="font-semibold">
                        {form.method === "delivery"
                          ? t("Cash on Delivery", "விநியோகத்தின் போது பணம்")
                          : t("Pay at the store on pickup", "கடையில் பெறும்போது பணம்")}
                      </p>
                      <p className="text-sm text-muted">
                        {t("No online payment is taken. You pay only when you get your order.", "இணையத்தில் பணம் செலுத்த வேண்டாம். ஆர்டர் கிடைக்கும்போது மட்டும் செலுத்துங்கள்.")}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <aside data-reveal className={`${card} space-y-4 lg:sticky lg:top-6`}>
                <h2 className="text-lg font-bold">{t("Order summary", "ஆர்டர் சுருக்கம்")}</h2>
                <ul className="divide-y divide-line">
                  {lines.map((l) => {
                    const p = productById(l.id);
                    if (!p) return null;
                    return (
                      <li key={l.id} className="flex items-center gap-3 py-2.5">
                        <Image src={p.image} alt="" width={44} height={44} className="size-11 rounded-lg bg-brand-soft object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{p.name[lang]}</p>
                          <p className="text-xs text-muted">{p.unit[lang]} × {l.qty}</p>
                        </div>
                        <span className="text-sm font-semibold">{formatPrice(p.price * l.qty)}</span>
                      </li>
                    );
                  })}
                </ul>
                <dl className="space-y-1.5 border-t border-line pt-3 text-sm">
                  <div className="flex justify-between"><dt className="text-muted">{t("Subtotal", "மொத்தம்")}</dt><dd>{formatPrice(subtotal)}</dd></div>
                  <div className="flex justify-between">
                    <dt className="text-muted">{t("Delivery", "விநியோகம்")}</dt>
                    <dd className={fee === 0 ? "font-semibold text-brand" : ""}>{fee === 0 ? t("Free", "இலவசம்") : formatPrice(fee)}</dd>
                  </div>
                  <div className="flex justify-between pt-1.5 text-base font-bold">
                    <dt>{t("Total", "செலுத்த வேண்டியது")}</dt><dd className="text-brand">{formatPrice(subtotal + fee)}</dd>
                  </div>
                </dl>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                    {t("Message we will send", "அனுப்பப்படும் செய்தி")}
                  </p>
                  <div className="max-h-72 overflow-y-auto rounded-xl bg-[#e5ddd5] p-3">
                    <div className="ml-auto max-w-[92%] whitespace-pre-wrap break-words rounded-xl rounded-tr-none bg-[#dcf8c6] px-3 py-2 text-[13px] leading-relaxed text-ink shadow-sm">
                      <Bold text={message} />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp py-3.5 font-semibold text-white shadow-sm hover:brightness-95 active:scale-[0.99]"
                >
                  <WhatsAppIcon /> {t("Place order on WhatsApp", "WhatsApp மூலம் ஆர்டர் செய்")}
                </button>
                <Link href="/" className="block text-center text-sm font-medium text-brand hover:underline sm:hidden">
                  ← {t("Back to shop", "கடைக்குத் திரும்பு")}
                </Link>
              </aside>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
