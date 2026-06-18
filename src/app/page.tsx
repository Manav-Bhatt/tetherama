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
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0">
        <canvas id="tetherama-canvas" className="h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.14),_transparent_24%)]" />
      </div>

      <div className="relative z-10 grid min-h-screen gap-6 p-6 lg:grid-cols-[1.2fr_420px]">
        <section className="flex flex-col justify-center gap-6 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
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
              <p className="mt-3 text-2xl font-semibold text-white">{defaultVisualConfig.archetype}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-6 ring-1 ring-white/5">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Smoothing</p>
              <p className="mt-3 text-2xl font-semibold text-white">{defaultVisualConfig.smoothing.toFixed(2)}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/80 p-6 ring-1 ring-white/5">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Palette</p>
            <div className="mt-4 flex gap-3">
              {defaultVisualConfig.colorPalette.map((color) => (
                <span key={color} className="h-10 w-10 rounded-full ring-1 ring-white/10" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/85 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Control panel</p>
            <h2 className="text-2xl font-semibold text-white">Real-time parameters</h2>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2 rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/5">
              <p className="text-sm text-slate-400">Particle Count</p>
              <p className="text-lg font-medium text-white">{defaultVisualConfig.particleCount}</p>
            </div>
            <div className="grid gap-2 rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/5">
              <p className="text-sm text-slate-400">Base Speed</p>
              <p className="text-lg font-medium text-white">{defaultVisualConfig.baseSpeed}</p>
            </div>
            <div className="grid gap-2 rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/5">
              <p className="text-sm text-slate-400">Noise Scale</p>
              <p className="text-lg font-medium text-white">{defaultVisualConfig.noiseScale}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/80 p-6 ring-1 ring-white/5">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Audio mappings</p>
            <div className="mt-4 space-y-3 text-slate-200">
              <p>Bass → {defaultVisualConfig.mappings.bass}</p>
              <p>Mids → {defaultVisualConfig.mappings.mids}</p>
              <p>Treble → {defaultVisualConfig.mappings.treble}</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
