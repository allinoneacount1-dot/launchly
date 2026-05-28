import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Lobby — Launchly",
  description: "Watch tokens launch in real-time across all supported chains.",
};

export default function LobbyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
