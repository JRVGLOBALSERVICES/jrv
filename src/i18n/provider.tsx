"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import en from "./en";
import ms from "./ms";

type Lang = "en" | "ms";
const STORAGE_KEY = "jrv_lang";

const translations: Record<Lang, Record<string, string>> = { en, ms };

interface LangCtx {
  lang: Lang;
  toggle: () => void;
  t: (key: string) => string;
}

const Ctx = createContext<LangCtx>({
  lang: "en",
  toggle: () => {},
  t: (key: string) => key,
});

export function useLang() {
  return useContext(Ctx);
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ms") setLang(stored);
  }, []);

  const toggle = useCallback(() => {
    setLang((l) => {
      const next = l === "en" ? "ms" : "en";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string) => translations[lang][key] ?? key,
    [lang]
  );

  return <Ctx.Provider value={{ lang, toggle, t }}>{children}</Ctx.Provider>;
}
