"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

const FRAMES = 61;
const fSrc = (i: number) => `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;
const ease = [0.23, 1, 0.32, 1] as const;

// ─── VIDEO FRAME SCRUBBER ───────────────────────────
function Scrubber({ onProg }: { onProg: (n: number) => void }) {
  const c = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const [ok, setOk] = useState(false);
  const cur = useRef(-1);

  useEffect(() => {
    const a: HTMLImageElement[] = [];
    let n = 0;
    for (let i = 0; i < FRAMES; i++) {
      const img = new Image();
      img.onload = img.onerror = () => { n++; if (n === FRAMES) { imgs.current = a; setOk(true); } };
      img.src = fSrc(i); a.push(img);
    }
    return () => a.forEach((i) => { i.src = ""; });
  }, []);

  const draw = useCallback((fi: number) => {
    const ca = c.current, im = imgs.current[fi];
    if (!ca || !im || !im.complete || !im.naturalWidth) return;
    const ctx = ca.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const w = window.innerWidth, h = window.innerHeight;
    ca.width = w; ca.height = h; ca.style.width = w + "px"; ca.style.height = h + "px";
    const s = Math.max(w / im.naturalWidth, h / im.naturalHeight);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(im, (w - im.naturalWidth * s) / 2, h - im.naturalHeight * s, im.naturalWidth * s, im.naturalHeight * s);
  }, []);

  useEffect(() => {
    if (!ok) return;
    let cl: (() => void) | undefined, rt: any;
    const at = () => {
      const l = (window as any).__lenis;
      if (!l) { rt = setTimeout(at, 0); return; }
      const os = () => {
        const scrolled = window.scrollY;
        const p = Math.min(1, scrolled / window.innerHeight);
        const fi = Math.min(FRAMES - 1, Math.floor(p * FRAMES));
        if (fi !== cur.current) { cur.current = fi; draw(fi); }
        onProg(p);
      };
      l.on("scroll", os); os();
      cl = () => l.off("scroll", os);
    };
    at();
    return () => { clearTimeout(rt); if (cl) cl(); };
  }, [ok, draw, onProg]);

  return (
    <div className="fixed inset-0 bg-black z-0">
      <canvas ref={c} className="w-full h-full block" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />
      {!ok && <div className="absolute inset-0 flex items-center justify-center bg-black"><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>}
    </div>
  );
}

// ─── FADE IN UTILITY ────────────────────────────────
function useFade(start: number, p: number) {
  const v = Math.min(1, Math.max(0, (p - start) * 8));
  return {
    opacity: v,
    transform: `translateY(${(1 - v) * 30}px)`,
  };
}

// ─── PAGE ────────────────────────────────────────────
export default function Home() {
  const [sy, setSy] = useState(0);
  const [vp, setVp] = useState(0);
  useEffect(() => { setVp(window.innerHeight); }, []);
  const p = vp > 0 ? Math.min(1, sy / vp) : 0;
  const hp = useCallback((n: number) => setSy(n * (window.innerHeight || 720)), []);
  const f = (s: number) => useFade(s, p);

  return (
    <main>
      {/* NAV */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ opacity: Math.max(0, 1 - p * 3) }}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FF4500] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">JRV</span>
            </div>
            <span className="text-white/50 text-xs font-semibold tracking-wider uppercase hidden sm:block">Car Rental</span>
          </a>
          <a href="https://wa.me/60126565477" target="_blank"
            className="bg-[#FF4500] text-white text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 active:scale-[0.97] transition-all"
          >Book Now</a>
        </div>
      </motion.nav>

      <div style={{ height: 56 }} />
      <div style={{ height: "calc(100vh - 56px)" }} />

      {/* VIDEO BACKGROUND */}
      <Scrubber onProg={hp} />

      {/* HERO OVERLAY */}
      <section className="relative min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center px-5 max-w-3xl mx-auto">
          <p className="text-[#FF4500] text-xs font-bold tracking-[0.25em] uppercase mb-4" style={f(0.05)}>
            Sewa Lama Lagi Murah
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.88] mb-4" style={f(0.12)}>
            Rent The<br /><span className="text-[#FF4500]">Ride.</span><br />Own The<br /><span className="text-[#FF4500]">Road.</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-md mx-auto mb-8" style={f(0.22)}>
            Premium cars · Honest prices · Free delivery Seremban
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3" style={f(0.32)}>
            <a href="https://wa.me/60126565477" target="_blank"
              className="bg-[#FF4500] text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:brightness-110 active:scale-[0.97] transition-all"
            >Book on WhatsApp</a>
            <a href="tel:+60126565477"
              className="border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-sm hover:bg-white/5 active:scale-[0.97] transition-all"
            >Call +60 12-656 5477</a>
          </div>
          <div className="flex gap-8 justify-center mt-8" style={f(0.42)}>
            {[{ v: "50+", l: "Cars" }, { v: "1K+", l: "Clients" }, { v: "4.9★", l: "Rating" }].map((x) => (
              <div key={x.l} className="text-center">
                <p className="text-2xl font-black text-white">{x.v}</p>
                <p className="text-[9px] text-white/40 font-semibold uppercase tracking-wider mt-0.5">{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLEET */}
      <section className="relative py-20 bg-black/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white">Choose Your Ride</h2>
            <p className="text-white/40 text-sm mt-1">50+ cars · From RM 110/day</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { n: "Perodua Axia G1", p: "RM 110", s: "Hatchback", img: "/images/perodua-axia.png" },
              { n: "Proton Exora", p: "RM 170", s: "MPV · 7 seats", img: "/images/proton-exora.png" },
              { n: "Proton X50", p: "RM 250", s: "SUV", img: "/images/proton-x50.png" },
              { n: "Toyota Vios", p: "RM 170", s: "Sedan", img: "/images/toyota-vios.png" },
              { n: "Honda City RS", p: "RM 170", s: "Hybrid", img: "/images/honda-city.png" },
              { n: "Toyota Alphard", p: "RM 700", s: "Luxury", img: "/images/car-luxury.png" },
            ].map((car) => (
              <div key={car.n}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="h-36 bg-gradient-to-br from-white/5 to-white/0 overflow-hidden">
                  <img src={car.img} alt={car.n} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm">{car.n}</h3>
                  <p className="text-white/40 text-[10px] mt-0.5">{car.s}</p>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10">
                    <span className="text-[#FF4500] font-bold text-base">{car.p}<span className="text-white/20 text-[9px]">/day</span></span>
                    <a href="https://wa.me/60126565477" className="text-white/50 group-hover:text-[#FF4500] text-[10px] font-bold uppercase tracking-wider transition-colors">Book</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 REASONS */}
      <section className="relative py-20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-white">Eight Reasons We're Built Different</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "Zero Deposit", "Free Delivery", "Unlimited Mileage", "24/7 Service",
              "Latest Models", "KLIA Pickup", "Best Rates", "Replacement Guaranteed",
            ].map((t) => (
              <div key={t}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-[#FF4500]/30 transition-all"
              >
                <h3 className="font-bold text-white text-sm">{t}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 bg-[#FF4500]">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-3">Ready To Hit The Road?</h2>
          <p className="text-white/70 text-sm max-w-md mx-auto mb-6">Reply in minutes. Zero paperwork. Be on the road within the hour.</p>
          <a href="https://wa.me/60126565477" target="_blank"
            className="bg-black text-white font-bold px-8 py-3.5 rounded-xl text-sm inline-block hover:brightness-110 active:scale-[0.97] transition-all"
          >Book via WhatsApp</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black/90 py-10 text-center border-t border-white/5">
        <div className="max-w-5xl mx-auto px-5">
          <p className="text-white/30 text-xs mb-1">51, Jln S2 B18, Seremban 2 · 24 hours · 7 days</p>
          <p className="text-white/40 text-xs mt-4">© 2026 JRV Rental Services.</p>
        </div>
      </footer>
    </main>
  );
}
