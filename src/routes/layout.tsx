import { component$, Slot, useContextProvider, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Header } from '../components/layout/Header';
import { Navbar } from '../components/layout/Navbar';
import { I18nContext, type I18nStore } from '../i18n/context';
import { db, initDatabase } from '../db';
import type { Language } from '../i18n/types';

export default component$(() => {
  const i18nStore = useStore<I18nStore>({
    lang: 'fr',
  });

  useContextProvider(I18nContext, i18nStore);

  const state = useStore({
    baseCurrency: 'EUR',
    ready: false,
  });

  // Client-side initialization
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    // Check saved language
    const savedLang = localStorage.getItem('honey_lang') as Language;
    if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
      i18nStore.lang = savedLang;
    }

    // Initialize Dexie DB
    await initDatabase();

    // Check Supabase authenticated user and auto-pull if local transactions are empty
    try {
      const { getCurrentUser } = await import('../services/supabase/auth');
      const user = await getCurrentUser();
      if (user) {
        const txCount = await db.transactions.count();
        if (txCount === 0) {
          const { pullRemoteFromSupabase } = await import('../services/supabase/sync');
          await pullRemoteFromSupabase(user.id);
        }
      }
    } catch (e) {
      console.warn('Supabase auto-sync check:', e);
    }

    const currentSettings = await db.settings.get('current');
    if (currentSettings) {
      state.baseCurrency = currentSettings.baseCurrency || 'MGA';
      if (!savedLang && currentSettings.language) {
        i18nStore.lang = currentSettings.language;
      }
    }

    state.ready = true;

    const onCurrencyChanged = (e: any) => {
      if (e.detail?.baseCurrency) {
        state.baseCurrency = e.detail.baseCurrency;
      }
    };
    window.addEventListener('honey_currency_changed', onCurrencyChanged);
    cleanup(() => {
      window.removeEventListener('honey_currency_changed', onCurrencyChanged);
    });
  });


  return (
    <div class="min-h-screen bg-[#FFFDF7] text-slate-800 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950 pb-24">
      <Header baseCurrency={state.baseCurrency} />
      <main class="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6">
        <Slot />
      </main>
      <Navbar />
    </div>
  );
});
