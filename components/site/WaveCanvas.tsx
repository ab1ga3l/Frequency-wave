'use client';

import { useEffect, useRef } from 'react';

type Layer = {
  color: string;
  amplitude: number;
  wavelength: number;
  speed: number;
  yOffset: number;
  lineWidth: number;
};

const HERO_LAYERS: Layer[] = [
  { color: 'rgba(107, 0, 245, 0.38)', amplitude: 46, wavelength: 320, speed: 0.55, yOffset: -30, lineWidth: 2 },
  { color: 'rgba(107, 0, 245, 0.2)', amplitude: 64, wavelength: 460, speed: 0.35, yOffset: 24, lineWidth: 1.5 },
  { color: 'rgba(38, 91, 255, 0.42)', amplitude: 38, wavelength: 260, speed: 0.8, yOffset: 0, lineWidth: 2 },
  { color: 'rgba(38, 91, 255, 0.18)', amplitude: 72, wavelength: 540, speed: 0.25, yOffset: -52, lineWidth: 1.5 },
  { color: 'rgba(0, 248, 255, 0.38)', amplitude: 28, wavelength: 200, speed: 1.05, yOffset: 14, lineWidth: 1.75 },
  { color: 'rgba(0, 248, 255, 0.14)', amplitude: 88, wavelength: 640, speed: 0.18, yOffset: 44, lineWidth: 1.25 },
  { color: 'rgba(0, 248, 255, 0.22)', amplitude: 18, wavelength: 130, speed: 1.4, yOffset: -8, lineWidth: 1.15 },
  { color: 'rgba(107, 0, 245, 0.26)', amplitude: 32, wavelength: 170, speed: 0.98, yOffset: 38, lineWidth: 1.4 },
  { color: 'rgba(38, 91, 255, 0.24)', amplitude: 54, wavelength: 380, speed: 0.42, yOffset: -16, lineWidth: 1.3 },
  { color: 'rgba(233, 60, 172, 0.2)', amplitude: 22, wavelength: 230, speed: 1.18, yOffset: 10, lineWidth: 1.2 },
];

const BAND_LAYERS: Layer[] = [
  { color: 'rgba(0, 248, 255, 0.4)', amplitude: 16, wavelength: 180, speed: 1.1, yOffset: 0, lineWidth: 1.6 },
  { color: 'rgba(38, 91, 255, 0.35)', amplitude: 22, wavelength: 260, speed: 0.7, yOffset: 8, lineWidth: 1.4 },
  { color: 'rgba(107, 0, 245, 0.32)', amplitude: 18, wavelength: 320, speed: 0.5, yOffset: -10, lineWidth: 1.3 },
  { color: 'rgba(0, 248, 255, 0.18)', amplitude: 28, wavelength: 420, speed: 0.35, yOffset: 14, lineWidth: 1.1 },
  { color: 'rgba(233, 60, 172, 0.2)', amplitude: 12, wavelength: 140, speed: 1.25, yOffset: -4, lineWidth: 1.1 },
];

const WASH_LAYERS: Layer[] = [
  { color: 'rgba(0, 248, 255, 0.16)', amplitude: 70, wavelength: 280, speed: 0.45, yOffset: -40, lineWidth: 1.4 },
  { color: 'rgba(38, 91, 255, 0.14)', amplitude: 90, wavelength: 400, speed: 0.28, yOffset: 20, lineWidth: 1.3 },
  { color: 'rgba(107, 0, 245, 0.16)', amplitude: 80, wavelength: 340, speed: 0.38, yOffset: 50, lineWidth: 1.4 },
  { color: 'rgba(0, 248, 255, 0.1)', amplitude: 110, wavelength: 520, speed: 0.2, yOffset: -70, lineWidth: 1.1 },
  { color: 'rgba(233, 60, 172, 0.1)', amplitude: 60, wavelength: 220, speed: 0.6, yOffset: 8, lineWidth: 1.15 },
  { color: 'rgba(38, 91, 255, 0.1)', amplitude: 100, wavelength: 600, speed: 0.16, yOffset: 80, lineWidth: 1.1 },
  { color: 'rgba(0, 248, 255, 0.12)', amplitude: 48, wavelength: 160, speed: 0.85, yOffset: -20, lineWidth: 1.05 },
  { color: 'rgba(107, 0, 245, 0.12)', amplitude: 66, wavelength: 240, speed: 0.5, yOffset: 36, lineWidth: 1.2 },
];

const PRESETS = {
  hero: { layers: HERO_LAYERS, step: 3, mid: 0.55 },
  band: { layers: BAND_LAYERS, step: 4, mid: 0.5 },
  wash: { layers: WASH_LAYERS, step: 5, mid: 0.5 },
} as const;

export type WaveVariant = keyof typeof PRESETS;

/**
 * Animated layered-sine soundwave. Pauses when offscreen; static frame
 * when reduced motion is preferred.
 */
export default function WaveCanvas({
  className = '',
  variant = 'hero',
  flip = false,
}: {
  className?: string;
  variant?: WaveVariant;
  flip?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { layers, step, mid } = PRESETS[variant];
    let raf = 0;
    let running = true;
    let visible = true;
    let t = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const midY = h * mid;
      const dir = flip ? -1 : 1;
      for (const layer of layers) {
        ctx.beginPath();
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = layer.lineWidth;
        const phase = t * layer.speed;
        for (let x = 0; x <= w; x += step) {
          const y =
            midY +
            dir *
              (layer.yOffset +
                Math.sin(x / layer.wavelength + phase) * layer.amplitude +
                Math.sin(x / (layer.wavelength * 0.37) + phase * 1.6) *
                  layer.amplitude *
                  0.22);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const loop = () => {
      if (!running || !visible) return;
      t += 0.016;
      draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    draw();

    if (!reduced) {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      draw();
    };
    window.addEventListener('resize', onResize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && running && !reduced) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(loop);
        }
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, [variant, flip]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    />
  );
}
