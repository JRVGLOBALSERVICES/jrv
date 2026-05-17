"use client";

export default function MapSection() {
  // Location: 51, Jln S2 B18, Seremban 2
  const lat = 2.7248;
  const lng = 101.9376;
  const query = encodeURIComponent("51, Jalan S2 B18, Seremban 2, Negeri Sembilan");
  const src = `https://www.google.com/maps?q=${query}&output=embed`;

  return (
    <section className="relative z-10 py-20 bg-black/60">
      <div className="max-w-5xl mx-auto px-5">
        <div className="text-center mb-10">
          <p className="text-[#FF4500] text-[10px] font-bold tracking-[0.25em] uppercase mb-2">Come See Us</p>
          <h2 className="text-3xl md:text-5xl font-black text-white">Our Location</h2>
          <p className="text-white/40 text-sm mt-1">51, Jln S2 B18, Seremban 2 · 24 hours · 7 days</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40">
          <iframe
            title="JRV Car Rental Location"
            width="100%"
            height="400"
            style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg)" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={src}
          />
          {/* Overlay branding strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FF4500] rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-black text-xs">JRV</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">JRV Car Rental</p>
                <p className="text-white/40 text-xs">51, Jln S2 B18, Seremban 2</p>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${query}`}
                target="_blank"
                className="ml-auto bg-[#FF4500] text-white text-[10px] font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all shrink-0"
              >
                Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
