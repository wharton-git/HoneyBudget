import { component$, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useI18n, t } from '../../i18n/context';
import { SvgIcon } from '../../components/icons/SvgIcon';
import { HoneyMascotSvg } from '../../components/illustrations/HoneyMascotSvg';
import { db, type Account, type Category } from '../../db';
import { formatMoney, convertCurrency } from '../../services/currency/ratesService';

interface MonthStat {
  month: string; // YYYY-MM
  label: string;
  income: number;
  expense: number;
  savings: number;
  txCount: number;
}

interface CategoryExpenseStat {
  category: Category;
  amount: number;
  percentage: number;
}

interface AccountFlowStat {
  account: Account;
  income: number;
  expense: number;
}

export default component$(() => {
  const { lang } = useI18n();

  const state = useStore({
    baseCurrency: 'MGA',
    rates: {} as Record<string, number>,
    selectedMonth: '',
    availableMonths: [] as string[],
    monthlyStats: [] as MonthStat[],
    
    // Stats for current selected month
    currentIncome: 0,
    currentExpense: 0,
    currentSavings: 0,
    currentFees: 0,
    savingsRate: 0,
    txCount: 0,
    avgDailyExpense: 0,
    
    // Breakdowns
    categoryStats: [] as CategoryExpenseStat[],
    dailySpending: [] as { day: number; amount: number }[],
    accountFlows: [] as AccountFlowStat[],
    
    loading: true,
  });

  const computeReports$ = $(async () => {
    state.loading = true;

    const settings = await db.settings.get('current');
    state.baseCurrency = settings?.baseCurrency || 'MGA';
    state.rates = settings?.rates || {};

    const [allTx, accounts, categories] = await Promise.all([
      db.transactions.toArray(),
      db.accounts.toArray(),
      db.categories.toArray(),
    ]);

    if (allTx.length === 0) {
      state.loading = false;
      return;
    }

    // Extract unique months
    const monthSet = new Set<string>();
    allTx.forEach((tx) => {
      if (tx.date && tx.date.length >= 7) {
        monthSet.add(tx.date.substring(0, 7));
      }
    });

    const monthsArr = Array.from(monthSet).sort().reverse();
    state.availableMonths = monthsArr;

    if (!state.selectedMonth || !monthsArr.includes(state.selectedMonth)) {
      state.selectedMonth = monthsArr[0] || '';
    }

    // 1. Compute multi-month overview
    const monthlyMap: Record<string, { income: number; expense: number; count: number }> = {};
    monthsArr.forEach((m) => {
      monthlyMap[m] = { income: 0, expense: 0, count: 0 };
    });

    allTx.forEach((tx) => {
      const ym = tx.date.substring(0, 7);
      if (!monthlyMap[ym]) return;

      const acc = accounts.find((a) => a.id === tx.accountId);
      const accCur = acc?.currencyCode || state.baseCurrency;
      const amountInBase = convertCurrency(tx.amount, accCur, state.baseCurrency, state.rates);
      const feeInBase = tx.fee ? convertCurrency(tx.fee, accCur, state.baseCurrency, state.rates) : 0;

      if (tx.type === 'income') {
        monthlyMap[ym].income += Math.max(0, amountInBase - feeInBase);
        monthlyMap[ym].count += 1;
      } else if (tx.type === 'expense') {
        monthlyMap[ym].expense += (amountInBase + feeInBase);
        monthlyMap[ym].count += 1;
      } else if (tx.type === 'transfer' && feeInBase > 0) {
        monthlyMap[ym].expense += feeInBase;
      }
    });

    const mStats: MonthStat[] = [];
    for (const m of [...monthsArr].reverse()) {
      const data = monthlyMap[m];
      const [year, month] = m.split('-');
      const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      const shortLabel = d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'short',
        year: '2-digit',
      });

      mStats.push({
        month: m,
        label: shortLabel,
        income: Math.round(data.income),
        expense: Math.round(data.expense),
        savings: Math.round(data.income - data.expense),
        txCount: data.count,
      });
    }
    state.monthlyStats = mStats;

    // 2. Compute details for selectedMonth
    const curMonth = state.selectedMonth;
    let income = 0;
    let expense = 0;
    let totalFees = 0;
    let count = 0;
    const catMap: Record<number, number> = {};
    const dayMap: Record<number, number> = {};
    const accFlowMap: Record<number, { income: number; expense: number }> = {};

    accounts.forEach((a) => {
      if (a.id) accFlowMap[a.id] = { income: 0, expense: 0 };
    });

    // Days in current selected month
    const [selYear, selMonth] = curMonth.split('-').map((v) => parseInt(v, 10));
    const totalDays = new Date(selYear, selMonth, 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
      dayMap[i] = 0;
    }

    allTx.forEach((tx) => {
      if (!tx.date.startsWith(curMonth)) return;

      const acc = accounts.find((a) => a.id === tx.accountId);
      const accCur = acc?.currencyCode || state.baseCurrency;
      const inBase = convertCurrency(tx.amount, accCur, state.baseCurrency, state.rates);
      const feeInBase = tx.fee ? convertCurrency(tx.fee, accCur, state.baseCurrency, state.rates) : 0;
      totalFees += feeInBase;

      const dayNum = parseInt(tx.date.substring(8, 10), 10);

      if (tx.type === 'income') {
        const netIncome = Math.max(0, inBase - feeInBase);
        income += netIncome;
        count += 1;
        if (accFlowMap[tx.accountId]) {
          accFlowMap[tx.accountId].income += netIncome;
        }
      } else if (tx.type === 'expense') {
        const totalExpense = inBase + feeInBase;
        expense += totalExpense;
        count += 1;
        catMap[tx.categoryId] = (catMap[tx.categoryId] || 0) + totalExpense;
        if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= totalDays) {
          dayMap[dayNum] = (dayMap[dayNum] || 0) + totalExpense;
        }
        if (accFlowMap[tx.accountId]) {
          accFlowMap[tx.accountId].expense += totalExpense;
        }
      } else if (tx.type === 'transfer' && feeInBase > 0) {
        expense += feeInBase;
        if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= totalDays) {
          dayMap[dayNum] = (dayMap[dayNum] || 0) + feeInBase;
        }
        if (accFlowMap[tx.accountId]) {
          accFlowMap[tx.accountId].expense += feeInBase;
        }
      }
    });

    state.currentIncome = Math.round(income);
    state.currentExpense = Math.round(expense);
    state.currentSavings = Math.round(income - expense);
    state.currentFees = Math.round(totalFees);
    state.savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
    state.txCount = count;
    state.avgDailyExpense = Math.round(expense / totalDays);

    // Categories breakdown
    const catList: CategoryExpenseStat[] = [];
    Object.entries(catMap).forEach(([cid, amt]) => {
      const cat = categories.find((c) => c.id === parseInt(cid, 10));
      if (cat) {
        catList.push({
          category: cat,
          amount: Math.round(amt),
          percentage: expense > 0 ? Math.round((amt / expense) * 100) : 0,
        });
      }
    });
    catList.sort((a, b) => b.amount - a.amount);
    state.categoryStats = catList;

    // Daily spending
    state.dailySpending = Object.entries(dayMap).map(([d, val]) => ({
      day: parseInt(d, 10),
      amount: Math.round(val),
    }));

    // Account flows
    const accList: AccountFlowStat[] = [];
    accounts.forEach((a) => {
      if (a.id && accFlowMap[a.id]) {
        accList.push({
          account: a,
          income: Math.round(accFlowMap[a.id].income),
          expense: Math.round(accFlowMap[a.id].expense),
        });
      }
    });
    accList.sort((a, b) => b.expense + b.income - (a.expense + a.income));
    state.accountFlows = accList;

    state.loading = false;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => state.selectedMonth);
    track(() => lang);
    computeReports$();
  });

  return (
    <div class="space-y-6 pb-20">
      {/* Header & Month Selector */}
      <div class="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-black text-amber-950 flex items-center gap-2">
              <SvgIcon name="bar-chart" size={24} class="text-amber-500 stroke-[2.5]" />
              <span>{t(lang, 'reports.title')}</span>
            </h2>
            <p class="text-xs font-semibold text-slate-500 mt-0.5">
              {t(lang, 'reports.subtitle')}
            </p>
          </div>

          {/* Month Pill Selector */}
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {state.availableMonths.map((m) => {
              const isSelected = m === state.selectedMonth;
              const [y, mon] = m.split('-');
              const d = new Date(parseInt(y, 10), parseInt(mon, 10) - 1, 1);
              const label = d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                month: 'short',
                year: 'numeric',
              });

              return (
                <button
                  key={m}
                  type="button"
                  onClick$={() => {
                    state.selectedMonth = m;
                  }}
                  class={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-400 text-amber-950 shadow-xs scale-105'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Income Card */}
        <div class="bg-white rounded-3xl p-4 border-2 border-emerald-100 shadow-xs space-y-1">
          <div class="flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>{t(lang, 'reports.income')}</span>
            <div class="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <SvgIcon name="arrow-up" size={16} />
            </div>
          </div>
          <div class="text-lg sm:text-xl font-black text-emerald-950 truncate">
            {formatMoney(state.currentIncome, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
          </div>
          <div class="text-[10px] font-semibold text-emerald-600">
            {state.selectedMonth}
          </div>
        </div>

        {/* Expense Card */}
        <div class="bg-white rounded-3xl p-4 border-2 border-rose-100 shadow-xs space-y-1">
          <div class="flex items-center justify-between text-xs font-bold text-rose-800">
            <span>{t(lang, 'reports.expense')}</span>
            <div class="w-7 h-7 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <SvgIcon name="arrow-down" size={16} />
            </div>
          </div>
          <div class="text-lg sm:text-xl font-black text-rose-950 truncate">
            {formatMoney(state.currentExpense, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
          </div>
          <div class="text-[10px] font-semibold text-rose-600 flex items-center justify-between gap-1 flex-wrap">
            <span>{state.txCount} {t(lang, 'reports.operations_count').toLowerCase()}</span>
            {state.currentFees > 0 && (
              <span class="text-amber-900 font-bold bg-amber-100 px-1.5 py-0.2 rounded-md text-[9px]">
                dont {formatMoney(state.currentFees, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')} de frais
              </span>
            )}
          </div>
        </div>

        {/* Net Savings Card */}
        <div class="bg-white rounded-3xl p-4 border-2 border-amber-100 shadow-xs space-y-1">
          <div class="flex items-center justify-between text-xs font-bold text-amber-800">
            <span>{t(lang, 'reports.savings')}</span>
            <div class="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <SvgIcon name="piggy" size={16} />
            </div>
          </div>
          <div
            class={`text-lg sm:text-xl font-black truncate ${
              state.currentSavings >= 0 ? 'text-amber-950' : 'text-rose-700'
            }`}
          >
            {formatMoney(state.currentSavings, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
          </div>
          <div class="text-[10px] font-semibold text-amber-700">
            {t(lang, 'reports.savings_rate')} : {state.savingsRate}%
          </div>
        </div>

        {/* Daily Average Card */}
        <div class="bg-white rounded-3xl p-4 border-2 border-sky-100 shadow-xs space-y-1">
          <div class="flex items-center justify-between text-xs font-bold text-sky-800">
            <span>{t(lang, 'reports.daily_average')}</span>
            <div class="w-7 h-7 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <SvgIcon name="calendar" size={16} />
            </div>
          </div>
          <div class="text-lg sm:text-xl font-black text-sky-950 truncate">
            {formatMoney(state.avgDailyExpense, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
          </div>
          <div class="text-[10px] font-semibold text-sky-600">
            {t(lang, 'reports.all_months')}
          </div>
        </div>
      </div>

      {/* Mascot Insight Message */}
      <div class="bg-amber-50/90 rounded-3xl p-4 border-2 border-amber-200/80 flex items-center gap-4 shadow-xs">
        <HoneyMascotSvg size={54} class="shrink-0" />
        <div class="text-xs font-medium text-amber-950 space-y-0.5">
          <div class="font-black text-sm text-amber-900">
            {state.currentSavings >= 0
              ? (lang === 'fr' ? 'Bilan positif pour ce mois !' : 'Positive balance this month!')
              : (lang === 'fr' ? 'Attention au budget ce mois-ci' : 'Watch your budget this month')}
          </div>
          <p class="leading-relaxed text-amber-800/90">
            {state.currentSavings >= 0
              ? t(lang, 'reports.mascot_tip_positive')
              : t(lang, 'reports.mascot_tip_deficit')}
          </p>
        </div>
      </div>

      {/* Diagram 1: Multi-Month Evolution Bar Chart */}
      <div class="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-black text-amber-950 flex items-center gap-2">
              <SvgIcon name="bar-chart" size={18} class="text-amber-600" />
              <span>{t(lang, 'reports.monthly_evolution')}</span>
            </h3>
            <p class="text-[11px] font-semibold text-slate-400">
              {lang === 'fr' ? 'Comparatif Revenus vs Dépenses' : 'Income vs Expenses comparison'}
            </p>
          </div>

          {/* Legend */}
          <div class="flex items-center gap-3 text-xs font-bold">
            <span class="flex items-center gap-1.5 text-emerald-700">
              <span class="w-3 h-3 rounded-md bg-emerald-400 inline-block"></span>
              {t(lang, 'reports.income')}
            </span>
            <span class="flex items-center gap-1.5 text-rose-700">
              <span class="w-3 h-3 rounded-md bg-rose-400 inline-block"></span>
              {t(lang, 'reports.expense')}
            </span>
          </div>
        </div>

        {/* SVG Multi-Month Bar Chart */}
        <div class="pt-2">
          {(() => {
            const stats = state.monthlyStats;
            if (stats.length === 0) return null;

            const maxVal = Math.max(
              ...stats.map((s) => Math.max(s.income, s.expense)),
              1000
            );

            const chartHeight = 160;
            const barWidth = 16;
            const gap = 12;
            const groupWidth = barWidth * 2 + 4;
            const totalWidth = stats.length * (groupWidth + gap) + gap;

            return (
              <div class="overflow-x-auto pb-2">
                <svg
                  viewBox={`0 0 ${Math.max(totalWidth, 320)} ${chartHeight + 40}`}
                  class="w-full h-48 select-none"
                >
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2={totalWidth} y2="20" stroke="#fef3c7" stroke-width="1" stroke-dasharray="3 3" />
                  <line x1="0" y1="80" x2={totalWidth} y2="80" stroke="#fef3c7" stroke-width="1" stroke-dasharray="3 3" />
                  <line x1="0" y1={chartHeight} x2={totalWidth} y2={chartHeight} stroke="#fde68a" stroke-width="1.5" />

                  {stats.map((item, idx) => {
                    const x = gap + idx * (groupWidth + gap);
                    const incHeight = maxVal > 0 ? (item.income / maxVal) * (chartHeight - 30) : 0;
                    const expHeight = maxVal > 0 ? (item.expense / maxVal) * (chartHeight - 30) : 0;

                    const incY = chartHeight - incHeight;
                    const expY = chartHeight - expHeight;
                    const isSelected = item.month === state.selectedMonth;

                    return (
                      <g
                        key={item.month}
                        class="cursor-pointer group"
                        onClick$={() => {
                          state.selectedMonth = item.month;
                        }}
                      >
                        {/* Selected Month Background highlight */}
                        {isSelected && (
                          <rect
                            x={x - 4}
                            y="10"
                            width={groupWidth + 8}
                            height={chartHeight + 25}
                            rx="8"
                            fill="#fef3c7"
                            opacity="0.6"
                          />
                        )}

                        {/* Income Bar (Green) */}
                        <rect
                          x={x}
                          y={incY}
                          width={barWidth}
                          height={Math.max(incHeight, 2)}
                          rx="5"
                          fill="#34d399"
                          class="group-hover:opacity-80 transition-opacity"
                        />

                        {/* Expense Bar (Rose) */}
                        <rect
                          x={x + barWidth + 3}
                          y={expY}
                          width={barWidth}
                          height={Math.max(expHeight, 2)}
                          rx="5"
                          fill="#f87171"
                          class="group-hover:opacity-80 transition-opacity"
                        />

                        {/* Month Label */}
                        <text
                          x={x + groupWidth / 2}
                          y={chartHeight + 18}
                          text-anchor="middle"
                          font-size="10"
                          font-weight={isSelected ? 'bold' : 'normal'}
                          fill={isSelected ? '#78350f' : '#64748b'}
                        >
                          {item.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Grid: Category Breakdown (Donut + Progress) & Daily Trend */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Breakdown Card */}
        <div class="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-black text-amber-950 flex items-center gap-2">
                <SvgIcon name="pie-chart" size={18} class="text-amber-600" />
                <span>{t(lang, 'reports.category_breakdown')}</span>
              </h3>
              <p class="text-[11px] font-semibold text-slate-400">
                {state.categoryStats.length} {lang === 'fr' ? 'postes de dépenses' : 'expense categories'}
              </p>
            </div>
          </div>

          {state.categoryStats.length === 0 ? (
            <div class="py-12 text-center text-slate-400 font-semibold text-xs">
              {t(lang, 'reports.no_data')}
            </div>
          ) : (
            <div class="space-y-4">
              {/* Cute SVG Donut Chart */}
              <div class="flex items-center justify-center py-2">
                {(() => {
                  const radius = 55;
                  const strokeWidth = 22;
                  const circumference = 2 * Math.PI * radius;
                  let currentOffset = 0;

                  return (
                    <div class="relative w-44 h-44 flex items-center justify-center">
                      <svg class="w-full h-full -rotate-90" viewBox="0 0 160 160">
                        {/* Background ring */}
                        <circle
                          cx="80"
                          cy="80"
                          r={radius}
                          fill="none"
                          stroke="#fef3c7"
                          stroke-width={strokeWidth}
                        />

                        {/* Category slices */}
                        {state.categoryStats.slice(0, 7).map((item) => {
                          const strokeDash = (item.percentage / 100) * circumference;
                          const offset = currentOffset;
                          currentOffset += strokeDash;

                          return (
                            <circle
                              key={item.category.id}
                              cx="80"
                              cy="80"
                              r={radius}
                              fill="none"
                              stroke={item.category.color}
                              stroke-width={strokeWidth}
                              stroke-dasharray={`${strokeDash} ${circumference}`}
                              stroke-dashoffset={-offset}
                              stroke-linecap="round"
                              class="transition-all duration-300 hover:opacity-90"
                            />
                          );
                        })}
                      </svg>

                      {/* Center Content */}
                      <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {t(lang, 'reports.expense')}
                        </span>
                        <span class="text-sm font-black text-amber-950 truncate max-w-[110px]">
                          {formatMoney(state.currentExpense, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Category List with Progress Bars */}
              <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {state.categoryStats.map((item) => (
                  <div key={item.category.id} class="space-y-1">
                    <div class="flex items-center justify-between text-xs">
                      <div class="flex items-center gap-2">
                        <div
                          class="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: item.category.color }}
                        >
                          <SvgIcon name={item.category.iconSvg} size={13} />
                        </div>
                        <span class="font-bold text-amber-950 truncate max-w-[130px] sm:max-w-[180px]">
                          {item.category.nameKey}
                        </span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-[11px] font-bold text-slate-400">
                          {item.percentage}%
                        </span>
                        <span class="font-black text-amber-950">
                          {formatMoney(item.amount, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div class="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.category.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Daily Spending Trend Card */}
        <div class="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-xs space-y-4">
          <div>
            <h3 class="text-base font-black text-amber-950 flex items-center gap-2">
              <SvgIcon name="trending-up" size={18} class="text-amber-600" />
              <span>{t(lang, 'reports.daily_trend')}</span>
            </h3>
            <p class="text-[11px] font-semibold text-slate-400">
              {lang === 'fr' ? 'Évolution jour par jour dans le mois' : 'Day by day spending curve'}
            </p>
          </div>

          {state.dailySpending.length === 0 ? (
            <div class="py-12 text-center text-slate-400 font-semibold text-xs">
              {t(lang, 'reports.no_data')}
            </div>
          ) : (
            <div>
              {/* Daily Bar Chart */}
              {(() => {
                const days = state.dailySpending;
                const maxDaySpend = Math.max(...days.map((d) => d.amount), 100);
                const chartH = 150;
                const totalW = Math.max(days.length * 10, 320);

                return (
                  <div class="overflow-x-auto pb-2">
                    <svg
                      viewBox={`0 0 ${totalW} ${chartH + 35}`}
                      class="w-full h-44 select-none"
                    >
                      {/* Grid lines */}
                      <line x1="0" y1="20" x2={totalW} y2="20" stroke="#fef3c7" stroke-width="1" stroke-dasharray="2 2" />
                      <line x1="0" y1="75" x2={totalW} y2="75" stroke="#fef3c7" stroke-width="1" stroke-dasharray="2 2" />
                      <line x1="0" y1={chartH} x2={totalW} y2={chartH} stroke="#fde68a" stroke-width="1.5" />

                      {days.map((d, idx) => {
                        const barW = 6;
                        const x = 5 + idx * (totalW / days.length);
                        const h = maxDaySpend > 0 ? (d.amount / maxDaySpend) * (chartH - 25) : 0;
                        const y = chartH - h;
                        const isPeak = d.amount > 0 && d.amount >= maxDaySpend * 0.7;

                        return (
                          <g key={d.day} class="group">
                            <rect
                              x={x}
                              y={y}
                              width={barW}
                              height={Math.max(h, d.amount > 0 ? 3 : 0)}
                              rx="3"
                              fill={isPeak ? '#f43f5e' : d.amount > 0 ? '#f59e0b' : '#f1f5f9'}
                              class="group-hover:opacity-75 transition-opacity"
                            >
                              <title>{`Jour ${d.day}: ${formatMoney(d.amount, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}`}</title>
                            </rect>

                            {/* Show day labels every 5 days or 1st/last */}
                            {(d.day === 1 || d.day % 5 === 0 || d.day === days.length) && (
                              <text
                                x={x + barW / 2}
                                y={chartH + 15}
                                text-anchor="middle"
                                font-size="9"
                                fill="#94a3b8"
                                font-weight="bold"
                              >
                                {d.day}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                );
              })()}

              {/* Peak indicator */}
              <div class="mt-2 flex items-center justify-between text-xs font-semibold text-slate-500 pt-3 border-t border-amber-50">
                <span>{lang === 'fr' ? 'Pic de dépense le plus élevé' : 'Highest spending peak'}</span>
                <span class="font-black text-rose-700">
                  {formatMoney(
                    Math.max(...state.dailySpending.map((d) => d.amount), 0),
                    state.baseCurrency,
                    lang === 'en' ? 'en-US' : 'fr-FR'
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Flows (Cash vs Mvola vs Orange Money vs Redotpay) */}
      <div class="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-xs space-y-4">
        <div>
          <h3 class="text-base font-black text-amber-950 flex items-center gap-2">
            <SvgIcon name="wallet" size={18} class="text-amber-600" />
            <span>{t(lang, 'reports.accounts_flow')}</span>
          </h3>
          <p class="text-[11px] font-semibold text-slate-400">
            {lang === 'fr' ? 'Volume des rentrées et sorties par moyen de paiement' : 'Inflows and outflows per payment method'}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.accountFlows.map((flow) => (
            <div
              key={flow.account.id}
              class="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2"
            >
              <div class="flex items-center gap-2.5">
                <div
                  class="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: flow.account.color }}
                >
                  <SvgIcon name={flow.account.iconSvg} size={16} />
                </div>
                <div class="truncate">
                  <div class="font-black text-xs text-amber-950 truncate">
                    {flow.account.name}
                  </div>
                  <div class="text-[10px] font-bold text-slate-500">
                    {flow.account.currencyCode}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 pt-1 border-t border-amber-200/40 text-[11px]">
                <div>
                  <span class="text-emerald-700 font-bold block">{t(lang, 'reports.income')}</span>
                  <span class="font-black text-emerald-950">
                    +{formatMoney(flow.income, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
                  </span>
                </div>
                <div>
                  <span class="text-rose-700 font-bold block">{t(lang, 'reports.expense')}</span>
                  <span class="font-black text-rose-950">
                    -{formatMoney(flow.expense, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'HoneyBudget - Rapports & Statistiques',
  meta: [
    {
      name: 'description',
      content: 'Rapports mensuels et diagrammes financiers HoneyBudget',
    },
  ],
};
