import { component$, useStore, $, useVisibleTask$, type PropFunction } from '@builder.io/qwik';
import { useI18n, t } from '../../i18n/context';
import { SvgIcon } from '../icons/SvgIcon';
import { db, type Account, type Category, type Transaction } from '../../db';

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

    state.accounts = await db.accounts.toArray();
    state.categories = await db.categories.toArray();

    if (editTransaction) {
      state.type = editTransaction.type;
      state.accountId = editTransaction.accountId;
      state.targetAccountId = editTransaction.targetAccountId || 0;
      state.categoryId = editTransaction.categoryId;
      state.amount = String(editTransaction.amount);
      state.date = editTransaction.date;
      state.label = editTransaction.label;
      state.notes = editTransaction.notes || '';
    } else {
      state.type = 'expense';
      state.amount = '';
      state.label = '';
      state.notes = '';
      state.date = new Date().toISOString().split('T')[0];
      if (state.accounts.length > 0) {
        state.accountId = state.accounts[0].id!;
        state.targetAccountId = state.accounts.length > 1 ? state.accounts[1].id! : state.accounts[0].id!;
      }
      if (state.categories.length > 0) {
        state.categoryId = state.categories[0].id!;
      }
    }
  });

  const handleSubmit$ = $(async () => {
    const val = parseFloat(state.amount);
    if (isNaN(val) || val <= 0 || !state.label.trim() || !state.accountId) {
      return;
    }

    state.loading = true;

    try {
      const selectedAccount = await db.accounts.get(state.accountId);
      if (!selectedAccount) return;

      // Handle balance delta
      if (!editTransaction) {
        // Add new
        await db.transactions.add({
          accountId: state.accountId,
          targetAccountId: state.type === 'transfer' ? state.targetAccountId : undefined,
          categoryId: state.categoryId,
          amount: val,
          date: state.date,
          label: state.label.trim(),
          notes: state.notes.trim() || undefined,
          type: state.type,
        });

        if (state.type === 'expense') {
          await db.accounts.update(state.accountId, {
            balance: selectedAccount.balance - val,
          });
        } else if (state.type === 'income') {
          await db.accounts.update(state.accountId, {
            balance: selectedAccount.balance + val,
          });
        } else if (state.type === 'transfer') {
          const targetAccount = await db.accounts.get(state.targetAccountId);
          if (targetAccount) {
            await db.accounts.update(state.accountId, {
              balance: selectedAccount.balance - val,
            });
            await db.accounts.update(state.targetAccountId, {
              balance: targetAccount.balance + val,
            });
          }
        }
      } else {
        // Edit existing
        await db.transactions.update(editTransaction.id!, {
          accountId: state.accountId,
          targetAccountId: state.type === 'transfer' ? state.targetAccountId : undefined,
          categoryId: state.categoryId,
          amount: val,
          date: state.date,
          label: state.label.trim(),
          notes: state.notes.trim() || undefined,
          type: state.type,
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

  const currentAccount = state.accounts.find((a) => a.id === state.accountId);
  const currencySymbol = currentAccount?.currencyCode || 'EUR';

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
          {/* Amount */}
          <div>
            <label class="block text-xs font-bold text-amber-900 mb-1">
              {t(lang, 'tx.amount')} ({currencySymbol})
            </label>
            <div class="relative">
              <input
                type="number"
                step="any"
                value={state.amount}
                onInput$={(e: any) => (state.amount = e.target.value)}
                placeholder="0.00"
                class="w-full text-2xl font-black text-amber-950 px-4 py-3 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/30"
              />
            </div>
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
                onChange$={(e: any) => (state.accountId = parseInt(e.target.value, 10))}
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
