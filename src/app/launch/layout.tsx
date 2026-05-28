import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Launch Token — Launchly",
  description: "Create and deploy your token on Solana, Ethereum, Base, and BNB Chain simultaneously.",
};

export default function LaunchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
