import { component$, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useI18n, t, translate } from '../../i18n/context';
import { SvgIcon } from '../../components/icons/SvgIcon';
import { HoneyMascotSvg } from '../../components/illustrations/HoneyMascotSvg';
import { db, initDatabase } from '../../db';

import {
  SUPPORTED_CURRENCIES,
  fetchLiveRates,
  convertCurrency,
  getCurrencyDecimals,
} from '../../services/currency/ratesService';
import {
  saveBackupWithoutGCP,
  restoreBackupData,
  decryptData,
} from '../../services/backup/driveSync';

export default component$(() => {
  const { lang, setLang$ } = useI18n();

  const state = useStore({
    lang,
    baseCurrency: 'EUR',
    rates: {} as Record<string, number>,
    lastRatesUpdate: '',
    passphrase: '',
    statusMessage: '',
    statusType: 'success' as 'success' | 'error',
    isUpdatingRates: false,
    restorePassphrase: '',
    showRestorePassModal: false,
    pendingEncryptedContent: '',
  });

  const loadSettings$ = $(async () => {
    const currentSettings = await db.settings.get('current');
    if (currentSettings) {
      state.baseCurrency = currentSettings.baseCurrency || 'EUR';
      state.rates = currentSettings.rates || {};
      state.lastRatesUpdate = currentSettings.lastRatesUpdate || '';
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    state.lang = lang;
    await loadSettings$();
  });

  const handleBaseCurrencyChange$ = $(async (newCur: string) => {
    state.baseCurrency = newCur;
    await db.settings.update('current', { baseCurrency: newCur });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('honey_currency_changed', { detail: { baseCurrency: newCur } }));
    }
    state.statusMessage = `${translate(state.lang, 'currency.base_currency')} : ${newCur}`;
    state.statusType = 'success';
  });

  const handleConvertBudgets$ = $(async () => {
    const cats = await db.categories.toArray();
    for (const cat of cats) {
      if (cat.budgetLimit > 0) {
        const converted = convertCurrency(cat.budgetLimit, 'EUR', state.baseCurrency, state.rates);
        const decimals = getCurrencyDecimals(state.baseCurrency);
        const rounded = decimals === 0 ? Math.round(converted) : Math.round(converted * 100) / 100;
        await db.categories.update(cat.id!, { budgetLimit: rounded });
      }
    }
    state.statusMessage = translate(state.lang, 'settings.budgets_converted_success');
    state.statusType = 'success';
  });

  const handleRefreshRates$ = $(async () => {
    state.isUpdatingRates = true;
    state.statusMessage = '';
    try {
      const liveRates = await fetchLiveRates();
      if (liveRates) {
        state.rates = liveRates;
        const now = new Date().toISOString();
        state.lastRatesUpdate = now;
        await db.settings.update('current', {
          rates: liveRates,
          lastRatesUpdate: now,
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('honey_currency_changed', { detail: { baseCurrency: state.baseCurrency } }));
        }
        state.statusMessage = 'Taux de change actualisés avec succès !';
        state.statusType = 'success';
      } else {
        state.statusMessage = 'Impossible de contacter le serveur de taux (mode hors-ligne). Taux existants conservés.';
        state.statusType = 'error';
      }
    } catch (e) {
      console.error(e);
      state.statusMessage = 'Erreur lors de la récupération des taux.';
      state.statusType = 'error';
    } finally {
      state.isUpdatingRates = false;
    }
  });

  const handleReloadRealData$ = $(async () => {

    if (confirm('Voulez-vous réinitialiser HoneyBudget avec les 474 opérations réelles de data.csv ?')) {
      await initDatabase(true);
      await loadSettings$();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('honey_currency_changed', { detail: { baseCurrency: 'MGA' } }));
      }
      state.statusMessage = 'Données réelles (data.csv) chargées avec succès ! (474 opérations)';
      state.statusType = 'success';
    }
  });

  const handleSaveToDrive$ = $(async () => {

    state.statusMessage = '';
    try {
      const res = await saveBackupWithoutGCP(state.passphrase);
      if (res.success) {
        state.statusMessage = translate(state.lang, 'backup.success');
        state.statusType = 'success';
      }
    } catch (e: any) {
      state.statusMessage = e.message || translate(state.lang, 'common.error');
      state.statusType = 'error';
    }
  });

  const handleRestoreFileSelected$ = $(async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    state.statusMessage = '';
    try {
      const text = await file.text();

      // Check if encrypted
      if (text.startsWith('HONEY_ENC:')) {
        state.pendingEncryptedContent = text;
        state.showRestorePassModal = true;
        return;
      }

      // Plain JSON
      const json = JSON.parse(text);
      await restoreBackupData(json);
      state.statusMessage = translate(state.lang, 'backup.restore_success');
      state.statusType = 'success';
      await loadSettings$();
    } catch (err: any) {
      console.error(err);
      state.statusMessage = translate(state.lang, 'backup.invalid_file');
      state.statusType = 'error';
    }
  });

  const handleConfirmDecryptRestore$ = $(async () => {
    try {
      const decryptedText = await decryptData(state.pendingEncryptedContent, state.restorePassphrase);
      const json = JSON.parse(decryptedText);
      await restoreBackupData(json);
      state.showRestorePassModal = false;
      state.pendingEncryptedContent = '';
      state.restorePassphrase = '';
      state.statusMessage = translate(state.lang, 'backup.restore_success');
      state.statusType = 'success';
      await loadSettings$();
    } catch (err) {
      console.error(err);
      state.statusMessage = 'Mot de passe incorrect ou fichier endommagé.';
      state.statusType = 'error';
    }
  });

  return (
    <div class="space-y-6">
      {/* Top bar */}
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-black text-amber-950 flex items-center gap-2">
            <SvgIcon name="settings" size={22} class="text-amber-600" />
            <span>{t(lang, 'settings.title')}</span>
          </h2>
          <p class="text-xs font-semibold text-slate-500 mt-0.5">
            Préférences, devises et sauvegardes Google Drive
          </p>
        </div>
      </div>

      {/* Status banner */}
      {state.statusMessage && (
        <div
          class={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border-2 ${
            state.statusType === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <SvgIcon name={state.statusType === 'success' ? 'check' : 'info'} size={16} />
          <span>{state.statusMessage}</span>
        </div>
      )}

      {/* 1. Language section */}
      <div class="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-xs space-y-3">
        <h3 class="text-sm font-black text-amber-950 flex items-center gap-2">
          <SvgIcon name="globe" size={18} class="text-amber-600" />
          <span>{t(lang, 'settings.language')}</span>
        </h3>

        <div class="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick$={() => setLang$('fr')}
            class={`py-3 px-4 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-2 transition-all ${
              lang === 'fr'
                ? 'border-amber-400 bg-amber-100 text-amber-950 shadow-xs'
                : 'border-amber-100 bg-white text-slate-600 hover:bg-amber-50'
            }`}
          >
            <span>Français</span>
            {lang === 'fr' && <SvgIcon name="check" size={14} />}
          </button>

          <button
            type="button"
            onClick$={() => setLang$('en')}
            class={`py-3 px-4 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-2 transition-all ${
              lang === 'en'
                ? 'border-amber-400 bg-amber-100 text-amber-950 shadow-xs'
                : 'border-amber-100 bg-white text-slate-600 hover:bg-amber-50'
            }`}
          >
            <span>English</span>
            {lang === 'en' && <SvgIcon name="check" size={14} />}
          </button>
        </div>
      </div>

      {/* 2. Base Currency & Exchange Rates */}
      <div class="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-amber-950 flex items-center gap-2">
            <SvgIcon name="coin" size={18} class="text-amber-600" />
            <span>{t(lang, 'settings.currency_settings')}</span>
          </h3>

          <button
            type="button"
            onClick$={handleRefreshRates$}
            disabled={state.isUpdatingRates}
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors cursor-pointer"
          >
            <SvgIcon name="refresh" size={12} class={state.isUpdatingRates ? 'animate-spin' : ''} />
            <span>{state.isUpdatingRates ? t(lang, 'common.loading') : t(lang, 'currency.refresh_rates')}</span>
          </button>
        </div>

        <div>
          <label class="block text-xs font-bold text-amber-900 mb-1">
            {t(lang, 'currency.base_currency')} (pour le solde total et les budgets)
          </label>
          <select
            value={state.baseCurrency}
            onChange$={(e: any) => handleBaseCurrencyChange$(e.target.value)}
            class="w-full text-sm font-bold text-slate-800 px-4 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {`${c.code} (${c.symbol}) - ${c.name}`}
              </option>
            ))}
          </select>
        </div>

        <div class="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick$={handleConvertBudgets$}
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border-2 border-amber-300 hover:bg-amber-50 text-amber-900 font-bold text-xs transition-colors cursor-pointer"
          >
            <SvgIcon name="pie-chart" size={14} class="text-amber-600" />
            <span>{t(lang, 'settings.convert_budgets')}</span>
          </button>
        </div>

        <div class="bg-amber-50/60 rounded-2xl p-3 border border-amber-100 text-xs font-semibold text-amber-900">
          <p>{t(lang, 'currency.rate_info')}</p>
          <p class="text-[11px] text-amber-700/80 mt-1">
            {t(lang, 'currency.offline_warning')}
          </p>
        </div>
      </div>


      {/* 3. Google Drive Backup & Restore (Zero GCP) */}
      <div class="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-amber-950 flex items-center gap-2">
            <SvgIcon name="download" size={18} class="text-amber-600" />
            <span>{t(lang, 'backup.title')}</span>
          </h3>
          <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {t(lang, 'backup.drive_zero_gcp')}
          </span>
        </div>

        <p class="text-xs font-semibold text-slate-600 leading-relaxed">
          {t(lang, 'backup.desc')}
        </p>

        {/* Zero GCP explanation cards */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="bg-amber-50/40 rounded-2xl p-3.5 border border-amber-100 space-y-1">
            <div class="text-xs font-black text-amber-950 flex items-center gap-1.5">
              <SvgIcon name="home" size={14} class="text-amber-700" />
              <span>Sur Ordinateur (PC / Mac)</span>
            </div>
            <p class="text-[11px] text-slate-600">
              {t(lang, 'backup.desktop_instruction')}
            </p>
          </div>

          <div class="bg-amber-50/40 rounded-2xl p-3.5 border border-amber-100 space-y-1">
            <div class="text-xs font-black text-amber-950 flex items-center gap-1.5">
              <SvgIcon name="bus" size={14} class="text-amber-700" />
              <span>Sur Smartphone (Android / iOS)</span>
            </div>
            <p class="text-[11px] text-slate-600">
              {t(lang, 'backup.mobile_instruction')}
            </p>
          </div>
        </div>

        {/* Optional Password Encryption */}
        <div class="pt-2 border-t border-amber-50 space-y-2">
          <div class="flex items-center gap-1.5 text-xs font-black text-amber-950">
            <SvgIcon name="shield" size={14} class="text-amber-700" />
            <span>{t(lang, 'backup.encryption_title')}</span>
          </div>
          <p class="text-[11px] text-slate-500">
            {t(lang, 'backup.encryption_desc')}
          </p>
          <input
            type="password"
            value={state.passphrase}
            onInput$={(e: any) => (state.passphrase = e.target.value)}
            placeholder={t(lang, 'backup.passphrase_placeholder')}
            class="w-full text-xs font-semibold text-slate-800 px-3.5 py-2 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/20"
          />
        </div>

        {/* Buttons Export and Import */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick$={handleSaveToDrive$}
            class="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <SvgIcon name="download" size={16} />
            <span>{t(lang, 'backup.save_to_drive')}</span>
          </button>

          <label class="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-amber-300 hover:bg-amber-50 text-amber-900 font-black text-xs cursor-pointer transition-all text-center">
            <SvgIcon name="upload" size={16} />
            <span>{t(lang, 'backup.restore_from_drive')}</span>
            <input
              type="file"
              accept=".json,.enc"
              onChange$={handleRestoreFileSelected$}
              class="hidden"
            />
          </label>
        </div>

        {/* Reload data.csv */}
        <div class="pt-3 border-t border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div class="text-xs font-black text-amber-950 flex items-center gap-1.5">
              <SvgIcon name="refresh" size={14} class="text-amber-600" />
              <span>Données Réelles (data.csv)</span>
            </div>
            <p class="text-[11px] text-slate-500">
              474 opérations réelles et 5 comptes (Cash, Mvola, Orange Money...)
            </p>
          </div>
          <button
            type="button"
            onClick$={handleReloadRealData$}
            class="px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <SvgIcon name="refresh" size={13} />
            <span>Recharger data.csv</span>
          </button>
        </div>
      </div>



      {/* 4. About HoneyBudget */}
      <div class="bg-amber-50/50 rounded-3xl p-5 border-2 border-amber-200/60 flex items-center gap-4">
        <HoneyMascotSvg size={48} class="shrink-0" />
        <div class="space-y-1">
          <h4 class="text-xs font-black text-amber-950">{t(lang, 'settings.about_title')}</h4>
          <p class="text-[11px] font-medium text-amber-800/80 leading-relaxed">
            {t(lang, 'settings.about_desc')}
          </p>
        </div>
      </div>

      {/* Decrypt modal when restoring encrypted file */}
      {state.showRestorePassModal && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-xs">
          <div class="bg-white rounded-3xl border-2 border-amber-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-amber-100">
              <h3 class="text-sm font-black text-amber-950 flex items-center gap-1.5">
                <SvgIcon name="shield" size={16} class="text-amber-600" />
                <span>Sauvegarde chiffrée</span>
              </h3>
              <button
                type="button"
                onClick$={() => (state.showRestorePassModal = false)}
                class="p-1 rounded-full text-amber-800 hover:bg-amber-100"
              >
                <SvgIcon name="x" size={16} />
              </button>
            </div>

            <p class="text-xs font-semibold text-slate-600">
              Ce fichier est protégé par mot de passe. Veuillez entrer la phrase secrète pour le déverrouiller.
            </p>

            <input
              type="password"
              value={state.restorePassphrase}
              onInput$={(e: any) => (state.restorePassphrase = e.target.value)}
              placeholder="Mot de passe de déchiffrement"
              class="w-full text-xs font-semibold text-slate-800 px-3.5 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/20"
            />

            <div class="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
              <button
                type="button"
                onClick$={() => (state.showRestorePassModal = false)}
                class="px-4 py-2 text-xs font-bold rounded-2xl text-amber-800 hover:bg-amber-100"
              >
                {t(lang, 'common.cancel')}
              </button>
              <button
                type="button"
                onClick$={handleConfirmDecryptRestore$}
                class="px-5 py-2 text-xs font-black rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-md cursor-pointer"
              >
                Restaurer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Réglages - HoneyBudget",
};
