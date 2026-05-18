"use client";

import { useState } from "react";
import { useLang } from "@/i18n/provider";

const CARS = [
  { n: "Perodua Axia G1", p: 110 },
  { n: "Perodua Axia G2", p: 120 },
  { n: "Proton Exora", p: 170 },
  { n: "Proton X50", p: 250 },
  { n: "Toyota Vios", p: 170 },
  { n: "Toyota Yaris", p: 161 },
  { n: "Honda City RS", p: 170 },
  { n: "Mitsubishi Xpander", p: 350 },
  { n: "Toyota Alphard", p: 700 },
];

const LOCATIONS = ["Seremban", "KLIA Terminal 1", "KLIA Terminal 2", "KL Sentral"];

function daysBetween(a: Date, b: Date) {
  return Math.max(0, Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function PricingCalculator() {
  const { t } = useLang();
  const [car, setCar] = useState(CARS[0].n);
  const [pickup, setPickup] = useState("");
  const [ret, setRet] = useState("");
  const [location, setLocation] = useState("Seremban");
  const [extraDelivery, setExtraDelivery] = useState(false);

  const c = CARS.find((c) => c.n === car);
  const daily = c?.p || 0;
  const today = new Date().toISOString().split("T")[0];

  const pickupD = pickup ? new Date(pickup) : null;
  const retD = ret ? new Date(ret) : null;
  const days = pickupD && retD ? daysBetween(pickupD, retD) : 0;
  const baseTotal = daily * days;
  const delivery = extraDelivery ? (location === "Seremban" ? 0 : 50) : 0;
  const total = baseTotal + delivery;

  return (
    <section className="relative z-10 py-20 bg-black/50">
      <div className="max-w-lg mx-auto px-5">
        <div className="text-center mb-10">
          <p className="text-[#FF4500] text-[10px] font-bold tracking-[0.25em] uppercase mb-2">Transparent Pricing</p>
          <h2 className="text-3xl md:text-5xl font-black text-white">Price Calculator</h2>
          <p className="text-white/40 text-sm mt-1">See exactly what you'll pay — no surprises</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 space-y-4">
          {/* Car */}
          <div>
            <label className="text-white/50 text-[10px] font-semibold uppercase tracking-widest block mb-1.5">Car Model</label>
            <select value={car} onChange={(e) => setCar(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF4500] transition-colors appearance-none">
              {CARS.map((c) => <option key={c.n} value={c.n}>{c.n} — RM {c.p}/{t('pricing.day')}</option>)}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/50 text-[10px] font-semibold uppercase tracking-widest block mb-1.5">Pickup</label>
              <input type="date" value={pickup} onChange={(e) => setPickup(e.target.value)} min={today}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF4500] transition-colors [color-scheme:dark]" />
            </div>
            <div>
              <label className="text-white/50 text-[10px] font-semibold uppercase tracking-widest block mb-1.5">Return</label>
              <input type="date" value={ret} onChange={(e) => setRet(e.target.value)} min={pickup || today}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF4500] transition-colors [color-scheme:dark]" />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-white/50 text-[10px] font-semibold uppercase tracking-widest block mb-1.5">Pickup Location</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF4500] transition-colors appearance-none">
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}{l !== "Seremban" ? " (+RM 50 delivery)" : ""}</option>)}
            </select>
          </div>

          {/* Delivery toggle for non-Seremban */}
          {location !== "Seremban" && (
            <label className="flex items-center gap-3 text-white/60 text-sm cursor-pointer">
              <input type="checkbox" checked={extraDelivery} onChange={(e) => setExtraDelivery(e.target.checked)}
                className="w-4 h-4 accent-[#FF4500]" />
              {t('pricing.delivery')} {location} (+RM 50)
            </label>
          )}

          {/* Divider */}
          <div className="border-t border-white/10 pt-4 mt-2" />

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">{car}</span>
              <span className="text-white">RM {daily}/day × {days} day{days !== 1 ? "s" : ""}</span>
            </div>
            {delivery > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Delivery</span>
                <span className="text-white">RM {delivery}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
              <span className="text-white">{t('pricing.total')}</span>
              <span className="text-[#FF4500]">RM {days > 0 ? total : "—"}</span>
            </div>
            {days === 0 && pickup && ret && (
              <p className="text-white/30 text-[10px] text-center">{t('pricing.return_error')}</p>
            )}
          </div>
        </div>

        <p className="text-white/20 text-[10px] text-center mt-4">{t('pricing.note')}</p>
      </div>
    </section>
  );
}
