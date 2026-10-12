import Dexie, { type Table } from 'dexie';

export type AccountType =
  | 'checking'
  | 'savings'
  | 'cash'
  | 'bank'
  | 'mobile_money'
  | 'crypto';

export interface Account {
  id?: number;
  name: string;
  type: AccountType;
  types?: AccountType[];
  currencyCode: string;
  balance: number; // in floating decimal or base unit (e.g. 1500.50)
  color: string;
  iconSvg: string;
}

/**
 * Returns all types associated with an account.
 * Defaults to [account.type] if types array is missing or empty.
 */
export const getAccountTypes = (account?: Account | null): AccountType[] => {
  if (!account) return ['checking'];
  if (Array.isArray(account.types) && account.types.length > 0) {
    return account.types;
  }
  return account.type ? [account.type] : ['checking'];
};

/**
 * Returns true if the account is strictly cash-only (i.e. every type is 'cash').
 * If an account has multiple types, such as 'cash' AND 'mobile_money', it is NOT cash-only,
 * so transaction fees are permitted.
 */
export const isCashOnlyAccount = (account?: Account | null): boolean => {
  if (!account) return false;
  const types = getAccountTypes(account);
  return types.length > 0 && types.every((t) => t === 'cash');
};

export interface Category {
  id?: number;
  nameKey: string;
  type: 'expense' | 'income';
  budgetLimit: number;
  color: string;
  iconSvg: string;
}

export interface GroupItem {
  id?: string;
  name: string;
  amount: number;
  quantity?: number;
}

export interface Transaction {
  id?: number;
  accountId: number;
  amount: number; // always positive in storage; type tells if it's expense/income/transfer
  fee?: number; // frais de transaction pour les comptes hors espèces (ex: mobile money, banques)
  date: string; // YYYY-MM-DD or YYYY-MM-DD HH:mm
  categoryId: number;
  label: string;
  notes?: string;
  type: 'expense' | 'income' | 'transfer';
  targetAccountId?: number; // for transfers
  isGroup?: boolean;
  items?: GroupItem[];
}

export interface CurrencyRecord {
  code: string;
  symbol: string;
  name: string;
  rateToBase: number;
}

export interface AppSettingsRecord {
  id: string; // 'current'
  baseCurrency: string;
  language: 'fr' | 'en';
  theme: string;
  lastBackupDate?: string;
  lastRatesUpdate?: string;
  rates: Record<string, number>;
  seedVersion?: number;
}

export class HoneyBudgetDatabase extends Dexie {
  accounts!: Table<Account, number>;
  categories!: Table<Category, number>;
  transactions!: Table<Transaction, number>;
  currencies!: Table<CurrencyRecord, string>;
  settings!: Table<AppSettingsRecord, string>;

  constructor() {
    super('HoneyBudgetDB');
    this.version(1).stores({
      accounts: '++id, name, type, currencyCode',
      categories: '++id, nameKey, type',
      transactions: '++id, accountId, date, categoryId, type',
      currencies: 'code',
      settings: 'id',
    });
  }
}

export const db = new HoneyBudgetDatabase();

/**
 * Initialize database with clean default starter data (no personal user data in seed)
 */
export const initDatabase = async (forceReset: boolean = false) => {
  if (typeof window === 'undefined') return;

  const currentSettings = await db.settings.get('current');
  const count = await db.accounts.count();

  // If first run or if legacy test data detected (seedVersion !== 7)
  if (forceReset || count === 0 || !currentSettings || currentSettings.seedVersion !== 7) {
    const {
      STARTER_SETTINGS,
      STARTER_ACCOUNTS,
      STARTER_CATEGORIES,
    } = await import('./starterData');

    await db.transactions.clear();
    await db.accounts.clear();
    await db.categories.clear();
    await db.settings.clear();

    await db.settings.put(STARTER_SETTINGS);
    await db.categories.bulkAdd(STARTER_CATEGORIES);
    await db.accounts.bulkAdd(STARTER_ACCOUNTS);
  }
};

