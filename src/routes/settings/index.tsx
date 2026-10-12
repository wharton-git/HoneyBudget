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
  exportLocalBackup,
  restoreBackupData,
  decryptData,
} from '../../services/backup/driveSync';
import {
  getCurrentUser,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  subscribeToAuthChanges,
} from '../../services/supabase/auth';
import {
  syncWithSupabase,
  pushLocalToSupabase,
  pullRemoteFromSupabase,
  getLastSyncTime,
} from '../../services/supabase/sync';

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
    // Supabase Auth & Sync state
    userId: '',
    userEmail: '',
    authEmail: '',
    authPassword: '',
    authMode: 'signin' as 'signin' | 'signup',
    isAuthLoading: false,
    isSyncing: false,
    lastSyncTime: '',
  });

  const loadSettings$ = $(async () => {
    const currentSettings = await db.settings.get('current');
    if (currentSettings) {
      state.baseCurrency = currentSettings.baseCurrency || 'EUR';
      state.rates = currentSettings.rates || {};
      state.lastRatesUpdate = currentSettings.lastRatesUpdate || '';
    }
  });

  const checkAuth$ = $(async () => {
    const user = await getCurrentUser();
    if (user) {
      state.userId = user.id;
      state.userEmail = user.email || '';
    } else {
      state.userId = '';
      state.userEmail = '';
    }
    state.lastSyncTime = getLastSyncTime() || '';
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    state.lang = lang;
    await loadSettings$();
    await checkAuth$();

    subscribeToAuthChanges((_event, session) => {
      if (session?.user) {
        state.userId = session.user.id;
        state.userEmail = session.user.email || '';
      } else {
        state.userId = '';
        state.userEmail = '';
      }
    });
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
        state.statusMessage = translate(state.lang, 'settings.rates_refresh_success');
        state.statusType = 'success';
      } else {
        state.statusMessage = translate(state.lang, 'settings.rates_offline_warning');
        state.statusType = 'error';
      }
    } catch (e) {
      console.error(e);
      state.statusMessage = translate(state.lang, 'settings.rates_fetch_error');
      state.statusType = 'error';
    } finally {
      state.isUpdatingRates = false;
    }
  });

  const handleResetAppData$ = $(async () => {
    if (confirm(translate(state.lang, 'settings.reset_confirm'))) {
      await initDatabase(true);
      await loadSettings$();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('honey_currency_changed', { detail: { baseCurrency: state.baseCurrency } }));
      }
      state.statusMessage = translate(state.lang, 'settings.reset_success');
      state.statusType = 'success';
    }
  });

  const handleSignIn$ = $(async () => {
    if (!state.authEmail || !state.authPassword) {
      state.statusMessage = translate(state.lang, 'settings.auth_credentials_required');
      state.statusType = 'error';
      return;
    }
    state.isAuthLoading = true;
    state.statusMessage = '';
    try {
      const res = await signInWithEmail(state.authEmail, state.authPassword);
      if (res.user) {
        state.userId = res.user.id;
        state.userEmail = res.user.email || '';
        state.statusMessage = `${translate(state.lang, 'settings.signed_in_as')} ${res.user.email}`;
        state.statusType = 'success';
        // Auto sync after login
        state.isSyncing = true;
        try {
          const syncRes = await syncWithSupabase(res.user.id);
          state.lastSyncTime = syncRes.timestamp;
          state.statusMessage = translate(state.lang, 'settings.login_success');
          await loadSettings$();
        } catch (syncErr: any) {
          console.warn('Sync warning:', syncErr);
        } finally {
          state.isSyncing = false;
        }
      }
    } catch (e: any) {
      console.error(e);
      state.statusMessage = e.message || translate(state.lang, 'settings.login_error');
      state.statusType = 'error';
    } finally {
      state.isAuthLoading = false;
    }
  });

  const handleSignUp$ = $(async () => {
    if (!state.authEmail || !state.authPassword) {
      state.statusMessage = translate(state.lang, 'settings.auth_credentials_required');
      state.statusType = 'error';
      return;
    }
    state.isAuthLoading = true;
    state.statusMessage = '';
    try {
      const res = await signUpWithEmail(state.authEmail, state.authPassword);
      if (res.user) {
        state.userId = res.user.id;
        state.userEmail = res.user.email || '';
        state.statusMessage = translate(state.lang, 'settings.signup_init');
        state.statusType = 'success';
        // Initial sync to upload existing local data into user's isolated cloud store
        state.isSyncing = true;
        try {
          const syncRes = await pushLocalToSupabase(res.user.id);
          state.lastSyncTime = new Date().toISOString();
          state.statusMessage = `${translate(state.lang, 'settings.signup_success')} (${syncRes.transactions})`;
        } catch (syncErr: any) {
          console.warn('Initial push error:', syncErr);
        } finally {
          state.isSyncing = false;
        }
      }
    } catch (e: any) {
      console.error(e);
      state.statusMessage = e.message || translate(state.lang, 'settings.signup_error');
      state.statusType = 'error';
    } finally {
      state.isAuthLoading = false;
    }
  });

  const handleSignOut$ = $(async () => {
    state.isAuthLoading = true;
    state.statusMessage = '';
    try {
      await signOutUser();
      state.userId = '';
      state.userEmail = '';
      state.statusMessage = translate(state.lang, 'settings.signout_success');
      state.statusType = 'success';
    } catch (e: any) {
      console.error(e);
      state.statusMessage = e.message || translate(state.lang, 'settings.signout_error');
      state.statusType = 'error';
    } finally {
      state.isAuthLoading = false;
    }
  });

  const handleSyncNow$ = $(async () => {
    if (!state.userId) return;
    state.isSyncing = true;
    state.statusMessage = '';
    try {
      const res = await syncWithSupabase(state.userId);
      state.lastSyncTime = res.timestamp;
      state.statusMessage = translate(state.lang, 'sync.success');
      state.statusType = 'success';
      await loadSettings$();
    } catch (e: any) {
      console.error(e);
      state.statusMessage = e.message || translate(state.lang, 'sync.error');
      state.statusType = 'error';
    } finally {
      state.isSyncing = false;
    }
  });

  const handlePushCloud$ = $(async () => {
    if (!state.userId) return;
    state.isSyncing = true;
    state.statusMessage = '';
    try {
      const res = await pushLocalToSupabase(state.userId);
      state.lastSyncTime = new Date().toISOString();
      state.statusMessage = `${res.transactions} ${translate(state.lang, 'settings.sync_push_success')}`;
      state.statusType = 'success';
    } catch (e: any) {
      console.error(e);
      state.statusMessage = e.message || translate(state.lang, 'settings.sync_push_error');
      state.statusType = 'error';
    } finally {
      state.isSyncing = false;
    }
  });

  const handlePullCloud$ = $(async () => {
    if (!state.userId) return;
    state.isSyncing = true;
    state.statusMessage = '';
    try {
      const res = await pullRemoteFromSupabase(state.userId);
      state.lastSyncTime = new Date().toISOString();
      state.statusMessage = `${res.transactions} ${translate(state.lang, 'settings.sync_pull_success')}`;
      state.statusType = 'success';
      await loadSettings$();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('honey_currency_changed', { detail: { baseCurrency: state.baseCurrency } }));
      }
    } catch (e: any) {
      console.error(e);
      state.statusMessage = e.message || translate(state.lang, 'settings.sync_pull_error');
      state.statusType = 'error';
    } finally {
      state.isSyncing = false;
    }
  });

  const handleExportLocal$ = $(async () => {
    state.statusMessage = '';
    try {
      const res = await exportLocalBackup(state.passphrase);
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
            {t(lang, 'currency.base_currency')}
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
      </div>

      {/* 3. Supabase Cloud Sync (User Isolation & Offline Sync) */}
      <div id="sync" class="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-amber-950 flex items-center gap-2">
            <SvgIcon name="cloud" size={18} class="text-amber-600" />
            <span>{t(lang, 'sync.title')}</span>
          </h3>
          <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <SvgIcon name="shield" size={11} />
            <span>{t(lang, 'sync.supabase_badge')}</span>
          </span>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed">
          {t(lang, 'sync.offline_note')}
        </p>

        {state.userId ? (
          /* Logged In View */
          <div class="space-y-4 pt-1">
            <div class="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-900 shrink-0">
                  <SvgIcon name="user" size={16} />
                </div>
                <div>
                  <div class="text-xs font-black text-amber-950">{state.userEmail}</div>
                  <div class="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span>{t(lang, 'settings.rls_active')}</span>
                  </div>
                </div>
              </div>

              <div class="text-right">
                <span class="text-[10px] text-slate-500 block">
                  {t(lang, 'sync.last_sync')} :
                </span>
                <span class="text-xs font-bold text-amber-950">
                  {state.lastSyncTime ? new Date(state.lastSyncTime).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US') : t(lang, 'sync.never')}
                </span>
              </div>
            </div>

            {/* Main Sync Button */}
            <button
              type="button"
              onClick$={handleSyncNow$}
              disabled={state.isSyncing}
              class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <SvgIcon name="refresh" size={16} class={state.isSyncing ? 'animate-spin' : ''} />
              <span>{state.isSyncing ? t(lang, 'sync.syncing') : t(lang, 'sync.sync_now')}</span>
            </button>

            {/* Secondary actions: Push / Pull / Logout */}
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick$={handlePushCloud$}
                disabled={state.isSyncing}
                class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-amber-200 hover:bg-amber-50 text-amber-900 font-bold text-xs transition-colors cursor-pointer"
                title="Envoyer les données locales vers Supabase"
              >
                <SvgIcon name="arrow-up" size={14} class="text-amber-600" />
                <span>{t(lang, 'sync.push_cloud')}</span>
              </button>

              <button
                type="button"
                onClick$={handlePullCloud$}
                disabled={state.isSyncing}
                class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-amber-200 hover:bg-amber-50 text-amber-900 font-bold text-xs transition-colors cursor-pointer"
                title="Télécharger les données depuis Supabase vers IndexedDB"
              >
                <SvgIcon name="arrow-down" size={14} class="text-amber-600" />
                <span>{t(lang, 'sync.pull_cloud')}</span>
              </button>

              <button
                type="button"
                onClick$={handleSignOut$}
                disabled={state.isAuthLoading}
                class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-800 font-bold text-xs transition-colors cursor-pointer"
              >
                <SvgIcon name="x" size={14} />
                <span>{t(lang, 'sync.signout')}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Logged Out: Auth Form */
          <div class="space-y-3.5 pt-1">
            {/* Mode switch */}
            <div class="flex items-center bg-amber-50/80 p-1 rounded-2xl border border-amber-200/80 text-xs font-bold">
              <button
                type="button"
                onClick$={() => (state.authMode = 'signin')}
                class={`flex-1 py-1.5 rounded-xl transition-all ${
                  state.authMode === 'signin'
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                {t(lang, 'sync.signin')}
              </button>
              <button
                type="button"
                onClick$={() => (state.authMode = 'signup')}
                class={`flex-1 py-1.5 rounded-xl transition-all ${
                  state.authMode === 'signup'
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                {t(lang, 'sync.signup')}
              </button>
            </div>

            <div class="space-y-2">
              <div>
                <label class="block text-xs font-bold text-amber-900 mb-1">
                  {t(lang, 'sync.email')}
                </label>
                <input
                  type="email"
                  value={state.authEmail}
                  onInput$={(e: any) => (state.authEmail = e.target.value)}
                  placeholder="nom@exemple.com"
                  class="w-full text-xs font-semibold text-slate-800 px-3.5 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/20"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-amber-900 mb-1">
                  {t(lang, 'sync.password')}
                </label>
                <input
                  type="password"
                  value={state.authPassword}
                  onInput$={(e: any) => (state.authPassword = e.target.value)}
                  placeholder="Minimum 6 caractères"
                  class="w-full text-xs font-semibold text-slate-800 px-3.5 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/20"
                />
              </div>
            </div>

            <button
              type="button"
              onClick$={state.authMode === 'signin' ? handleSignIn$ : handleSignUp$}
              disabled={state.isAuthLoading}
              class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <SvgIcon name="cloud" size={16} />
              <span>
                {state.isAuthLoading
                  ? t(lang, 'common.loading')
                  : state.authMode === 'signin'
                  ? t(lang, 'sync.signin')
                  : t(lang, 'sync.signup')}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Local Backup (JSON) & Initial Data */}
      <div class="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-amber-950 flex items-center gap-2">
            <SvgIcon name="download" size={18} class="text-amber-600" />
            <span>{t(lang, 'settings.local_backup_json')}</span>
          </h3>
          <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
            Export / Import
          </span>
        </div>

        {/* Password Encryption */}
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-amber-900">
            {t(lang, 'backup.passphrase')}
          </label>
          <input
            type="password"
            value={state.passphrase}
            onInput$={(e: any) => (state.passphrase = e.target.value)}
            placeholder={t(lang, 'backup.passphrase_placeholder')}
            class="w-full text-xs font-semibold text-slate-800 px-3.5 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/20"
          />
        </div>

        {/* Buttons Export and Import */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick$={handleExportLocal$}
            class="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <SvgIcon name="download" size={16} />
            <span>{t(lang, 'backup.export_now')}</span>
          </button>

          <label class="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-amber-300 hover:bg-amber-50 text-amber-900 font-black text-xs cursor-pointer transition-all text-center">
            <SvgIcon name="upload" size={16} />
            <span>{t(lang, 'backup.import_now')}</span>
            <input
              type="file"
              accept=".json,.enc"
              onChange$={handleRestoreFileSelected$}
              class="hidden"
            />
          </label>
        </div>

        {/* Reset App */}
        <div class="pt-3 border-t border-amber-100 flex items-center justify-between">
          <span class="text-xs font-bold text-slate-600">{t(lang, 'settings.reset_title')}</span>
          <button
            type="button"
            onClick$={handleResetAppData$}
            class="px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <SvgIcon name="refresh" size={13} />
            <span>{t(lang, 'settings.reset_button')}</span>
          </button>
        </div>
      </div>

      {/* 4. About HoneyBudget */}
      <div class="bg-amber-50/50 rounded-3xl p-4 border border-amber-200/60 flex items-center gap-3">
        <HoneyMascotSvg size={36} class="shrink-0" />
        <div class="text-xs font-bold text-amber-950">
          {t(lang, 'settings.about_footer')}
        </div>
      </div>

      {/* Decrypt modal when restoring encrypted file */}
      {state.showRestorePassModal && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-xs">
          <div class="bg-white rounded-3xl border-2 border-amber-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-amber-100">
              <h3 class="text-sm font-black text-amber-950 flex items-center gap-1.5">
                <SvgIcon name="shield" size={16} class="text-amber-600" />
                <span>{t(lang, 'settings.encrypted_backup')}</span>
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
              {t(lang, 'settings.decrypt_prompt')}
            </p>

            <input
              type="password"
              value={state.restorePassphrase}
              onInput$={(e: any) => (state.restorePassphrase = e.target.value)}
              placeholder={t(lang, 'settings.decrypt_placeholder')}
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
                {t(lang, 'settings.restore_button')}
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
