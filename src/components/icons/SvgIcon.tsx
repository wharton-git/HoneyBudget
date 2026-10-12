import { component$ } from '@builder.io/qwik';

export type IconName =
  | 'honey-pot'
  | 'wallet'
  | 'piggy'
  | 'vault'
  | 'coin'
  | 'swap'
  | 'apple'
  | 'home'
  | 'bus'
  | 'game'
  | 'heart'
  | 'gift'
  | 'coffee'
  | 'salary'
  | 'tag'
  | 'globe'
  | 'plus'
  | 'minus'
  | 'check'
  | 'x'
  | 'trash'
  | 'edit'
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-transfer'
  | 'settings'
  | 'download'
  | 'upload'
  | 'shield'
  | 'pie-chart'
  | 'bar-chart'
  | 'trending-up'
  | 'calendar'
  | 'clock'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'chevron-up'
  | 'search'
  | 'refresh'
  | 'info'
  | 'cloud'
  | 'user';

interface SvgIconProps {
  name: IconName | string;
  size?: number | string;
  class?: string;
  strokeWidth?: number;
}

export const SvgIcon = component$<SvgIconProps>(({ name, size = 20, class: className = '', strokeWidth = 2.2 }) => {
  const s = typeof size === 'number' ? `${size}px` : size;

  const renderIcon = () => {
    switch (name) {
      case 'honey-pot':
        return (
          <>
            <path d="M7 8h10" />
            <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M6 9a5 5 0 0 0-1 3.5c0 5 3.5 7.5 7 7.5s7-2.5 7-7.5A5 5 0 0 0 18 9H6z" />
            <path d="M9.5 13.5c1.5 1 3.5 1 5 0" />
          </>
        );
      case 'piggy':
        return (
          <>
            <path d="M19 11c0-4-3-7-7-7-3.5 0-6.5 2.5-7 6" />
            <path d="M5 10c-1.5 0-3 1.5-3 3s1.5 3 3 3h1" />
            <path d="M7 17l-1 3h3l1-2" />
            <path d="M15 17l-1 3h3l1-2" />
            <path d="M6 16c1 2 3.5 3 6 3 4.5 0 7-3 7-7" />
            <circle cx="15" cy="9" r="1" fill="currentColor" />
            <path d="M11 6v2" />
          </>
        );
      case 'wallet':
        return (
          <>
            <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
            <rect x="14" y="9" width="7" height="6" rx="2" />
            <circle cx="17.5" cy="12" r="0.8" fill="currentColor" />
          </>
        );
      case 'vault':
        return (
          <>
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 9v1m0 4v1m-3-2h1m4 0h1" />
            <circle cx="18" cy="8" r="0.5" fill="currentColor" />
          </>
        );
      case 'coin':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" stroke-dasharray="2 2" />
            <path d="M12 9.5v5" />
            <path d="M10.5 11h3" />
          </>
        );
      case 'swap':
        return (
          <>
            <path d="M16 3l4 4-4 4" />
            <path d="M20 7H4" />
            <path d="M8 21l-4-4 4-4" />
            <path d="M4 17h16" />
          </>
        );
      case 'apple':
        return (
          <>
            <path d="M12 4c.5-1.5 2-2 3-2" />
            <path d="M12 4c-1 3.5-5 3.5-5 7.5A5.5 5.5 0 0 0 12 17a5.5 5.5 0 0 0 5-5.5C17 7.5 13 7.5 12 4z" />
          </>
        );
      case 'home':
        return (
          <>
            <path d="M3 10.5l9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z" />
            <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" />
          </>
        );
      case 'bus':
        return (
          <>
            <rect x="4" y="4" width="16" height="13" rx="3" />
            <path d="M4 11h16" />
            <circle cx="8" cy="14" r="1.5" />
            <circle cx="16" cy="14" r="1.5" />
            <path d="M6 17v2m12-2v2" />
          </>
        );
      case 'game':
        return (
          <>
            <rect x="2" y="6" width="20" height="12" rx="4" />
            <path d="M6 12h4m-2-2v4" />
            <circle cx="15.5" cy="10.5" r="1" fill="currentColor" />
            <circle cx="17.5" cy="13.5" r="1" fill="currentColor" />
          </>
        );
      case 'heart':
        return (
          <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
        );
      case 'gift':
        return (
          <>
            <rect x="3" y="8" width="18" height="13" rx="2" />
            <path d="M12 8v13" />
            <path d="M3 13h18" />
            <path d="M8 8a3 3 0 0 1 4-4c-1 2-2 3.5-4 4z" />
            <path d="M16 8a3 3 0 0 0-4-4c1 2 2 3.5 4 4z" />
          </>
        );
      case 'coffee':
        return (
          <>
            <path d="M3 8h13v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8z" />
            <path d="M16 10h2a2.5 2.5 0 0 1 0 5h-2" />
            <path d="M2 21h15" />
          </>
        );
      case 'salary':
        return (
          <>
            <rect x="3" y="6" width="18" height="14" rx="3" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <circle cx="12" cy="13" r="2.5" />
          </>
        );
      case 'tag':
        return (
          <>
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </>
        );
      case 'globe':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M3.6 9h16.8M3.6 15h16.8" />
            <path d="M11.5 3a13 13 0 0 0 0 18m1-18a13 13 0 0 1 0 18" />
          </>
        );
      case 'plus':
        return <path d="M12 5v14m-7-7h14" />;
      case 'minus':
        return <path d="M5 12h14" />;
      case 'check':
        return <path d="M20 6L9 17l-5-5" />;
      case 'x':
        return <path d="M18 6L6 18M6 6l12 12" />;
      case 'trash':
        return (
          <>
            <path d="M3 6h18m-4 0v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </>
        );
      case 'edit':
        return (
          <>
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </>
        );
      case 'arrow-up':
        return (
          <>
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </>
        );
      case 'arrow-down':
        return (
          <>
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </>
        );
      case 'arrow-transfer':
        return (
          <>
            <path d="M17 4l4 4-4 4" />
            <path d="M21 8H7a4 4 0 0 0-4 4v1" />
            <path d="M7 20l-4-4 4-4" />
            <path d="M3 16h14a4 4 0 0 0 4-4v-1" />
          </>
        );
      case 'settings':
        return (
          <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </>
        );
      case 'download':
        return (
          <>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </>
        );
      case 'upload':
        return (
          <>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </>
        );
      case 'shield':
        return (
          <>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </>
        );
      case 'pie-chart':
        return (
          <>
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </>
        );
      case 'bar-chart':
        return (
          <>
            <line x1="12" y1="20" x2="12" y2="10" />
            <line x1="18" y1="20" x2="18" y2="4" />
            <line x1="6" y1="20" x2="6" y2="16" />
          </>
        );
      case 'trending-up':
        return (
          <>
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </>
        );
      case 'calendar':
        return (
          <>
            <rect x="3" y="4" width="18" height="18" rx="3" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </>
        );
      case 'clock':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </>
        );
      case 'chevron-left':
        return <polyline points="15 18 9 12 15 6" />;
      case 'chevron-right':
        return <polyline points="9 18 15 12 9 6" />;
      case 'chevron-down':
        return <polyline points="6 9 12 15 18 9" />;
      case 'chevron-up':
        return <polyline points="18 15 12 9 6 15" />;
      case 'search':
        return (
          <>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </>
        );
      case 'refresh':
        return (
          <>
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </>
        );
      case 'info':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </>
        );
      case 'cloud':
        return (
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        );
      case 'user':
        return (
          <>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </>
        );
      default:
        return (
          <circle cx="12" cy="12" r="8" />
        );
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-linejoin="round"
      class={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      {renderIcon()}
    </svg>
  );
});
