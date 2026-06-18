import { useCallback, useEffect, useRef, useState } from "react";
import type { AudioData } from "@/types";

const DEFAULT_SMOOTHING = 0.55;
const FFT_SIZE = 2048;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeFrequencyValue(value: number) {
  return clamp(value / 255, 0, 1);
}

function calculateBandAverage(
  data: Uint8Array,
  startIndex: number,
  endIndex: number,
): number {
  const validEnd = Math.min(endIndex, data.length - 1);
  const count = Math.max(validEnd - startIndex + 1, 1);
  let sum = 0;

  for (let index = startIndex; index <= validEnd; index += 1) {
    sum += data[index];
  }

  return normalizeFrequencyValue(sum / count);
}

function computeRms(timeDomainData: Uint8Array): number {
  let total = 0;

  for (let i = 0; i < timeDomainData.length; i += 1) {
    const normalized = timeDomainData[i] / 128 - 1;
    total += normalized * normalized;
  }

  return Math.sqrt(total / timeDomainData.length);
}

function frequencyRangeToIndices(
  sampleRate: number,
  fftSize: number,
  lowerHz: number,
  upperHz: number,
) {
  const resolution = sampleRate / fftSize;
  const minIndex = Math.floor(lowerHz / resolution);
  const maxIndex = Math.min(Math.floor(upperHz / resolution), fftSize / 2 - 1);
  return [minIndex, maxIndex];
}

export function useAudioAnalyser() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const currentFileUrlRef = useRef<string | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioDataRef = useRef<AudioData>({ bass: 0, mids: 0, treble: 0, rms: 0 });
  const [isReady, setIsReady] = useState(false);
  const [smoothing, setSmoothingState] = useState(DEFAULT_SMOOTHING);
  const smoothingRef = useRef(DEFAULT_SMOOTHING);

  const stopAudio = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      if (currentFileUrlRef.current) {
        URL.revokeObjectURL(currentFileUrlRef.current);
        currentFileUrlRef.current = null;
      }
      audioElementRef.current.src = "";
      audioElementRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    if (audioContextRef.current?.state === "running") {
      void audioContextRef.current.suspend();
    }

    setIsReady(false);
  }, []);

  const updateAudioData = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) {
      rafRef.current = requestAnimationFrame(updateAudioData);
      return;
    }

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    const timeDomainData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(timeDomainData);

    const sampleRate = audioContextRef.current?.sampleRate ?? 44100;
    const [bassStart, bassEnd] = frequencyRangeToIndices(sampleRate, FFT_SIZE, 20, 250);
    const [midsStart, midsEnd] = frequencyRangeToIndices(sampleRate, FFT_SIZE, 250, 2000);
    const [trebleStart, trebleEnd] = frequencyRangeToIndices(sampleRate, FFT_SIZE, 2000, 20000);

    audioDataRef.current.bass = calculateBandAverage(frequencyData, bassStart, bassEnd);
    audioDataRef.current.mids = calculateBandAverage(frequencyData, midsStart, midsEnd);
    audioDataRef.current.treble = calculateBandAverage(frequencyData, trebleStart, trebleEnd);
    audioDataRef.current.rms = computeRms(timeDomainData);

    rafRef.current = requestAnimationFrame(updateAudioData);
  }, []);

  const initializeAnalyser = useCallback((audioElement: HTMLAudioElement) => {
    const AudioContextConstructor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextConstructor) {
      throw new Error("Web Audio API is not supported in this browser.");
    }

    const audioContext = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = smoothingRef.current;
    analyserRef.current = analyser;

    const source = audioContext.createMediaElementSource(audioElement);
    sourceRef.current = source;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    rafRef.current = requestAnimationFrame(updateAudioData);
  }, [updateAudioData]);

  const loadAudioFile = useCallback(async (file: File): Promise<void> => {
    if (typeof window === "undefined") {
      throw new Error("Audio analyser must be initialized in a browser environment.");
    }

    stopAudio();

    const objectUrl = URL.createObjectURL(file);
    currentFileUrlRef.current = objectUrl;

    const audioElement = new Audio(objectUrl);
    audioElement.crossOrigin = "anonymous";
    audioElement.preload = "auto";
    audioElement.loop = false;
    audioElement.autoplay = true;
    audioElementRef.current = audioElement;

    await audioElement.play().catch(() => {
      // Some browsers require a user gesture. Playback may still initialize silently.
    });

    initializeAnalyser(audioElement);
    setIsReady(true);
  }, [initializeAnalyser, stopAudio]);

  const setSmoothing = useCallback((value: number) => {
    const next = clamp(value, 0, 1);
    smoothingRef.current = next;
    setSmoothingState(next);
    if (analyserRef.current) {
      analyserRef.current.smoothingTimeConstant = next;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return {
    audioDataRef,
    analyserRef,
    audioElementRef,
    isReady,
    smoothing,
    loadAudioFile,
    stopAudio,
    setSmoothing,
  };
}
