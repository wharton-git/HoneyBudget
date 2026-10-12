import { getSupabase } from './client';
import { db, type Account, type Category, type Transaction, type AppSettingsRecord } from '../../db';

export interface SyncResult {
  success: boolean;
  uploadedAccounts: number;
  uploadedCategories: number;
  uploadedTransactions: number;
  downloadedAccounts: number;
  downloadedCategories: number;
  downloadedTransactions: number;
  timestamp: string;
}

const BATCH_SIZE = 500;

export const pushLocalToSupabase = async (userId: string): Promise<{ accounts: number; categories: number; transactions: number }> => {
  const supabase = getSupabase();

  // 1. Accounts
  const localAccounts = await db.accounts.toArray();
  if (localAccounts.length > 0) {
    const payload = localAccounts.map((acc) => ({
      user_id: userId,
      client_id: acc.id!,
      name: acc.name,
      type: acc.type,
      currency_code: acc.currencyCode,
      balance: acc.balance,
      color: acc.color,
      icon_svg: acc.iconSvg,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('accounts').upsert(payload, { onConflict: 'user_id,client_id' });
    if (error) throw error;
  }

  // 2. Categories
  const localCategories = await db.categories.toArray();
  if (localCategories.length > 0) {
    const payload = localCategories.map((cat) => ({
      user_id: userId,
      client_id: cat.id!,
      name_key: cat.nameKey,
      type: cat.type,
      budget_limit: cat.budgetLimit,
      color: cat.color,
      icon_svg: cat.iconSvg,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('categories').upsert(payload, { onConflict: 'user_id,client_id' });
    if (error) throw error;
  }

  // 3. Transactions in batches
  const localTransactions = await db.transactions.toArray();
  for (let i = 0; i < localTransactions.length; i += BATCH_SIZE) {
    const chunk = localTransactions.slice(i, i + BATCH_SIZE).map((tx) => ({
      user_id: userId,
      client_id: tx.id!,
      account_id: tx.accountId,
      category_id: tx.categoryId,
      amount: tx.amount,
      fee: tx.fee || 0,
      date: tx.date,
      label: tx.label,
      notes: tx.notes || null,
      type: tx.type,
      target_account_id: tx.targetAccountId || null,
      is_group: tx.isGroup || false,
      items: tx.items || [],
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('transactions').upsert(chunk, { onConflict: 'user_id,client_id' });
    if (error) throw error;
  }

  // 4. Settings
  const localSettings = await db.settings.get('current');
  if (localSettings) {
    const settingsPayload = {
      user_id: userId,
      base_currency: localSettings.baseCurrency,
      language: localSettings.language,
      theme: localSettings.theme,
      rates: localSettings.rates,
      last_rates_update: localSettings.lastRatesUpdate || null,
      updated_at: new Date().toISOString(),
    };
    await supabase.from('app_settings').upsert(settingsPayload, { onConflict: 'user_id' });
  }

  return {
    accounts: localAccounts.length,
    categories: localCategories.length,
    transactions: localTransactions.length,
  };
};

export const pullRemoteFromSupabase = async (userId: string): Promise<{ accounts: number; categories: number; transactions: number }> => {
  const supabase = getSupabase();

  // 1. Fetch remote accounts
  const { data: remoteAccounts, error: accErr } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null);
  if (accErr) throw accErr;

  // 2. Fetch remote categories
  const { data: remoteCategories, error: catErr } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null);
  if (catErr) throw catErr;

  // 3. Fetch remote transactions
  const { data: remoteTransactions, error: txErr } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null);
  if (txErr) throw txErr;

  // 4. Fetch remote settings
  const { data: remoteSettings } = await supabase
    .from('app_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Map to local format
  const mappedAccounts: Account[] = (remoteAccounts || []).map((row) => ({
    id: Number(row.client_id),
    name: row.name,
    type: row.type as any,
    currencyCode: row.currency_code,
    balance: Number(row.balance),
    color: row.color,
    iconSvg: row.icon_svg,
  }));

  const mappedCategories: Category[] = (remoteCategories || []).map((row) => ({
    id: Number(row.client_id),
    nameKey: row.name_key,
    type: row.type as any,
    budgetLimit: Number(row.budget_limit),
    color: row.color,
    iconSvg: row.icon_svg,
  }));

  const mappedTransactions: Transaction[] = (remoteTransactions || []).map((row) => ({
    id: Number(row.client_id),
    accountId: Number(row.account_id),
    categoryId: Number(row.category_id),
    amount: Number(row.amount),
    fee: row.fee ? Number(row.fee) : 0,
    date: row.date,
    label: row.label,
    notes: row.notes || undefined,
    type: row.type as any,
    targetAccountId: row.target_account_id ? Number(row.target_account_id) : undefined,
    isGroup: Boolean(row.is_group),
    items: row.items || undefined,
  }));

  // Store in Dexie
  await db.transaction('rw', [db.accounts, db.categories, db.transactions, db.settings], async () => {
    if (mappedAccounts.length > 0) {
      await db.accounts.clear();
      await db.accounts.bulkAdd(mappedAccounts);
    }
    if (mappedCategories.length > 0) {
      await db.categories.clear();
      await db.categories.bulkAdd(mappedCategories);
    }
    if (mappedTransactions.length > 0) {
      await db.transactions.clear();
      await db.transactions.bulkAdd(mappedTransactions);
    }
    if (remoteSettings) {
      const current = await db.settings.get('current');
      const updated: AppSettingsRecord = {
        id: 'current',
        baseCurrency: remoteSettings.base_currency,
        language: remoteSettings.language as any,
        theme: remoteSettings.theme,
        rates: remoteSettings.rates || current?.rates || {},
        lastRatesUpdate: remoteSettings.last_rates_update || current?.lastRatesUpdate,
        seedVersion: 7,
      };
      await db.settings.put(updated);
    }
  });

  return {
    accounts: mappedAccounts.length,
    categories: mappedCategories.length,
    transactions: mappedTransactions.length,
  };
};

export const syncWithSupabase = async (userId: string): Promise<SyncResult> => {
  const supabase = getSupabase();

  // Check remote count
  const { count: remoteTxCount, error } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (error) throw error;

  const localTxCount = await db.transactions.count();

  let uploaded = { accounts: 0, categories: 0, transactions: 0 };
  let downloaded = { accounts: 0, categories: 0, transactions: 0 };

  if ((remoteTxCount ?? 0) === 0 && localTxCount > 0) {
    // Initial sync: Upload local data to Supabase
    uploaded = await pushLocalToSupabase(userId);
  } else if ((remoteTxCount ?? 0) > 0 && localTxCount === 0) {
    // Fresh client: Download cloud data to Dexie
    downloaded = await pullRemoteFromSupabase(userId);
  } else {
    // Both have data: Push local, then ensure remote convergence
    uploaded = await pushLocalToSupabase(userId);
    downloaded = await pullRemoteFromSupabase(userId);
  }

  const timestamp = new Date().toISOString();
  if (typeof window !== 'undefined') {
    localStorage.setItem('honeybudget_last_sync', timestamp);
  }

  return {
    success: true,
    uploadedAccounts: uploaded.accounts,
    uploadedCategories: uploaded.categories,
    uploadedTransactions: uploaded.transactions,
    downloadedAccounts: downloaded.accounts,
    downloadedCategories: downloaded.categories,
    downloadedTransactions: downloaded.transactions,
    timestamp,
  };
};

export const getLastSyncTime = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('honeybudget_last_sync');
};
