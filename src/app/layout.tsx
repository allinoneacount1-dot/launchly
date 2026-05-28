import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WalletProvider } from "@/components/WalletConnect";
import { LaunchProvider } from "@/components/LaunchTracker";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: {
    default: "Launchly — One Token. Every Chain.",
    template: "%s | Launchly",
  },
  description: "Launch your token on Solana, Ethereum, Base, and BNB Chain simultaneously — with a single click. No ETH required.",
  icons: { icon: "/favicon.svg", apple: "/launchly-logo.svg" },
  openGraph: {
    title: "Launchly — One Token. Every Chain.",
    description: "Multi-chain token launchpad with built-in privacy mixer. Deploy to Solana, Ethereum, Base, and BNB Chain with one click.",
    url: "https://launchly-mu-ten.vercel.app",
    siteName: "Launchly",
    type: "website",
    images: [{ url: "/launchly-logo.svg", width: 512, height: 512, alt: "Launchly Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Launchly — One Token. Every Chain.",
    description: "Multi-chain token launchpad. Deploy to 4 chains with one click.",
  },
  metadataBase: new URL("https://launchly-mu-ten.vercel.app"),
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
          <LaunchProvider>
            <ErrorBoundary>
              <Navbar />
              <main className="pt-16">
                {children}
              </main>
              <Footer />
            </ErrorBoundary>
          </LaunchProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
