import { component$, useStore, $, useVisibleTask$, type PropFunction } from '@builder.io/qwik';
import { useI18n, t } from '../../i18n/context';
import type { Translations } from '../../i18n/types';
import { SvgIcon, type IconName } from '../icons/SvgIcon';
import { db, type Account, type AccountType, getAccountTypes } from '../../db';
import { SUPPORTED_CURRENCIES, convertCurrency, getCurrencyDecimals } from '../../services/currency/ratesService';

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

const ACCOUNT_ICONS: IconName[] = [
  'wallet',
  'smartphone',
  'bank',
  'crypto',
  'coin',
  'vault',
  'piggy',
  'honey-pot',
];

interface AccountTypeOption {
  type: AccountType;
  labelKey: keyof Translations;
  icon: IconName;
}

const ACCOUNT_TYPE_OPTIONS: AccountTypeOption[] = [
  { type: 'mobile_money', labelKey: 'accounts.type.mobile_money', icon: 'smartphone' },
  { type: 'bank', labelKey: 'accounts.type.bank', icon: 'bank' },
  { type: 'crypto', labelKey: 'accounts.type.crypto', icon: 'crypto' },
  { type: 'checking', labelKey: 'accounts.type.checking', icon: 'coin' },
  { type: 'savings', labelKey: 'accounts.type.savings', icon: 'piggy' },
  { type: 'cash', labelKey: 'accounts.type.cash', icon: 'wallet' },
];

export const AccountModal = component$<AccountModalProps>(({ isOpen, onClose$, onSaved$, editAccount }) => {
  const { lang } = useI18n();

  const state = useStore({
    name: '',
    types: ['checking'] as AccountType[],
    currencyCode: 'EUR',
    balance: '',
    color: '#F59E0B',
    iconSvg: 'wallet',
    loading: false,
    rates: {} as Record<string, number>,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => isOpen);
    if (!isOpen) return;

    const settings = await db.settings.get('current');
    state.rates = settings?.rates || {};

    if (editAccount) {
      state.name = editAccount.name;
      state.types = getAccountTypes(editAccount);
      state.currencyCode = editAccount.currencyCode;
      state.balance = String(editAccount.balance);
      state.color = editAccount.color || '#F59E0B';
      state.iconSvg = editAccount.iconSvg || 'wallet';
    } else {
      state.name = '';
      state.types = ['checking'];
      state.currencyCode = settings?.baseCurrency || 'EUR';
      state.balance = '0';
      state.color = '#F59E0B';
      state.iconSvg = 'wallet';
    }
  });

  const handleToggleType$ = $((tType: AccountType) => {
    const exists = state.types.includes(tType);
    if (exists) {
      if (state.types.length > 1) {
        state.types = state.types.filter((t) => t !== tType);
      }
    } else {
      state.types = [...state.types, tType];
    }
  });

  const handleCurrencyChange$ = $((newCode: string) => {
    const currentVal = parseFloat(state.balance);
    if (!isNaN(currentVal) && currentVal !== 0 && state.currencyCode !== newCode) {
      const converted = convertCurrency(currentVal, state.currencyCode, newCode, state.rates);
      const decimals = getCurrencyDecimals(newCode);
      state.balance = decimals === 0 ? String(Math.round(converted)) : converted.toFixed(decimals);
    }
    state.currencyCode = newCode;
  });

  const handleSubmit$ = $(async () => {
    const val = parseFloat(state.balance);
    if (!state.name.trim() || isNaN(val)) {
      return;
    }

    state.loading = true;

    const primaryType = state.types.length > 0 ? state.types[0] : 'checking';

    try {
      if (editAccount) {
        // If currency changed, convert all transactions belonging to this account
        if (state.currencyCode !== editAccount.currencyCode) {
          const txs = await db.transactions.where('accountId').equals(editAccount.id!).toArray();
          const decimals = getCurrencyDecimals(state.currencyCode);
          for (const tx of txs) {
            const convertedAmt = convertCurrency(tx.amount, editAccount.currencyCode, state.currencyCode, state.rates);
            const roundedAmt = decimals === 0 ? Math.round(convertedAmt) : Math.round(convertedAmt * 100) / 100;
            await db.transactions.update(tx.id!, {
              amount: roundedAmt,
            });
          }
        }

        await db.accounts.update(editAccount.id!, {
          name: state.name.trim(),
          type: primaryType,
          types: state.types,
          currencyCode: state.currencyCode,
          balance: val,
          color: state.color,
          iconSvg: state.iconSvg,
        });
      } else {
        await db.accounts.add({
          name: state.name.trim(),
          type: primaryType,
          types: state.types,
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
              placeholder={t(lang, 'accounts.name_placeholder')}
              class="w-full text-sm font-semibold text-slate-800 px-4 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/20"
            />
          </div>

          {/* Types (Multi-selection) */}
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold text-amber-900">
                {t(lang, 'accounts.types_label')}
              </label>
              <span class="text-[11px] font-medium text-amber-700/80">
                {t(lang, 'accounts.types_hint')}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              {ACCOUNT_TYPE_OPTIONS.map((opt) => {
                const isSelected = state.types.includes(opt.type);
                return (
                  <button
                    type="button"
                    key={opt.type}
                    onClick$={() => handleToggleType$(opt.type)}
                    class={`relative flex items-center gap-2 p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-100/70 text-amber-950 font-black shadow-xs'
                        : 'border-amber-100 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50/30'
                    }`}
                  >
                    <div
                      class={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-amber-400 text-amber-950' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <SvgIcon name={opt.icon} size={14} />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-bold truncate leading-tight">
                        {t(lang, opt.labelKey)}
                      </div>
                    </div>
                    {isSelected && (
                      <div class="w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shrink-0">
                        <SvgIcon name="check" size={10} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
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
                onChange$={(e: any) => handleCurrencyChange$(e.target.value)}
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

            {editAccount && state.currencyCode !== editAccount.currencyCode && (
              <div class="col-span-2 bg-amber-50 rounded-2xl p-3 border border-amber-200 text-[11px] font-bold text-amber-900 flex items-center gap-2">
                <SvgIcon name="info" size={16} class="text-amber-600 shrink-0" />
                <span>{t(lang, 'accounts.convert_transactions_tip')}</span>
              </div>
            )}
          </div>


          {/* Color Picker */}
          <div>
            <label class="block text-xs font-bold text-amber-900 mb-1">
              {t(lang, 'common.color')}
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
              {t(lang, 'common.icon')}
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
