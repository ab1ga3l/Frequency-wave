/** Slim footer sitting on a frequency-line band. */
import WaveBand from './WaveBand';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black/60">
      <WaveBand wash variant="band" className="opacity-70" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 font-mono text-[0.7rem] uppercase tracking-wider text-white/40 sm:flex-row sm:px-6">
        <p>&copy; 2026 Frequency Wave. All rights reserved.</p>
        <p>
          Made by{' '}
          <a
            href="https://arttentionmedia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 transition-colors hover:text-cyan"
          >
            arttentionmedia.com
          </a>
        </p>
      </div>
    </footer>
  );
}
