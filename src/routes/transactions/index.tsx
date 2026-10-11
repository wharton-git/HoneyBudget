import { component$, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useI18n, t } from '../../i18n/context';
import { SvgIcon } from '../../components/icons/SvgIcon';
import { TransactionModal } from '../../components/transactions/TransactionModal';
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
    isTxModalOpen: false,
    editingTx: null as Transaction | null,
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
          <p class="text-xs font-semibold text-slate-500 mt-0.5">
            Historique complet de vos flux financiers
          </p>
        </div>

        <button
          type="button"
          onClick$={() => {
            state.editingTx = null;
            state.isTxModalOpen = true;
          }}
          class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <SvgIcon name="plus" size={14} />
          <span>{t(lang, 'tx.new')}</span>
        </button>
      </div>

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

            return (
              <div
                key={tx.id}
                class="bg-white rounded-2xl p-4 border-2 border-amber-50 hover:border-amber-200 shadow-xs flex items-center justify-between transition-all"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: cat?.color || '#F59E0B' }}
                  >
                    <SvgIcon name={cat?.iconSvg || 'tag'} size={20} />
                  </div>

                  <div>
                    <div class="text-sm font-black text-slate-800">{tx.label}</div>
                    <div class="text-[11px] font-semibold text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{tx.date}</span>
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
                    <button
                      type="button"
                      onClick$={() => {
                        state.editingTx = tx;
                        state.isTxModalOpen = true;
                      }}
                      class="p-1.5 rounded-full hover:bg-amber-100 text-amber-800 transition-colors"
                      title={t(lang, 'common.edit')}
                    >
                      <SvgIcon name="edit" size={14} />
                    </button>
                    <button
                      type="button"
                      onClick$={() => handleDelete$(tx)}
                      class="p-1.5 rounded-full hover:bg-rose-100 text-rose-700 transition-colors"
                      title={t(lang, 'common.delete')}
                    >
                      <SvgIcon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={state.isTxModalOpen}
        editTransaction={state.editingTx}
        onClose$={$(() => (state.isTxModalOpen = false))}
        onSaved$={loadData$}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Opérations - HoneyBudget",
};
