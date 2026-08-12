/**
 * Full-page crowd photo under a heavy midnight-navy wash, plus cyan/violet glow.
 */

export default function PageBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#040B24]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/crowd.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(4,11,36,0.82) 0%, rgba(4,11,36,0.7) 48%, rgba(4,11,36,0.64) 100%), linear-gradient(180deg, rgba(4,11,36,0.45) 0%, rgba(4,11,36,0.62) 48%, rgba(4,11,36,0.92) 100%)',
        }}
      />
      <div
        className="anim-glow absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 18% 35%, rgba(0,248,255,0.12), transparent 48%), radial-gradient(ellipse at 82% 65%, rgba(107,0,245,0.14), transparent 52%)',
        }}
      />
    </div>
  );
}
