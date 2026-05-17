"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getCarBySlug } from "@/data/fleet";
import dynamic from "next/dynamic";
import BookingModal from "@/components/booking/BookingModal";

const Fleet3DView = dynamic(() => import("./Fleet3DView"), { ssr: false });

export default function FleetDetailPage() {
  const params = useParams();
  const car = getCarBySlug(params.slug as string);
  const [showBooking, setShowBooking] = useState(false);

  if (!car) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center px-5">
          <h1 className="text-4xl font-black text-white mb-2">Car Not Found</h1>
          <p className="text-white/40 mb-6">This model isn't in our fleet.</p>
          <a href="/" className="text-[#FF4500] hover:underline">← Back to Home</a>
        </div>
      </main>
    );
  }

  const dailyPrice = car.price;

  return (
    <main className="min-h-screen bg-black">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#FF4500] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-[10px]">JRV</span>
            </div>
            <span className="text-white/40 text-[10px] font-semibold tracking-wider uppercase">Car Rental</span>
          </a>
          <button onClick={() => setShowBooking(true)}
            className="bg-[#FF4500] text-white text-[10px] font-bold px-4 py-2 rounded-lg hover:brightness-110 active:scale-[0.97] transition-all">
            Book Now
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 py-16">
          <a href="/" className="text-white/30 hover:text-white/60 text-xs mb-6 inline-block transition-colors">← Back to fleet</a>
          <div className="grid md:grid-cols-2 gap-8 items-center mt-4">
            {/* 3D Model */}
            <div className="h-[350px] md:h-[450px] rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-transparent border border-white/10">
              {car.model ? <Fleet3DView modelPath={car.model} /> : (
                <div className="w-full h-full flex items-center justify-center">
                  <img src={car.img} alt={car.name} className="w-3/4 object-contain opacity-60" />
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="text-[#FF4500] text-[10px] font-bold tracking-[0.25em] uppercase mb-2">{car.type}</p>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] mb-4">{car.name}</h1>
              <p className="text-white/40 text-sm leading-relaxed mb-6">{car.description}</p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-[#FF4500] text-4xl font-black">RM {dailyPrice}</span>
                <span className="text-white/30 text-sm">/ day</span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  { label: "Seats", value: car.seats.toString() },
                  { label: "Transmission", value: car.transmission },
                  { label: "Fuel", value: car.fuel },
                  { label: "Year", value: car.year },
                  { label: "Deposit", value: car.deposit },
                  { label: "Mileage", value: car.mileage },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 rounded-xl px-3.5 py-2.5 border border-white/5">
                    <p className="text-white/30 text-[9px] uppercase tracking-wider">{s.label}</p>
                    <p className="text-white text-sm font-semibold">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="mb-6">
                <p className="text-white/30 text-[10px] uppercase tracking-wider font-semibold mb-2">Features</p>
                <div className="flex flex-wrap gap-1.5">
                  {car.features.map((f) => (
                    <span key={f} className="bg-white/10 text-white/70 text-[10px] px-2.5 py-1 rounded-full">{f}</span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button onClick={() => setShowBooking(true)}
                className="w-full bg-[#FF4500] text-white font-bold py-3.5 rounded-xl text-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Book {car.name}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#FF4500] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-[10px]">JRV</span>
            </div>
            <span className="text-white/30 text-xs">JRV Car Rental</span>
          </div>
          <p className="text-white/20 text-[10px]">51, Jln S2 B18, Seremban 2 · 24 hours · 7 days</p>
          <a href="https://wa.me/60126565477" className="text-white/40 hover:text-[#FF4500] text-xs transition-colors">WhatsApp</a>
        </div>
      </footer>

      <BookingModal open={showBooking} preselectedCar={car.name} onClose={() => setShowBooking(false)} />
    </main>
  );
}
