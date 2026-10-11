import { component$, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useI18n, t } from '../../i18n/context';
import { SvgIcon } from '../../components/icons/SvgIcon';
import { db, type Account, type Category, type Transaction } from '../../db';
import { formatMoney, convertCurrency, getCurrencyDecimals } from '../../services/currency/ratesService';

export default component$(() => {
  const { lang } = useI18n();

  const state = useStore({
    transactions: [] as Transaction[],
    accounts: [] as Account[],
    categories: [] as Category[],
    baseCurrency: 'EUR',
    rates: {} as Record<string, number>,
    filterType: 'all' as 'all' | 'expense' | 'income' | 'transfer',
    searchQuery: '',
    selectedAccountId: 0,
    expandedGroupIds: [] as number[],
    selectedTxIds: [] as number[],
    isMultiSelectMode: false,
  });

  const loadData$ = $(async () => {
    const settings = await db.settings.get('current');
    state.baseCurrency = settings?.baseCurrency || 'EUR';
    state.rates = settings?.rates || {};

    state.accounts = await db.accounts.toArray();
    state.categories = await db.categories.toArray();

    const txs = await db.transactions.toArray();
    txs.sort((a, b) => b.date.localeCompare(a.date) || (b.id || 0) - (a.id || 0));
    state.transactions = txs;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    loadData$();

    const onCurrencyChanged = () => {
      loadData$();
    };
    window.addEventListener('honey_currency_changed', onCurrencyChanged);
    cleanup(() => {
      window.removeEventListener('honey_currency_changed', onCurrencyChanged);
    });
  });

  const handleToggleExpand$ = $((txId: number) => {
    if (state.expandedGroupIds.includes(txId)) {
      state.expandedGroupIds = state.expandedGroupIds.filter((id) => id !== txId);
    } else {
      state.expandedGroupIds = [...state.expandedGroupIds, txId];
    }
  });

  const handleToggleSelect$ = $((txId: number) => {
    if (state.selectedTxIds.includes(txId)) {
      state.selectedTxIds = state.selectedTxIds.filter((id) => id !== txId);
    } else {
      state.selectedTxIds = [...state.selectedTxIds, txId];
    }
  });

  const handleUngroup$ = $(async (tx: Transaction) => {
    if (!tx.items || tx.items.length === 0) return;
    if (confirm(`Dégrouper "${tx.label}" en ${tx.items.length} opérations individuelles ?`)) {
      await db.transactions.delete(tx.id!);

      for (const item of tx.items) {
        const itemTotal = item.amount * (item.quantity && item.quantity > 1 ? item.quantity : 1);
        await db.transactions.add({
          accountId: tx.accountId,
          categoryId: tx.categoryId,
          amount: itemTotal,
          date: tx.date,
          label: `${tx.label} - ${item.name}`,
          type: tx.type,
          isGroup: false,
        });
      }

      await loadData$();
    }
  });

  const handleGroupSelected$ = $(async () => {
    if (state.selectedTxIds.length < 2) return;
    const toGroup = state.transactions.filter((tx) => state.selectedTxIds.includes(tx.id!));
    if (toGroup.length === 0) return;

    const firstAcc = toGroup[0].accountId;
    const sameAcc = toGroup.every((t) => t.accountId === firstAcc);
    if (!sameAcc) {
      alert('Veuillez sélectionner des opérations du même compte pour les grouper.');
      return;
    }

    const title = prompt('Titre du groupe d\'achats (ex: Score, Super U, Sortie restaurant) :', 'Achat groupé');
    if (!title || !title.trim()) return;

    const totalAmount = toGroup.reduce((sum, t) => sum + t.amount, 0);
    const items = toGroup.map((t, idx) => ({
      id: String(idx + 1),
      name: t.label,
      amount: t.amount,
      quantity: 1,
    }));

    await db.transactions.add({
      accountId: firstAcc,
      categoryId: toGroup[0].categoryId,
      amount: totalAmount,
      date: toGroup[0].date,
      label: title.trim(),
      type: toGroup[0].type,
      isGroup: true,
      items,
    });

    for (const t of toGroup) {
      await db.transactions.delete(t.id!);
    }

    state.selectedTxIds = [];
    state.isMultiSelectMode = false;
    await loadData$();
  });


  const handleDelete$ = $(async (tx: Transaction) => {
    if (confirm('Voulez-vous supprimer cette opération ?')) {
      await db.transactions.delete(tx.id!);
      // Revert account balance
      const acc = await db.accounts.get(tx.accountId);
      if (acc) {
        if (tx.type === 'expense') {
          await db.accounts.update(acc.id!, { balance: acc.balance + tx.amount });
        } else if (tx.type === 'income') {
          await db.accounts.update(acc.id!, { balance: acc.balance - tx.amount });
        } else if (tx.type === 'transfer' && tx.targetAccountId) {
          const target = await db.accounts.get(tx.targetAccountId);
          await db.accounts.update(acc.id!, { balance: acc.balance + tx.amount });
          if (target) {
            const targetVal = convertCurrency(tx.amount, acc.currencyCode, target.currencyCode, state.rates);
            const dec = getCurrencyDecimals(target.currencyCode);
            const roundedVal = dec === 0 ? Math.round(targetVal) : Math.round(targetVal * 100) / 100;
            await db.accounts.update(target.id!, { balance: target.balance - roundedVal });
          }
        }
      }
      await loadData$();
    }
  });

  const getAccount = (id: number) => state.accounts.find((a) => a.id === id);
  const getCategory = (id: number) => state.categories.find((c) => c.id === id);

  const filteredTransactions = state.transactions.filter((tx) => {
    if (state.filterType !== 'all' && tx.type !== state.filterType) return false;
    if (state.selectedAccountId !== 0 && tx.accountId !== state.selectedAccountId) return false;
    if (state.searchQuery.trim().length > 0) {
      const q = state.searchQuery.toLowerCase();
      const matchLabel = tx.label.toLowerCase().includes(q);
      const matchNotes = tx.notes ? tx.notes.toLowerCase().includes(q) : false;
      return matchLabel || matchNotes;
    }
    return true;
  });

  return (
    <div class="space-y-6">
      {/* Top bar */}
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-black text-amber-950 flex items-center gap-2">
            <SvgIcon name="arrow-transfer" size={22} class="text-amber-600" />
            <span>{t(lang, 'tx.title')}</span>
          </h2>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            onClick$={() => {
              state.isMultiSelectMode = !state.isMultiSelectMode;
              if (!state.isMultiSelectMode) {
                state.selectedTxIds = [];
              }
            }}
            class={`flex items-center gap-1.5 px-3 py-2 rounded-full font-bold text-xs transition-all cursor-pointer ${
              state.isMultiSelectMode
                ? 'bg-amber-300 text-amber-950 border border-amber-400 shadow-xs'
                : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
            title="Activer la sélection multiple pour grouper des opérations"
          >
            <SvgIcon name="tag" size={13} />
            <span>{state.isMultiSelectMode ? 'Annuler' : 'Grouper'}</span>
          </button>

          <a
            href="/transactions/new/"
            class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <SvgIcon name="plus" size={14} />
            <span>{t(lang, 'tx.new')}</span>
          </a>
        </div>
      </div>

      {/* Multi-Select Grouping Action Banner */}
      {state.isMultiSelectMode && (
        <div class="p-3.5 bg-amber-100/90 rounded-3xl border-2 border-amber-300 flex items-center justify-between shadow-xs">
          <div class="text-xs font-black text-amber-950 flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-amber-200 flex items-center justify-center text-amber-900">
              <SvgIcon name="check" size={13} />
            </div>
            <span>{state.selectedTxIds.length} opération(s) sélectionnée(s)</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              onClick$={handleGroupSelected$}
              disabled={state.selectedTxIds.length < 2}
              class={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 ${
                state.selectedTxIds.length >= 2
                  ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-xs cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <SvgIcon name="tag" size={13} />
              <span>Grouper en 1 ticket</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div class="bg-white rounded-3xl p-4 border-2 border-amber-100 shadow-xs space-y-3">
        <div class="relative">
          <input
            type="text"
            value={state.searchQuery}
            onInput$={(e: any) => (state.searchQuery = e.target.value)}
            placeholder={t(lang, 'tx.search_placeholder')}
            class="w-full text-xs font-semibold text-slate-800 pl-9 pr-4 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/20"
          />
          <SvgIcon name="search" size={15} class="absolute left-3 top-3 text-amber-600" />
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Type filter pill */}
          <div class="flex items-center gap-1 bg-amber-50 rounded-2xl p-1 border border-amber-200">
            {(['all', 'expense', 'income', 'transfer'] as const).map((ty) => (
              <button
                key={ty}
                type="button"
                onClick$={() => (state.filterType = ty)}
                class={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                  state.filterType === ty
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'text-amber-900 hover:bg-amber-100/60'
                }`}
              >
                {ty === 'all'
                  ? t(lang, 'common.all')
                  : ty === 'expense'
                  ? t(lang, 'tx.type.expense')
                  : ty === 'income'
                  ? t(lang, 'tx.type.income')
                  : t(lang, 'tx.type.transfer')}
              </button>
            ))}
          </div>

          {/* Account Filter */}
          <select
            value={state.selectedAccountId}
            onChange$={(e: any) => (state.selectedAccountId = parseInt(e.target.value, 10))}
            class="text-xs font-bold text-slate-700 bg-white border-2 border-amber-200 rounded-2xl px-3 py-1.5 focus:outline-none"
          >
            <option value={0}>Tous les comptes</option>
            {state.accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {`${acc.name} (${acc.currencyCode})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div class="bg-white rounded-3xl p-10 border-2 border-amber-100 text-center space-y-2">
          <SvgIcon name="honey-pot" size={36} class="mx-auto text-amber-400" />
          <p class="text-xs font-bold text-slate-500">{t(lang, 'tx.empty')}</p>
        </div>
      ) : (
        <div class="space-y-2">
          {filteredTransactions.map((tx) => {
            const acc = getAccount(tx.accountId);
            const cat = getCategory(tx.categoryId);
            const isIncome = tx.type === 'income';
            const isTransfer = tx.type === 'transfer';
            const isGroupExpanded = state.expandedGroupIds.includes(tx.id!);
            const isSelected = state.selectedTxIds.includes(tx.id!);

            return (
              <div
                key={tx.id}
                class={`bg-white rounded-2xl p-4 border-2 shadow-xs transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50/40'
                    : 'border-amber-50 hover:border-amber-200'
                }`}
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    {state.isMultiSelectMode && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange$={() => handleToggleSelect$(tx.id!)}
                        class="w-4 h-4 rounded text-amber-600 focus:ring-amber-400 border-amber-300 cursor-pointer"
                      />
                    )}

                    <div
                      class="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: cat?.color || '#F59E0B' }}
                    >
                      <SvgIcon name={tx.isGroup ? 'tag' : (cat?.iconSvg || 'tag')} size={20} />
                    </div>

                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-sm font-black text-slate-800">{tx.label}</span>
                        {tx.isGroup && tx.items && tx.items.length > 0 && (
                          <button
                            type="button"
                            onClick$={() => handleToggleExpand$(tx.id!)}
                            class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 text-[10px] font-black transition-colors cursor-pointer"
                            title="Afficher/masquer les détails du panier"
                          >
                            <SvgIcon name="tag" size={11} class="text-amber-700" />
                            <span>{tx.items.length} articles</span>
                            <SvgIcon
                              name={isGroupExpanded ? 'chevron-up' : 'chevron-down'}
                              size={11}
                              class="text-amber-700"
                            />
                          </button>
                        )}
                      </div>

                      <div class="text-[11px] font-semibold text-slate-500 flex items-center flex-wrap gap-1.5 mt-0.5">
                        <span>{tx.date.split(' ')[0]}</span>
                        {tx.date.includes(' ') && (
                          <span class="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">
                            {tx.date.split(' ')[1]}
                          </span>
                        )}
                        <span>•</span>
                        <span class="text-amber-800 font-bold">{acc?.name}</span>
                        {tx.notes && (
                          <>
                            <span>•</span>
                            <span class="italic text-slate-400 truncate max-w-[120px]">{tx.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="text-right">
                      <div
                        class={`text-sm sm:text-base font-black ${
                          isIncome
                            ? 'text-emerald-600'
                            : isTransfer
                            ? 'text-sky-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {isIncome ? '+' : isTransfer ? '' : '-'}
                        {formatMoney(tx.amount, acc?.currencyCode || 'EUR', lang === 'en' ? 'en-US' : 'fr-FR')}
                      </div>
                      {acc && acc.currencyCode !== state.baseCurrency && (
                        <div class="text-[11px] font-bold text-amber-700/90 mt-0.5">
                          ≈ {isIncome ? '+' : isTransfer ? '' : '-'}
                          {formatMoney(
                            convertCurrency(tx.amount, acc.currencyCode, state.baseCurrency, state.rates),
                            state.baseCurrency,
                            lang === 'en' ? 'en-US' : 'fr-FR'
                          )}
                        </div>
                      )}
                    </div>

                    <div class="flex items-center gap-0.5">
                      <a
                        href={`/transactions/new/?id=${tx.id}`}
                        class="p-1.5 rounded-full hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer"
                        title={t(lang, 'common.edit')}
                      >
                        <SvgIcon name="edit" size={14} />
                      </a>
                      <button
                        type="button"
                        onClick$={() => handleDelete$(tx)}
                        class="p-1.5 rounded-full hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                        title={t(lang, 'common.delete')}
                      >
                        <SvgIcon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Group Drawer */}
                {tx.isGroup && tx.items && tx.items.length > 0 && isGroupExpanded && (
                  <div class="mt-3 pt-3 border-t border-amber-100 bg-amber-50/60 rounded-2xl p-3.5 space-y-2 animate-in fade-in duration-150">
                    <div class="flex items-center justify-between text-xs font-black text-amber-950">
                      <div class="flex items-center gap-1.5">
                        <SvgIcon name="tag" size={13} class="text-amber-700" />
                        <span>Détail du panier ({tx.items.length} articles)</span>
                      </div>
                      <button
                        type="button"
                        onClick$={() => handleUngroup$(tx)}
                        class="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline decoration-amber-300 underline-offset-2 transition-colors cursor-pointer"
                        title="Dégrouper cette opération en plusieurs achats individuels"
                      >
                        Dégrouper en achats individuels
                      </button>
                    </div>

                    <div class="space-y-1.5 pt-1">
                      {tx.items.map((item, idx) => {
                        const lineTotal = item.amount * (item.quantity && item.quantity > 1 ? item.quantity : 1);
                        return (
                          <div
                            key={item.id || idx}
                            class="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-amber-200/70 shadow-2xs"
                          >
                            <div class="flex items-center gap-2">
                              <span class="w-4 text-center font-bold text-slate-400 text-[10px]">
                                {idx + 1}
                              </span>
                              <span class="text-xs font-bold text-slate-800">
                                {item.name}
                              </span>
                              {item.quantity && item.quantity > 1 && (
                                <span class="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                                  x{item.quantity}
                                </span>
                              )}
                            </div>
                            <span class="text-xs font-black text-amber-950">
                              {formatMoney(lineTotal, acc?.currencyCode || 'MGA', lang === 'en' ? 'en-US' : 'fr-FR')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Opérations - HoneyBudget",
};
