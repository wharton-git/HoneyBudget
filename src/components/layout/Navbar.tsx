import { component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { useI18n, t } from '../../i18n/context';
import { SvgIcon } from '../icons/SvgIcon';
import type { Translations } from '../../i18n/types';

export const Navbar = component$(() => {
  const loc = useLocation();
  const { lang } = useI18n();

  const links: { href: string; labelKey: keyof Translations; icon: string }[] = [
    { href: '/', labelKey: 'nav.dashboard', icon: 'home' },
    { href: '/transactions/', labelKey: 'nav.transactions', icon: 'arrow-transfer' },
    { href: '/reports/', labelKey: 'nav.reports', icon: 'bar-chart' },
    { href: '/categories/', labelKey: 'nav.categories', icon: 'pie-chart' },
    { href: '/accounts/', labelKey: 'nav.accounts', icon: 'wallet' },
    { href: '/settings/', labelKey: 'nav.settings', icon: 'settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return loc.url.pathname === '/' || loc.url.pathname === '';
    }
    return loc.url.pathname.startsWith(href);
  };

  return (
    <nav class="fixed bottom-3 left-0 right-0 z-40 px-3 pointer-events-none">
      <div class="max-w-lg mx-auto pointer-events-auto bg-white/95 backdrop-blur-lg border border-amber-200/80 shadow-[0_10px_30px_rgba(245,158,11,0.18)] rounded-full px-1.5 py-1 flex items-center justify-around">
        {links.map((item) => {
          const active = isActive(item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              class={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all duration-200 ${
                active
                  ? 'bg-amber-400 text-amber-950 font-bold shadow-xs scale-105'
                  : 'text-amber-800 hover:text-amber-950 hover:bg-amber-100/60 font-medium'
              }`}
            >
              <SvgIcon name={item.icon} size={18} class={active ? 'stroke-[2.4]' : 'stroke-[2]'} />
              <span class="text-[9px] tracking-tight mt-0.5 leading-none">
                {t(lang, item.labelKey)}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
});
