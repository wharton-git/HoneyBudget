import { component$, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useI18n, t } from '../../i18n/context';
import { SvgIcon } from '../../components/icons/SvgIcon';
import { db, type Category } from '../../db';
import { formatMoney, convertCurrency } from '../../services/currency/ratesService';

export default component$(() => {
  const { lang } = useI18n();

  const state = useStore({
    categories: [] as Category[],
    baseCurrency: 'EUR',
    rates: {} as Record<string, number>,
    spentMap: {} as Record<number, number>,
    isModalOpen: false,
    editingCat: null as Category | null,
    modalLimit: '',
  });

  const loadData$ = $(async () => {
    const settings = await db.settings.get('current');
    const baseCur = settings?.baseCurrency || 'EUR';
    const ratesMap = settings?.rates || {};
    state.baseCurrency = baseCur;
    state.rates = ratesMap;

    const cats = await db.categories.toArray();
    state.categories = cats;

    // Calculate spent this month
    const accounts = await db.accounts.toArray();
    const now = new Date();
    const curYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const allTx = await db.transactions.toArray();

    const spent: Record<number, number> = {};
    allTx.forEach((tx) => {
      if (tx.type === 'expense' && tx.date.startsWith(curYearMonth)) {
        const acc = accounts.find((a) => a.id === tx.accountId);
        const inBase = convertCurrency(tx.amount, acc?.currencyCode || baseCur, baseCur, ratesMap, baseCur);
        spent[tx.categoryId] = (spent[tx.categoryId] || 0) + inBase;
      }
    });
    state.spentMap = spent;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    await loadData$();
  });

  const handleSaveBudget$ = $(async () => {
    if (!state.editingCat) return;
    const val = parseFloat(state.modalLimit);
    if (!isNaN(val) && val >= 0) {
      await db.categories.update(state.editingCat.id!, {
        budgetLimit: val,
      });
      state.isModalOpen = false;
      await loadData$();
    }
  });

  return (
    <div class="space-y-6">
      {/* Top bar */}
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-black text-amber-950 flex items-center gap-2">
            <SvgIcon name="pie-chart" size={22} class="text-amber-600" />
            <span>{t(lang, 'cat.title')}</span>
          </h2>
          <p class="text-xs font-semibold text-slate-500 mt-0.5">
            Suivi des plafonds de dépenses mensuelles ({state.baseCurrency})
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.categories
          .filter((c) => c.type === 'expense')
          .map((cat) => {
            const spent = state.spentMap[cat.id!] || 0;
            const limit = cat.budgetLimit || 0;
            const pct = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
            const isOver = limit > 0 && spent > limit;
            const remaining = limit - spent;

            return (
              <div
                key={cat.id}
                class="bg-white rounded-3xl p-5 border-2 border-amber-100 hover:border-amber-300 shadow-xs transition-all space-y-4"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: cat.color }}
                    >
                      <SvgIcon name={cat.iconSvg} size={22} />
                    </div>
                    <div>
                      <h3 class="text-sm font-black text-amber-950">
                        {t(lang, cat.nameKey as any) || cat.nameKey}
                      </h3>
                      <div class="text-[11px] font-semibold text-slate-500 mt-0.5">
                        {limit > 0
                          ? `${t(lang, 'cat.budget_limit')} : ${formatMoney(limit, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}`
                          : 'Aucun plafond défini'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick$={() => {
                      state.editingCat = cat;
                      state.modalLimit = String(cat.budgetLimit);
                      state.isModalOpen = true;
                    }}
                    class="p-2 rounded-full hover:bg-amber-100 text-amber-800 transition-colors"
                    title={t(lang, 'common.edit')}
                  >
                    <SvgIcon name="edit" size={16} />
                  </button>
                </div>

                {/* Progress bar and metrics */}
                <div class="space-y-1.5 pt-1">
                  <div class="flex items-center justify-between text-xs font-bold">
                    <span class="text-slate-600">
                      {t(lang, 'cat.spent_this_month')} :{' '}
                      <strong class="text-amber-950">
                        {formatMoney(spent, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
                      </strong>
                    </span>
                    <span class={isOver ? 'text-rose-600 font-black' : 'text-slate-500'}>
                      {limit > 0 ? `${pct}%` : ''}
                    </span>
                  </div>

                  <div class="w-full h-3 rounded-full bg-amber-50 overflow-hidden border border-amber-100">
                    <div
                      class={`h-full rounded-full transition-all duration-500 ${
                        isOver ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${limit > 0 ? pct : 0}%` }}
                    />
                  </div>

                  {limit > 0 && (
                    <div class="flex items-center justify-between text-[11px] font-bold pt-1">
                      {isOver ? (
                        <span class="text-rose-600 flex items-center gap-1">
                          <SvgIcon name="info" size={12} />
                          <span>
                            {t(lang, 'cat.over_budget')} (+{formatMoney(spent - limit, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')})
                          </span>
                        </span>
                      ) : (
                        <span class="text-emerald-700">
                          {t(lang, 'cat.remaining')} : {formatMoney(remaining, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Edit Budget Limit Modal */}
      {state.isModalOpen && state.editingCat && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-xs">
          <div class="bg-white rounded-3xl border-2 border-amber-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-amber-100">
              <h3 class="text-base font-black text-amber-950">
                Plafond : {t(lang, state.editingCat.nameKey as any) || state.editingCat.nameKey}
              </h3>
              <button
                type="button"
                onClick$={() => (state.isModalOpen = false)}
                class="p-1 rounded-full text-amber-800 hover:bg-amber-100"
              >
                <SvgIcon name="x" size={16} />
              </button>
            </div>

            <div>
              <label class="block text-xs font-bold text-amber-900 mb-1">
                {t(lang, 'cat.budget_limit')} ({state.baseCurrency})
              </label>
              <input
                type="number"
                step="any"
                value={state.modalLimit}
                onInput$={(e: any) => (state.modalLimit = e.target.value)}
                class="w-full text-lg font-black text-amber-950 px-4 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50/20"
              />
            </div>

            <div class="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
              <button
                type="button"
                onClick$={() => (state.isModalOpen = false)}
                class="px-4 py-2 text-xs font-bold rounded-2xl text-amber-800 hover:bg-amber-100"
              >
                {t(lang, 'common.cancel')}
              </button>
              <button
                type="button"
                onClick$={handleSaveBudget$}
                class="px-5 py-2 text-xs font-black rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-md cursor-pointer"
              >
                {t(lang, 'common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Budgets & Catégories - HoneyBudget",
};
