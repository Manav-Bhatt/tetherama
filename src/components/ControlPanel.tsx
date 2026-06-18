"use client";

import type { VisualConfig, VisualMappingKey } from "@/types";

interface ControlPanelProps {
  config: VisualConfig;
  smoothing: number;
  onConfigChange: (next: VisualConfig) => void;
  onSmoothingChange: (value: number) => void;
}

const mappingOptions: VisualMappingKey[] = [
  "speedMultiplier",
  "scaleMultiplier",
  "turbulenceMultiplier",
  "colorShiftRate",
];

export default function ControlPanel({ config, smoothing, onConfigChange, onSmoothingChange }: ControlPanelProps) {
  const updatePartial = (patch: Partial<VisualConfig>) => {
    onConfigChange({ ...config, ...patch });
  };

  const updateMapping = (band: keyof VisualConfig["mappings"], value: VisualMappingKey) => {
    onConfigChange({
      ...config,
      mappings: {
        ...config.mappings,
        [band]: value,
      },
    });
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Tetherama controls</p>
        <h2 className="text-2xl font-semibold text-white">Visual configuration</h2>
        <p className="text-sm leading-6 text-slate-400">
          Map audio bands into the generative engine and fine-tune the motion matrix in real time.
        </p>
      </div>

      <div className="grid gap-4">
        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-medium text-slate-200">Archetype</span>
          <select
            value={config.archetype}
            onChange={(event) => updatePartial({ archetype: event.target.value as VisualConfig["archetype"] })}
            className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
          >
            <option value="swarm">Swarm</option>
            <option value="nebula">Nebula</option>
            <option value="monolith">Monolith</option>
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-medium text-slate-200">Particle Count</span>
          <input
            type="range"
            min="200"
            max="2400"
            value={config.particleCount}
            onChange={(event) => updatePartial({ particleCount: Number(event.target.value) })}
            className="w-full accent-cyan-400"
          />
          <div className="text-right text-xs text-slate-400">{config.particleCount}</div>
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-medium text-slate-200">Base Speed</span>
          <input
            type="range"
            min="0.3"
            max="2.6"
            step="0.05"
            value={config.baseSpeed}
            onChange={(event) => updatePartial({ baseSpeed: Number(event.target.value) })}
            className="w-full accent-cyan-400"
          />
          <div className="text-right text-xs text-slate-400">{config.baseSpeed.toFixed(2)}</div>
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-medium text-slate-200">Noise Scale</span>
          <input
            type="range"
            min="0.1"
            max="1.4"
            step="0.02"
            value={config.noiseScale}
            onChange={(event) => updatePartial({ noiseScale: Number(event.target.value) })}
            className="w-full accent-cyan-400"
          />
          <div className="text-right text-xs text-slate-400">{config.noiseScale.toFixed(2)}</div>
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-medium text-slate-200">Friction</span>
          <input
            type="range"
            min="0"
            max="0.3"
            step="0.01"
            value={config.friction}
            onChange={(event) => updatePartial({ friction: Number(event.target.value) })}
            className="w-full accent-cyan-400"
          />
          <div className="text-right text-xs text-slate-400">{config.friction.toFixed(2)}</div>
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-medium text-slate-200">Smoothing</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={smoothing}
            onChange={(event) => onSmoothingChange(Number(event.target.value))}
            className="w-full accent-cyan-400"
          />
          <div className="text-right text-xs text-slate-400">{smoothing.toFixed(2)}</div>
        </label>
      </div>

      <div className="grid gap-4 rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/10">
        <p className="text-sm font-medium text-slate-200">Audio mappings</p>
        {(Object.keys(config.mappings) as Array<keyof VisualConfig["mappings"]>).map((band) => (
          <label key={band} className="grid gap-2 text-sm text-slate-300">
            <span className="font-medium text-slate-200">{band.toUpperCase()}</span>
            <select
              value={config.mappings[band]}
              onChange={(event) => updateMapping(band, event.target.value as VisualMappingKey)}
              className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            >
              {mappingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}
