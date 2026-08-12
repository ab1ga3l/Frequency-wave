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

const LAYERS: Layer[] = [
  { color: 'rgba(107, 0, 245, 0.35)', amplitude: 46, wavelength: 320, speed: 0.55, yOffset: -30, lineWidth: 2 },
  { color: 'rgba(107, 0, 245, 0.18)', amplitude: 64, wavelength: 460, speed: 0.35, yOffset: 24, lineWidth: 1.5 },
  { color: 'rgba(38, 91, 255, 0.4)', amplitude: 38, wavelength: 260, speed: 0.8, yOffset: 0, lineWidth: 2 },
  { color: 'rgba(38, 91, 255, 0.16)', amplitude: 72, wavelength: 540, speed: 0.25, yOffset: -52, lineWidth: 1.5 },
  { color: 'rgba(0, 248, 255, 0.35)', amplitude: 28, wavelength: 200, speed: 1.05, yOffset: 14, lineWidth: 1.75 },
  { color: 'rgba(0, 248, 255, 0.12)', amplitude: 88, wavelength: 640, speed: 0.18, yOffset: 44, lineWidth: 1.25 },
];

/**
 * Animated layered-sine soundwave background. Pauses when scrolled
 * offscreen; draws a single static frame when reduced motion is preferred.
 */
export default function WaveCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
      const midY = h * 0.55;
      for (const layer of LAYERS) {
        ctx.beginPath();
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = layer.lineWidth;
        const phase = t * layer.speed;
        for (let x = 0; x <= w; x += 4) {
          const y =
            midY +
            layer.yOffset +
            Math.sin(x / layer.wavelength + phase) * layer.amplitude +
            Math.sin(x / (layer.wavelength * 0.37) + phase * 1.6) *
              layer.amplitude *
              0.22;
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    />
  );
}
