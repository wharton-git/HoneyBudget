import { component$, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useI18n, t, translate } from '../../i18n/context';
import { SvgIcon } from '../../components/icons/SvgIcon';
import { AccountModal } from '../../components/accounts/AccountModal';
import { db, type Account } from '../../db';
import { formatMoney, convertCurrency } from '../../services/currency/ratesService';

export default component$(() => {
  const { lang } = useI18n();

  const state = useStore({
    accounts: [] as Account[],
    baseCurrency: 'EUR',
    rates: {} as Record<string, number>,
    isAccountModalOpen: false,
    editingAccount: null as Account | null,
    isTransferModalOpen: false,
    lang,
  });

  const loadAccounts$ = $(async () => {
    const settings = await db.settings.get('current');
    state.baseCurrency = settings?.baseCurrency || 'EUR';
    state.rates = settings?.rates || {};
    state.accounts = await db.accounts.toArray();
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    state.lang = lang;
    await loadAccounts$();
  });

  const handleDelete$ = $(async (id: number) => {
    if (confirm(translate(state.lang, 'accounts.delete_confirm'))) {
      await db.accounts.delete(id);
      await loadAccounts$();
    }
  });

  return (
    <div class="space-y-6">
      {/* Top bar */}
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-black text-amber-950 flex items-center gap-2">
            <SvgIcon name="wallet" size={22} class="text-amber-600" />
            <span>{t(lang, 'accounts.title')}</span>
          </h2>
          <p class="text-xs font-semibold text-slate-500 mt-0.5">
            Gérez vos différents comptes et devises
          </p>
        </div>

        <button
          type="button"
          onClick$={() => {
            state.editingAccount = null;
            state.isAccountModalOpen = true;
          }}
          class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <SvgIcon name="plus" size={14} />
          <span>{t(lang, 'accounts.new_account')}</span>
        </button>
      </div>

      {/* Account Cards Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.accounts.map((acc) => {
          const isDifferent = acc.currencyCode !== state.baseCurrency;
          const converted = convertCurrency(acc.balance, acc.currencyCode, state.baseCurrency, state.rates, state.baseCurrency);

          return (
            <div
              key={acc.id}
              class="bg-white rounded-3xl p-5 border-2 border-amber-100 hover:border-amber-300 shadow-xs transition-all space-y-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: acc.color }}
                  >
                    <SvgIcon name={acc.iconSvg} size={24} />
                  </div>
                  <div>
                    <h3 class="text-base font-black text-amber-950">{acc.name}</h3>
                    <div class="flex items-center gap-1.5 mt-0.5">
                      <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                        {acc.type === 'checking'
                          ? t(lang, 'accounts.type.checking')
                          : acc.type === 'savings'
                          ? t(lang, 'accounts.type.savings')
                          : t(lang, 'accounts.type.cash')}
                      </span>
                      <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {acc.currencyCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    onClick$={() => {
                      state.editingAccount = acc;
                      state.isAccountModalOpen = true;
                    }}
                    class="p-2 rounded-full hover:bg-amber-100 text-amber-800 transition-colors"
                    title={t(lang, 'common.edit')}
                  >
                    <SvgIcon name="edit" size={16} />
                  </button>
                  <button
                    type="button"
                    onClick$={() => handleDelete$(acc.id!)}
                    class="p-2 rounded-full hover:bg-rose-100 text-rose-700 transition-colors"
                    title={t(lang, 'common.delete')}
                  >
                    <SvgIcon name="trash" size={16} />
                  </button>
                </div>
              </div>

              {/* Balance */}
              <div class="pt-2 border-t border-amber-50 flex items-baseline justify-between">
                <div>
                  <div class="text-[11px] font-bold text-slate-400">
                    {t(lang, 'accounts.current_balance')}
                  </div>
                  <div class="text-2xl font-black text-amber-950">
                    {formatMoney(acc.balance, acc.currencyCode, lang === 'en' ? 'en-US' : 'fr-FR')}
                  </div>
                </div>

                {isDifferent && (
                  <div class="text-right">
                    <div class="text-[11px] font-bold text-slate-400">
                      {t(lang, 'accounts.converted_in')} {state.baseCurrency}
                    </div>
                    <div class="text-sm font-black text-amber-800">
                      ≈ {formatMoney(converted, state.baseCurrency, lang === 'en' ? 'en-US' : 'fr-FR')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Modal */}
      <AccountModal
        isOpen={state.isAccountModalOpen}
        editAccount={state.editingAccount}
        onClose$={$(() => (state.isAccountModalOpen = false))}
        onSaved$={loadAccounts$}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Comptes - HoneyBudget",
};
