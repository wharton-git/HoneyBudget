import Dexie, { type Table } from 'dexie';
import { DEFAULT_RATES_FROM_EUR } from '../services/currency/ratesService';

export interface Account {
  id?: number;
  name: string;
  type: 'checking' | 'savings' | 'cash';
  currencyCode: string;
  balance: number; // in floating decimal or base unit (e.g. 1500.50)
  color: string;
  iconSvg: string;
}

export interface Category {
  id?: number;
  nameKey: string;
  type: 'expense' | 'income';
  budgetLimit: number;
  color: string;
  iconSvg: string;
}

export interface Transaction {
  id?: number;
  accountId: number;
  amount: number; // always positive in storage; type tells if it's expense/income/transfer
  date: string; // YYYY-MM-DD
  categoryId: number;
  label: string;
  notes?: string;
  type: 'expense' | 'income' | 'transfer';
  targetAccountId?: number; // for transfers
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
 * Initialize and seed database if first run
 */
export const initDatabase = async () => {
  if (typeof window === 'undefined') return;

  const count = await db.accounts.count();
  if (count === 0) {
    // Seed initial settings
    await db.settings.put({
      id: 'current',
      baseCurrency: 'EUR',
      language: 'fr',
      theme: 'honey-gold',
      rates: DEFAULT_RATES_FROM_EUR,
      lastRatesUpdate: new Date().toISOString(),
    });

    // Seed default categories
    const catFood = await db.categories.add({
      nameKey: 'cat.food',
      type: 'expense',
      budgetLimit: 400,
      color: '#F59E0B',
      iconSvg: 'apple',
    });
    const catHome = await db.categories.add({
      nameKey: 'cat.home',
      type: 'expense',
      budgetLimit: 850,
      color: '#EC4899',
      iconSvg: 'home',
    });
    const catTransport = await db.categories.add({
      nameKey: 'cat.transport',
      type: 'expense',
      budgetLimit: 120,
      color: '#3B82F6',
      iconSvg: 'bus',
    });
    const catLeisure = await db.categories.add({
      nameKey: 'cat.leisure',
      type: 'expense',
      budgetLimit: 180,
      color: '#8B5CF6',
      iconSvg: 'game',
    });
    await db.categories.add({
      nameKey: 'cat.health',
      type: 'expense',
      budgetLimit: 60,
      color: '#EF4444',
      iconSvg: 'heart',
    });
    await db.categories.add({
      nameKey: 'cat.gift',
      type: 'expense',
      budgetLimit: 90,
      color: '#F43F5E',
      iconSvg: 'gift',
    });
    const catSalary = await db.categories.add({
      nameKey: 'cat.salary',
      type: 'income',
      budgetLimit: 0,
      color: '#10B981',
      iconSvg: 'salary',
    });
    await db.categories.add({
      nameKey: 'cat.other',
      type: 'expense',
      budgetLimit: 100,
      color: '#64748B',
      iconSvg: 'tag',
    });

    // Seed accounts
    const accChecking = await db.accounts.add({
      name: 'Compte Courant',
      type: 'checking',
      currencyCode: 'EUR',
      balance: 1450.50,
      color: '#F59E0B',
      iconSvg: 'wallet',
    });

    const accSavings = await db.accounts.add({
      name: 'Tirelire Miel',
      type: 'savings',
      currencyCode: 'EUR',
      balance: 920.00,
      color: '#10B981',
      iconSvg: 'honey-pot',
    });

    const accTravel = await db.accounts.add({
      name: 'Poche Voyage',
      type: 'checking',
      currencyCode: 'USD',
      balance: 320.00,
      color: '#3B82F6',
      iconSvg: 'coin',
    });

    // Seed initial realistic transactions for current month
    const today = new Date();
    const curYear = today.getFullYear();
    const curMonth = String(today.getMonth() + 1).padStart(2, '0');

    await db.transactions.bulkAdd([
      {
        accountId: accChecking,
        amount: 2200,
        date: `${curYear}-${curMonth}-01`,
        categoryId: catSalary,
        label: 'Salaire mensuel',
        type: 'income',
      },
      {
        accountId: accChecking,
        amount: 780,
        date: `${curYear}-${curMonth}-02`,
        categoryId: catHome,
        label: 'Loyer et charges',
        type: 'expense',
      },
      {
        accountId: accChecking,
        amount: 150,
        date: `${curYear}-${curMonth}-04`,
        categoryId: catFood,
        label: 'Épargne vers Tirelire Miel',
        type: 'transfer',
        targetAccountId: accSavings,
      },
      {
        accountId: accChecking,
        amount: 68.40,
        date: `${curYear}-${curMonth}-05`,
        categoryId: catFood,
        label: 'Marché primeur et épicerie',
        type: 'expense',
      },
      {
        accountId: accChecking,
        amount: 32.50,
        date: `${curYear}-${curMonth}-07`,
        categoryId: catTransport,
        label: 'Abonnement tram / bus',
        type: 'expense',
      },
      {
        accountId: accChecking,
        amount: 45.00,
        date: `${curYear}-${curMonth}-09`,
        categoryId: catLeisure,
        label: 'Sortie cinéma et salon de thé',
        type: 'expense',
      },
      {
        accountId: accTravel,
        amount: 25.00,
        date: `${curYear}-${curMonth}-08`,
        categoryId: catFood,
        label: 'Café & Snack USD',
        type: 'expense',
      },
    ]);
  }
};
