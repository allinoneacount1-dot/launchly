import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — Launchly",
  description: "Understand how Launchly's privacy mixer enables multi-chain token launches with just SOL.",
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
