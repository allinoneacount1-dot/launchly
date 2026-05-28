import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Launchly",
  description: "Track deployments, holders, and performance across all chains.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
