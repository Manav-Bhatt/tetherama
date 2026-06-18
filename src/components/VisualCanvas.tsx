"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { AudioData, VisualConfig, VisualMappingKey, VisualModifiers } from "@/types";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

const createParticles = (count: number, width: number, height: number) => {
  const particles: Particle[] = [];

  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      radius: Math.random() * 1.6 + 0.7,
      hue: Math.random() * 360,
    });
  }

  return particles;
};

const deriveModifiers = (config: VisualConfig, audio: AudioData): VisualModifiers => {
  const values: Record<VisualMappingKey, number> = {
    speedMultiplier: 1,
    scaleMultiplier: 1,
    turbulenceMultiplier: 1,
    colorShiftRate: 1,
  };

  const bandAmplitude = {
    bass: clamp(audio.bass, 0, 1),
    mids: clamp(audio.mids, 0, 1),
    treble: clamp(audio.treble, 0, 1),
  } as const;

  const scale = 0.95;
  (Object.keys(config.mappings) as Array<keyof typeof config.mappings>).forEach((band) => {
    const mappedKey = config.mappings[band];
    values[mappedKey] = 1 + bandAmplitude[band] * scale;
  });

  return {
    speedMultiplier: values.speedMultiplier,
    scaleMultiplier: values.scaleMultiplier,
    turbulenceMultiplier: values.turbulenceMultiplier,
    colorShiftRate: values.colorShiftRate,
  };
};

const getPaletteColor = (palette: string[], index: number) => {
  return palette[index % palette.length] ?? "#ffffff";
};

const drawSwarm = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: VisualConfig,
  audio: AudioData,
  modifiers: VisualModifiers,
  particles: Particle[],
  frame: number,
) => {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineWidth = 1;

  const intensity = clamp(audio.bass * 1.3 + audio.rms * 0.6, 0.05, 1.25);
  const turbulence = config.noiseScale * modifiers.turbulenceMultiplier;
  const speed = config.baseSpeed * modifiers.speedMultiplier;

  particles.forEach((particle, index) => {
    const dx = width / 2 - particle.x;
    const dy = height / 2 - particle.y;
    const distance = Math.hypot(dx, dy) + 0.01;
    const angle = Math.atan2(dy, dx);
    const flow = Math.sin(angle * 2 + frame * 0.004) * 0.75;

    particle.vx += Math.cos(angle + flow) * 0.003 * turbulence;
    particle.vy += Math.sin(angle - flow) * 0.003 * turbulence;

    if (audio.bass > 0.75) {
      particle.vx += (Math.random() - 0.5) * 0.08 * audio.bass;
      particle.vy += (Math.random() - 0.5) * 0.08 * audio.bass;
    }

    particle.vx *= 1 - config.friction;
    particle.vy *= 1 - config.friction;
    particle.x += particle.vx * speed * 1.4;
    particle.y += particle.vy * speed * 1.4;

    if (particle.x < -20) particle.x = width + 20;
    if (particle.x > width + 20) particle.x = -20;
    if (particle.y < -20) particle.y = height + 20;
    if (particle.y > height + 20) particle.y = -20;

    const color = getPaletteColor(config.colorPalette, index);
    const alpha = lerp(0.06, 0.35, intensity);

    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(particle.x, particle.y);
    ctx.lineTo(particle.x - particle.vx * 6, particle.y - particle.vy * 6);
    ctx.stroke();
  });

  ctx.restore();
};

const drawNebula = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: VisualConfig,
  audio: AudioData,
  modifiers: VisualModifiers,
  frame: number,
) => {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const radiusBase = Math.min(width, height) * 0.14 * modifiers.scaleMultiplier;
  const centerX = width / 2;
  const centerY = height / 2;

  for (let ring = 0; ring < 4; ring += 1) {
    const progress = ring / 3;
    const radius = radiusBase * (1 + progress * 1.6 + audio.mids * 1.2);
    const bleed = 0.14 + progress * 0.05 + audio.rms * 0.12;
    const color = getPaletteColor(config.colorPalette, ring);

    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.12,
      centerX,
      centerY,
      radius,
    );
    gradient.addColorStop(0, `${color}ff`);
    gradient.addColorStop(1, `${color}00`);

    ctx.fillStyle = gradient;
    ctx.globalAlpha = bleed;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + Math.sin(frame * 0.008 + ring) * 18, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

const drawMonolith = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: VisualConfig,
  audio: AudioData,
  modifiers: VisualModifiers,
  frame: number,
) => {
  ctx.save();
  ctx.translate(width / 2, height / 2);
  const baseRadius = Math.min(width, height) * 0.15 * modifiers.scaleMultiplier;
  const rotation = frame * 0.002 + audio.treble * 1.4;

  const vertexCount = 7;
  const pathRadius = baseRadius * (1 + audio.mids * 0.6);
  const strokeWidth = 1.25 + audio.rms * 2.5;

  ctx.rotate(rotation);
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = getPaletteColor(config.colorPalette, 2);
  ctx.fillStyle = getPaletteColor(config.colorPalette, 1);
  ctx.globalAlpha = 0.9;

  ctx.beginPath();
  for (let i = 0; i <= vertexCount; i += 1) {
    const angle = (Math.PI * 2 * i) / vertexCount;
    const radius = pathRadius * (1 + Math.sin(angle * 3 + frame * 0.004) * 0.12);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  for (let layer = 0; layer < 3; layer += 1) {
    const shrink = pathRadius * (1 - layer * 0.18);
    ctx.beginPath();
    for (let i = 0; i <= vertexCount; i += 1) {
      const angle = (Math.PI * 2 * i) / vertexCount + layer * 0.18;
      const x = Math.cos(angle) * shrink;
      const y = Math.sin(angle) * shrink;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = getPaletteColor(config.colorPalette, layer);
    ctx.globalAlpha = 0.22;
    ctx.stroke();
  }

  ctx.restore();
};

interface VisualCanvasProps {
  config: VisualConfig;
  audioDataRef: RefObject<AudioData>;
}

export default function VisualCanvas({ config, audioDataRef }: VisualCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    resizeObserverRef.current = new ResizeObserver(resize);
    resizeObserverRef.current.observe(canvas);

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (particlesRef.current.length !== config.particleCount) {
      particlesRef.current = createParticles(config.particleCount, rect.width, rect.height);
    }

    const render = () => {
      if (!canvas) return;
      const bounds = canvas.getBoundingClientRect();
      const width = bounds.width;
      const height = bounds.height;
      const audio = audioDataRef.current;
      const modifiers = deriveModifiers(config, audio);
      const backgroundAlpha = 0.12 + audio.rms * 0.16;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgba(2, 6, 23, ${backgroundAlpha})`;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      const frame = frameRef.current;

      switch (config.archetype) {
        case "swarm":
          drawSwarm(ctx, width, height, config, audio, modifiers, particlesRef.current, frame);
          break;
        case "nebula":
          drawNebula(ctx, width, height, config, audio, modifiers, frame);
          break;
        case "monolith":
          drawMonolith(ctx, width, height, config, audio, modifiers, frame);
          break;
        default:
          drawSwarm(ctx, width, height, config, audio, modifiers, particlesRef.current, frame);
      }

      frameRef.current += 1;
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }, [config, audioDataRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
