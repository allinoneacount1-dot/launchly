import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WalletProvider } from "@/components/WalletConnect";

export const metadata: Metadata = {
  title: "Launchly - One Token. Every Chain.",
  description: "Launch your token on Solana, Ethereum, Base, and BNB Chain simultaneously — with a single click.",
  icons: { icon: "/favicon.svg", apple: "/launchly-logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WalletProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
