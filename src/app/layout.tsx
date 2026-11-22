import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";
import MobileMenu from "@/components/MobileMenu";
import MobileBottomBar from "@/components/MobileBottomBar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

// Fonts are self-hosted (src/app/fonts) so the site never waits on Google Fonts.
const inter = localFont({
  src: "./fonts/Inter.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

const jakarta = localFont({
  src: "./fonts/PlusJakartaSans.woff2",
  weight: "200 800",
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pasumai Fresh — பசுமை உங்கள் வாழ்க்கைக்கு",
  description:
    "Fresh vegetables, fruits, tender coconut, greens and groceries delivered to your home. Order on WhatsApp, pay cash on delivery.",
};

export const viewport: Viewport = { themeColor: "#1b7a36" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ta" className={`${inter.variable} ${jakarta.variable} antialiased`}>
      <body className="min-h-dvh flex flex-col font-sans">
        <LangProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <MobileMenu />
            <MobileBottomBar />
            <FloatingWhatsApp />
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
