"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";

interface AudioUploaderProps {
  onFileSelected: (file: File) => Promise<void>;
  isReady: boolean;
  onStop: () => void;
}

export default function AudioUploader({ onFileSelected, isReady, onStop }: AudioUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    await onFileSelected(file);
  };

  return (
    <div className="space-y-3 rounded-3xl bg-slate-900/80 p-5 ring-1 ring-white/10">
      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Audio upload</p>
      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left transition hover:border-slate-300/10">
        <span className="text-sm text-slate-300">Choose an audio file</span>
        <input
          type="file"
          accept="audio/*"
          className="sr-only"
          onChange={handleFileChange}
        />
        <span className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-950">
          Browse
        </span>
      </label>
      {fileName ? (
        <div className="rounded-3xl bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
          Loaded: <span className="font-medium text-white">{fileName}</span>
        </div>
      ) : null}
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onStop}
        disabled={!isReady}
      >
        Stop Audio
      </button>
    </div>
  );
}
