import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import { LangProvider } from "@/i18n/provider";

export const metadata: Metadata = {
  title: "JRV Car Rental | Sewa Lama Lagi Murah",
  description: "Premium car rental in Seremban. 50+ cars, zero deposit, free delivery, 24/7 service.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body className="antialiased">
        <LenisProvider>
          <LangProvider>{children}</LangProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
