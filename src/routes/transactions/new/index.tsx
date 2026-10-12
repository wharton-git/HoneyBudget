import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, useNavigate, type DocumentHead } from '@builder.io/qwik-city';
import { useI18n, t } from '../../../i18n/context';
import { SvgIcon } from '../../../components/icons/SvgIcon';
import { HoneyDateTimePicker } from '../../../components/common/HoneyDateTimePicker';
import { db, type Account, type Category, type Transaction, isCashOnlyAccount } from '../../../db';
import {
  SUPPORTED_CURRENCIES,
  convertCurrency,
  getCurrencyDecimals,
  formatMoney,
} from '../../../services/currency/ratesService';

export default component$(() => {
  const { lang } = useI18n();
  const loc = useLocation();
  const nav = useNavigate();

  const state = useStore({
    editTxId: 0,
    type: 'expense' as 'expense' | 'income' | 'transfer',
    isGroup: false,
    groupItems: [] as Array<{ id: string; name: string; amount: string; quantity: string }>,
    accountId: 0,
    targetAccountId: 0,
    categoryId: 0,
    amount: '',
    fee: '',
    currencyCode: 'EUR',
    rates: {} as Record<string, number>,
    date: '',
    label: '',
    notes: '',
    accounts: [] as Account[],
    categories: [] as Category[],
    loading: false,
    errorMessage: '',
    ready: false,
  });

  const recomputeGroupTotal$ = $(() => {
    let sum = 0;
    for (const it of state.groupItems) {
      const price = parseFloat(it.amount);
      const qty = parseInt(it.quantity, 10);
      if (!isNaN(price) && price > 0) {
        sum += price * (isNaN(qty) || qty <= 0 ? 1 : qty);
      }
    }
    state.amount = sum > 0 ? String(sum) : '';
  });

  const handleAddItem$ = $(() => {
    state.groupItems.push({
      id: String(Date.now() + Math.random()),
      name: '',
      amount: '',
      quantity: '1',
    });
  });

  const handleRemoveItem$ = $((index: number) => {
    state.groupItems.splice(index, 1);
    recomputeGroupTotal$();
  });

  const handleAccountChange$ = $((accId: number) => {
    const oldAcc = state.accounts.find((a) => a.id === state.accountId);
    const newAcc = state.accounts.find((a) => a.id === accId);
    state.accountId = accId;
    if (newAcc && oldAcc && state.currencyCode === oldAcc.currencyCode) {
      state.currencyCode = newAcc.currencyCode;
    }
    if (isCashOnlyAccount(newAcc)) {
      state.fee = '0';
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    const settings = await db.settings.get('current');
    state.rates = settings?.rates || {};

    const accounts = await db.accounts.toArray();
    state.accounts = accounts;
    state.categories = await db.categories.toArray();

    const idParam = loc.url.searchParams.get('id');
    const txId = idParam ? parseInt(idParam, 10) : 0;

    let editTransaction: Transaction | undefined;
    if (txId && !isNaN(txId)) {
      editTransaction = await db.transactions.get(txId);
    }

    if (editTransaction) {
      state.editTxId = editTransaction.id!;
      state.type = editTransaction.type;
      state.isGroup = !!editTransaction.isGroup;
      if (editTransaction.isGroup && editTransaction.items && editTransaction.items.length > 0) {
        state.groupItems = editTransaction.items.map((it, idx) => ({
          id: it.id || String(idx + 1),
          name: it.name,
          amount: String(it.amount),
          quantity: String(it.quantity || 1),
        }));
      } else {
        state.groupItems = [
          { id: '1', name: editTransaction.label, amount: String(editTransaction.amount), quantity: '1' },
        ];
      }
      state.accountId = editTransaction.accountId;
      state.targetAccountId = editTransaction.targetAccountId || 0;
      state.categoryId = editTransaction.categoryId;
      state.amount = String(editTransaction.amount);
      state.fee = editTransaction.fee ? String(editTransaction.fee) : '';
      const acc = accounts.find((a) => a.id === editTransaction.accountId);
      state.currencyCode = acc?.currencyCode || settings?.baseCurrency || 'EUR';
      state.date = editTransaction.date;
      state.label = editTransaction.label;
      state.notes = editTransaction.notes || '';
    } else {
      state.editTxId = 0;
      state.type = 'expense';
      state.isGroup = false;
      state.groupItems = [
        { id: '1', name: '', amount: '', quantity: '1' },
      ];
      state.amount = '';
      state.fee = '';
      state.label = '';
      state.notes = '';

      const now = new Date();
      const datePart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const timePart = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      state.date = `${datePart} ${timePart}`;

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

    state.ready = true;
  });

  const handleSubmit$ = $(async () => {
    state.errorMessage = '';

    if (state.isGroup) {
      let sum = 0;
      for (const it of state.groupItems) {
        const price = parseFloat(it.amount);
        const qty = parseInt(it.quantity, 10);
        if (!isNaN(price) && price > 0) {
          sum += price * (isNaN(qty) || qty <= 0 ? 1 : qty);
        }
      }
      state.amount = sum > 0 ? String(sum) : '';
    }

    const rawVal = parseFloat(state.amount);
    if (isNaN(rawVal) || rawVal <= 0) {
      state.errorMessage = t(lang, 'tx.error_amount');
      return;
    }
    if (!state.label.trim()) {
      state.errorMessage = t(lang, 'tx.error_label');
      return;
    }
    if (!state.accountId) {
      state.errorMessage = t(lang, 'tx.error_account');
      return;
    }
    if (state.type === 'transfer' && state.accountId === state.targetAccountId) {
      state.errorMessage = t(lang, 'tx.error_same_account');
      return;
    }

    state.loading = true;

    try {
      const selectedAccount = await db.accounts.get(state.accountId);
      if (!selectedAccount) {
        state.errorMessage = t(lang, 'tx.error_account_not_found');
        state.loading = false;
        return;
      }

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
      if (state.editTxId > 0) {
        const prevTx = await db.transactions.get(state.editTxId);
        if (prevTx) {
          const prevAcc = await db.accounts.get(prevTx.accountId);
          const prevFee = prevTx.fee || 0;
          if (prevAcc) {
            if (prevTx.type === 'expense') {
              await db.accounts.update(prevAcc.id!, { balance: prevAcc.balance + (prevTx.amount + prevFee) });
            } else if (prevTx.type === 'income') {
              await db.accounts.update(prevAcc.id!, { balance: prevAcc.balance - (prevTx.amount - prevFee) });
            } else if (prevTx.type === 'transfer' && prevTx.targetAccountId) {
              const prevTarget = await db.accounts.get(prevTx.targetAccountId);
              await db.accounts.update(prevAcc.id!, { balance: prevAcc.balance + (prevTx.amount + prevFee) });
              if (prevTarget) {
                const prevTargetVal = convertCurrency(prevTx.amount, prevAcc.currencyCode, prevTarget.currencyCode, state.rates);
                const dec = getCurrencyDecimals(prevTarget.currencyCode);
                const roundedPrev = dec === 0 ? Math.round(prevTargetVal) : Math.round(prevTargetVal * 100) / 100;
                await db.accounts.update(prevTarget.id!, { balance: prevTarget.balance - roundedPrev });
              }
            }
          }
        }
      }

      const fee = selectedAccount && !isCashOnlyAccount(selectedAccount) && !isNaN(parseFloat(state.fee)) ? Math.max(0, parseFloat(state.fee)) : 0;

      const groupItemsToSave = state.isGroup
        ? state.groupItems
            .filter((it) => it.name.trim() || (parseFloat(it.amount) || 0) > 0)
            .map((it, idx) => ({
              id: it.id || String(idx + 1),
              name: it.name.trim() || `Article ${idx + 1}`,
              amount: parseFloat(it.amount) || 0,
              quantity: parseInt(it.quantity, 10) || 1,
            }))
        : undefined;

      const cleanItems = groupItemsToSave ? JSON.parse(JSON.stringify(groupItemsToSave)) : undefined;

      // Apply new / updated transaction
      if (state.editTxId === 0) {
        await db.transactions.add({
          accountId: state.accountId,
          targetAccountId: state.type === 'transfer' ? state.targetAccountId : undefined,
          categoryId: state.categoryId,
          amount: val,
          fee: fee > 0 ? fee : undefined,
          date: state.date,
          label: state.label.trim(),
          notes: notes || undefined,
          type: state.type,
          isGroup: state.isGroup,
          items: cleanItems,
        });
      } else {
        await db.transactions.update(state.editTxId, {
          accountId: state.accountId,
          targetAccountId: state.type === 'transfer' ? state.targetAccountId : undefined,
          categoryId: state.categoryId,
          amount: val,
          fee: fee > 0 ? fee : undefined,
          date: state.date,
          label: state.label.trim(),
          notes: notes || undefined,
          type: state.type,
          isGroup: state.isGroup,
          items: cleanItems,
        });
      }

      // Apply new balance delta (including fee for non-cash accounts)
      const updatedAcc = await db.accounts.get(state.accountId);
      if (updatedAcc) {
        if (state.type === 'expense') {
          await db.accounts.update(state.accountId, {
            balance: updatedAcc.balance - (val + fee),
          });
        } else if (state.type === 'income') {
          await db.accounts.update(state.accountId, {
            balance: updatedAcc.balance + (val - fee),
          });
        } else if (state.type === 'transfer') {
          const targetAccount = await db.accounts.get(state.targetAccountId);
          if (targetAccount) {
            await db.accounts.update(state.accountId, {
              balance: updatedAcc.balance - (val + fee),
            });
            const targetVal = convertCurrency(val, updatedAcc.currencyCode, targetAccount.currencyCode, state.rates);
            const dec = getCurrencyDecimals(targetAccount.currencyCode);
            const roundedVal = dec === 0 ? Math.round(targetVal) : Math.round(targetVal * 100) / 100;
            await db.accounts.update(state.targetAccountId, {
              balance: targetAccount.balance + roundedVal,
            });
          }
        }
      }

      await nav('/transactions/');
    } catch (e: any) {
      console.error(e);
      state.errorMessage = e?.message || 'Une erreur est survenue lors de l\'enregistrement.';
    } finally {
      state.loading = false;
    }
  });

  const currentAccount = state.accounts.find((a) => a.id === state.accountId);
  const isEditing = state.editTxId > 0;

  return (
    <div class="max-w-2xl mx-auto space-y-5 pb-8">
      {/* Top Navigation Bar */}
      <div class="flex items-center justify-between">
        <a
          href="/transactions/"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-colors"
        >
          <SvgIcon name="chevron-left" size={16} />
          <span>{t(lang, 'tx.back_to_list')}</span>
        </a>

        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-2xl bg-amber-200 text-amber-950 flex items-center justify-center shadow-2xs">
            <SvgIcon name={isEditing ? 'edit' : 'plus'} size={16} />
          </div>
          <h2 class="text-lg font-black text-amber-950">
            {isEditing ? t(lang, 'tx.edit') : t(lang, 'tx.new')}
          </h2>
        </div>
      </div>

      {/* Main Form Card */}
      <div class="bg-white rounded-3xl border-2 border-amber-200/80 shadow-sm p-5 sm:p-7 space-y-6">
        {/* Error notification if any */}
        {state.errorMessage && (
          <div class="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-center gap-2">
            <SvgIcon name="info" size={16} class="text-rose-600 shrink-0" />
            <span>{state.errorMessage}</span>
          </div>
        )}

        {/* 1. Type Selector Pills */}
        <div>
          <label class="block text-xs font-bold text-amber-900 mb-2">
            {t(lang, 'tx.type')}
          </label>
          <div class="grid grid-cols-3 gap-2 p-1.5 bg-amber-50 rounded-2xl border border-amber-200">
            <button
              type="button"
              onClick$={() => {
                state.type = 'expense';
              }}
              class={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                state.type === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs font-black'
                  : 'text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              <SvgIcon name="arrow-down" size={14} />
              <span>{t(lang, 'tx.type.expense')}</span>
            </button>

            <button
              type="button"
              onClick$={() => {
                state.type = 'income';
                state.isGroup = false;
              }}
              class={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                state.type === 'income'
                  ? 'bg-emerald-500 text-white shadow-xs font-black'
                  : 'text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              <SvgIcon name="arrow-up" size={14} />
              <span>{t(lang, 'tx.type.income')}</span>
            </button>

            <button
              type="button"
              onClick$={() => {
                state.type = 'transfer';
                state.isGroup = false;
              }}
              class={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                state.type === 'transfer'
                  ? 'bg-sky-500 text-white shadow-xs font-black'
                  : 'text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              <SvgIcon name="swap" size={14} />
              <span>{t(lang, 'tx.type.transfer')}</span>
            </button>
          </div>
        </div>

        {/* 2. Sub-toggle inside Dépense: Achat individuel vs Achat groupé */}
        {state.type === 'expense' && (
          <div class="flex items-center p-1 bg-amber-100/70 rounded-2xl border border-amber-200">
            <button
              type="button"
              onClick$={() => (state.isGroup = false)}
              class={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !state.isGroup
                  ? 'bg-white text-amber-950 shadow-xs font-black'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              <SvgIcon name="coin" size={14} class="text-amber-600" />
              <span>{t(lang, 'tx.single_purchase')}</span>
            </button>

            <button
              type="button"
              onClick$={() => {
                state.isGroup = true;
                if (state.groupItems.length === 0) {
                  state.groupItems = [
                    { id: '1', name: state.label || '', amount: state.amount || '', quantity: '1' },
                  ];
                }
              }}
              class={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                state.isGroup
                  ? 'bg-amber-400 text-amber-950 shadow-xs font-black'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              <SvgIcon name="tag" size={14} class="text-amber-800" />
              <span>{t(lang, 'tx.grouped_purchase')}</span>
            </button>
          </div>
        )}

        {/* 3. Form fields according to selection */}
        {state.type === 'expense' && state.isGroup ? (
          /* Achat groupé mode */
          <div class="space-y-4 p-4 bg-amber-50/60 rounded-3xl border-2 border-amber-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center">
                  <SvgIcon name="tag" size={16} />
                </div>
                <div>
                  <span class="text-xs font-black text-amber-950 block">
                    {t(lang, 'tx.cart_title')}
                  </span>
                  <span class="text-[11px] font-semibold text-slate-500">
                    {state.groupItems.length} {t(lang, 'tx.cart_items_count')}
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-amber-900">{t(lang, 'accounts.currency')} :</span>
                <select
                  value={state.currencyCode}
                  onChange$={(e: any) => (state.currencyCode = e.target.value)}
                  class="text-xs font-black text-slate-800 px-3 py-1.5 rounded-xl border border-amber-300 bg-white cursor-pointer"
                >
                  {SUPPORTED_CURRENCIES.map((cur) => (
                    <option key={cur.code} value={cur.code}>
                      {`${cur.code} (${cur.symbol})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Group Title */}
            <div>
              <label class="block text-xs font-bold text-amber-900 mb-1">
                {t(lang, 'tx.label')}
              </label>
              <input
                type="text"
                value={state.label}
                onInput$={(e: any) => (state.label = e.target.value)}
                placeholder={t(lang, 'tx.label_placeholder')}
                class="w-full text-sm font-black text-slate-800 px-4 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white"
              />
            </div>

            {/* Items rows */}
            <div class="space-y-2 pt-1">
              <div class="grid grid-cols-12 gap-2 px-1 text-[10px] font-black uppercase text-amber-800/80">
                <div class="col-span-6 sm:col-span-7">{t(lang, 'tx.item_name')}</div>
                <div class="col-span-4 sm:col-span-3">{t(lang, 'tx.unit_price')}</div>
                <div class="col-span-2 sm:col-span-2 text-center">{t(lang, 'tx.qty')}</div>
              </div>

              {state.groupItems.map((item, idx) => (
                <div
                  key={item.id}
                  class="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs"
                >
                  <div class="col-span-6 sm:col-span-7">
                    <input
                      type="text"
                      value={item.name}
                      onInput$={(e: any) => {
                        item.name = e.target.value;
                      }}
                      placeholder={`Article ${idx + 1}`}
                      class="w-full text-xs font-bold text-slate-800 px-3 py-2 rounded-xl border border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/20"
                    />
                  </div>

                  <div class="col-span-4 sm:col-span-3">
                    <input
                      type="number"
                      step="any"
                      value={item.amount}
                      onInput$={(e: any) => {
                        item.amount = e.target.value;
                        recomputeGroupTotal$();
                      }}
                      placeholder="0.00"
                      class="w-full text-xs font-black text-amber-950 px-3 py-2 rounded-xl border border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/20"
                    />
                  </div>

                  <div class="col-span-2 sm:col-span-2 flex items-center gap-1 justify-end">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onInput$={(e: any) => {
                        item.quantity = e.target.value;
                        recomputeGroupTotal$();
                      }}
                      placeholder="1"
                      class="w-11 text-center text-xs font-bold text-slate-800 px-1 py-2 rounded-xl border border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/20"
                    />
                    {state.groupItems.length > 1 && (
                      <button
                        type="button"
                        onClick$={() => handleRemoveItem$(idx)}
                        class="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title={t(lang, 'common.delete')}
                      >
                        <SvgIcon name="trash" size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add item button & Live Total */}
            <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-amber-200">
              <button
                type="button"
                onClick$={handleAddItem$}
                class="px-4 py-2.5 rounded-xl border-2 border-dashed border-amber-400 hover:bg-amber-100 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <SvgIcon name="plus" size={14} />
                <span>{t(lang, 'tx.add_item')}</span>
              </button>

              <div class="bg-amber-100/90 px-4 py-2 rounded-2xl flex items-center justify-between sm:justify-end gap-3 text-xs font-black text-amber-950">
                <span class="text-amber-800 text-[11px]">{t(lang, 'tx.receipt_total')}</span>
                <span class="text-lg font-black text-amber-950">
                  {formatMoney(parseFloat(state.amount) || 0, state.currencyCode, lang === 'en' ? 'en-US' : 'fr-FR')}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Single purchase, income, or transfer mode */
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold text-amber-900">
                  {t(lang, 'tx.amount')}
                </label>
                <span class="text-[11px] font-semibold text-slate-500">
                  {t(lang, 'tx.input_currency')}
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
                    class="w-full text-2xl font-black text-amber-950 px-4 py-3 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/30"
                  />
                </div>
                <select
                  value={state.currencyCode}
                  onChange$={(e: any) => (state.currencyCode = e.target.value)}
                  class="text-xs font-black text-slate-800 px-3 py-3.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white cursor-pointer self-stretch"
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
                <div class="mt-2.5 bg-amber-50 rounded-2xl p-3 border border-amber-200 text-xs font-bold text-amber-900 flex items-center justify-between">
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
              <label class="block text-xs font-bold text-amber-900 mb-1.5">
                {t(lang, 'tx.label')}
              </label>
              <input
                type="text"
                value={state.label}
                onInput$={(e: any) => (state.label = e.target.value)}
                placeholder={t(lang, 'tx.label_placeholder')}
                class="w-full text-sm font-semibold text-slate-800 px-4 py-3 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/20"
              />
            </div>
          </div>
        )}

        {/* 4. Accounts & Category Selection */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-amber-900 mb-1.5">
              {state.type === 'transfer' ? t(lang, 'accounts.from_account') : t(lang, 'tx.account')}
            </label>
            <select
              value={state.accountId}
              onChange$={(e: any) => handleAccountChange$(parseInt(e.target.value, 10))}
              class="w-full text-sm font-semibold text-slate-800 px-3.5 py-3 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white cursor-pointer"
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
              <label class="block text-xs font-bold text-amber-900 mb-1.5">
                {t(lang, 'accounts.to_account')}
              </label>
              <select
                value={state.targetAccountId}
                onChange$={(e: any) => (state.targetAccountId = parseInt(e.target.value, 10))}
                class="w-full text-sm font-semibold text-slate-800 px-3.5 py-3 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white cursor-pointer"
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
              <label class="block text-xs font-bold text-amber-900 mb-1.5">
                {t(lang, 'tx.category')}
              </label>
              <select
                value={state.categoryId}
                onChange$={(e: any) => (state.categoryId = parseInt(e.target.value, 10))}
                class="w-full text-sm font-semibold text-slate-800 px-3.5 py-3 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white cursor-pointer"
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

        {/* 4.5 Frais de transaction (pour les comptes autres que le cash) */}
        {currentAccount && !isCashOnlyAccount(currentAccount) && (
          <div class="p-4 bg-amber-50/70 rounded-2xl border-2 border-amber-200/90 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center">
                  <SvgIcon name="tag" size={14} />
                </div>
                <div>
                  <span class="text-xs font-black text-amber-950 block">
                    {t(lang, 'tx.fees')}
                  </span>
                  <span class="text-[11px] font-medium text-slate-500">
                    {t(lang, 'tx.fees_deducted_from')} {currentAccount.name} ({currentAccount.currencyCode})
                  </span>
                </div>
              </div>

              {parseFloat(state.fee) > 0 && (
                <button
                  type="button"
                  onClick$={() => (state.fee = '0')}
                  class="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                >
                  {t(lang, 'tx.clear_fees')}
                </button>
              )}
            </div>

            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={state.fee}
                  onInput$={(e: any) => (state.fee = e.target.value)}
                  placeholder="0.00"
                  class="w-full text-base font-bold text-amber-950 px-3.5 py-2.5 rounded-xl border border-amber-200 focus:border-amber-400 focus:outline-none bg-white"
                />
              </div>
              <div class="px-3.5 py-2.5 bg-amber-100 rounded-xl text-xs font-black text-amber-900 shrink-0">
                {currentAccount.currencyCode}
              </div>
            </div>

            {/* Quick shortcuts for MGA accounts */}
            {currentAccount.currencyCode === 'MGA' && (
              <div class="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span class="text-[10px] font-bold text-slate-500 mr-1">{t(lang, 'tx.shortcuts')}</span>
                {[0, 100, 200, 300, 500, 1000, 1500, 2000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick$={() => (state.fee = String(preset))}
                    class={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      parseFloat(state.fee) === preset
                        ? 'bg-amber-400 text-amber-950 shadow-2xs font-black'
                        : 'bg-white border border-amber-200 text-amber-900 hover:bg-amber-100'
                    }`}
                  >
                    {preset === 0 ? '0' : `+${preset} Ar`}
                  </button>
                ))}
              </div>
            )}

            {/* Live summary computation */}
            {parseFloat(state.fee) > 0 && (
              <div class="pt-2 border-t border-amber-200/60 text-xs font-bold text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span class="text-amber-800 text-[11px]">
                  {state.type === 'expense'
                    ? t(lang, 'tx.total_debited')
                    : state.type === 'transfer'
                    ? t(lang, 'tx.total_debited_source')
                    : t(lang, 'tx.net_credited')}
                </span>
                <span class="font-black text-sm text-amber-950">
                  {formatMoney(
                    state.type === 'income'
                      ? Math.max(0, (parseFloat(state.amount) || 0) - (parseFloat(state.fee) || 0))
                      : (parseFloat(state.amount) || 0) + (parseFloat(state.fee) || 0),
                    currentAccount.currencyCode,
                    lang === 'en' ? 'en-US' : 'fr-FR'
                  )}
                </span>
              </div>
            )}
          </div>
        )}

        {/* 5. Date & Time Picker */}
        <HoneyDateTimePicker
          value={state.date}
          onChange$={$((newVal: string) => {
            state.date = newVal;
          })}
          label={t(lang, 'tx.date')}
        />

        {/* 6. Notes field */}
        <div>
          <label class="block text-xs font-bold text-amber-900 mb-1.5">
            {t(lang, 'tx.notes')}
          </label>
          <input
            type="text"
            value={state.notes}
            onInput$={(e: any) => (state.notes = e.target.value)}
            placeholder={t(lang, 'tx.notes_placeholder')}
            class="w-full text-sm text-slate-800 px-4 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white"
          />
        </div>

        {/* 7. Action buttons */}
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-amber-100">
          <a
            href="/transactions/"
            class="px-5 py-2.5 text-xs font-bold rounded-2xl text-amber-800 hover:bg-amber-100 transition-colors"
          >
            {t(lang, 'common.cancel')}
          </a>

          <button
            type="button"
            onClick$={handleSubmit$}
            disabled={state.loading}
            class="px-6 py-3 text-xs font-black rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <SvgIcon name="check" size={16} />
            <span>{t(lang, 'common.save')}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Opération - HoneyBudget',
  meta: [
    {
      name: 'description',
      content: 'Ajouter ou modifier une opération HoneyBudget',
    },
  ],
};
