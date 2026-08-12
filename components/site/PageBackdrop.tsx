/**
 * Full-page crowd backdrop: navy + cyan/violet tint over a clearly
 * visible photo. Stays fixed while content scrolls.
 */

export default function PageBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/crowd.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover brightness-110 contrast-110"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(4,11,36,0.72) 0%, rgba(4,11,36,0.58) 48%, rgba(4,11,36,0.5) 100%), linear-gradient(180deg, rgba(4,11,36,0.28) 0%, rgba(4,11,36,0.5) 48%, rgba(4,11,36,0.9) 100%)',
        }}
      />
      <div
        className="anim-glow absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 18% 35%, rgba(0,248,255,0.14), transparent 48%), radial-gradient(ellipse at 82% 65%, rgba(107,0,245,0.16), transparent 52%)',
        }}
      />
    </div>
  );
}
