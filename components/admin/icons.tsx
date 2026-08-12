/**
 * Inline SVG stroke icons for Mission Control — 1.5px stroke, currentColor.
 * Zero emoji policy: every glyph in the admin comes from here.
 */

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function base(props: IconProps) {
  return {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
    className: props.className ?? 'h-4 w-4',
  };
}

export function IconBolt(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
    </svg>
  );
}

export function IconRadar(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
      <path d="M12 12l6-6.5" />
    </svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5" width="17" height="16" />
      <path d="M3.5 9.5h17M8 2.5V6M16 2.5V6" />
    </svg>
  );
}

export function IconFile(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 2.5h8l4 4V21.5H6v-19Z" />
      <path d="M14 2.5v4h4M9 12h6M9 15.5h6M9 8.5h2" />
    </svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 5.5a3.5 3.5 0 0 1 0 5M18.5 20c0-2.5-1.2-4.4-3-5.4" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="5.5" width="18" height="13" />
      <path d="m3 7 9 6.5L21 7" />
    </svg>
  );
}

export function IconChat(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 4.5h16v11H9l-5 4.5v-15.5Z" />
      <path d="M8 9h8M8 12h5" />
    </svg>
  );
}

export function IconCpu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="7" y="7" width="10" height="10" />
      <path d="M10 2.5V7M14 2.5V7M10 17v4.5M14 17v4.5M2.5 10H7M2.5 14H7M17 10h4.5M17 14h4.5" />
    </svg>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18" />
    </svg>
  );
}

export function IconPower(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v8" />
      <path d="M6.3 6.5a8 8 0 1 0 11.4 0" />
    </svg>
  );
}

export function IconStar({
  filled = false,
  ...props
}: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(props)} fill={filled ? 'currentColor' : 'none'}>
      <path d="m12 3 2.7 5.8 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3.1 1.2-6.2L3 9.6l6.3-.8L12 3Z" />
    </svg>
  );
}

export function IconMapPin(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21.5S5 14.8 5 9.5a7 7 0 0 1 14 0c0 5.3-7 12-7 12Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m4.5 12.5 5 5L19.5 7" />
    </svg>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 2.5 20h19L12 3Z" />
      <path d="M12 9.5V14M12 16.5v.5" />
    </svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 9 7 7 7-7" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4.5v15M4.5 12h15" />
    </svg>
  );
}

export function IconArrowUpRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6.5 17.5 17.5 6.5M8.5 6.5h9v9" />
    </svg>
  );
}
