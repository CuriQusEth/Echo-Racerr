import type { Metadata, Viewport } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-cinzel" });

export const metadata: Metadata = {
  title: "Echo Racer | Web3 Cyber-Sonic Racer",
  description: "A high-speed futuristic racer where sound and echoes are your greatest weapon. Built on Base.",
  manifest: "/manifest.json",
  other: {
    "talentapp:project_verification": "6c46c768c5820e2b33d96bff5d4c4999198d15fd02cd49d284b259d77f0f2fa6a7fd9a8610f4437f1588ffd39924827f35692589be1162b4c29f56402e459656",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="antialiased bg-black text-white font-sans overflow-hidden touch-none">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
