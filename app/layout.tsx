import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-cinzel" });

export const metadata: Metadata = {
  title: "Echo Racer | Web3 Cyber-Sonic Racer",
  description: "A high-speed futuristic racer where sound and echoes are your greatest weapon. Built on Base.",
  manifest: "/manifest.json",
  themeColor: "#050505",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
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
