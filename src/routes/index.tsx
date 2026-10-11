import { component$, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useI18n, t } from '../i18n/context';
import { SvgIcon } from '../components/icons/SvgIcon';
import { HoneyMascotSvg } from '../components/illustrations/HoneyMascotSvg';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { db, type Account, type Category, type Transaction } from '../db';
import { formatMoney, convertCurrency } from '../services/currency/ratesService';

export default component$(() => {
  const { lang } = useI18n();

  const state = useStore({
    accounts: [] as Account[],
    categories: [] as Category[],
    recentTransactions: [] as Transaction[],
    baseCurrency: 'EUR',
    rates: {} as Record<string, number>,
    totalConsolidatedBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    categoryExpenses: [] as { category: Category; amount: number; percentage: number }[],
    isTxModalOpen: false,
    editingTx: null as Transaction | null,
  });

  const loadDashboardData$ = $(async () => {
    const settings = await db.settings.get('current');
    const baseCur = settings?.baseCurrency || 'EUR';
    const ratesMap = settings?.rates || {};

    state.baseCurrency = baseCur;
    state.rates = ratesMap;

    const accounts = await db.accounts.toArray();
    state.accounts = accounts;

    const categories = await db.categories.toArray();
    state.categories = categories;

    // Calculate total net worth converted to baseCurrency
    let totalNet = 0;
    accounts.forEach((acc) => {
      const converted = convertCurrency(acc.balance, acc.currencyCode, baseCur, ratesMap);
      totalNet += converted;
    });
    state.totalConsolidatedBalance = totalNet;

    // Get current month transactions
    const now = new Date();
    const curYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const allTx = await db.transactions.toArray();
    // Sort descending by date
    allTx.sort((a, b) => b.date.localeCompare(a.date) || (b.id || 0) - (a.id || 0));

    state.recentTransactions = allTx.slice(0, 5);

    // Calculate monthly income, expense & categories breakdown
    let income = 0;
    let expense = 0;
    const catMap: Record<number, number> = {};

    allTx.forEach((tx) => {
      if (tx.date.startsWith(curYearMonth)) {
        const acc = accounts.find((a) => a.id === tx.accountId);
        const accCur = acc?.currencyCode || baseCur;
        const inBase = convertCurrency(tx.amount, accCur, baseCur, ratesMap);

        if (tx.type === 'income') {
          income += inBase;
        } else if (tx.type === 'expense') {
          expense += inBase;
          catMap[tx.categoryId] = (catMap[tx.categoryId] || 0) + inBase;
        }
      }
    });

    state.monthlyIncome = income;
    state.monthlyExpense = expense;

    // Breakdown
    const catBreakdown: { category: Category; amount: number; percentage: number }[] = [];
    Object.entries(catMap).forEach(([catIdStr, amt]) => {
      const cat = categories.find((c) => c.id === parseInt(catIdStr, 10));
      if (cat) {
        catBreakdown.push({
          category: cat,
          amount: amt,
          percentage: expense > 0 ? Math.round((amt / expense) * 100) : 0,
        });
      }
    });

    catBreakdown.sort((a, b) => b.amount - a.amount);
    state.categoryExpenses = catBreakdown;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    loadDashboardData$();

    const onCurrencyChanged = () => {
      loadDashboardData$();
    };
    window.addEventListener('honey_currency_changed', onCurrencyChanged);
    cleanup(() => {
      window.removeEventListener('honey_currency_changed', onCurrencyChanged);
    });
  });


  const getAccount = (id: number) => state.accounts.find((a) => a.id === id);
  const getCategory = (id: number) => state.categories.find((c) => c.id === id);

  return (
    <div class="space-y-6">
      {/* Greeting Header */}
      <div class="flex items-center justify-between px-1">
        <div>
          <h2 class="text-2xl font-black text-amber-950 tracking-tight">
            {t(lang, 'dashboard.greeting')}
          </h2>
        </div>
        <HoneyMascotSvg size={44} class="hover:scale-105 transition-transform" />
      </div>

      {/* Main Consolidated Balance Card */}
      <div class="bg-linear-to-br from-amber-400 via-amber-400 to-amber-500 rounded-3xl p-6 text-amber-950 shadow-[0_12px_28px_rgba(245,158,11,0.25)] border border-amber-300 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <span class="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-900/90">
            {t(lang, 'dashboard.total_balance')}
          </span>
          <div class="flex items-center gap-1 bg-amber-300/60 px-2.5 py-1 rounded-full text-xs font-black">
            <SvgIcon name="globe" size={13} />
            <span>{state.baseCurrency}</span>
          </div>
        </div>

        <div class="mt-3">
          <div class="text-3xl sm:text-4xl font-black tracking-tight text-amber-950">
            {formatMoney(state.totalConsolidatedBalance, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
          </div>
        </div>

        {/* Mini stats pill bar */}
        <div class="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-amber-500/40">
          <div class="bg-white/40 backdrop-blur-xs rounded-2xl p-2.5 text-center">
            <div class="text-[10px] sm:text-xs font-bold text-amber-900">
              {t(lang, 'dashboard.monthly_income')}
            </div>
            <div class="text-xs sm:text-sm font-black text-emerald-800 mt-0.5">
              +{formatMoney(state.monthlyIncome, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
            </div>
          </div>

          <div class="bg-white/40 backdrop-blur-xs rounded-2xl p-2.5 text-center">
            <div class="text-[10px] sm:text-xs font-bold text-amber-900">
              {t(lang, 'dashboard.monthly_expense')}
            </div>
            <div class="text-xs sm:text-sm font-black text-rose-800 mt-0.5">
              -{formatMoney(state.monthlyExpense, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
            </div>
          </div>

          <div class="bg-white/40 backdrop-blur-xs rounded-2xl p-2.5 text-center">
            <div class="text-[10px] sm:text-xs font-bold text-amber-900">
              {t(lang, 'dashboard.monthly_savings')}
            </div>
            <div class={`text-xs sm:text-sm font-black mt-0.5 ${state.monthlyIncome >= state.monthlyExpense ? 'text-amber-950' : 'text-rose-800'}`}>
              {formatMoney(state.monthlyIncome - state.monthlyExpense, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Action Button */}
      <div class="flex justify-center">
        <button
          type="button"
          onClick$={() => {
            state.editingTx = null;
            state.isTxModalOpen = true;
          }}
          class="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <div class="w-6 h-6 rounded-full bg-amber-950 text-amber-300 flex items-center justify-center">
            <SvgIcon name="plus" size={14} class="stroke-3" />
          </div>
          <span>{t(lang, 'dashboard.quick_add')}</span>
        </button>
      </div>

      {/* Accounts Carousel / Preview */}
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-black text-amber-950 flex items-center gap-2">
            <SvgIcon name="wallet" size={18} class="text-amber-600" />
            <span>{t(lang, 'dashboard.my_accounts')}</span>
          </h3>
          <a
            href="/accounts/"
            class="text-xs font-bold text-amber-800 hover:text-amber-950 underline decoration-amber-300 underline-offset-4"
          >
            {t(lang, 'dashboard.view_all')}
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {state.accounts.map((acc) => {
            const isDifferent = acc.currencyCode !== state.baseCurrency;
            const converted = convertCurrency(acc.balance, acc.currencyCode, state.baseCurrency, state.rates);
            return (
              <div
                key={acc.id}
                class="bg-white rounded-3xl p-4 border-2 border-amber-100 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div class="flex items-center justify-between">
                  <div
                    class="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: acc.color }}
                  >
                    <SvgIcon name={acc.iconSvg} size={18} />
                  </div>
                  <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    {acc.currencyCode}
                  </span>
                </div>

                <div class="mt-3">
                  <div class="text-xs font-bold text-slate-500 truncate">{acc.name}</div>
                  <div class="text-lg font-black text-amber-950 mt-0.5">
                    {formatMoney(acc.balance, acc.currencyCode, lang === 'en' ? 'en-US' : 'fr-FR')}
                  </div>
                  {isDifferent && (
                    <div class="text-[11px] font-semibold text-amber-700 mt-0.5">
                      ≈ {formatMoney(converted, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses Breakdown & Visual SVG Chart */}
      {state.categoryExpenses.length > 0 && (
        <div class="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-xs space-y-4">
          <h3 class="text-base font-black text-amber-950 flex items-center gap-2">
            <SvgIcon name="pie-chart" size={18} class="text-amber-600" />
            <span>{t(lang, 'dashboard.expense_by_category')}</span>
          </h3>

          <div class="space-y-3">
            {state.categoryExpenses.map((item) => (
              <div key={item.category.id} class="space-y-1">
                <div class="flex items-center justify-between text-xs font-bold">
                  <span class="flex items-center gap-1.5 text-slate-700">
                    <div
                      class="w-5 h-5 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: item.category.color }}
                    >
                      <SvgIcon name={item.category.iconSvg} size={12} />
                    </div>
                    <span>{t(lang, item.category.nameKey as any) || item.category.nameKey}</span>
                  </span>
                  <span class="text-amber-950 font-black">
                    {formatMoney(item.amount, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')} ({item.percentage}%)
                  </span>
                </div>
                {/* SVG Progress bar */}
                <div class="w-full h-3 rounded-full bg-amber-50 overflow-hidden border border-amber-100">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.category.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions List */}
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-black text-amber-950 flex items-center gap-2">
            <SvgIcon name="calendar" size={18} class="text-amber-600" />
            <span>{t(lang, 'dashboard.recent_transactions')}</span>
          </h3>
          <a
            href="/transactions/"
            class="text-xs font-bold text-amber-800 hover:text-amber-950 underline decoration-amber-300 underline-offset-4"
          >
            {t(lang, 'dashboard.view_all')}
          </a>
        </div>

        {state.recentTransactions.length === 0 ? (
          <div class="bg-white rounded-3xl p-8 border-2 border-amber-100 text-center space-y-2">
            <SvgIcon name="honey-pot" size={32} class="mx-auto text-amber-400" />
            <p class="text-xs font-semibold text-slate-500">
              {t(lang, 'dashboard.no_transactions')}
            </p>
          </div>
        ) : (
          <div class="space-y-2">
            {state.recentTransactions.map((tx) => {
              const acc = getAccount(tx.accountId);
              const cat = getCategory(tx.categoryId);
              const isIncome = tx.type === 'income';
              const isTransfer = tx.type === 'transfer';

              return (
                <div
                  key={tx.id}
                  class="bg-white rounded-2xl p-3.5 border-2 border-amber-50 hover:border-amber-200 shadow-xs flex items-center justify-between transition-all"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: cat?.color || '#F59E0B' }}
                    >
                      <SvgIcon name={cat?.iconSvg || 'tag'} size={18} />
                    </div>
                    <div>
                      <div class="text-xs font-black text-slate-800 truncate max-w-[180px] sm:max-w-xs">
                        {tx.label}
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
                      </div>
                    </div>
                  </div>

                  <div class="text-right">
                    <div
                      class={`text-sm font-black ${
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
                      <div class="text-[10px] font-bold text-amber-700/90 mt-0.5">
                        ≈ {isIncome ? '+' : isTransfer ? '' : '-'}
                        {formatMoney(
                          convertCurrency(tx.amount, acc.currencyCode, state.baseCurrency, state.rates),
                          state.baseCurrency,
                          lang === 'en' ? 'en-US' : 'fr-FR'
                        )}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={state.isTxModalOpen}
        editTransaction={state.editingTx}
        onClose$={$(() => (state.isTxModalOpen = false))}
        onSaved$={loadDashboardData$}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "HoneyBudget - Gestion de Budget Mignonne",
  meta: [
    {
      name: "description",
      content: "HoneyBudget: PWA de gestion de budget et de comptes synchronisée avec Google Drive",
    },
  ],
};
