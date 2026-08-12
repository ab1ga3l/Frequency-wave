import Reveal from './Reveal';
import WaveBand from './WaveBand';

/** Centered founder quote with a small circular portrait. */
export default function FounderQuote() {
  return (
    <section aria-label="From the founder" className="relative overflow-hidden py-20">
      <WaveBand wash variant="wash" flip />
      <Reveal className="relative z-10">
        <figure className="mx-auto max-w-2xl px-5 text-center sm:px-6">
          <div className="anim-ring mx-auto h-[56px] w-[56px] overflow-hidden rounded-full ring-1 ring-cyan/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/dj.jpg"
              alt="DJ Grace behind the decks"
              className="h-full w-full object-cover"
            />
          </div>
          <blockquote className="mt-6 text-base leading-relaxed text-white/75">
            Frequency Wave was born from a simple but powerful idea — that tech
            and entertainment belong in the same room. We&apos;re not just
            hosting events. We&apos;re building a movement that puts Africa at
            the centre of the global Web3 conversation. This is just the
            beginning.
          </blockquote>
          <figcaption className="mt-6">
            <span className="block font-display text-lg italic tracking-wide text-cyan">
              Grace Njura
            </span>
            <span className="mt-1 block text-xs uppercase text-white/40">
              Founder, Frequency Wave · DJ Grace
            </span>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
