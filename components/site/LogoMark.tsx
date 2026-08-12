/** Cropped FW wave monogram (transparent PNG) used in nav, hero, and admin. */
export default function LogoMark({
  className,
  alt = '',
}: {
  className?: string;
  alt?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/images/fw-mark.png" alt={alt} className={className} />
  );
}
