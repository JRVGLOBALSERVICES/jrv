"use client";

import { useState, useEffect, useRef } from "react";

const ease = [0.23, 1, 0.32, 1] as const;
const WHATSAPP = "60126565477";

// ─── FLEET CARS FOR DROPDOWN ────────────────────────
const CARS = [
  "Perodua Axia G1", "Perodua Axia G2", "Proton Exora",
  "Proton X50", "Toyota Vios", "Toyota Yaris",
  "Honda City RS", "Mitsubishi Xpander", "Toyota Alphard",
];

interface BookingModalProps {
  open: boolean;
  preselectedCar?: string;
  onClose: () => void;
}

export default function BookingModal({ open, preselectedCar, onClose }: BookingModalProps) {
  const [car, setCar] = useState(preselectedCar || "");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [location, setLocation] = useState("Seremban");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (preselectedCar) setCar(preselectedCar);
  }, [preselectedCar, open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const message = `Hi JRV! I'd like to book a car.
🚗 Car: ${car || "Not selected"}
📅 Pickup: ${pickupDate || "Not set"}
📅 Return: ${returnDate || "Not set"}
📍 Location: ${location}
👤 Name: ${name || "Not provided"}
📞 Phone: ${phone || "Not provided"}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setTimeout(() => setSubmitting(false), 1000);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === overlay.current) onClose(); }}
    >
      <div
        className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden"
        style={{ animation: "modalIn 0.3s cubic-bezier(0.23,1,0.32,1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h2 className="text-lg font-black text-white">Book a Car</h2>
            <p className="text-white/30 text-xs mt-0.5">Fill in your details and we'll reply within minutes</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-all text-sm">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {/* Car */}
          <div>
            <label className="text-white/50 text-[10px] font-semibold uppercase tracking-widest block mb-1">Car Model</label>
            <select value={car} onChange={(e) => setCar(e.target.value)} required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF4500] transition-colors appearance-none">
              <option value="">Select a car</option>
              {CARS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/50 text-[10px] font-semibold uppercase tracking-widest block mb-1">Pickup Date</label>
              <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} min={today} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF4500] transition-colors [color-scheme:dark]" />
            </div>
            <div>
              <label className="text-white/50 text-[10px] font-semibold uppercase tracking-widest block mb-1">Return Date</label>
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} min={pickupDate || today} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF4500] transition-colors [color-scheme:dark]" />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-white/50 text-[10px] font-semibold uppercase tracking-widest block mb-1">Pickup Location</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF4500] transition-colors appearance-none">
              <option value="Seremban">Seremban</option>
              <option value="KLIA Terminal 1">KLIA Terminal 1</option>
              <option value="KLIA Terminal 2">KLIA Terminal 2</option>
              <option value="KL Sentral">KL Sentral</option>
            </select>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/50 text-[10px] font-semibold uppercase tracking-widest block mb-1">Your Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ali" required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#FF4500] transition-colors" />
            </div>
            <div>
              <label className="text-white/50 text-[10px] font-semibold uppercase tracking-widest block mb-1">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 012-345 6789" required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#FF4500] transition-colors" />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-1.5">Booking Summary</p>
            <p className="text-white/60 text-xs whitespace-pre-line">{message}</p>
          </div>

          {/* Submit */}
          <button type="submit" disabled={submitting}
            className="w-full bg-[#FF4500] text-white font-bold py-3.5 rounded-xl text-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? "Opening WhatsApp..." : "Send Booking via WhatsApp"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </button>
        </form>

        {/* Footer */}
        <div className="px-5 pb-4">
          <p className="text-white/20 text-[10px] text-center">By submitting, you agree to our terms. We'll respond within minutes.</p>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
