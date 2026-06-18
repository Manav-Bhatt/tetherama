export type Archetype = "swarm" | "nebula" | "monolith";

export interface VisualModifiers {
  speedMultiplier: number;
  scaleMultiplier: number;
  turbulenceMultiplier: number;
  colorShiftRate: number;
}

export type VisualMappingKey = keyof VisualModifiers;

export interface VisualConfig {
  archetype: Archetype;
  particleCount: number;
  baseSpeed: number;
  noiseScale: number;
  friction: number;
  colorPalette: string[];
  smoothing: number;
  mappings: {
    bass: VisualMappingKey;
    mids: VisualMappingKey;
    treble: VisualMappingKey;
  };
}

export interface AudioData {
  bass: number;
  mids: number;
  treble: number;
  rms: number;
}
