"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Two languages, written side by side where they are used: t("Cart", "கூடை").
// ponytail: no dictionary files; add one if a third language ever comes.
export type Lang = "ta" | "en";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (en: string, ta: string) => string };

const LangCtx = createContext<Ctx | null>(null);
const KEY = "pf-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  // Tamil first, as in the design.
  const [lang, setLangState] = useState<Lang>("ta");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "en" || saved === "ta") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  };

  const t = (en: string, ta: string) => (lang === "ta" ? ta : en);
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLang outside LangProvider");
  return c;
}
