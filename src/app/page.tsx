"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useLang } from "@/i18n/provider";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import BookingModal from "@/components/booking/BookingModal";
import PricingCalculator from "@/components/PricingCalculator";
import Globe from "@/components/Globe";
import LangSwitch from "@/components/LangSwitch";

const Car3D = dynamic(() => import("@/components/3d/Car3D"), { ssr: false });
const FleetShowroom = dynamic(() => import("@/components/fleet/FleetShowroom"), { ssr: false });

const FRAMES = 47;
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
    <div className="fixed inset-0 bg-black -z-10">
      <canvas ref={c} className="w-full h-full block" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />
      {!ok && <div className="absolute inset-0 flex items-center justify-center bg-black"><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>}
    </div>
  );
}

// ─── STAGGER VARIANTS ───────────────────────────────
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease }} className={className}>{children}</motion.div>;
}

function useFade(start: number, p: number) {
  const v = Math.min(1, Math.max(0, (p - start) * 8));
  return { opacity: v, transform: `translateY(${(1 - v) * 30}px)` };
}

const CARS = [
  { n: "Perodua Axia G1", p: "RM 110", s: "Hatchback", img: "/images/perodua-axia.png" },
  { n: "Perodua Axia G2", p: "RM 120", s: "Hatchback", img: "/images/car-hatchback.png" },
  { n: "Proton Exora", p: "RM 170", s: "MPV · 7 seats", img: "/images/proton-exora.png" },
  { n: "Proton X50", p: "RM 250", s: "SUV", img: "/images/proton-x50.png" },
  { n: "Toyota Vios", p: "RM 170", s: "Sedan", img: "/images/toyota-vios.png" },
  { n: "Toyota Yaris", p: "RM 161", s: "Hatchback", img: "/images/car-hatchback.png" },
  { n: "Honda City RS", p: "RM 170", s: "Hybrid", img: "/images/honda-city.png" },
  { n: "Mitsubishi Xpander", p: "RM 350", s: "MPV", img: "/images/car-suv.png" },
  { n: "Toyota Alphard", p: "RM 700", s: "Luxury", img: "/images/car-luxury.png" },
];

// ─── 3D SHOWCASE SECTION ────────────────────────────
function Showcase3D({ scene }: { scene?: any }) {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const l = (window as any).__lenis;
    if (!l) return;
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const h = rect.height;
      // Progress from section entering viewport (0)
      // to section fully exited (1)
      const totalDist = h + window.innerHeight;
      const pct = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / totalDist));
      setProgress(pct);
    };
    l.on("scroll", update);
    update();
    return () => l.off("scroll", update);
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 bg-black/80 min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Car3D progress={progress} scene={scene} />
      </div>
      <div className="relative z-10 text-center px-5 max-w-xl">
        <p className="text-[#FF4500] text-[10px] font-bold tracking-[0.25em] uppercase mb-2">{t('showcase.badge')}</p>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{t('showcase.title')}</h2>
        <p className="text-white/40 text-sm">{t('showcase.subtitle')}</p>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────
export default function Home() {
  const { t } = useLang();
  const [sy, setSy] = useState(0);
  const [vp, setVp] = useState(0);
  const [carScene, setCarScene] = useState<any>(null);
  const [booking, setBooking] = useState<{ open: boolean; car?: string }>({ open: false });
  useEffect(() => { setVp(window.innerHeight); }, []);

  // Load X50 model once, outside Canvas
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
      const loader = new GLTFLoader();
      loader.load("/models/proton-x50.glb",
        (gltf) => {
          if (cancelled) return;
          gltf.scene.traverse((child: any) => {
            if (!(child instanceof (THREE as any).Mesh)) return;
            child.castShadow = true;
            child.receiveShadow = true;
            const mat: any = child.material;
            if (mat && mat.name === "00 - BODY") {
              mat.color.set("#FF4500");
              mat.metalness = 0.6;
              mat.roughness = 0.3;
            }
          });
          setCarScene(gltf.scene);
        },
        undefined,
        (err: any) => console.error("X50 load error:", err)
      );
    })();
    return () => { cancelled = true; };
  }, []);
  const p = vp > 0 ? Math.min(1, sy / vp) : 0;
  const hp = useCallback((n: number) => setSy(n * (window.innerHeight || 720)), []);
  const f = (s: number) => useFade(s, p);

  return (
    <main>
      {/* NAV */}
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease }}
        className="fixed top-0 left-0 right-0 z-50" style={{ opacity: Math.max(0, 1 - p * 3) }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FF4500] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">JRV</span>
            </div>
            <span className="text-white/50 text-xs font-semibold tracking-wider uppercase hidden sm:block">{t('nav.brand')}</span>
          </a>
          <div className="flex items-center gap-3">
            <LangSwitch />
            <a href="#fleet" className="text-white/60 hover:text-white text-[10px] font-semibold uppercase tracking-wider transition-colors">{t('nav.fleet')}</a>
            <button onClick={() => setBooking({ open: true })}
              className="bg-[#FF4500] text-white text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 active:scale-[0.97] transition-all cursor-pointer">{t('nav.book')}</button>
          </div>
        </div>
      </motion.nav>
      <div style={{ height: 56 }} />
      <div style={{ height: "calc(100vh - 56px)" }} />

      <Scrubber onProg={hp} />

      {/* ─── HERO ─── */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center px-5 max-w-3xl mx-auto">
          <p className="text-[#FF4500] text-xs font-bold tracking-[0.25em] uppercase mb-4" style={f(0.05)}>Sewa Lama Lagi Murah</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.88] mb-4" style={f(0.12)}>
            {t('hero.title_1')}<br /><span className="text-[#FF4500]">{t('hero.title_2')}</span><br />{t('hero.title_3')}<br /><span className="text-[#FF4500]">{t('hero.title_4')}</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-md mx-auto mb-8" style={f(0.22)}>{t('hero.subtitle')}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3" style={f(0.32)}>
            <button onClick={() => setBooking({ open: true })}
              className="bg-[#FF4500] text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:brightness-110 active:scale-[0.97] transition-all cursor-pointer">{t('hero.book')}</button>
            <a href="tel:+60126565477"
              className="border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-sm hover:bg-white/5 active:scale-[0.97] transition-all">{t('hero.call')}</a>
          </div>
          <div className="flex gap-8 justify-center mt-8" style={f(0.42)}>
            {[{ v: "50+", l: t('hero.cars') }, { v: "1K+", l: t('hero.clients') }, { v: "4.9★", l: t('hero.rating') }].map((x) => (
              <div key={x.l} className="text-center">
                <p className="text-2xl font-black text-white">{x.v}</p>
                <p className="text-[9px] text-white/40 font-semibold uppercase tracking-wider mt-0.5">{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3D SHOWCASE ─── */}
      <Showcase3D scene={carScene} />

      {/* ─── MARQUEE ─── */}
      <div className="relative z-10 py-2.5 bg-white/10 backdrop-blur-sm border-y border-white/10 overflow-hidden">
        <div className="flex whitespace-nowrap" style={{ animation: "m 30s linear infinite" }}>
          {Array.from({ length: 6 }).flatMap(() => [
            "SEWA LAMA LAGI MURAH", "FREE DELIVERY", "ZERO DEPOSIT", "UNLIMITED MILEAGE", "24/7 SERVICE", "KLIA PICKUP"
          ]).map((t, i) => (
            <span key={i} className="text-[10px] font-bold text-white/60 uppercase tracking-[0.15em] mx-4">
              {t} <span className="text-[#FF4500]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── FLEET ─── */}
      <section id="fleet" className="relative z-10 py-20 bg-black/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-5">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-white">{t('fleet.title')}</h2>
              <p className="text-white/40 text-sm mt-1">{t('fleet.subtitle')}</p>
            </div>
          </Reveal>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CARS.map((car) => (
              <motion.div key={car.n} variants={item}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="h-36 overflow-hidden bg-gradient-to-br from-white/5 to-white/0">
                  <img src={car.img} alt={car.n} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm">{car.n}</h3>
                  <p className="text-white/40 text-[10px] mt-0.5">{car.s}</p>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10">
                    <span className="text-[#FF4500] font-bold text-base">{car.p}<span className="text-white/20 text-[9px]">{t('fleet.per_day')}</span></span>
                    <div className="flex items-center gap-2.5">
                      <a href={`/fleet/${car.n.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}`}
                        className="text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors">{t('fleet.view')}</a>
                      <button onClick={() => setBooking({ open: true, car: car.n })}
                        className="text-white/50 group-hover:text-[#FF4500] text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer">{t('fleet.book')}</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <FleetShowroom onBook={(car) => setBooking({ open: true, car })} />

      {/* ─── 8 REASONS ─── */}
      <section className="relative z-10 py-20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-5">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-[#FF4500] text-[10px] font-bold tracking-[0.25em] uppercase mb-2">{t('reasons.badge')}</p>
              <h2 className="text-3xl md:text-5xl font-black text-white">{t('reasons.title')}</h2>
              <p className="text-white/40 text-sm mt-1 max-w-xl mx-auto">{t('reasons.subtitle')}</p>
            </div>
          </Reveal>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { k: "zero_deposit" },
              { k: "free_delivery" },
              { k: "unlimited_mileage" },
              { k: "service" },
              { k: "latest" },
              { k: "klia" },
              { k: "best_rates" },
              { k: "replacement" },
            ].map((r) => (
              <motion.div key={r.k} variants={item}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-[#FF4500]/30 transition-all duration-300"
              >
                <h3 className="font-bold text-white text-sm">{t('reasons.' + r.k)}</h3>
                <p className="text-white/40 text-[11px] mt-1.5 leading-relaxed">{t('reasons.' + r.k + '_desc')}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <PricingCalculator />

      {/* ─── REVIEWS ─── */}
      <section className="relative z-10 py-20 bg-black/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-5">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-[#FF4500] text-[10px] font-bold tracking-[0.25em] uppercase mb-2">{t('reviews.badge')}</p>
              <h2 className="text-3xl md:text-5xl font-black text-white">What Our Clients Say</h2>
            </div>
          </Reveal>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { q: '"Professional service, spotless car. Will definitely rent again."', a: "— Ahmad R.", s: "★★★★★" },
              { q: '"Smooth booking and free delivery saved my time. Highly recommended!"', a: "— Sarah L.", s: "★★★★★" },
              { q: '"Best car rental in Seremban. Zero deposit, unlimited mileage."', a: "— Mike C.", s: "★★★★★" },
            ].map((r, i) => (
              <motion.div key={i} variants={item}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
              >
                <p className="text-[#FFD700] text-sm mb-3">{r.s}</p>
                <p className="text-white/80 text-sm leading-relaxed mb-3">{r.q}</p>
                <p className="text-white/40 text-xs">{r.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="relative z-10 py-20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-5">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-[#FF4500] text-[10px] font-bold tracking-[0.25em] uppercase mb-2">{t('faq.title')}</p>
              <h2 className="text-3xl md:text-5xl font-black text-white">{t('faq.title')}</h2>
            </div>
          </Reveal>
          <div className="space-y-2">
            {['q1','q2','q3','q4'].map((k, i) => (
              <details key={i} className="group border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm">
                <summary className="px-5 py-3.5 cursor-pointer text-white font-semibold text-sm flex items-center justify-between list-none hover:bg-white/5 transition-colors">
                  <span>{t('faq.' + k)}</span>
                  <span className="text-[#FF4500] group-open:rotate-180 transition-transform text-xs shrink-0">▾</span>
                </summary>
                <div className="px-5 pb-3.5 text-white/50 text-xs leading-relaxed border-t border-white/5 pt-2.5">{t('faq.' + k.replace('q', 'a'))}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GLOBE ─── */}
      <section className="relative z-10 h-[380px] md:h-[450px] flex items-center justify-center overflow-hidden bg-black/80">
        <div className="absolute inset-0">
          <Globe />
        </div>
        <div className="relative z-10 text-center px-5">
          <p className="text-[#FF4500] text-[10px] font-bold tracking-[0.25em] uppercase mb-2">{t('globe.badge')}</p>
          <h2 className="text-3xl md:text-5xl font-black text-white">{t('globe.title')}</h2>
          <p className="text-white/40 text-sm mt-2 max-w-md mx-auto">{t('globe.subtitle')}</p>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative z-10 bg-[#FF4500] py-16">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-3">Ready To Hit The Road?</h2>
          <p className="text-white/70 text-sm max-w-md mx-auto mb-8">Reply in minutes. Zero paperwork. Be on the road within the hour.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={() => setBooking({ open: true })}
              className="bg-black text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:brightness-110 active:scale-[0.97] transition-all cursor-pointer">Book via WhatsApp</button>
            <a href="tel:+60126565477"
              className="border-2 border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-sm hover:bg-white/10 active:scale-[0.97] transition-all">Call +60 12-656 5477</a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 bg-black/90 py-10 text-center border-t border-white/5">
        <div className="max-w-5xl mx-auto px-5">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#FF4500] flex items-center justify-center font-black text-white text-xs rounded-lg">JRV</div>
            <span className="text-white font-bold text-sm">{t('nav.brand')}</span>
          </div>
          <p className="text-white/30 text-xs mb-1">{t('footer.address')}</p>
          <div className="flex justify-center gap-5 my-4">
            <a href="https://wa.me/60126565477" className="text-white/40 hover:text-[#FF4500] text-xs transition-colors">{t('footer.whatsapp')}</a>
            <a href="tel:+60126565477" className="text-white/40 hover:text-[#FF4500] text-xs transition-colors">{t('footer.call')}</a>
            <a href="https://jrvservices.co" className="text-white/40 hover:text-[#FF4500] text-xs transition-colors">{t('footer.website')}</a>
          </div>
          <p className="text-white/40 text-[11px]">© 2026 JRV Rental Services. Powered by <a href="https://jrvsystems.app" className="text-[#FF4500] hover:underline">JRV Systems</a></p>
        </div>
      </footer>

      <style>{`@keyframes m{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>

      <BookingModal
        open={booking.open}
        preselectedCar={booking.car}
        onClose={() => setBooking({ open: false })}
      />
    </main>
  );
}
