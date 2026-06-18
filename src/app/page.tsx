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
  colorPalette: ["#c3f400", "#7df4ff", "#fface8"],
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
    <main className="relative min-h-screen overflow-hidden bg-background text-on-background">
      <div className="scanlines" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(195,244,0,0.12),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(125,244,255,0.12),_transparent_18%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1920px] flex-col gap-8 px-6 py-8 lg:px-12 lg:py-10">
        <header className="grid gap-4 rounded-[2rem] border border-white/10 bg-surface-container-highest/85 p-6 shadow-[0_20px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.45em] text-secondary-fixed-dim">system shell</p>
            <h1 className="max-w-3xl text-4xl font-semibold text-white sm:text-5xl">Tetherama Neon Wave OS</h1>
            <p className="max-w-2xl text-sm leading-7 text-on-surface-variant sm:text-base">
              A local-first audio visualization studio with a neon cyberpunk shell, responsive FFT-driven canvas, and real-time parameter controls.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-panel rounded-[1.75rem] bg-surface-container/80 p-5 shadow-xl shadow-slate-950/30 backdrop-blur-xl">
              <p className="text-[0.7rem] uppercase tracking-[0.35em] text-secondary-fixed-dim">system status</p>
              <div className="mt-4 grid gap-3 text-sm text-white">
                <div className="flex items-center justify-between rounded-3xl bg-surface-container-high/90 px-4 py-3">
                  <span>Audio loaded</span>
                  <span className="font-semibold text-secondary-fixed">{isReady ? "online" : "idle"}</span>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-surface-container-high/90 px-4 py-3">
                  <span>Visual archetype</span>
                  <span className="font-semibold text-secondary-fixed">{config.archetype}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-[1.75rem] bg-surface-container/80 p-5 shadow-xl shadow-slate-950/30 backdrop-blur-xl">
              <p className="text-[0.7rem] uppercase tracking-[0.35em] text-secondary-fixed-dim">audio profile</p>
              <div className="mt-4 grid gap-3 text-sm text-white">
                <div className="rounded-3xl bg-surface-container-high/90 px-4 py-3">
                  <span className="uppercase tracking-[0.25em] text-xs text-slate-400">Smoothing</span>
                  <p className="mt-2 text-lg font-semibold text-white">{smoothing.toFixed(2)}</p>
                </div>
                <div className="rounded-3xl bg-surface-container-high/90 px-4 py-3">
                  <span className="uppercase tracking-[0.25em] text-xs text-slate-400">palette</span>
                  <div className="mt-3 flex gap-2">{palettePreview}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <section className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-surface-container/75 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="absolute inset-0 pointer-events-none rounded-[2.25rem] bg-gradient-to-br from-transparent via-transparent to-[#00eefc]/10" />
            <div className="relative h-[540px] overflow-hidden rounded-[2rem] border border-white/5 bg-[#080a0f] shadow-inner shadow-slate-950/60">
              <VisualCanvas config={config} audioDataRef={audioDataRef} />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="glass-panel rounded-[1.75rem] bg-surface-container/85 p-4 text-sm text-slate-300">
                <p className="uppercase tracking-[0.28em] text-secondary-fixed-dim">bass</p>
                <p className="mt-2 text-2xl font-semibold text-white">{audioDataRef.current.bass.toFixed(2)}</p>
              </div>
              <div className="glass-panel rounded-[1.75rem] bg-surface-container/85 p-4 text-sm text-slate-300">
                <p className="uppercase tracking-[0.28em] text-secondary-fixed-dim">mids</p>
                <p className="mt-2 text-2xl font-semibold text-white">{audioDataRef.current.mids.toFixed(2)}</p>
              </div>
              <div className="glass-panel rounded-[1.75rem] bg-surface-container/85 p-4 text-sm text-slate-300">
                <p className="uppercase tracking-[0.28em] text-secondary-fixed-dim">treble</p>
                <p className="mt-2 text-2xl font-semibold text-white">{audioDataRef.current.treble.toFixed(2)}</p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="glass-panel rounded-[2rem] bg-surface-container/85 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.35em] text-secondary-fixed-dim">interface</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Control dock</h2>
                </div>
                <span className="material-symbols-outlined icon-fill text-3xl text-secondary-fixed">settings_suggest</span>
              </div>
              <div className="mt-6 space-y-6">
                <AudioUploader onFileSelected={loadAudioFile} isReady={isReady} onStop={stopAudio} />
                <ControlPanel
                  config={config}
                  smoothing={smoothing}
                  onConfigChange={setConfig}
                  onSmoothingChange={setSmoothing}
                />
              </div>
            </div>
            <div className="glass-panel rounded-[2rem] bg-surface-container/85 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.35em] text-secondary-fixed-dim">signal monitor</p>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#c3f400]/10 text-secondary-fixed">01</span>
              </div>
              <div className="mt-5 space-y-4 text-sm text-slate-300">
                <div className="rounded-3xl bg-surface-container-high/90 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Active Mode</p>
                  <p className="mt-2 text-lg font-semibold text-white">{config.archetype}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-surface-container-high/90 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Render load</p>
                    <p className="mt-2 text-lg font-semibold text-white">{Math.round(config.particleCount / 12)}%</p>
                  </div>
                  <div className="rounded-3xl bg-surface-container-high/90 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Latency</p>
                    <p className="mt-2 text-lg font-semibold text-white">{isReady ? "Real-time" : "Standby"}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}