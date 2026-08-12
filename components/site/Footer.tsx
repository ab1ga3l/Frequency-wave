/** Slim footer with frequency lines rising from the bottom. */
import WaveCanvas from './WaveCanvas';

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-white/10 bg-[#040B24]/20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-28 opacity-80 sm:h-36"
      >
        <WaveCanvas variant="hero" flip />
      </div>
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-10 font-mono text-[0.7rem] uppercase tracking-wider text-white/40 sm:flex-row sm:px-6">
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
