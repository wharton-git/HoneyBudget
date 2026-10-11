import { component$, useStore, $, useVisibleTask$, type PropFunction } from '@builder.io/qwik';
import { useI18n, t } from '../../i18n/context';
import { SvgIcon } from '../icons/SvgIcon';
import { db, type Account, type Category, type Transaction } from '../../db';
import {
  SUPPORTED_CURRENCIES,
  convertCurrency,
  getCurrencyDecimals,
  formatMoney,
} from '../../services/currency/ratesService';

interface TransactionModalProps {
  isOpen: boolean;
  onClose$: PropFunction<() => void>;
  onSaved$: PropFunction<() => void>;
  editTransaction?: Transaction | null;
}

export const TransactionModal = component$<TransactionModalProps>(({ isOpen, onClose$, onSaved$, editTransaction }) => {
  const { lang } = useI18n();

  const state = useStore({
    type: 'expense' as 'expense' | 'income' | 'transfer',
    accountId: 0,
    targetAccountId: 0,
    categoryId: 0,
    amount: '',
    currencyCode: 'EUR',
    rates: {} as Record<string, number>,
    date: new Date().toISOString().split('T')[0],
    label: '',
    notes: '',
    accounts: [] as Account[],
    categories: [] as Category[],
    loading: false,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => isOpen);
    if (!isOpen) return;

    const settings = await db.settings.get('current');
    state.rates = settings?.rates || {};

    const accounts = await db.accounts.toArray();
    state.accounts = accounts;
    state.categories = await db.categories.toArray();

    if (editTransaction) {
      state.type = editTransaction.type;
      state.accountId = editTransaction.accountId;
      state.targetAccountId = editTransaction.targetAccountId || 0;
      state.categoryId = editTransaction.categoryId;
      state.amount = String(editTransaction.amount);
      const acc = accounts.find((a) => a.id === editTransaction.accountId);
      state.currencyCode = acc?.currencyCode || settings?.baseCurrency || 'EUR';
      state.date = editTransaction.date;
      state.label = editTransaction.label;
      state.notes = editTransaction.notes || '';
    } else {
      state.type = 'expense';
      state.amount = '';
      state.label = '';
      state.notes = '';
      state.date = new Date().toISOString().split('T')[0];
      if (accounts.length > 0) {
        state.accountId = accounts[0].id!;
        state.currencyCode = accounts[0].currencyCode;
        state.targetAccountId = accounts.length > 1 ? accounts[1].id! : accounts[0].id!;
      } else {
        state.currencyCode = settings?.baseCurrency || 'EUR';
      }
      if (state.categories.length > 0) {
        state.categoryId = state.categories[0].id!;
      }
    }
  });

  const handleAccountChange$ = $((accId: number) => {
    const oldAcc = state.accounts.find((a) => a.id === state.accountId);
    const newAcc = state.accounts.find((a) => a.id === accId);
    state.accountId = accId;
    if (newAcc && oldAcc && state.currencyCode === oldAcc.currencyCode) {
      state.currencyCode = newAcc.currencyCode;
    }
  });

  const handleSubmit$ = $(async () => {
    const rawVal = parseFloat(state.amount);
    if (isNaN(rawVal) || rawVal <= 0 || !state.label.trim() || !state.accountId) {
      return;
    }

    state.loading = true;

    try {
      const selectedAccount = await db.accounts.get(state.accountId);
      if (!selectedAccount) return;

      // Convert rawVal to account's native currency if different
      let val = rawVal;
      let notes = state.notes.trim();

      if (state.currencyCode !== selectedAccount.currencyCode) {
        const convertedVal = convertCurrency(rawVal, state.currencyCode, selectedAccount.currencyCode, state.rates);
        const decimals = getCurrencyDecimals(selectedAccount.currencyCode);
        val = decimals === 0 ? Math.round(convertedVal) : Math.round(convertedVal * 100) / 100;

        const noteAddition = `(${rawVal} ${state.currencyCode})`;
        if (!notes.includes(noteAddition)) {
          notes = notes ? `${notes} ${noteAddition}` : noteAddition;
        }
      }

      // Revert previous transaction impact if editing
      if (editTransaction) {
        const prevAcc = await db.accounts.get(editTransaction.accountId);
        if (prevAcc) {
          if (editTransaction.type === 'expense') {
            await db.accounts.update(prevAcc.id!, { balance: prevAcc.balance + editTransaction.amount });
          } else if (editTransaction.type === 'income') {
            await db.accounts.update(prevAcc.id!, { balance: prevAcc.balance - editTransaction.amount });
          } else if (editTransaction.type === 'transfer' && editTransaction.targetAccountId) {
            const prevTarget = await db.accounts.get(editTransaction.targetAccountId);
            await db.accounts.update(prevAcc.id!, { balance: prevAcc.balance + editTransaction.amount });
            if (prevTarget) {
              await db.accounts.update(prevTarget.id!, { balance: prevTarget.balance - editTransaction.amount });
            }
          }
        }
      }

      // Apply new / updated transaction
      if (!editTransaction) {
        await db.transactions.add({
          accountId: state.accountId,
          targetAccountId: state.type === 'transfer' ? state.targetAccountId : undefined,
          categoryId: state.categoryId,
          amount: val,
          date: state.date,
          label: state.label.trim(),
          notes: notes || undefined,
          type: state.type,
        });
      } else {
        await db.transactions.update(editTransaction.id!, {
          accountId: state.accountId,
          targetAccountId: state.type === 'transfer' ? state.targetAccountId : undefined,
          categoryId: state.categoryId,
          amount: val,
          date: state.date,
          label: state.label.trim(),
          notes: notes || undefined,
          type: state.type,
        });
      }

      // Apply new balance delta
      const updatedAcc = await db.accounts.get(state.accountId);
      if (updatedAcc) {
        if (state.type === 'expense') {
          await db.accounts.update(state.accountId, {
            balance: updatedAcc.balance - val,
          });
        } else if (state.type === 'income') {
          await db.accounts.update(state.accountId, {
            balance: updatedAcc.balance + val,
          });
        } else if (state.type === 'transfer') {
          const targetAccount = await db.accounts.get(state.targetAccountId);
          if (targetAccount) {
            await db.accounts.update(state.accountId, {
              balance: updatedAcc.balance - val,
            });
            await db.accounts.update(state.targetAccountId, {
              balance: targetAccount.balance + val,
            });
          }
        }
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

  const currentAccount = state.accounts.find((a) => a.id === state.accountId);


  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-xs">
      <div class="bg-white rounded-3xl border-2 border-amber-200/80 shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div class="flex items-center justify-between pb-3 border-b border-amber-100">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <SvgIcon name="honey-pot" size={20} />
            </div>
            <h3 class="text-lg font-black text-amber-950">
              {editTransaction ? t(lang, 'tx.edit') : t(lang, 'tx.new')}
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

        {/* Type selector pill buttons */}
        <div class="grid grid-cols-3 gap-2 mt-4 p-1 bg-amber-50 rounded-2xl border border-amber-200">
          <button
            type="button"
            onClick$={() => (state.type = 'expense')}
            class={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              state.type === 'expense'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            <SvgIcon name="arrow-down" size={14} />
            <span>{t(lang, 'tx.type.expense')}</span>
          </button>

          <button
            type="button"
            onClick$={() => (state.type = 'income')}
            class={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              state.type === 'income'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            <SvgIcon name="arrow-up" size={14} />
            <span>{t(lang, 'tx.type.income')}</span>
          </button>

          <button
            type="button"
            onClick$={() => (state.type = 'transfer')}
            class={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              state.type === 'transfer'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            <SvgIcon name="swap" size={14} />
            <span>{t(lang, 'tx.type.transfer')}</span>
          </button>
        </div>

        {/* Form */}
        <div class="space-y-4 mt-5">
          {/* Amount & Currency */}
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold text-amber-900">
                {t(lang, 'tx.amount')}
              </label>
              <span class="text-[11px] font-semibold text-slate-500">
                Devise de saisie
              </span>
            </div>

            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <input
                  type="number"
                  step="any"
                  value={state.amount}
                  onInput$={(e: any) => (state.amount = e.target.value)}
                  placeholder="0.00"
                  class="w-full text-2xl font-black text-amber-950 px-4 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/30"
                />
              </div>
              <select
                value={state.currencyCode}
                onChange$={(e: any) => (state.currencyCode = e.target.value)}
                class="text-xs font-black text-slate-800 px-3 py-3 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white cursor-pointer self-stretch"
              >
                {SUPPORTED_CURRENCIES.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {`${cur.code} (${cur.symbol})`}
                  </option>
                ))}

              </select>
            </div>

            {/* Live conversion preview if different from account's currency */}
            {currentAccount && state.currencyCode !== currentAccount.currencyCode && !isNaN(parseFloat(state.amount)) && parseFloat(state.amount) > 0 && (
              <div class="mt-2 bg-amber-50 rounded-2xl p-2.5 border border-amber-200 text-xs font-bold text-amber-900 flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <SvgIcon name="swap" size={14} class="text-amber-600" />
                  <span>{t(lang, 'tx.converted_preview')} ({currentAccount.name}) :</span>
                </div>
                <span class="text-amber-950 font-black">
                  {formatMoney(
                    convertCurrency(parseFloat(state.amount), state.currencyCode, currentAccount.currencyCode, state.rates),
                    currentAccount.currencyCode,
                    lang === 'en' ? 'en-US' : 'fr-FR'
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label class="block text-xs font-bold text-amber-900 mb-1">
              {t(lang, 'tx.label')}
            </label>
            <input
              type="text"
              value={state.label}
              onInput$={(e: any) => (state.label = e.target.value)}
              placeholder="Ex: Courses au marché, Restaurant, Salaire..."
              class="w-full text-sm font-semibold text-slate-800 px-4 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/20"
            />
          </div>

          {/* Account Selection */}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-amber-900 mb-1">
                {state.type === 'transfer' ? t(lang, 'accounts.from_account') : t(lang, 'tx.account')}
              </label>
              <select
                value={state.accountId}
                onChange$={(e: any) => handleAccountChange$(parseInt(e.target.value, 10))}
                class="w-full text-sm font-semibold text-slate-800 px-3 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white"
              >

                {state.accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {`${a.name} (${a.currencyCode})`}
                  </option>
                ))}
              </select>
            </div>

            {state.type === 'transfer' ? (
              <div>
                <label class="block text-xs font-bold text-amber-900 mb-1">
                  {t(lang, 'accounts.to_account')}
                </label>
                <select
                  value={state.targetAccountId}
                  onChange$={(e: any) => (state.targetAccountId = parseInt(e.target.value, 10))}
                  class="w-full text-sm font-semibold text-slate-800 px-3 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white"
                >
                  {state.accounts
                    .filter((a) => a.id !== state.accountId)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {`${a.name} (${a.currencyCode})`}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <div>
                <label class="block text-xs font-bold text-amber-900 mb-1">
                  {t(lang, 'tx.category')}
                </label>
                <select
                  value={state.categoryId}
                  onChange$={(e: any) => (state.categoryId = parseInt(e.target.value, 10))}
                  class="w-full text-sm font-semibold text-slate-800 px-3 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white"
                >
                  {state.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {t(lang, c.nameKey as any) || c.nameKey}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label class="block text-xs font-bold text-amber-900 mb-1">
              {t(lang, 'tx.date')}
            </label>
            <input
              type="date"
              value={state.date}
              onInput$={(e: any) => (state.date = e.target.value)}
              class="w-full text-sm font-semibold text-slate-800 px-4 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white"
            />
          </div>

          {/* Notes */}
          <div>
            <label class="block text-xs font-bold text-amber-900 mb-1">
              {t(lang, 'tx.notes')}
            </label>
            <input
              type="text"
              value={state.notes}
              onInput$={(e: any) => (state.notes = e.target.value)}
              placeholder="Facultatif..."
              class="w-full text-sm text-slate-800 px-4 py-2 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white"
            />
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
