import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "tetherama",
  description: "Local-first audio-to-art visualization studio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
