import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "tetherama",
  description: "Local-first audio-to-art visualization studio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-on-background">
        <div className="min-h-screen flex flex-col">
          <div className="scanlines pointer-events-none" />
          <div className="flex-1">{children}</div>
          <footer className="mt-4 border-t border-white/6 bg-transparent py-3 text-center text-xs text-on-surface-variant/80">Tetherama — local audio visualizer</footer>
        </div>
      </body>
    </html>
  );
}
