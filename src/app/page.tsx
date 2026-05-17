"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.23, 1, 0.32, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const CARS = [
  { n: "Perodua Axia G1", p: "RM 110", s: "Hatchback" },
  { n: "Perodua Axia G2", p: "RM 120", s: "Hatchback" },
  { n: "Proton Exora", p: "RM 170", s: "MPV" },
  { n: "Proton X50", p: "RM 250", s: "SUV" },
  { n: "Toyota Vios", p: "RM 170", s: "Sedan" },
  { n: "Toyota Yaris", p: "RM 161", s: "Hatchback" },
  { n: "Honda City RS", p: "RM 170", s: "Hybrid" },
  { n: "Mitsubishi Xpander", p: "RM 350", s: "MPV" },
  { n: "Toyota Alphard", p: "RM 700", s: "Luxury" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* NAV */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100"
      >
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FF4500] flex items-center justify-center font-black text-white text-xs rounded">JRV</div>
            <span className="text-sm font-bold text-gray-900">JRV</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="#fleet" className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors">Cars</a>
            <a href="https://wa.me/60126565477" target="_blank"
              className="text-xs font-semibold bg-[#FF4500] text-white px-4 py-2 rounded-lg hover:brightness-110 active:scale-[0.97] transition-all"
            >Book Now</a>
          </div>
        </div>
      </motion.nav>

      {/* HERO */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.15 }}
            className="text-[#FF4500] text-xs font-semibold tracking-[0.2em] uppercase mb-3"
          >
            JRV Car Rental · Since 2020
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.25 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] mb-4"
          >
            Rent The Ride.<br />
            <span className="text-[#FF4500]">Own The Road.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.35 }}
            className="text-white/40 text-sm max-w-md mx-auto mb-8"
          >
            Premium cars · Honest prices · Free delivery Seremban
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.45 }}
            className="flex flex-col sm:flex-row justify-center gap-3"
          >
            <a href="https://wa.me/60126565477" target="_blank"
              className="bg-[#FF4500] text-white font-semibold px-7 py-3 rounded-xl text-sm hover:brightness-110 active:scale-[0.97] transition-all"
            >Book on WhatsApp</a>
            <a href="tel:+60126565477"
              className="border border-white/20 text-white font-medium px-7 py-3 rounded-xl text-sm hover:bg-white/5 active:scale-[0.97] transition-all"
            >Call +60 12-656 5477</a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex gap-6 justify-center mt-8"
          >
            {[
              { v: "50+", l: "Cars" },
              { v: "1K+", l: "Clients" },
              { v: "4.9★", l: "Rating" },
            ].map((x) => (
              <div key={x.l} className="text-center">
                <p className="text-xl font-black text-white">{x.v}</p>
                <p className="text-[9px] text-white/40 font-medium uppercase tracking-wider mt-0.5">{x.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="py-3 bg-white border-b border-gray-100 overflow-hidden">
        <div className="flex whitespace-nowrap" style={{ animation: "m 30s linear infinite" }}>
          {Array.from({ length: 6 }).flatMap(() => [
            "SEWA LAMA LAGI MURAH", "FREE DELIVERY", "ZERO DEPOSIT", "UNLIMITED MILEAGE", "24/7 SERVICE", "KLIA PICKUP"
          ]).map((t, i) => (
            <span key={i} className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mx-4">
              {t} <span className="text-[#FF4500]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* FLEET */}
      <section id="fleet" className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-[#FF4500] text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">The Fleet</p>
              <h2 className="text-2xl md:text-4xl font-black text-gray-900">Choose Your Ride</h2>
              <p className="text-gray-400 text-xs mt-1">50+ cars · From RM 110/day</p>
            </div>
          </Reveal>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-2 md:grid-cols-3 gap-2.5"
          >
            {CARS.map((car) => (
              <motion.div key={car.n} variants={item}>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="h-20 bg-gray-50 flex items-center justify-center border-b border-gray-100">
                    <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5l-1.5-2H8L6.5 7H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
                    </svg>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm">{car.n}</h3>
                    <p className="text-gray-400 text-[10px] mt-0.5">{car.s}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="text-[#FF4500] font-bold text-base">{car.p}<span className="text-gray-300 text-[9px]">/day</span></span>
                      <a href="https://wa.me/60126565477" target="_blank"
                        className="text-gray-400 group-hover:text-[#FF4500] text-[10px] font-semibold uppercase tracking-wider transition-colors"
                      >Book</a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* REASONS */}
      <section className="py-16 md:py-20 bg-[#FFF8F0]">
        <div className="max-w-5xl mx-auto px-5">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-[#FF4500] text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">Built Different</p>
              <h2 className="text-2xl md:text-4xl font-black text-gray-900">Eight Reasons We're Built Different</h2>
            </div>
          </Reveal>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-2.5"
          >
            {[
              "Zero Deposit", "Free Delivery", "Unlimited Mileage", "24/7 Service",
              "Latest Models", "KLIA Pickup", "Best Rates", "Replacement",
            ].map((t) => (
              <motion.div key={t} variants={item}
                className="bg-white border border-gray-200 rounded-xl p-3.5 hover:border-[#FF4500]/20 hover:shadow-sm transition-all duration-200"
              >
                <h3 className="font-semibold text-gray-900 text-sm">{t}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-[#FF4500] text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">Questions?</p>
              <h2 className="text-2xl md:text-4xl font-black text-gray-900">FAQ</h2>
            </div>
          </Reveal>

          <div className="space-y-2">
            {[
              { q: "What documents do I need?", a: "Valid license, IC/passport, recent utility bill." },
              { q: "How much deposit?", a: "Zero. Rare in the industry." },
              { q: "Mileage limit?", a: "No. Unlimited on all rentals." },
              { q: "Breakdown?", a: "24/7 roadside assistance + replacement." },
            ].map((f, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden bg-white">
                <summary className="px-4 py-3 cursor-pointer text-gray-900 font-medium text-sm flex items-center justify-between list-none hover:bg-gray-50">
                  <span>{f.q}</span>
                  <span className="text-[#FF4500] group-open:rotate-180 transition-transform text-xs shrink-0">▾</span>
                </summary>
                <div className="px-4 pb-3 text-gray-500 text-xs border-t border-gray-100 pt-2">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FF4500] py-14">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-3">Ready To Hit The Road?</h2>
          <p className="text-white/70 text-sm max-w-md mx-auto mb-6">Book via WhatsApp. Zero paperwork. On the road within the hour.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a href="https://wa.me/60126565477" target="_blank"
              className="bg-black text-white font-semibold px-7 py-3 rounded-xl text-sm hover:brightness-110 active:scale-[0.97] transition-all"
            >Book via WhatsApp</a>
            <a href="tel:+60126565477"
              className="border-2 border-white/20 text-white font-medium px-7 py-3 rounded-xl text-sm hover:bg-white/10 active:scale-[0.97] transition-all"
            >Call +60 12-656 5477</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white/40 py-10 text-center text-sm">
        <div className="max-w-5xl mx-auto px-5">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#FF4500] flex items-center justify-center font-black text-white text-xs rounded">JRV</div>
            <span className="text-white font-bold">JRV Car Rental</span>
          </div>
          <p className="text-white/30 text-xs mb-1">51, Jln S2 B18, Seremban 2 · 24 hours · 7 days</p>
          <div className="flex justify-center gap-4 my-3">
            <a href="https://wa.me/60126565477" className="text-white/40 hover:text-[#FF4500] text-xs transition-colors">WhatsApp</a>
            <a href="tel:+60126565477" className="text-white/40 hover:text-[#FF4500] text-xs transition-colors">Call</a>
            <a href="https://jrvservices.co" className="text-white/40 hover:text-[#FF4500] text-xs transition-colors">Website</a>
          </div>
          <p className="text-xs">© 2026 JRV Rental Services. Powered by <a href="https://jrvsystems.app" className="text-[#FF4500] hover:underline">JRV Systems</a></p>
        </div>
      </footer>

      <style>{`@keyframes m{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </main>
  );
}
