import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "FlowAssist Control Space",
  description: "Advanced Voice Agent Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${outfit.variable} font-sans bg-void text-white antialiased overflow-x-hidden selection:bg-signal-purple/30`}
      >
        {children}
      </body>
    </html>
  );
}
