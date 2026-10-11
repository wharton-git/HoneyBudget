import { component$, useStore, $, useVisibleTask$, type PropFunction } from '@builder.io/qwik';
import { useI18n, t } from '../../i18n/context';
import { SvgIcon } from '../icons/SvgIcon';
import { db, type Account } from '../../db';
import { SUPPORTED_CURRENCIES } from '../../services/currency/ratesService';

interface AccountModalProps {
  isOpen: boolean;
  onClose$: PropFunction<() => void>;
  onSaved$: PropFunction<() => void>;
  editAccount?: Account | null;
}

const PASTEL_COLORS = [
  '#F59E0B', // Miel
  '#10B981', // Menthe
  '#3B82F6', // Ciel
  '#EC4899', // Pêche rose
  '#8B5CF6', // Lavande
  '#F43F5E', // Fraise
  '#06B6D4', // Turquoise
];

const ACCOUNT_ICONS = ['wallet', 'honey-pot', 'piggy', 'vault', 'coin'];

export const AccountModal = component$<AccountModalProps>(({ isOpen, onClose$, onSaved$, editAccount }) => {
  const { lang } = useI18n();

  const state = useStore({
    name: '',
    type: 'checking' as 'checking' | 'savings' | 'cash',
    currencyCode: 'EUR',
    balance: '',
    color: '#F59E0B',
    iconSvg: 'wallet',
    loading: false,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => isOpen);
    if (!isOpen) return;

    if (editAccount) {
      state.name = editAccount.name;
      state.type = editAccount.type;
      state.currencyCode = editAccount.currencyCode;
      state.balance = String(editAccount.balance);
      state.color = editAccount.color || '#F59E0B';
      state.iconSvg = editAccount.iconSvg || 'wallet';
    } else {
      state.name = '';
      state.type = 'checking';
      state.currencyCode = 'EUR';
      state.balance = '0';
      state.color = '#F59E0B';
      state.iconSvg = 'wallet';
    }
  });

  const handleSubmit$ = $(async () => {
    const val = parseFloat(state.balance);
    if (!state.name.trim() || isNaN(val)) {
      return;
    }

    state.loading = true;

    try {
      if (editAccount) {
        await db.accounts.update(editAccount.id!, {
          name: state.name.trim(),
          type: state.type,
          currencyCode: state.currencyCode,
          balance: val,
          color: state.color,
          iconSvg: state.iconSvg,
        });
      } else {
        await db.accounts.add({
          name: state.name.trim(),
          type: state.type,
          currencyCode: state.currencyCode,
          balance: val,
          color: state.color,
          iconSvg: state.iconSvg,
        });
      }

      await onSaved$();
      await onClose$();
    } catch (e) {
      console.error(e);
    } finally {
      state.loading = false;
    }
  });

  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-xs">
      <div class="bg-white rounded-3xl border-2 border-amber-200/80 shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div class="flex items-center justify-between pb-3 border-b border-amber-100">
          <div class="flex items-center gap-2">
            <div
              class="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: state.color }}
            >
              <SvgIcon name={state.iconSvg} size={20} />
            </div>
            <h3 class="text-lg font-black text-amber-950">
              {editAccount ? t(lang, 'accounts.edit_account') : t(lang, 'accounts.new_account')}
            </h3>
          </div>
          <button
            type="button"
            onClick$={onClose$}
            class="p-2 rounded-full hover:bg-amber-100 text-amber-800 transition-colors"
          >
            <SvgIcon name="x" size={18} />
          </button>
        </div>

        {/* Form */}
        <div class="space-y-4 mt-4">
          {/* Name */}
          <div>
            <label class="block text-xs font-bold text-amber-900 mb-1">
              {t(lang, 'accounts.name')}
            </label>
            <input
              type="text"
              value={state.name}
              onInput$={(e: any) => (state.name = e.target.value)}
              placeholder="Ex: Compte Courant, Épargne Vacances..."
              class="w-full text-sm font-semibold text-slate-800 px-4 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/20"
            />
          </div>

          {/* Type */}
          <div>
            <label class="block text-xs font-bold text-amber-900 mb-1">
              {t(lang, 'accounts.type')}
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick$={() => (state.type = 'checking')}
                class={`py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                  state.type === 'checking'
                    ? 'border-amber-400 bg-amber-100/70 text-amber-950'
                    : 'border-amber-100 bg-white text-slate-600'
                }`}
              >
                {t(lang, 'accounts.type.checking')}
              </button>
              <button
                type="button"
                onClick$={() => (state.type = 'savings')}
                class={`py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                  state.type === 'savings'
                    ? 'border-amber-400 bg-amber-100/70 text-amber-950'
                    : 'border-amber-100 bg-white text-slate-600'
                }`}
              >
                {t(lang, 'accounts.type.savings')}
              </button>
              <button
                type="button"
                onClick$={() => (state.type = 'cash')}
                class={`py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                  state.type === 'cash'
                    ? 'border-amber-400 bg-amber-100/70 text-amber-950'
                    : 'border-amber-100 bg-white text-slate-600'
                }`}
              >
                {t(lang, 'accounts.type.cash')}
              </button>
            </div>
          </div>

          {/* Currency selection */}
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-amber-900 mb-1">
                {t(lang, 'accounts.currency')}
              </label>
              <select
                value={state.currencyCode}
                onChange$={(e: any) => (state.currencyCode = e.target.value)}
                class="w-full text-sm font-semibold text-slate-800 px-3 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white"
              >
                {SUPPORTED_CURRENCIES.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {`${cur.code} (${cur.symbol}) - ${cur.name}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Balance */}
            <div>
              <label class="block text-xs font-bold text-amber-900 mb-1">
                {t(lang, 'accounts.current_balance')}
              </label>
              <input
                type="number"
                step="any"
                value={state.balance}
                onInput$={(e: any) => (state.balance = e.target.value)}
                placeholder="0.00"
                class="w-full text-sm font-bold text-slate-800 px-3 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label class="block text-xs font-bold text-amber-900 mb-1">
              Couleur douce
            </label>
            <div class="flex items-center gap-2">
              {PASTEL_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick$={() => (state.color = c)}
                  class={`w-7 h-7 rounded-full transition-transform ${
                    state.color === c ? 'scale-125 ring-2 ring-amber-400 ring-offset-2' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* SVG Icon Picker */}
          <div>
            <label class="block text-xs font-bold text-amber-900 mb-1">
              Icône SVG
            </label>
            <div class="flex items-center gap-2">
              {ACCOUNT_ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick$={() => (state.iconSvg = ic)}
                  class={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all ${
                    state.iconSvg === ic
                      ? 'border-amber-400 bg-amber-100 text-amber-950 font-bold'
                      : 'border-amber-100 bg-white text-slate-500 hover:bg-amber-50'
                  }`}
                >
                  <SvgIcon name={ic} size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div class="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-amber-100">
          <button
            type="button"
            onClick$={onClose$}
            class="px-4 py-2 text-xs font-bold rounded-2xl text-amber-800 hover:bg-amber-100 transition-colors"
          >
            {t(lang, 'common.cancel')}
          </button>
          <button
            type="button"
            onClick$={handleSubmit$}
            disabled={state.loading}
            class="px-5 py-2.5 text-xs font-black rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <SvgIcon name="check" size={14} />
            <span>{t(lang, 'common.save')}</span>
          </button>
        </div>
      </div>
    </div>
  );
});
