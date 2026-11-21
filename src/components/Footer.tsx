"use client";

import { useLang } from "@/lib/i18n";
import { waLink, helloMessage, STORE_PHONE_DISPLAY } from "@/lib/whatsapp";
import Logo from "./Logo";
import { LeafIcon, WhatsAppIcon } from "./icons";

const SOCIAL = [
  { name: "Facebook", d: "M14 8h2V5h-2.5C11 5 10 6.6 10 9v2H8v3h2v6h3v-6h2.3l.5-3H13V9.3c0-.8.3-1.3 1-1.3z" },
  { name: "Instagram", d: "M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4zm4 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM16.8 6.3a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" },
  { name: "YouTube", d: "M21 8.2c-.2-1.4-1-2.2-2.4-2.4C16.4 5.5 12 5.5 12 5.5s-4.4 0-6.6.3C4 6 3.2 6.8 3 8.2 2.8 9.5 2.8 12 2.8 12s0 2.5.2 3.8c.2 1.4 1 2.2 2.4 2.4 2.2.3 6.6.3 6.6.3s4.4 0 6.6-.3c1.4-.2 2.2-1 2.4-2.4.2-1.3.2-3.8.2-3.8s0-2.5-.2-3.8zM10 15V9l5 3z" },
  { name: "TikTok", d: "M16.5 3h-3v12a2.5 2.5 0 1 1-2.5-2.5V9.5A5.5 5.5 0 1 0 16.5 15V9.2a6.4 6.4 0 0 0 3.5 1V7.2A3.6 3.6 0 0 1 16.5 3z" },
];

export default function Footer() {
  const { t, lang, setLang } = useLang();

  const links = [
    { href: "/", label: t("Home", "முகப்பு") },
    { href: "#products", label: t("Our products", "எங்கள் பொருட்கள்") },
    { href: "#services", label: t("Our services", "எங்கள் சேவைகள்") },
    { href: "#contact", label: t("Contact", "தொடர்பு கொள்ள") },
  ];
  const head = "mb-3 font-display font-bold text-white";

  return (
    <footer id="contact" className="bg-brand-dark pb-20 text-white md:pb-0">
      <div className="container-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0">
          <Logo light />
          <p className="mt-3 max-w-xs text-sm text-white/75">
            {t("Fresh vegetables, fruits and groceries delivered to your door.", "புதிய காய்கறிகள், பழங்கள் மற்றும் மளிகைப் பொருட்கள் உங்கள் வீட்டு வாசலுக்கு.")}
          </p>
        </div>

        <nav aria-label={t("Quick links", "விரைவு இணைப்புகள்")}>
          <h3 className={head}>{t("Quick links", "விரைவு இணைப்புகள்")}</h3>
          <ul className="space-y-2 text-sm text-white/80">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-leaf">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <h3 className={head}>{t("Contact", "தொடர்பு கொள்ள")}</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li>
              <a href={waLink(helloMessage(lang))} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-leaf">
                <WhatsAppIcon className="size-5 shrink-0 text-whatsapp" />
                <span>
                  <span className="block font-semibold text-white">{STORE_PHONE_DISPLAY}</span>
                  <span className="block text-xs">{t("(WhatsApp only)", "(வாட்ஸ்அப் மட்டும்)")}</span>
                </span>
              </a>
            </li>
            <li className="flex items-start gap-2">
              <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-leaf" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              {t("Colombo, Sri Lanka", "கொழும்பு, இலங்கை")}
            </li>
            <li className="flex items-start gap-2">
              <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-leaf" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              {t("Every day 7am - 9pm", "தினமும் காலை 7 - இரவு 9")}
            </li>
          </ul>
        </div>

        <div className="min-w-0">
          <h3 className={head}>{t("Follow us", "எங்களை பின்தொடருங்கள்")}</h3>
          <ul className="flex gap-2">
            {SOCIAL.map((s) => (
              <li key={s.name}>
                <a
                  href="#"
                  aria-label={s.name}
                  className="grid size-9 place-items-center rounded-full bg-white/10 transition hover:bg-leaf"
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
                    <path d={s.d} fillRule="evenodd" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-start gap-2 text-sm text-white/80">
            <LeafIcon className="size-6 shrink-0 text-leaf" />
            {t("Freshness for nature, care for the future", "பசுமையை காப்போம் எதிர்காலத்தை பாதுகாப்போம்")}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-4 text-center text-xs text-white/70 sm:flex-row sm:text-left">
          <p>{t("© 2026 Pasumai Fresh. All rights reserved.", "© 2026 பசுமை ஃப்ரெஷ். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.")}</p>
          <p className="flex items-center gap-2">
            <button onClick={() => setLang("ta")} aria-pressed={lang === "ta"} className={lang === "ta" ? "font-bold text-white" : "hover:text-white"}>
              தமிழ்
            </button>
            <span aria-hidden>|</span>
            <button onClick={() => setLang("en")} aria-pressed={lang === "en"} className={lang === "en" ? "font-bold text-white" : "hover:text-white"}>
              English
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
