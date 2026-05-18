"use client";

import { useLang } from "@/i18n/provider";

export default function LangSwitch() {
  const { lang, toggle, t } = useLang();

  return (
    <button
      onClick={toggle}
      className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
    >
      {lang === "en" ? "BM" : "EN"}
    </button>
  );
}
