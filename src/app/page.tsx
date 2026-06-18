"use client";

import { useMemo, useState } from "react";
import VisualCanvas from "@/components/VisualCanvas";
import ControlPanel from "@/components/ControlPanel";
import AudioUploader from "@/components/AudioUploader";
import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";
import type { VisualConfig } from "@/types";

const defaultVisualConfig: VisualConfig = {
  archetype: "swarm",
  particleCount: 1200,
  baseSpeed: 1.35,
  noiseScale: 0.72,
  friction: 0.12,
  colorPalette: ["#ff6d8f", "#4f46e5", "#22d3ee"],
  smoothing: 0.55,
  mappings: {
    bass: "turbulenceMultiplier",
    mids: "scaleMultiplier",
    treble: "colorShiftRate",
  },
};

export default function Page() {
  const [config, setConfig] = useState<VisualConfig>(defaultVisualConfig);
  const { audioDataRef, isReady, loadAudioFile, stopAudio, smoothing, setSmoothing } = useAudioAnalyser();

  const palettePreview = useMemo(
    () =>
      config.colorPalette.map((color) => (
        <span key={color} className="h-10 w-10 rounded-full ring-1 ring-white/10" style={{ backgroundColor: color }} />
      )),
    [config.colorPalette],
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0">
        <VisualCanvas config={config} audioDataRef={audioDataRef} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.14),_transparent_24%)]" />
      </div>

      <div className="relative z-10 grid min-h-screen gap-6 p-6 lg:grid-cols-[1.3fr_420px]">
        <section className="flex flex-col justify-between gap-6 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">tetherama</p>
            <h1 className="text-4xl font-semibold text-white">Local-first audio visualization studio</h1>
            <p className="max-w-2xl text-slate-300">
              Upload audio, tune the modulation matrix, and watch the canvas transform your bass, mids, and treble into generative parametric art.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/80 p-6 ring-1 ring-white/5">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Active Archetype</p>
              <p className="mt-3 text-2xl font-semibold text-white">{config.archetype}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-6 ring-1 ring-white/5">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Smoothing</p>
              <p className="mt-3 text-2xl font-semibold text-white">{smoothing.toFixed(2)}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/80 p-6 ring-1 ring-white/5">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Palette</p>
            <div className="mt-4 flex gap-3">{palettePreview}</div>
          </div>

          <AudioUploader onFileSelected={loadAudioFile} isReady={isReady} onStop={stopAudio} />
        </section>

        <aside className="space-y-6">
          <ControlPanel
            config={config}
            smoothing={smoothing}
            onConfigChange={setConfig}
            onSmoothingChange={setSmoothing}
          />
        </aside>
      </div>
    </main>
  );
}
