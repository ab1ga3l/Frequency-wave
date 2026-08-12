/** Frequency-line band: section divider or full-section wash. */
import WaveCanvas, { type WaveVariant } from './WaveCanvas';

export default function WaveBand({
  variant = 'band',
  flip = false,
  wash = false,
  className = '',
}: {
  variant?: WaveVariant;
  flip?: boolean;
  wash?: boolean;
  className?: string;
}) {
  if (wash) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 overflow-hidden opacity-45 ${className}`}
      >
        <WaveCanvas variant={variant} flip={flip} />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative h-28 overflow-hidden sm:h-32 ${className}`}
    >
      <WaveCanvas variant={variant} flip={flip} />
    </div>
  );
}
