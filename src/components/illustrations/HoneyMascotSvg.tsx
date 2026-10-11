import { component$ } from '@builder.io/qwik';

interface HoneyMascotSvgProps {
  size?: number | string;
  mood?: 'happy' | 'celebrating' | 'saving';
  class?: string;
}

export const HoneyMascotSvg = component$<HoneyMascotSvgProps>(({ size = 72, class: className = '' }) => {
  const s = typeof size === 'number' ? `${size}px` : size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={s}
      height={s}
      class={`inline-block drop-shadow-sm select-none ${className}`}
      aria-label="HoneyBudget Mascot"
    >
      {/* Soft shadow */}
      <ellipse cx="50" cy="92" rx="28" ry="5" fill="#fde68a" opacity="0.6" />

      {/* Tiny translucent wings */}
      <ellipse cx="32" cy="34" rx="14" ry="9" transform="rotate(-30 32 34)" fill="#bae6fd" opacity="0.75" stroke="#7dd3fc" stroke-width="1.8" />
      <ellipse cx="68" cy="34" rx="14" ry="9" transform="rotate(30 68 34)" fill="#bae6fd" opacity="0.75" stroke="#7dd3fc" stroke-width="1.8" />

      {/* Little antennae */}
      <path d="M42 28 Q 38 16 32 18" fill="none" stroke="#78350f" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="31" cy="18" r="3" fill="#f59e0b" />
      <path d="M58 28 Q 62 16 68 18" fill="none" stroke="#78350f" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="69" cy="18" r="3" fill="#f59e0b" />

      {/* Cute Chubby Honey Bee Body */}
      <rect x="22" y="26" width="56" height="58" rx="28" fill="#fbbf24" stroke="#d97706" stroke-width="2.5" />

      {/* Sweet Honey Stripes */}
      <path d="M23 46 Q 50 50 77 46" fill="none" stroke="#78350f" stroke-width="4.5" stroke-linecap="round" opacity="0.85" />
      <path d="M25 60 Q 50 65 75 60" fill="none" stroke="#78350f" stroke-width="4.5" stroke-linecap="round" opacity="0.85" />

      {/* Rosy Round Cheeks */}
      <ellipse cx="33" cy="42" rx="4.5" ry="3" fill="#fda4af" opacity="0.85" />
      <ellipse cx="67" cy="42" rx="4.5" ry="3" fill="#fda4af" opacity="0.85" />

      {/* Sparkly Round Eyes */}
      <circle cx="39" cy="38" r="3.2" fill="#1e293b" />
      <circle cx="40" cy="37" r="1.1" fill="#ffffff" />
      <circle cx="61" cy="38" r="3.2" fill="#1e293b" />
      <circle cx="62" cy="37" r="1.1" fill="#ffffff" />

      {/* Happy Smile */}
      <path d="M46 43 Q 50 48 54 43" fill="none" stroke="#1e293b" stroke-width="2.2" stroke-linecap="round" />

      {/* Tiny Honey Dipper or Little Gold Coin Badge in Hand */}
      <g transform="translate(42, 66)">
        <circle cx="8" cy="8" r="7" fill="#fef08a" stroke="#ca8a04" stroke-width="1.8" />
        <path d="M8 5 v6 M6 7 h4" stroke="#ca8a04" stroke-width="1.5" stroke-linecap="round" />
      </g>
    </svg>
  );
});
