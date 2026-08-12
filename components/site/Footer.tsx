/** Slim footer with frequency lines rising up into the section above. */
import WaveCanvas from './WaveCanvas';

export default function Footer() {
  return (
    <footer className="relative z-0 border-t border-white/10 bg-[#040B24]/20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-44 bottom-0 z-0 opacity-85 sm:-top-56"
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
