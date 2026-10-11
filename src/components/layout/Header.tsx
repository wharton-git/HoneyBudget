import { component$, $ } from '@builder.io/qwik';
import { useI18n, t } from '../../i18n/context';
import { SvgIcon } from '../icons/SvgIcon';
import { HoneyMascotSvg } from '../illustrations/HoneyMascotSvg';
import { saveBackupWithoutGCP } from '../../services/backup/driveSync';

interface HeaderProps {
  baseCurrency?: string;
}

export const Header = component$<HeaderProps>(({ baseCurrency = 'EUR' }) => {
  const { lang, setLang$ } = useI18n();

  const handleQuickBackup$ = $(async () => {
    try {
      await saveBackupWithoutGCP();
    } catch (e) {
      console.error(e);
    }
  });

  return (
    <header class="sticky top-0 z-40 bg-amber-50/90 backdrop-blur-md border-b border-amber-200/60 px-4 py-3 transition-colors">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <a href="/" class="flex items-center gap-2.5 group">
          <div class="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300/80 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <HoneyMascotSvg size={32} />
          </div>
          <div>
            <h1 class="text-lg font-black tracking-tight text-amber-950 font-sans">
              HoneyBudget
            </h1>
          </div>
        </a>

        {/* Right actions: Base currency, Lang switch, Backup */}
        <div class="flex items-center gap-2">
          {/* Base Currency Pill */}
          <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-amber-200 text-xs font-bold text-amber-900 shadow-xs">
            <SvgIcon name="coin" size={13} class="text-amber-500" />
            <span>{baseCurrency}</span>
          </div>

          {/* Language Toggle */}
          <div class="flex items-center bg-white/80 border border-amber-200 rounded-full p-0.5 shadow-xs">
            <button
              type="button"
              onClick$={() => setLang$('fr')}
              class={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${
                lang === 'fr'
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
              title="Français"
            >
              FR
            </button>
            <button
              type="button"
              onClick$={() => setLang$('en')}
              class={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${
                lang === 'en'
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Quick Backup to Drive Button */}
          <button
            type="button"
            onClick$={handleQuickBackup$}
            class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
            title={t(lang, 'backup.save_to_drive')}
          >
            <SvgIcon name="download" size={14} class="stroke-2" />
            <span class="hidden md:inline">{t(lang, 'common.save')}</span>
          </button>
        </div>
      </div>
    </header>
  );
});
