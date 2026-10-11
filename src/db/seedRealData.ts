import type { Account, Category, Transaction, AppSettingsRecord } from './index';
import { DEFAULT_RATES_FROM_EUR } from '../services/currency/ratesService';

export const REAL_SETTINGS: AppSettingsRecord = {
  id: 'current',
  baseCurrency: 'MGA',
  language: 'fr',
  theme: 'honey-mga-real',
  rates: DEFAULT_RATES_FROM_EUR,
  lastRatesUpdate: new Date().toISOString(),
  seedVersion: 3,
};

export const REAL_ACCOUNTS: Account[] = [
  {
    "id": 1,
    "name": "Cash (Esp\u00e8ces)",
    "type": "cash",
    "currencyCode": "MGA",
    "balance": 172700,
    "color": "#F59E0B",
    "iconSvg": "wallet"
  },
  {
    "id": 2,
    "name": "Mvola 2",
    "type": "checking",
    "currencyCode": "MGA",
    "balance": 133650,
    "color": "#10B981",
    "iconSvg": "coin"
  },
  {
    "id": 3,
    "name": "Orange Money",
    "type": "checking",
    "currencyCode": "MGA",
    "balance": 3790,
    "color": "#F97316",
    "iconSvg": "vault"
  },
  {
    "id": 4,
    "name": "Orange Money 2",
    "type": "savings",
    "currencyCode": "MGA",
    "balance": 10000,
    "color": "#EC4899",
    "iconSvg": "honey-pot"
  },
  {
    "id": 5,
    "name": "Redotpay",
    "type": "checking",
    "currencyCode": "USD",
    "balance": 3.31,
    "color": "#8B5CF6",
    "iconSvg": "piggy"
  }
];

export const REAL_CATEGORIES: Category[] = [
  {
    "id": 1,
    "nameKey": "Accessory",
    "type": "expense",
    "budgetLimit": 20000,
    "color": "#EC4899",
    "iconSvg": "tag"
  },
  {
    "id": 2,
    "nameKey": "Appliances",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#10B981",
    "iconSvg": "home"
  },
  {
    "id": 3,
    "nameKey": "Bags",
    "type": "expense",
    "budgetLimit": 2000,
    "color": "#F59E0B",
    "iconSvg": "wallet"
  },
  {
    "id": 4,
    "nameKey": "Beauty",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#EC4899",
    "iconSvg": "heart"
  },
  {
    "id": 5,
    "nameKey": "Beverages",
    "type": "expense",
    "budgetLimit": 20000,
    "color": "#06B6D4",
    "iconSvg": "coffee"
  },
  {
    "id": 6,
    "nameKey": "Books",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#3B82F6",
    "iconSvg": "tag"
  },
  {
    "id": 7,
    "nameKey": "Broadband",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#3B82F6",
    "iconSvg": "globe"
  },
  {
    "id": 8,
    "nameKey": "Bus",
    "type": "expense",
    "budgetLimit": 15000,
    "color": "#EC4899",
    "iconSvg": "bus"
  },
  {
    "id": 9,
    "nameKey": "Cash gift",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#EC4899",
    "iconSvg": "gift"
  },
  {
    "id": 10,
    "nameKey": "Clothing",
    "type": "expense",
    "budgetLimit": 10000,
    "color": "#F43F5E",
    "iconSvg": "tag"
  },
  {
    "id": 11,
    "nameKey": "Connectivity",
    "type": "expense",
    "budgetLimit": 40000,
    "color": "#3B82F6",
    "iconSvg": "globe"
  },
  {
    "id": 12,
    "nameKey": "Cosmetics",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#EC4899",
    "iconSvg": "heart"
  },
  {
    "id": 13,
    "nameKey": "Daily nes.",
    "type": "expense",
    "budgetLimit": 25000,
    "color": "#10B981",
    "iconSvg": "home"
  },
  {
    "id": 14,
    "nameKey": "Digital",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#8B5CF6",
    "iconSvg": "globe"
  },
  {
    "id": 15,
    "nameKey": "Dining",
    "type": "expense",
    "budgetLimit": 70000,
    "color": "#F59E0B",
    "iconSvg": "apple"
  },
  {
    "id": 16,
    "nameKey": "Drink",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#06B6D4",
    "iconSvg": "coffee"
  },
  {
    "id": 17,
    "nameKey": "Education",
    "type": "expense",
    "budgetLimit": 50000,
    "color": "#F59E0B",
    "iconSvg": "pie-chart"
  },
  {
    "id": 18,
    "nameKey": "Fruit",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#10B981",
    "iconSvg": "apple"
  },
  {
    "id": 19,
    "nameKey": "Fun",
    "type": "expense",
    "budgetLimit": 20000,
    "color": "#8B5CF6",
    "iconSvg": "game"
  },
  {
    "id": 20,
    "nameKey": "Gaming",
    "type": "expense",
    "budgetLimit": 10000,
    "color": "#8B5CF6",
    "iconSvg": "game"
  },
  {
    "id": 21,
    "nameKey": "Gas",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#F97316",
    "iconSvg": "home"
  },
  {
    "id": 22,
    "nameKey": "Gift",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#EC4899",
    "iconSvg": "gift"
  },
  {
    "id": 23,
    "nameKey": "Go\u00fbter",
    "type": "expense",
    "budgetLimit": 25000,
    "color": "#F43F5E",
    "iconSvg": "honey-pot"
  },
  {
    "id": 24,
    "nameKey": "Health",
    "type": "expense",
    "budgetLimit": 15000,
    "color": "#EF4444",
    "iconSvg": "heart"
  },
  {
    "id": 25,
    "nameKey": "Hygiene",
    "type": "expense",
    "budgetLimit": 10000,
    "color": "#06B6D4",
    "iconSvg": "heart"
  },
  {
    "id": 26,
    "nameKey": "Loan",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#EF4444",
    "iconSvg": "swap"
  },
  {
    "id": 27,
    "nameKey": "Meat",
    "type": "expense",
    "budgetLimit": 10000,
    "color": "#F43F5E",
    "iconSvg": "apple"
  },
  {
    "id": 28,
    "nameKey": "Medical",
    "type": "expense",
    "budgetLimit": 10000,
    "color": "#EF4444",
    "iconSvg": "heart"
  },
  {
    "id": 29,
    "nameKey": "Membership",
    "type": "expense",
    "budgetLimit": 30000,
    "color": "#8B5CF6",
    "iconSvg": "shield"
  },
  {
    "id": 30,
    "nameKey": "Office",
    "type": "expense",
    "budgetLimit": 15000,
    "color": "#64748B",
    "iconSvg": "tag"
  },
  {
    "id": 31,
    "nameKey": "Repayment",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#EF4444",
    "iconSvg": "swap"
  },
  {
    "id": 32,
    "nameKey": "Secret",
    "type": "expense",
    "budgetLimit": 50000,
    "color": "#6366F1",
    "iconSvg": "vault"
  },
  {
    "id": 33,
    "nameKey": "Snacks",
    "type": "expense",
    "budgetLimit": 10000,
    "color": "#F59E0B",
    "iconSvg": "honey-pot"
  },
  {
    "id": 34,
    "nameKey": "Social",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#F59E0B",
    "iconSvg": "coffee"
  },
  {
    "id": 35,
    "nameKey": "Tools",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#64748B",
    "iconSvg": "tag"
  },
  {
    "id": 36,
    "nameKey": "Trans",
    "type": "expense",
    "budgetLimit": 10000,
    "color": "#3B82F6",
    "iconSvg": "bus"
  },
  {
    "id": 37,
    "nameKey": "Vegetables",
    "type": "expense",
    "budgetLimit": 20000,
    "color": "#10B981",
    "iconSvg": "apple"
  },
  {
    "id": 38,
    "nameKey": "Water",
    "type": "expense",
    "budgetLimit": 5000,
    "color": "#06B6D4",
    "iconSvg": "coffee"
  },
  {
    "id": 39,
    "nameKey": "Bonus",
    "type": "income",
    "budgetLimit": 0,
    "color": "#10B981",
    "iconSvg": "coin"
  },
  {
    "id": 40,
    "nameKey": "Gift",
    "type": "income",
    "budgetLimit": 0,
    "color": "#EC4899",
    "iconSvg": "gift"
  },
  {
    "id": 41,
    "nameKey": "Receipt",
    "type": "income",
    "budgetLimit": 0,
    "color": "#F59E0B",
    "iconSvg": "coin"
  },
  {
    "id": 42,
    "nameKey": "Rent",
    "type": "income",
    "budgetLimit": 0,
    "color": "#8B5CF6",
    "iconSvg": "home"
  },
  {
    "id": 43,
    "nameKey": "Salary",
    "type": "income",
    "budgetLimit": 0,
    "color": "#10B981",
    "iconSvg": "salary"
  },
  {
    "id": 44,
    "nameKey": "Side job",
    "type": "income",
    "budgetLimit": 0,
    "color": "#3B82F6",
    "iconSvg": "wallet"
  },
  {
    "id": 45,
    "nameKey": "Virement",
    "type": "expense",
    "budgetLimit": 0,
    "color": "#3B82F6",
    "iconSvg": "swap"
  }
];

export const REAL_TRANSACTIONS: Transaction[] = [
  {
    "id": 1,
    "accountId": 1,
    "categoryId": 41,
    "amount": 30000.0,
    "date": "2026-03-06",
    "label": "Maman",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 2,
    "accountId": 1,
    "categoryId": 7,
    "amount": 1000.0,
    "date": "2026-03-06",
    "label": "Cr\u00e9dit Yas",
    "type": "expense",
    "notes": "Broadband"
  },
  {
    "id": 3,
    "accountId": 1,
    "categoryId": 15,
    "amount": 3000.0,
    "date": "2026-03-06",
    "label": "2500Ar + 500Ar (Riz + Yaourt)",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 4,
    "accountId": 1,
    "categoryId": 41,
    "amount": 3000.0,
    "date": "2026-03-06",
    "label": "Doneli",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 5,
    "accountId": 1,
    "categoryId": 13,
    "amount": 500.0,
    "date": "2026-03-07",
    "label": "\u00c9ponge",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 6,
    "accountId": 1,
    "categoryId": 16,
    "amount": 4200.0,
    "date": "2026-03-07",
    "label": "Jus de Pomme 1L",
    "type": "expense",
    "notes": "Drink"
  },
  {
    "id": 7,
    "accountId": 1,
    "categoryId": 38,
    "amount": 2000.0,
    "date": "2026-03-07",
    "label": "Cristalline 1L",
    "type": "expense",
    "notes": "Water"
  },
  {
    "id": 8,
    "accountId": 1,
    "categoryId": 13,
    "amount": 900.0,
    "date": "2026-03-07",
    "label": "Liquide Vaisselle MIRA",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 9,
    "accountId": 1,
    "categoryId": 2,
    "amount": 800.0,
    "date": "2026-03-07",
    "label": "D\u00e9tergents Poudre x2",
    "type": "expense",
    "notes": "Appliances"
  },
  {
    "id": 10,
    "accountId": 1,
    "categoryId": 3,
    "amount": 400.0,
    "date": "2026-03-07",
    "label": "Sachet SuperMaki",
    "type": "expense",
    "notes": "Bags"
  },
  {
    "id": 11,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-03-07",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 12,
    "accountId": 1,
    "categoryId": 22,
    "amount": 200.0,
    "date": "2026-03-07",
    "label": "***",
    "type": "expense",
    "notes": "Gift"
  },
  {
    "id": 13,
    "accountId": 1,
    "categoryId": 33,
    "amount": 1500.0,
    "date": "2026-03-07",
    "label": "Biscuits",
    "type": "expense",
    "notes": "Snacks"
  },
  {
    "id": 14,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-03-07",
    "label": "D\u00eener",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 15,
    "accountId": 1,
    "categoryId": 7,
    "amount": 500.0,
    "date": "2026-03-08",
    "label": "Cyber",
    "type": "expense",
    "notes": "Broadband"
  },
  {
    "id": 16,
    "accountId": 1,
    "categoryId": 7,
    "amount": 1500.0,
    "date": "2026-03-08",
    "label": "Credit Yas",
    "type": "expense",
    "notes": "Broadband"
  },
  {
    "id": 17,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-03-08",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 18,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-03-08",
    "label": "D\u00eener",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 19,
    "accountId": 1,
    "categoryId": 33,
    "amount": 500.0,
    "date": "2026-03-08",
    "label": "Pain",
    "type": "expense",
    "notes": "Snacks"
  },
  {
    "id": 20,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2500.0,
    "date": "2026-03-09",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 21,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-03-09",
    "label": "D\u00eener",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 22,
    "accountId": 1,
    "categoryId": 18,
    "amount": 1000.0,
    "date": "2026-03-09",
    "label": "Pomme",
    "type": "expense",
    "notes": "Fruit"
  },
  {
    "id": 23,
    "accountId": 1,
    "categoryId": 7,
    "amount": 1000.0,
    "date": "2026-03-10",
    "label": "Cr\u00e9dit Yas",
    "type": "expense",
    "notes": "Broadband"
  },
  {
    "id": 24,
    "accountId": 1,
    "categoryId": 41,
    "amount": 25000.0,
    "date": "2026-03-10",
    "label": "Maman",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 25,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-03-10",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 26,
    "accountId": 1,
    "categoryId": 7,
    "amount": 500.0,
    "date": "2026-03-10",
    "label": "Cyber",
    "type": "expense",
    "notes": "Broadband"
  },
  {
    "id": 27,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-03-10",
    "label": "D\u00eener",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 28,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-03-11",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 29,
    "accountId": 1,
    "categoryId": 7,
    "amount": 1000.0,
    "date": "2026-03-11",
    "label": "Cr\u00e9dit Yas",
    "type": "expense",
    "notes": "Broadband"
  },
  {
    "id": 30,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-03-11",
    "label": "D\u00eener",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 31,
    "accountId": 1,
    "categoryId": 7,
    "amount": 1000.0,
    "date": "2026-03-12",
    "label": "Cr\u00e9dit Yas",
    "type": "expense",
    "notes": "Broadband"
  },
  {
    "id": 32,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-03-12",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 33,
    "accountId": 1,
    "categoryId": 13,
    "amount": 3100.0,
    "date": "2026-03-12",
    "label": "Riz",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 34,
    "accountId": 1,
    "categoryId": 13,
    "amount": 300.0,
    "date": "2026-03-12",
    "label": "Sel",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 35,
    "accountId": 1,
    "categoryId": 13,
    "amount": 5500.0,
    "date": "2026-03-12",
    "label": "Huile (1/2 L)",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 36,
    "accountId": 1,
    "categoryId": 21,
    "amount": 1000.0,
    "date": "2026-03-12",
    "label": "Charbon",
    "type": "expense",
    "notes": "Gas"
  },
  {
    "id": 37,
    "accountId": 1,
    "categoryId": 27,
    "amount": 1500.0,
    "date": "2026-03-12",
    "label": "Courgettes + tomate + oignons",
    "type": "expense",
    "notes": "Meat"
  },
  {
    "id": 38,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1000.0,
    "date": "2026-03-13",
    "label": "Poivron + tomates + oignon",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 39,
    "accountId": 1,
    "categoryId": 37,
    "amount": 800.0,
    "date": "2026-03-14",
    "label": "Haricots verts + tomates + oignons",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 40,
    "accountId": 1,
    "categoryId": 41,
    "amount": 25000.0,
    "date": "2026-03-15",
    "label": "Maman",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 41,
    "accountId": 1,
    "categoryId": 37,
    "amount": 900.0,
    "date": "2026-03-15",
    "label": "Pomme de terre + tomates + oignons",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 42,
    "accountId": 1,
    "categoryId": 13,
    "amount": 500.0,
    "date": "2026-03-15",
    "label": "Vinaigre",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 43,
    "accountId": 1,
    "categoryId": 32,
    "amount": 24400.0,
    "date": "2026-03-31",
    "label": "Secret",
    "type": "expense",
    "notes": "14:10"
  },
  {
    "id": 44,
    "accountId": 1,
    "categoryId": 41,
    "amount": 100000.0,
    "date": "2026-08-03",
    "label": "OM",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 45,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-08-03",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 46,
    "accountId": 1,
    "categoryId": 2,
    "amount": 1300.0,
    "date": "2026-08-03",
    "label": "Sel 1Kg",
    "type": "expense",
    "notes": "Appliances"
  },
  {
    "id": 47,
    "accountId": 1,
    "categoryId": 33,
    "amount": 2000.0,
    "date": "2026-08-03",
    "label": "Yaourt x2",
    "type": "expense",
    "notes": "Snacks"
  },
  {
    "id": 48,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2200.0,
    "date": "2026-08-03",
    "label": "Nouilles x2",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 49,
    "accountId": 1,
    "categoryId": 15,
    "amount": 3700.0,
    "date": "2026-08-03",
    "label": "Vermicelles 500g",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 50,
    "accountId": 1,
    "categoryId": 3,
    "amount": 400.0,
    "date": "2026-08-03",
    "label": "Sachet",
    "type": "expense",
    "notes": "Bags"
  },
  {
    "id": 51,
    "accountId": 1,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-08-03",
    "label": "Forfait Yas",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 52,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-08-04",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 53,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1000.0,
    "date": "2026-08-04",
    "label": "Courgettes",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 54,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1000.0,
    "date": "2026-08-04",
    "label": "Tomates",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 55,
    "accountId": 1,
    "categoryId": 3,
    "amount": 200.0,
    "date": "2026-08-04",
    "label": "Sachet",
    "type": "expense",
    "notes": "Bags"
  },
  {
    "id": 56,
    "accountId": 1,
    "categoryId": 3,
    "amount": 600.0,
    "date": "2026-08-04",
    "label": "Sachet",
    "type": "expense",
    "notes": "Bags"
  },
  {
    "id": 57,
    "accountId": 1,
    "categoryId": 21,
    "amount": 2000.0,
    "date": "2026-08-04",
    "label": "Charbon",
    "type": "expense",
    "notes": "Gas"
  },
  {
    "id": 58,
    "accountId": 1,
    "categoryId": 23,
    "amount": 400.0,
    "date": "2026-08-04",
    "label": "Ramanonaka",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 59,
    "accountId": 1,
    "categoryId": 13,
    "amount": 800.0,
    "date": "2026-08-04",
    "label": "D\u00e9tergent x2",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 60,
    "accountId": 1,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-08-04",
    "label": "Forfait Yas",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 61,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-08-05",
    "label": "Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 62,
    "accountId": 1,
    "categoryId": 11,
    "amount": 2000.0,
    "date": "2026-08-05",
    "label": "Yas & Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 63,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-05",
    "label": "Ambohimiandra - Ankadifotsy",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 64,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-05",
    "label": "Ambohijatovo - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 65,
    "accountId": 1,
    "categoryId": 39,
    "amount": 20000.0,
    "date": "2026-08-05",
    "label": "Papa",
    "type": "income",
    "notes": "Bonus"
  },
  {
    "id": 66,
    "accountId": 1,
    "targetAccountId": 3,
    "categoryId": 45,
    "amount": 10000.0,
    "date": "2026-08-05",
    "label": "Virement vers Orange Money",
    "notes": "De Cash (Esp\u00e8ces) (16:54)",
    "type": "transfer"
  },
  {
    "id": 67,
    "accountId": 3,
    "categoryId": 20,
    "amount": 6300.0,
    "date": "2026-08-05",
    "label": "Free Fire Largage + frais",
    "type": "expense",
    "notes": "Gaming"
  },
  {
    "id": 68,
    "accountId": 1,
    "categoryId": 23,
    "amount": 2700.0,
    "date": "2026-08-05",
    "label": "Yaourt x3",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 69,
    "accountId": 1,
    "categoryId": 38,
    "amount": 2200.0,
    "date": "2026-08-05",
    "label": "Volnic 1,5L",
    "type": "expense",
    "notes": "Water"
  },
  {
    "id": 70,
    "accountId": 3,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-08-05",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 71,
    "accountId": 1,
    "categoryId": 14,
    "amount": 200.0,
    "date": "2026-08-06",
    "label": "Impression",
    "type": "expense",
    "notes": "Digital"
  },
  {
    "id": 72,
    "accountId": 1,
    "categoryId": 43,
    "amount": 58100.0,
    "date": "2026-08-06",
    "label": "Bourse",
    "type": "income",
    "notes": "Salary"
  },
  {
    "id": 73,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-06",
    "label": "Ambohijatovo - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 74,
    "accountId": 1,
    "categoryId": 15,
    "amount": 3000.0,
    "date": "2026-08-06",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 75,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-06",
    "label": "Ambohimiandra - Ambohijatovo",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 76,
    "accountId": 1,
    "categoryId": 23,
    "amount": 2300.0,
    "date": "2026-08-06",
    "label": "Yaourt x2",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 77,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1200.0,
    "date": "2026-08-06",
    "label": "Tomates x4",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 78,
    "accountId": 1,
    "categoryId": 41,
    "amount": 2000.0,
    "date": "2026-08-07",
    "label": "Doneli",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 79,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-08-07",
    "label": "Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 80,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-08-07",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 81,
    "accountId": 3,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-08-07",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 82,
    "accountId": 3,
    "categoryId": 31,
    "amount": 1000.0,
    "date": "2026-08-07",
    "label": "Transfer Yas",
    "type": "expense",
    "notes": "Repayment"
  },
  {
    "id": 83,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-07",
    "label": "Ambohimiandra - Ambohijatovo",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 84,
    "accountId": 1,
    "categoryId": 15,
    "amount": 7000.0,
    "date": "2026-08-07",
    "label": "Flocons d'avoine",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 85,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1600.0,
    "date": "2026-08-07",
    "label": "Mac\u00e9doine de L\u00e9gumes",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 86,
    "accountId": 1,
    "categoryId": 18,
    "amount": 1100.0,
    "date": "2026-08-07",
    "label": "Sakoa",
    "type": "expense",
    "notes": "Fruit"
  },
  {
    "id": 87,
    "accountId": 1,
    "categoryId": 23,
    "amount": 2800.0,
    "date": "2026-08-07",
    "label": "Yaourt x2",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 88,
    "accountId": 3,
    "categoryId": 11,
    "amount": 500.0,
    "date": "2026-08-08",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 89,
    "accountId": 1,
    "categoryId": 13,
    "amount": 2800.0,
    "date": "2026-08-08",
    "label": "Sucre 1Kg +2000",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 90,
    "accountId": 1,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-08-08",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 91,
    "accountId": 1,
    "categoryId": 23,
    "amount": 2800.0,
    "date": "2026-08-08",
    "label": "Yaourt x2",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 92,
    "accountId": 1,
    "categoryId": 8,
    "amount": 2000.0,
    "date": "2026-08-08",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 93,
    "accountId": 1,
    "categoryId": 38,
    "amount": 2200.0,
    "date": "2026-08-09",
    "label": "Volnic 1,5L",
    "type": "expense",
    "notes": "Water"
  },
  {
    "id": 94,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1400.0,
    "date": "2026-08-09",
    "label": "Yaourt",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 95,
    "accountId": 1,
    "categoryId": 11,
    "amount": 2000.0,
    "date": "2026-08-09",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 96,
    "accountId": 1,
    "categoryId": 23,
    "amount": 600.0,
    "date": "2026-08-09",
    "label": "Mofo Grefy x3",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 97,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-08-10",
    "label": "Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 98,
    "accountId": 1,
    "categoryId": 15,
    "amount": 1000.0,
    "date": "2026-08-10",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 99,
    "accountId": 1,
    "categoryId": 27,
    "amount": 4000.0,
    "date": "2026-08-10",
    "label": "Poulet x2",
    "type": "expense",
    "notes": "Meat"
  },
  {
    "id": 100,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1000.0,
    "date": "2026-08-10",
    "label": "Tomates",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 101,
    "accountId": 2,
    "categoryId": 41,
    "amount": 5000.0,
    "date": "2026-08-10",
    "label": "Egilson",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 102,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-11",
    "label": "vers Antanifotsy",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 103,
    "accountId": 1,
    "targetAccountId": 3,
    "categoryId": 45,
    "amount": 4000.0,
    "date": "2026-08-11",
    "label": "Virement vers Orange Money",
    "notes": "De Cash (Esp\u00e8ces) (10:07)",
    "type": "transfer"
  },
  {
    "id": 104,
    "accountId": 3,
    "categoryId": 26,
    "amount": 3300.0,
    "date": "2026-08-11",
    "label": "Orange Lany cr\u00e9dit",
    "type": "expense",
    "notes": "Loan"
  },
  {
    "id": 105,
    "accountId": 3,
    "categoryId": 11,
    "amount": 600.0,
    "date": "2026-08-11",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 106,
    "accountId": 1,
    "categoryId": 41,
    "amount": 10000.0,
    "date": "2026-08-11",
    "label": "Meme",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 107,
    "accountId": 1,
    "categoryId": 41,
    "amount": 5000.0,
    "date": "2026-08-11",
    "label": "Maman'Tony",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 108,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-11",
    "label": "Ankadifotsy - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 109,
    "accountId": 1,
    "categoryId": 1,
    "amount": 18000.0,
    "date": "2026-08-11",
    "label": "Achromatic Glasses + Ar4000 Delivery",
    "type": "expense",
    "notes": "Accessory"
  },
  {
    "id": 110,
    "accountId": 3,
    "categoryId": 11,
    "amount": 350.0,
    "date": "2026-08-11",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 111,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-11",
    "label": "Ambohimiandra - Ambohijatovo",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 112,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1400.0,
    "date": "2026-08-11",
    "label": "Yaourt",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 113,
    "accountId": 1,
    "categoryId": 37,
    "amount": 6400.0,
    "date": "2026-08-11",
    "label": "Piments",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 114,
    "accountId": 1,
    "categoryId": 11,
    "amount": 2000.0,
    "date": "2026-08-11",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 115,
    "accountId": 3,
    "categoryId": 41,
    "amount": 10000.0,
    "date": "2026-08-11",
    "label": "Mama",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 116,
    "accountId": 1,
    "categoryId": 4,
    "amount": 1500.0,
    "date": "2026-08-12",
    "label": "Coiffeur",
    "type": "expense",
    "notes": "Beauty"
  },
  {
    "id": 117,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-08-12",
    "label": "Ankazotokana - Analakely",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 118,
    "accountId": 1,
    "categoryId": 36,
    "amount": 5000.0,
    "date": "2026-08-12",
    "label": "Taxi Moto Analakely - Ankorondrano",
    "type": "expense",
    "notes": "Trans"
  },
  {
    "id": 119,
    "accountId": 1,
    "categoryId": 5,
    "amount": 2000.0,
    "date": "2026-08-12",
    "label": "Jus de Canne (Citron + Gingembre)",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 120,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-12",
    "label": "Ankorondrano - 67ha",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 121,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-12",
    "label": "67ha - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 122,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-08-12",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 123,
    "accountId": 3,
    "categoryId": 20,
    "amount": 5600.0,
    "date": "2026-08-12",
    "label": "Free Fire Largage + frais",
    "type": "expense",
    "notes": "Gaming"
  },
  {
    "id": 124,
    "accountId": 1,
    "categoryId": 38,
    "amount": 2200.0,
    "date": "2026-08-12",
    "label": "Volnic 1,5L",
    "type": "expense",
    "notes": "Water"
  },
  {
    "id": 125,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1400.0,
    "date": "2026-08-12",
    "label": "Yaourt",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 126,
    "accountId": 1,
    "categoryId": 23,
    "amount": 2000.0,
    "date": "2026-08-12",
    "label": "Compos\u00e9 + Brochette",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 127,
    "accountId": 1,
    "categoryId": 28,
    "amount": 700.0,
    "date": "2026-08-12",
    "label": "Efferalgan",
    "type": "expense",
    "notes": "Medical"
  },
  {
    "id": 128,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1000.0,
    "date": "2026-08-12",
    "label": "Tomates",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 129,
    "accountId": 1,
    "categoryId": 37,
    "amount": 500.0,
    "date": "2026-08-12",
    "label": "Poivron",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 130,
    "accountId": 2,
    "categoryId": 41,
    "amount": 10000.0,
    "date": "2026-08-13",
    "label": "Fanantenana x2",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 131,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-08-13",
    "label": "Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 132,
    "accountId": 2,
    "categoryId": 41,
    "amount": 5000.0,
    "date": "2026-08-13",
    "label": "Felicite Lydia",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 133,
    "accountId": 3,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-08-13",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 134,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1000.0,
    "date": "2026-08-13",
    "label": "Ramanonaka",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 135,
    "accountId": 1,
    "categoryId": 42,
    "amount": 40000.0,
    "date": "2026-08-13",
    "label": "Mois d'ao\u00fbt",
    "type": "income",
    "notes": "Rent"
  },
  {
    "id": 136,
    "accountId": 1,
    "categoryId": 28,
    "amount": 7000.0,
    "date": "2026-08-14",
    "label": "Sparadrap",
    "type": "expense",
    "notes": "Medical"
  },
  {
    "id": 137,
    "accountId": 1,
    "categoryId": 28,
    "amount": 1300.0,
    "date": "2026-08-14",
    "label": "Cotton",
    "type": "expense",
    "notes": "Medical"
  },
  {
    "id": 138,
    "accountId": 3,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-08-14",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 139,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-14",
    "label": "Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 140,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-08-14",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 141,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-14",
    "label": "Ambohimiandra - Ambohijatovo",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 142,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1400.0,
    "date": "2026-08-14",
    "label": "Yaourt",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 143,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1900.0,
    "date": "2026-08-14",
    "label": "Achard Mangue 154g",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 144,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1300.0,
    "date": "2026-08-14",
    "label": "Achard l\u00e9gumes 100g",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 145,
    "accountId": 1,
    "categoryId": 13,
    "amount": 5500.0,
    "date": "2026-08-14",
    "label": "Dentifrice Sparkle",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 146,
    "accountId": 3,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-08-15",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 147,
    "accountId": 1,
    "categoryId": 27,
    "amount": 10000.0,
    "date": "2026-08-15",
    "label": "Assiette de Brochettes",
    "type": "expense",
    "notes": "Meat"
  },
  {
    "id": 148,
    "accountId": 1,
    "categoryId": 33,
    "amount": 3000.0,
    "date": "2026-08-15",
    "label": "Frites aux Fromages",
    "type": "expense",
    "notes": "Snacks"
  },
  {
    "id": 149,
    "accountId": 1,
    "categoryId": 5,
    "amount": 3500.0,
    "date": "2026-08-15",
    "label": "Milkshake x2",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 150,
    "accountId": 1,
    "categoryId": 9,
    "amount": 500.0,
    "date": "2026-08-15",
    "label": "Pourboires",
    "type": "expense",
    "notes": "Cash gift"
  },
  {
    "id": 151,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1200.0,
    "date": "2026-08-15",
    "label": "Yaourt",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 152,
    "accountId": 1,
    "categoryId": 3,
    "amount": 300.0,
    "date": "2026-08-15",
    "label": "Sachet",
    "type": "expense",
    "notes": "Bags"
  },
  {
    "id": 153,
    "accountId": 1,
    "categoryId": 35,
    "amount": 2500.0,
    "date": "2026-08-15",
    "label": "Colle Epoxy",
    "type": "expense",
    "notes": "Tools"
  },
  {
    "id": 154,
    "accountId": 1,
    "categoryId": 35,
    "amount": 2000.0,
    "date": "2026-08-15",
    "label": "Barnader",
    "type": "expense",
    "notes": "Tools"
  },
  {
    "id": 155,
    "accountId": 1,
    "categoryId": 24,
    "amount": 10000.0,
    "date": "2026-08-15",
    "label": "Bazary Semaine",
    "type": "expense",
    "notes": "Health"
  },
  {
    "id": 156,
    "accountId": 1,
    "categoryId": 41,
    "amount": 11000.0,
    "date": "2026-08-15",
    "label": "Tatiana",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 157,
    "accountId": 2,
    "categoryId": 31,
    "amount": 2000.0,
    "date": "2026-08-15",
    "label": "Tatiana",
    "type": "expense",
    "notes": "Repayment"
  },
  {
    "id": 158,
    "accountId": 1,
    "categoryId": 22,
    "amount": 2200.0,
    "date": "2026-08-15",
    "label": "Yaourt Tamby + Tatiana",
    "type": "expense",
    "notes": "Gift"
  },
  {
    "id": 159,
    "accountId": 1,
    "categoryId": 28,
    "amount": 6800.0,
    "date": "2026-08-15",
    "label": "Pansement x2",
    "type": "expense",
    "notes": "Medical"
  },
  {
    "id": 160,
    "accountId": 3,
    "categoryId": 11,
    "amount": 1400.0,
    "date": "2026-08-16",
    "label": "Connectivity",
    "type": "expense",
    "notes": "16:59"
  },
  {
    "id": 161,
    "accountId": 2,
    "categoryId": 11,
    "amount": 2000.0,
    "date": "2026-08-16",
    "label": "Forfait Yas",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 162,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-08-17",
    "label": "Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 163,
    "accountId": 1,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-08-17",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 164,
    "accountId": 1,
    "categoryId": 15,
    "amount": 1000.0,
    "date": "2026-08-17",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 165,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-17",
    "label": "180 : Andohanimandroseza - Ivandry",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 166,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-17",
    "label": "180 : Ivandry - Andohanimandroseza",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 167,
    "accountId": 1,
    "categoryId": 28,
    "amount": 700.0,
    "date": "2026-08-17",
    "label": "Efferalgan",
    "type": "expense",
    "notes": "Medical"
  },
  {
    "id": 168,
    "accountId": 1,
    "categoryId": 23,
    "amount": 600.0,
    "date": "2026-08-17",
    "label": "Ramanonaka",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 169,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-18",
    "label": "015 : Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 170,
    "accountId": 2,
    "targetAccountId": 3,
    "categoryId": 45,
    "amount": 14500.0,
    "date": "2026-08-18",
    "label": "Virement vers Orange Money",
    "notes": "De Mvola 2 (09:08)",
    "type": "transfer"
  },
  {
    "id": 171,
    "accountId": 1,
    "targetAccountId": 3,
    "categoryId": 45,
    "amount": 15000.0,
    "date": "2026-08-18",
    "label": "Virement vers Orange Money",
    "notes": "De Cash (Esp\u00e8ces) (09:58)",
    "type": "transfer"
  },
  {
    "id": 172,
    "accountId": 3,
    "categoryId": 29,
    "amount": 29000.0,
    "date": "2026-08-18",
    "label": "Spotify family",
    "type": "expense",
    "notes": "Membership"
  },
  {
    "id": 173,
    "accountId": 1,
    "categoryId": 15,
    "amount": 3900.0,
    "date": "2026-08-18",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 174,
    "accountId": 1,
    "categoryId": 8,
    "amount": 2400.0,
    "date": "2026-08-18",
    "label": "Frais bus x4",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 175,
    "accountId": 1,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-08-18",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 176,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-08-19",
    "label": "015 : Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 177,
    "accountId": 1,
    "categoryId": 11,
    "amount": 2000.0,
    "date": "2026-08-19",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 178,
    "accountId": 1,
    "categoryId": 15,
    "amount": 1000.0,
    "date": "2026-08-19",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 179,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-08-20",
    "label": "015 : Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 180,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-08-20",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 181,
    "accountId": 3,
    "categoryId": 41,
    "amount": 30000.0,
    "date": "2026-08-20",
    "label": "Depot Maman",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 182,
    "accountId": 1,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-08-20",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 183,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-08-21",
    "label": "Dining",
    "type": "expense",
    "notes": "12:32"
  },
  {
    "id": 184,
    "accountId": 3,
    "targetAccountId": 1,
    "categoryId": 45,
    "amount": 30500.0,
    "date": "2026-08-21",
    "label": "Virement vers Cash (Esp\u00e8ces)",
    "notes": "De Orange Money (17:45)",
    "type": "transfer"
  },
  {
    "id": 185,
    "accountId": 1,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-08-21",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 186,
    "accountId": 1,
    "categoryId": 5,
    "amount": 2100.0,
    "date": "2026-08-22",
    "label": "Yoplait",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 187,
    "accountId": 1,
    "categoryId": 5,
    "amount": 2100.0,
    "date": "2026-08-22",
    "label": "Jus de pomme homeopharma",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 188,
    "accountId": 1,
    "categoryId": 10,
    "amount": 5000.0,
    "date": "2026-08-22",
    "label": "Chaussettes x2",
    "type": "expense",
    "notes": "Clothing"
  },
  {
    "id": 189,
    "accountId": 1,
    "categoryId": 5,
    "amount": 600.0,
    "date": "2026-08-22",
    "label": "natural juice Ginger+percil",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 190,
    "accountId": 1,
    "categoryId": 5,
    "amount": 500.0,
    "date": "2026-08-22",
    "label": "Sirop de pomme",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 191,
    "accountId": 1,
    "categoryId": 12,
    "amount": 6400.0,
    "date": "2026-08-22",
    "label": "D\u00e9odorant",
    "type": "expense",
    "notes": "Cosmetics"
  },
  {
    "id": 192,
    "accountId": 1,
    "categoryId": 11,
    "amount": 2000.0,
    "date": "2026-08-22",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 193,
    "accountId": 3,
    "categoryId": 11,
    "amount": 3350.0,
    "date": "2026-08-23",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 194,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-08-24",
    "label": "139 : Ambatoroaka - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 195,
    "accountId": 1,
    "categoryId": 15,
    "amount": 1000.0,
    "date": "2026-08-24",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 196,
    "accountId": 2,
    "categoryId": 11,
    "amount": 1500.0,
    "date": "2026-08-25",
    "label": "Connectivity",
    "type": "expense",
    "notes": "08:03"
  },
  {
    "id": 197,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-08-25",
    "label": "I : Ambatoroaka - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 198,
    "accountId": 1,
    "categoryId": 11,
    "amount": 500.0,
    "date": "2026-08-25",
    "label": "Forfait Yas",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 199,
    "accountId": 1,
    "categoryId": 15,
    "amount": 1000.0,
    "date": "2026-08-25",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 200,
    "accountId": 3,
    "categoryId": 41,
    "amount": 15000.0,
    "date": "2026-08-25",
    "label": "Depot Maman",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 201,
    "accountId": 1,
    "categoryId": 13,
    "amount": 5600.0,
    "date": "2026-08-25",
    "label": "Huile 500ml",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 202,
    "accountId": 1,
    "categoryId": 37,
    "amount": 2500.0,
    "date": "2026-08-25",
    "label": "Tomate + oignons + poivrons",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 203,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2400.0,
    "date": "2026-08-25",
    "label": "Nouilles x2",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 204,
    "accountId": 3,
    "categoryId": 11,
    "amount": 3500.0,
    "date": "2026-08-26",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 205,
    "accountId": 1,
    "categoryId": 15,
    "amount": 1000.0,
    "date": "2026-08-26",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 206,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-26",
    "label": "Ambohimiandra - Anosy",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 207,
    "accountId": 1,
    "categoryId": 15,
    "amount": 1000.0,
    "date": "2026-08-27",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 208,
    "accountId": 3,
    "categoryId": 11,
    "amount": 3500.0,
    "date": "2026-08-28",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 209,
    "accountId": 3,
    "targetAccountId": 1,
    "categoryId": 45,
    "amount": 4000.0,
    "date": "2026-08-28",
    "label": "Virement vers Cash (Esp\u00e8ces)",
    "notes": "De Orange Money (07:53)",
    "type": "transfer"
  },
  {
    "id": 210,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-08-28",
    "label": "015 : Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 211,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-08-28",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 212,
    "accountId": 3,
    "categoryId": 41,
    "amount": 25000.0,
    "date": "2026-08-28",
    "label": "D\u00e9p\u00f4t",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 213,
    "accountId": 3,
    "targetAccountId": 1,
    "categoryId": 45,
    "amount": 25000.0,
    "date": "2026-08-28",
    "label": "Virement vers Cash (Esp\u00e8ces)",
    "notes": "De Orange Money (17:01)",
    "type": "transfer"
  },
  {
    "id": 214,
    "accountId": 1,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-08-28",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 215,
    "accountId": 3,
    "categoryId": 11,
    "amount": 700.0,
    "date": "2026-08-29",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 216,
    "accountId": 1,
    "categoryId": 15,
    "amount": 5000.0,
    "date": "2026-08-29",
    "label": "Petit D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 217,
    "accountId": 1,
    "categoryId": 38,
    "amount": 1700.0,
    "date": "2026-08-29",
    "label": "Natur'eau",
    "type": "expense",
    "notes": "Water"
  },
  {
    "id": 218,
    "accountId": 1,
    "categoryId": 28,
    "amount": 1400.0,
    "date": "2026-08-29",
    "label": "Efferalgan x2",
    "type": "expense",
    "notes": "Medical"
  },
  {
    "id": 219,
    "accountId": 1,
    "categoryId": 15,
    "amount": 10000.0,
    "date": "2026-08-29",
    "label": "Min'sao Poulet + 4 crudit\u00e9s",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 220,
    "accountId": 1,
    "categoryId": 22,
    "amount": 2000.0,
    "date": "2026-08-29",
    "label": "Angoy",
    "type": "expense",
    "notes": "Gift"
  },
  {
    "id": 221,
    "accountId": 1,
    "categoryId": 24,
    "amount": 4900.0,
    "date": "2026-08-30",
    "label": "M\u00e9dicament + eau + biscuits",
    "type": "expense",
    "notes": "Health"
  },
  {
    "id": 222,
    "accountId": 3,
    "categoryId": 41,
    "amount": 30000.0,
    "date": "2026-08-31",
    "label": "Depot Maman",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 223,
    "accountId": 3,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-08-31",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 224,
    "accountId": 3,
    "targetAccountId": 1,
    "categoryId": 45,
    "amount": 29000.0,
    "date": "2026-08-31",
    "label": "Virement vers Cash (Esp\u00e8ces)",
    "notes": "De Orange Money (11:34)",
    "type": "transfer"
  },
  {
    "id": 225,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-31",
    "label": "Ankazotokana - Analakely",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 226,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-31",
    "label": "120 : Analakely - Ivandry",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 227,
    "accountId": 1,
    "categoryId": 5,
    "amount": 4200.0,
    "date": "2026-08-31",
    "label": "Jus de pomme homeopharma x2",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 228,
    "accountId": 1,
    "categoryId": 15,
    "amount": 3600.0,
    "date": "2026-08-31",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 229,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-08-31",
    "label": "120 : Ivandry - Analakely",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 230,
    "accountId": 1,
    "categoryId": 38,
    "amount": 2200.0,
    "date": "2026-08-31",
    "label": "Volnic 1,5L",
    "type": "expense",
    "notes": "Water"
  },
  {
    "id": 231,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2200.0,
    "date": "2026-08-31",
    "label": "Nouilles x2",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 232,
    "accountId": 1,
    "categoryId": 18,
    "amount": 1000.0,
    "date": "2026-08-31",
    "label": "Fraise",
    "type": "expense",
    "notes": "Fruit"
  },
  {
    "id": 233,
    "accountId": 1,
    "categoryId": 18,
    "amount": 2500.0,
    "date": "2026-08-31",
    "label": "Orange 1/2 Kg",
    "type": "expense",
    "notes": "Fruit"
  },
  {
    "id": 234,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-09-01",
    "label": "015 : Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 235,
    "accountId": 3,
    "categoryId": 41,
    "amount": 100000.0,
    "date": "2026-09-01",
    "label": "Depot Maman",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 236,
    "accountId": 1,
    "categoryId": 15,
    "amount": 5500.0,
    "date": "2026-09-01",
    "label": "Nouilles",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 237,
    "accountId": 1,
    "categoryId": 33,
    "amount": 2000.0,
    "date": "2026-09-02",
    "label": "Bonbons",
    "type": "expense",
    "notes": "Snacks"
  },
  {
    "id": 238,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-09-02",
    "label": "015 : Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 239,
    "accountId": 1,
    "categoryId": 6,
    "amount": 200.0,
    "date": "2026-09-02",
    "label": "Impression",
    "type": "expense",
    "notes": "Books"
  },
  {
    "id": 240,
    "accountId": 1,
    "categoryId": 23,
    "amount": 2000.0,
    "date": "2026-09-02",
    "label": "Soupe",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 241,
    "accountId": 1,
    "categoryId": 43,
    "amount": 58100.0,
    "date": "2026-09-03",
    "label": "Bourse",
    "type": "income",
    "notes": "Salary"
  },
  {
    "id": 242,
    "accountId": 1,
    "categoryId": 33,
    "amount": 5000.0,
    "date": "2026-09-03",
    "label": "Bonbons",
    "type": "expense",
    "notes": "Snacks"
  },
  {
    "id": 243,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-03",
    "label": "I : Ambohijatovo - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 244,
    "accountId": 1,
    "categoryId": 42,
    "amount": 40000.0,
    "date": "2026-09-03",
    "label": "Doneli",
    "type": "income",
    "notes": "Rent"
  },
  {
    "id": 245,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-09-03",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 246,
    "accountId": 1,
    "categoryId": 18,
    "amount": 2000.0,
    "date": "2026-09-03",
    "label": "Orange",
    "type": "expense",
    "notes": "Fruit"
  },
  {
    "id": 247,
    "accountId": 3,
    "categoryId": 11,
    "amount": 13500.0,
    "date": "2026-09-03",
    "label": "Weekly Forfait",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 248,
    "accountId": 1,
    "categoryId": 18,
    "amount": 2000.0,
    "date": "2026-09-03",
    "label": "Orange",
    "type": "expense",
    "notes": "Fruit"
  },
  {
    "id": 249,
    "accountId": 1,
    "categoryId": 27,
    "amount": 2000.0,
    "date": "2026-09-03",
    "label": "Poulet",
    "type": "expense",
    "notes": "Meat"
  },
  {
    "id": 250,
    "accountId": 1,
    "categoryId": 15,
    "amount": 5000.0,
    "date": "2026-09-03",
    "label": "Riz 2kg",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 251,
    "accountId": 1,
    "categoryId": 27,
    "amount": 1400.0,
    "date": "2026-09-03",
    "label": "Eggs x2",
    "type": "expense",
    "notes": "Meat"
  },
  {
    "id": 252,
    "accountId": 1,
    "categoryId": 37,
    "amount": 800.0,
    "date": "2026-09-03",
    "label": "Tomates x4",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 253,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-04",
    "label": "I : Ambohimiandra - Ambohijatovo",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 254,
    "accountId": 1,
    "categoryId": 15,
    "amount": 1500.0,
    "date": "2026-09-04",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 255,
    "accountId": 1,
    "categoryId": 23,
    "amount": 8000.0,
    "date": "2026-09-04",
    "label": "Popcorn",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 256,
    "accountId": 1,
    "categoryId": 28,
    "amount": 2000.0,
    "date": "2026-09-04",
    "label": "Masque M\u00e9dical",
    "type": "expense",
    "notes": "Medical"
  },
  {
    "id": 257,
    "accountId": 1,
    "categoryId": 18,
    "amount": 1000.0,
    "date": "2026-09-04",
    "label": "Fraise",
    "type": "expense",
    "notes": "Fruit"
  },
  {
    "id": 258,
    "accountId": 1,
    "categoryId": 27,
    "amount": 4000.0,
    "date": "2026-09-04",
    "label": "Poulet x2",
    "type": "expense",
    "notes": "Meat"
  },
  {
    "id": 259,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-09-05",
    "label": "139 : ? - Antanimena",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 260,
    "accountId": 1,
    "categoryId": 33,
    "amount": 500.0,
    "date": "2026-09-05",
    "label": "Contre toux",
    "type": "expense",
    "notes": "Snacks"
  },
  {
    "id": 261,
    "accountId": 1,
    "categoryId": 8,
    "amount": 1200.0,
    "date": "2026-09-05",
    "label": "147 : Anosy - 67ha",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 262,
    "accountId": 1,
    "categoryId": 10,
    "amount": 3000.0,
    "date": "2026-09-05",
    "label": "T-shirt",
    "type": "expense",
    "notes": "Clothing"
  },
  {
    "id": 263,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1000.0,
    "date": "2026-09-05",
    "label": "Frites",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 264,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1500.0,
    "date": "2026-09-05",
    "label": "Bonbons voanjo",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 265,
    "accountId": 1,
    "categoryId": 37,
    "amount": 2500.0,
    "date": "2026-09-05",
    "label": "Gros oignons 1kg",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 266,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1000.0,
    "date": "2026-09-05",
    "label": "Petit pois",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 267,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-05",
    "label": "Ambodiviona - Analakely",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 268,
    "accountId": 3,
    "categoryId": 25,
    "amount": 5490.0,
    "date": "2026-09-06",
    "label": "Vao Shp Avocat 300ml",
    "type": "expense",
    "notes": "Hygiene"
  },
  {
    "id": 269,
    "accountId": 3,
    "categoryId": 25,
    "amount": 7290.0,
    "date": "2026-09-06",
    "label": "Huile Tsara Argan (apr\u00e8s shampooing)",
    "type": "expense",
    "notes": "Hygiene"
  },
  {
    "id": 270,
    "accountId": 3,
    "categoryId": 13,
    "amount": 1990.0,
    "date": "2026-09-06",
    "label": "Lessive Liquide Exp",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 271,
    "accountId": 3,
    "categoryId": 13,
    "amount": 2150.0,
    "date": "2026-09-06",
    "label": "Lessive Linge Ultra",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 272,
    "accountId": 3,
    "categoryId": 28,
    "amount": 6590.0,
    "date": "2026-09-06",
    "label": "Purificateur d'air Impec",
    "type": "expense",
    "notes": "Medical"
  },
  {
    "id": 273,
    "accountId": 3,
    "categoryId": 13,
    "amount": 350.0,
    "date": "2026-09-06",
    "label": "Sachet Score",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 274,
    "accountId": 1,
    "categoryId": 37,
    "amount": 2000.0,
    "date": "2026-09-06",
    "label": "Tomate 1/2 Kg",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 275,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1400.0,
    "date": "2026-09-06",
    "label": "Tsaramaso 1kp",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 276,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1000.0,
    "date": "2026-09-06",
    "label": "Pomme de terre 1/2 Kg",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 277,
    "accountId": 3,
    "categoryId": 11,
    "amount": 13500.0,
    "date": "2026-09-06",
    "label": "Weekly Forfait",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 278,
    "accountId": 1,
    "categoryId": 4,
    "amount": 1500.0,
    "date": "2026-09-06",
    "label": "Coiffeur",
    "type": "expense",
    "notes": "Beauty"
  },
  {
    "id": 279,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-06",
    "label": "015 : Ambanidia - Andavamamba",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 280,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-06",
    "label": "Ampefiloha - Analakely",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 281,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-09-07",
    "label": "I : Ambatoroaka - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 282,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-09-07",
    "label": "Dining",
    "type": "expense",
    "notes": "13:07"
  },
  {
    "id": 283,
    "accountId": 1,
    "categoryId": 33,
    "amount": 900.0,
    "date": "2026-09-07",
    "label": "Bonbons",
    "type": "expense",
    "notes": "Snacks"
  },
  {
    "id": 284,
    "accountId": 1,
    "categoryId": 23,
    "amount": 500.0,
    "date": "2026-09-07",
    "label": "Mofo Gasy",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 285,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-09-08",
    "label": "Dining",
    "type": "expense",
    "notes": "13:09"
  },
  {
    "id": 286,
    "accountId": 3,
    "categoryId": 41,
    "amount": 55000.0,
    "date": "2026-09-08",
    "label": "Serveur",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 287,
    "accountId": 3,
    "categoryId": 17,
    "amount": 48700.0,
    "date": "2026-09-09",
    "label": "Google Cloud \ufe0f",
    "type": "expense",
    "notes": "Education"
  },
  {
    "id": 288,
    "accountId": 1,
    "categoryId": 27,
    "amount": 2000.0,
    "date": "2026-09-09",
    "label": "Poulet",
    "type": "expense",
    "notes": "Meat"
  },
  {
    "id": 289,
    "accountId": 1,
    "categoryId": 37,
    "amount": 700.0,
    "date": "2026-09-09",
    "label": "Carottes+haricots verts",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 290,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-09-10",
    "label": "I : Ambatoroaka - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 291,
    "accountId": 3,
    "targetAccountId": 1,
    "categoryId": 45,
    "amount": 6000.0,
    "date": "2026-09-10",
    "label": "Virement vers Cash (Esp\u00e8ces)",
    "notes": "De Orange Money (09:24)",
    "type": "transfer"
  },
  {
    "id": 292,
    "accountId": 1,
    "categoryId": 37,
    "amount": 2000.0,
    "date": "2026-09-10",
    "label": "Tomate 1/2 Kg",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 293,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1600.0,
    "date": "2026-09-10",
    "label": "Petit pois x2",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 294,
    "accountId": 1,
    "categoryId": 23,
    "amount": 400.0,
    "date": "2026-09-10",
    "label": "Ramanonaka x2",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 295,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-11",
    "label": "015 : Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 296,
    "accountId": 2,
    "categoryId": 41,
    "amount": 5000.0,
    "date": "2026-09-11",
    "label": "Fifaliana",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 297,
    "accountId": 3,
    "categoryId": 34,
    "amount": 5400.0,
    "date": "2026-09-11",
    "label": "Tondraka",
    "type": "expense",
    "notes": "Social"
  },
  {
    "id": 298,
    "accountId": 1,
    "categoryId": 43,
    "amount": 120000.0,
    "date": "2026-09-11",
    "label": "Allocation de Stage",
    "type": "income",
    "notes": "Salary"
  },
  {
    "id": 299,
    "accountId": 1,
    "categoryId": 33,
    "amount": 1000.0,
    "date": "2026-09-12",
    "label": "Bonbons",
    "type": "expense",
    "notes": "Snacks"
  },
  {
    "id": 300,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-12",
    "label": "015 : Ambanidia - 67Ha",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 301,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1000.0,
    "date": "2026-09-12",
    "label": "Lasary manga",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 302,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-09-12",
    "label": "133 : Ampefiloha - Analakely",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 303,
    "accountId": 3,
    "categoryId": 13,
    "amount": 4790.0,
    "date": "2026-09-12",
    "label": "Curcuma",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 304,
    "accountId": 3,
    "categoryId": 13,
    "amount": 4590.0,
    "date": "2026-09-12",
    "label": "Curry",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 305,
    "accountId": 3,
    "categoryId": 25,
    "amount": 6190.0,
    "date": "2026-09-12",
    "label": "Paprika",
    "type": "expense",
    "notes": "Hygiene"
  },
  {
    "id": 306,
    "accountId": 3,
    "categoryId": 24,
    "amount": 3850.0,
    "date": "2026-09-12",
    "label": "Fromage Candia Rouge",
    "type": "expense",
    "notes": "Health"
  },
  {
    "id": 307,
    "accountId": 3,
    "categoryId": 24,
    "amount": 5550.0,
    "date": "2026-09-12",
    "label": "Fromage Candia Lait",
    "type": "expense",
    "notes": "Health"
  },
  {
    "id": 308,
    "accountId": 3,
    "categoryId": 13,
    "amount": 8490.0,
    "date": "2026-09-12",
    "label": "10 Sacs poubelles 50L",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 309,
    "accountId": 1,
    "categoryId": 15,
    "amount": 4000.0,
    "date": "2026-09-12",
    "label": "Nouilles Presto x4",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 310,
    "accountId": 3,
    "categoryId": 38,
    "amount": 2190.0,
    "date": "2026-09-12",
    "label": "Volnic 1,5L",
    "type": "expense",
    "notes": "Water"
  },
  {
    "id": 311,
    "accountId": 1,
    "categoryId": 15,
    "amount": 500.0,
    "date": "2026-09-12",
    "label": "Lasary",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 312,
    "accountId": 1,
    "categoryId": 5,
    "amount": 1000.0,
    "date": "2026-09-12",
    "label": "Jus Fraise et Ananas",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 313,
    "accountId": 1,
    "categoryId": 15,
    "amount": 1000.0,
    "date": "2026-09-12",
    "label": "Soupe Chinoise",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 314,
    "accountId": 3,
    "categoryId": 11,
    "amount": 2000.0,
    "date": "2026-09-12",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 315,
    "accountId": 1,
    "categoryId": 36,
    "amount": 8500.0,
    "date": "2026-09-13",
    "label": "Taxi Moto Ambanidia - Ankadifotsy",
    "type": "expense",
    "notes": "Trans"
  },
  {
    "id": 316,
    "accountId": 1,
    "categoryId": 9,
    "amount": 1500.0,
    "date": "2026-09-13",
    "label": "Cash gift",
    "type": "expense",
    "notes": "08:21"
  },
  {
    "id": 317,
    "accountId": 1,
    "categoryId": 23,
    "amount": 2800.0,
    "date": "2026-09-13",
    "label": "Yaourt x2",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 318,
    "accountId": 1,
    "categoryId": 22,
    "amount": 2000.0,
    "date": "2026-09-13",
    "label": "Tatiana Frippe",
    "type": "expense",
    "notes": "Gift"
  },
  {
    "id": 319,
    "accountId": 1,
    "categoryId": 18,
    "amount": 2500.0,
    "date": "2026-09-13",
    "label": "Fraise 1Kg",
    "type": "expense",
    "notes": "Fruit"
  },
  {
    "id": 320,
    "accountId": 1,
    "categoryId": 22,
    "amount": 1000.0,
    "date": "2026-09-13",
    "label": "Kitay menaka Tat's",
    "type": "expense",
    "notes": "Gift"
  },
  {
    "id": 321,
    "accountId": 3,
    "categoryId": 41,
    "amount": 15000.0,
    "date": "2026-09-13",
    "label": "Maman",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 322,
    "accountId": 3,
    "categoryId": 11,
    "amount": 13500.0,
    "date": "2026-09-13",
    "label": "Weekly Forfait",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 323,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-14",
    "label": "015 : Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 324,
    "accountId": 1,
    "categoryId": 33,
    "amount": 500.0,
    "date": "2026-09-14",
    "label": "Bonbons",
    "type": "expense",
    "notes": "Snacks"
  },
  {
    "id": 325,
    "accountId": 3,
    "targetAccountId": 1,
    "categoryId": 45,
    "amount": 3200.0,
    "date": "2026-09-14",
    "label": "Virement vers Cash (Esp\u00e8ces)",
    "notes": "De Orange Money (13:23)",
    "type": "transfer"
  },
  {
    "id": 326,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-14",
    "label": "I : Ambohimiandra - Ambohijatovo",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 327,
    "accountId": 1,
    "categoryId": 5,
    "amount": 2180.0,
    "date": "2026-09-14",
    "label": "Jus en brique x2",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 328,
    "accountId": 1,
    "categoryId": 15,
    "amount": 4780.0,
    "date": "2026-09-14",
    "label": "Nouilles Sukses x2",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 329,
    "accountId": 1,
    "categoryId": 13,
    "amount": 350.0,
    "date": "2026-09-14",
    "label": "Sachet Score",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 330,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1000.0,
    "date": "2026-09-14",
    "label": "Compos\u00e9",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 331,
    "accountId": 1,
    "categoryId": 37,
    "amount": 400.0,
    "date": "2026-09-14",
    "label": "Poivrons",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 332,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1000.0,
    "date": "2026-09-14",
    "label": "Tomate",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 333,
    "accountId": 1,
    "categoryId": 28,
    "amount": 1600.0,
    "date": "2026-09-14",
    "label": "Efferalgan x2",
    "type": "expense",
    "notes": "Medical"
  },
  {
    "id": 334,
    "accountId": 1,
    "categoryId": 23,
    "amount": 600.0,
    "date": "2026-09-14",
    "label": "Mofo Grefy",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 335,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-15",
    "label": "015 : Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 336,
    "accountId": 1,
    "targetAccountId": 3,
    "categoryId": 45,
    "amount": 1000.0,
    "date": "2026-09-15",
    "label": "Virement vers Orange Money",
    "notes": "De Cash (Esp\u00e8ces) (12:06)",
    "type": "transfer"
  },
  {
    "id": 337,
    "accountId": 2,
    "targetAccountId": 3,
    "categoryId": 45,
    "amount": 4700.0,
    "date": "2026-09-15",
    "label": "Virement vers Orange Money",
    "notes": "De Mvola 2 (12:07)",
    "type": "transfer"
  },
  {
    "id": 338,
    "accountId": 2,
    "categoryId": 31,
    "amount": 300.0,
    "date": "2026-09-15",
    "label": "Fee",
    "type": "expense",
    "notes": "Repayment"
  },
  {
    "id": 339,
    "accountId": 1,
    "categoryId": 27,
    "amount": 2000.0,
    "date": "2026-09-15",
    "label": "Poulet",
    "type": "expense",
    "notes": "Meat"
  },
  {
    "id": 340,
    "accountId": 1,
    "categoryId": 37,
    "amount": 600.0,
    "date": "2026-09-15",
    "label": "Tomate",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 341,
    "accountId": 1,
    "categoryId": 23,
    "amount": 600.0,
    "date": "2026-09-15",
    "label": "Ramanonaka x3",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 342,
    "accountId": 3,
    "categoryId": 11,
    "amount": 2000.0,
    "date": "2026-09-16",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 343,
    "accountId": 1,
    "categoryId": 37,
    "amount": 200.0,
    "date": "2026-09-16",
    "label": "Tomate",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 344,
    "accountId": 1,
    "categoryId": 37,
    "amount": 800.0,
    "date": "2026-09-16",
    "label": "Petit pois",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 345,
    "accountId": 1,
    "categoryId": 23,
    "amount": 400.0,
    "date": "2026-09-16",
    "label": "Mofo Gasy x2",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 346,
    "accountId": 1,
    "categoryId": 5,
    "amount": 2200.0,
    "date": "2026-09-16",
    "label": "Boisson (Caprice bonbon anglais Doneli)",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 347,
    "accountId": 1,
    "categoryId": 33,
    "amount": 1390.0,
    "date": "2026-09-17",
    "label": "10 B\u00e2tonnets Croquants",
    "type": "expense",
    "notes": "Snacks"
  },
  {
    "id": 348,
    "accountId": 1,
    "categoryId": 23,
    "amount": 990.0,
    "date": "2026-09-17",
    "label": "Frego Litchi",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 349,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1190.0,
    "date": "2026-09-17",
    "label": "Frego Vanille",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 350,
    "accountId": 1,
    "categoryId": 13,
    "amount": 350.0,
    "date": "2026-09-17",
    "label": "Sachet",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 351,
    "accountId": 1,
    "categoryId": 5,
    "amount": 2000.0,
    "date": "2026-09-17",
    "label": "Caprice Citron",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 352,
    "accountId": 1,
    "categoryId": 24,
    "amount": 3900.0,
    "date": "2026-09-17",
    "label": "Fromage Candia Rouge",
    "type": "expense",
    "notes": "Health"
  },
  {
    "id": 353,
    "accountId": 1,
    "categoryId": 15,
    "amount": 3500.0,
    "date": "2026-09-17",
    "label": "Nouilles Voky be",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 354,
    "accountId": 1,
    "categoryId": 13,
    "amount": 3700.0,
    "date": "2026-09-17",
    "label": "Vinaigre aromatis\u00e9",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 355,
    "accountId": 2,
    "categoryId": 41,
    "amount": 15000.0,
    "date": "2026-09-18",
    "label": "Depot Spotify",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 356,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-09-18",
    "label": "015 : Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 357,
    "accountId": 1,
    "targetAccountId": 3,
    "categoryId": 45,
    "amount": 10000.0,
    "date": "2026-09-18",
    "label": "Virement vers Orange Money",
    "notes": "De Cash (Esp\u00e8ces) (08:32)",
    "type": "transfer"
  },
  {
    "id": 358,
    "accountId": 1,
    "categoryId": 33,
    "amount": 1000.0,
    "date": "2026-09-18",
    "label": "Bonbons",
    "type": "expense",
    "notes": "Snacks"
  },
  {
    "id": 359,
    "accountId": 2,
    "targetAccountId": 3,
    "categoryId": 45,
    "amount": 14000.0,
    "date": "2026-09-18",
    "label": "Virement vers Orange Money",
    "notes": "De Mvola 2 (09:24)",
    "type": "transfer"
  },
  {
    "id": 360,
    "accountId": 2,
    "categoryId": 26,
    "amount": 1000.0,
    "date": "2026-09-18",
    "label": "Fee",
    "type": "expense",
    "notes": "Loan"
  },
  {
    "id": 361,
    "accountId": 3,
    "categoryId": 29,
    "amount": 26500.0,
    "date": "2026-09-18",
    "label": "Spotify",
    "type": "expense",
    "notes": "Membership"
  },
  {
    "id": 362,
    "accountId": 1,
    "categoryId": 15,
    "amount": 4000.0,
    "date": "2026-09-18",
    "label": "D\u00e9jeuner",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 363,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1000.0,
    "date": "2026-09-18",
    "label": "Tomate",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 364,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1000.0,
    "date": "2026-09-18",
    "label": "Concombre",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 365,
    "accountId": 1,
    "categoryId": 23,
    "amount": 600.0,
    "date": "2026-09-18",
    "label": "Ramanonaka x3",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 366,
    "accountId": 3,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-09-18",
    "label": "Connectivity",
    "type": "expense",
    "notes": "19:25"
  },
  {
    "id": 367,
    "accountId": 3,
    "categoryId": 11,
    "amount": 2000.0,
    "date": "2026-09-19",
    "label": "Connectivity",
    "type": "expense",
    "notes": "09:54"
  },
  {
    "id": 368,
    "accountId": 1,
    "categoryId": 24,
    "amount": 3850.0,
    "date": "2026-09-19",
    "label": "Fromage Candia Rouge",
    "type": "expense",
    "notes": "Health"
  },
  {
    "id": 369,
    "accountId": 1,
    "categoryId": 5,
    "amount": 2300.0,
    "date": "2026-09-19",
    "label": "Jus en brique x2",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 370,
    "accountId": 1,
    "categoryId": 15,
    "amount": 3500.0,
    "date": "2026-09-19",
    "label": "Nouilles Voky be",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 371,
    "accountId": 1,
    "categoryId": 13,
    "amount": 350.0,
    "date": "2026-09-19",
    "label": "Sachet Score",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 372,
    "accountId": 3,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-09-19",
    "label": "Connectivity",
    "type": "expense",
    "notes": "17:44"
  },
  {
    "id": 373,
    "accountId": 1,
    "categoryId": 15,
    "amount": 3500.0,
    "date": "2026-09-20",
    "label": "Dining",
    "type": "expense",
    "notes": "12:46"
  },
  {
    "id": 374,
    "accountId": 3,
    "categoryId": 11,
    "amount": 1800.0,
    "date": "2026-09-20",
    "label": "Connectivity",
    "type": "expense",
    "notes": "17:47"
  },
  {
    "id": 375,
    "accountId": 3,
    "categoryId": 41,
    "amount": 16500.0,
    "date": "2026-09-20",
    "label": "Maman",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 376,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-09-21",
    "label": "015 : Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 377,
    "accountId": 1,
    "categoryId": 15,
    "amount": 1000.0,
    "date": "2026-09-21",
    "label": "Dining",
    "type": "expense",
    "notes": "12:48"
  },
  {
    "id": 378,
    "accountId": 1,
    "categoryId": 23,
    "amount": 2000.0,
    "date": "2026-09-21",
    "label": "Mofo",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 379,
    "accountId": 3,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-09-21",
    "label": "Forfait Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 380,
    "accountId": 1,
    "categoryId": 15,
    "amount": 1000.0,
    "date": "2026-09-22",
    "label": "Dining",
    "type": "expense",
    "notes": "12:36"
  },
  {
    "id": 381,
    "accountId": 3,
    "categoryId": 20,
    "amount": 5000.0,
    "date": "2026-09-22",
    "label": "Top up",
    "type": "expense",
    "notes": "Gaming"
  },
  {
    "id": 382,
    "accountId": 1,
    "categoryId": 37,
    "amount": 700.0,
    "date": "2026-09-22",
    "label": "M\u00e9lange de l\u00e9gumes",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 383,
    "accountId": 1,
    "categoryId": 37,
    "amount": 300.0,
    "date": "2026-09-22",
    "label": "Tomate",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 384,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1000.0,
    "date": "2026-09-22",
    "label": "Mofo",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 385,
    "accountId": 1,
    "categoryId": 37,
    "amount": 400.0,
    "date": "2026-09-22",
    "label": "C\u00e9leri + percil",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 386,
    "accountId": 3,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-09-22",
    "label": "Connectivity",
    "type": "expense",
    "notes": "19:47"
  },
  {
    "id": 387,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-23",
    "label": "015 : Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 388,
    "accountId": 1,
    "categoryId": 33,
    "amount": 400.0,
    "date": "2026-09-23",
    "label": "Contre toux",
    "type": "expense",
    "notes": "Snacks"
  },
  {
    "id": 389,
    "accountId": 3,
    "categoryId": 20,
    "amount": 6700.0,
    "date": "2026-09-23",
    "label": "Free Fire + frais",
    "type": "expense",
    "notes": "Gaming"
  },
  {
    "id": 390,
    "accountId": 1,
    "categoryId": 37,
    "amount": 700.0,
    "date": "2026-09-23",
    "label": "Choux",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 391,
    "accountId": 1,
    "categoryId": 37,
    "amount": 700.0,
    "date": "2026-09-23",
    "label": "Carottes+haricots verts",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 392,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1000.0,
    "date": "2026-09-23",
    "label": "Tomate + Oignons",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 393,
    "accountId": 1,
    "categoryId": 23,
    "amount": 600.0,
    "date": "2026-09-23",
    "label": "Mofo",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 394,
    "accountId": 3,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-09-23",
    "label": "Connectivity",
    "type": "expense",
    "notes": "21:34"
  },
  {
    "id": 395,
    "accountId": 3,
    "categoryId": 11,
    "amount": 1000.0,
    "date": "2026-09-24",
    "label": "Connectivity",
    "type": "expense",
    "notes": "18:21"
  },
  {
    "id": 396,
    "accountId": 1,
    "categoryId": 5,
    "amount": 4950.0,
    "date": "2026-09-24",
    "label": "Jus de pomme",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 397,
    "accountId": 1,
    "categoryId": 15,
    "amount": 3500.0,
    "date": "2026-09-24",
    "label": "Nouilles Voky be",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 398,
    "accountId": 1,
    "categoryId": 5,
    "amount": 1000.0,
    "date": "2026-09-24",
    "label": "Jus de raisin",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 399,
    "accountId": 3,
    "categoryId": 40,
    "amount": 37000.0,
    "date": "2026-09-24",
    "label": "Maman",
    "type": "income",
    "notes": "Gift"
  },
  {
    "id": 400,
    "accountId": 3,
    "categoryId": 11,
    "amount": 2000.0,
    "date": "2026-09-24",
    "label": "Connectivity",
    "type": "expense",
    "notes": "21:26"
  },
  {
    "id": 401,
    "accountId": 3,
    "targetAccountId": 1,
    "categoryId": 45,
    "amount": 35000.0,
    "date": "2026-09-25",
    "label": "Virement vers Cash (Esp\u00e8ces)",
    "notes": "De Orange Money (09:28)",
    "type": "transfer"
  },
  {
    "id": 402,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-25",
    "label": "120 : Analakely - Ankorondrano",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 403,
    "accountId": 1,
    "categoryId": 34,
    "amount": 500.0,
    "date": "2026-09-25",
    "label": "2Toi",
    "type": "expense",
    "notes": "Social"
  },
  {
    "id": 404,
    "accountId": 1,
    "categoryId": 15,
    "amount": 25000.0,
    "date": "2026-09-25",
    "label": "Cheeseburger",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 405,
    "accountId": 1,
    "categoryId": 5,
    "amount": 7000.0,
    "date": "2026-09-25",
    "label": "Cappuccinos",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 406,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-25",
    "label": "120 : Ankorondrano - Analakely",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 407,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-25",
    "label": "134 : Analakely - La haute",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 408,
    "accountId": 3,
    "categoryId": 11,
    "amount": 3500.0,
    "date": "2026-09-25",
    "label": "Lany cr\u00e9dit Orange",
    "type": "expense",
    "notes": "Connectivity"
  },
  {
    "id": 409,
    "accountId": 1,
    "categoryId": 23,
    "amount": 2000.0,
    "date": "2026-09-26",
    "label": "Compos\u00e9 x2",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 410,
    "accountId": 1,
    "categoryId": 35,
    "amount": 1000.0,
    "date": "2026-09-26",
    "label": "Super glue",
    "type": "expense",
    "notes": "Tools"
  },
  {
    "id": 411,
    "accountId": 1,
    "targetAccountId": 3,
    "categoryId": 45,
    "amount": 11000.0,
    "date": "2026-09-26",
    "label": "Virement vers Orange Money",
    "notes": "De Cash (Esp\u00e8ces) (12:47)",
    "type": "transfer"
  },
  {
    "id": 412,
    "accountId": 3,
    "categoryId": 20,
    "amount": 5600.0,
    "date": "2026-09-26",
    "label": "Largage",
    "type": "expense",
    "notes": "Gaming"
  },
  {
    "id": 413,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-26",
    "label": "015 : Ambanidia - Andavamamba",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 414,
    "accountId": 1,
    "categoryId": 5,
    "amount": 10000.0,
    "date": "2026-09-26",
    "label": "Th\u00e9 Japonais",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 415,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-09-26",
    "label": "119 : Ampefiloha - Ambohijatovo",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 416,
    "accountId": 1,
    "categoryId": 15,
    "amount": 7000.0,
    "date": "2026-09-26",
    "label": "Nouilles Voky be x2",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 417,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1000.0,
    "date": "2026-09-28",
    "label": "Flan",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 418,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1000.0,
    "date": "2026-09-28",
    "label": "Pain Chocolat x2",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 419,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-09-29",
    "label": "I : Ambatoroaka - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 420,
    "accountId": 3,
    "categoryId": 41,
    "amount": 20600.0,
    "date": "2026-09-29",
    "label": "Receipt",
    "type": "income",
    "notes": "09:36"
  },
  {
    "id": 421,
    "accountId": 1,
    "categoryId": 15,
    "amount": 1000.0,
    "date": "2026-09-29",
    "label": "Dining",
    "type": "expense",
    "notes": "12:18"
  },
  {
    "id": 422,
    "accountId": 1,
    "categoryId": 5,
    "amount": 1000.0,
    "date": "2026-09-29",
    "label": "Yaourts \u00e0 boire",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 423,
    "accountId": 1,
    "categoryId": 37,
    "amount": 1000.0,
    "date": "2026-09-29",
    "label": "Courgettes",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 424,
    "accountId": 1,
    "categoryId": 37,
    "amount": 700.0,
    "date": "2026-09-29",
    "label": "Oignons",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 425,
    "accountId": 1,
    "categoryId": 13,
    "amount": 500.0,
    "date": "2026-09-29",
    "label": "Sachet",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 426,
    "accountId": 1,
    "categoryId": 37,
    "amount": 500.0,
    "date": "2026-09-29",
    "label": "Tomate",
    "type": "expense",
    "notes": "Vegetables"
  },
  {
    "id": 427,
    "accountId": 1,
    "categoryId": 23,
    "amount": 220.0,
    "date": "2026-09-29",
    "label": "Mofo Gasy",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 428,
    "accountId": 3,
    "targetAccountId": 1,
    "categoryId": 45,
    "amount": 22000.0,
    "date": "2026-09-30",
    "label": "Virement vers Cash (Esp\u00e8ces)",
    "notes": "De Orange Money (09:13)",
    "type": "transfer"
  },
  {
    "id": 429,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-09-30",
    "label": "Dining",
    "type": "expense",
    "notes": "13:11"
  },
  {
    "id": 430,
    "accountId": 1,
    "categoryId": 5,
    "amount": 1000.0,
    "date": "2026-09-30",
    "label": "Yaourts \u00e0 boire",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 431,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1000.0,
    "date": "2026-09-30",
    "label": "Flan",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 432,
    "accountId": 3,
    "categoryId": 41,
    "amount": 100000.0,
    "date": "2026-10-01",
    "label": "Octobre",
    "type": "income",
    "notes": "Receipt"
  },
  {
    "id": 433,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-10-01",
    "label": "015 : Ambanidia - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 434,
    "accountId": 1,
    "categoryId": 5,
    "amount": 2000.0,
    "date": "2026-10-01",
    "label": "Caprice Citron",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 435,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-10-01",
    "label": "Dining",
    "type": "expense",
    "notes": "13:09"
  },
  {
    "id": 436,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-10-01",
    "label": "Soupe + Misao",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 437,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1000.0,
    "date": "2026-10-01",
    "label": "Flan",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 438,
    "accountId": 1,
    "categoryId": 8,
    "amount": 500.0,
    "date": "2026-10-02",
    "label": "015 : Ambatoroaka - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 439,
    "accountId": 3,
    "categoryId": 19,
    "amount": 16000.0,
    "date": "2026-10-02",
    "label": "Z2U test+Google Ai pro",
    "type": "expense",
    "notes": "Fun"
  },
  {
    "id": 440,
    "accountId": 2,
    "categoryId": 41,
    "amount": 10000.0,
    "date": "2026-10-02",
    "label": "Receipt",
    "type": "income",
    "notes": "11:46"
  },
  {
    "id": 441,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-10-02",
    "label": "Dining",
    "type": "expense",
    "notes": "12:37"
  },
  {
    "id": 442,
    "accountId": 1,
    "categoryId": 5,
    "amount": 500.0,
    "date": "2026-10-02",
    "label": "Jus voaroy",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 443,
    "accountId": 1,
    "categoryId": 15,
    "amount": 1500.0,
    "date": "2026-10-02",
    "label": "Compos\u00e9",
    "type": "expense",
    "notes": "Dining"
  },
  {
    "id": 444,
    "accountId": 1,
    "categoryId": 5,
    "amount": 1000.0,
    "date": "2026-10-02",
    "label": "Yaourts \u00e0 boire",
    "type": "expense",
    "notes": "Beverages"
  },
  {
    "id": 445,
    "accountId": 1,
    "categoryId": 23,
    "amount": 3000.0,
    "date": "2026-10-02",
    "label": "Compos\u00e9",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 446,
    "accountId": 1,
    "categoryId": 39,
    "amount": 40000.0,
    "date": "2026-10-02",
    "label": "Bonus",
    "type": "income",
    "notes": "18:44"
  },
  {
    "id": 447,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1500.0,
    "date": "2026-10-02",
    "label": "Sandwich",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 448,
    "accountId": 1,
    "categoryId": 13,
    "amount": 4800.0,
    "date": "2026-10-04",
    "label": "Sucre 1kg",
    "type": "expense",
    "notes": "Daily nes."
  },
  {
    "id": 449,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1000.0,
    "date": "2026-10-04",
    "label": "Grefy",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 450,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1000.0,
    "date": "2026-10-04",
    "label": "Min'sao",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 451,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1200.0,
    "date": "2026-10-04",
    "label": "Yaourts Maison x2",
    "type": "expense",
    "notes": "Go\u00fbter"
  },
  {
    "id": 452,
    "accountId": 1,
    "categoryId": 4,
    "amount": 1500.0,
    "date": "2026-10-04",
    "label": "Beauty",
    "type": "expense",
    "notes": "12:52"
  },
  {
    "id": 453,
    "accountId": 1,
    "categoryId": 33,
    "amount": 1000.0,
    "date": "2026-10-05",
    "label": "Snacks",
    "type": "expense",
    "notes": "08:39"
  },
  {
    "id": 454,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-10-05",
    "label": "Dining",
    "type": "expense",
    "notes": "12:40"
  },
  {
    "id": 455,
    "accountId": 1,
    "categoryId": 5,
    "amount": 1000.0,
    "date": "2026-10-05",
    "label": "Beverages",
    "type": "expense",
    "notes": "12:41"
  },
  {
    "id": 456,
    "accountId": 1,
    "categoryId": 37,
    "amount": 4000.0,
    "date": "2026-10-05",
    "label": "Vegetables",
    "type": "expense",
    "notes": "18:38"
  },
  {
    "id": 457,
    "accountId": 1,
    "categoryId": 23,
    "amount": 3000.0,
    "date": "2026-10-05",
    "label": "Go\u00fbter",
    "type": "expense",
    "notes": "19:38"
  },
  {
    "id": 458,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-10-06",
    "label": "Dining",
    "type": "expense",
    "notes": "12:36"
  },
  {
    "id": 459,
    "accountId": 1,
    "categoryId": 23,
    "amount": 1000.0,
    "date": "2026-10-06",
    "label": "Go\u00fbter",
    "type": "expense",
    "notes": "18:36"
  },
  {
    "id": 460,
    "accountId": 2,
    "targetAccountId": 3,
    "categoryId": 45,
    "amount": 9500.0,
    "date": "2026-10-06",
    "label": "Virement vers Orange Money",
    "notes": "De Mvola 2 (19:46)",
    "type": "transfer"
  },
  {
    "id": 461,
    "accountId": 2,
    "categoryId": 31,
    "amount": 500.0,
    "date": "2026-10-06",
    "label": "Frais",
    "type": "expense",
    "notes": "Repayment"
  },
  {
    "id": 462,
    "accountId": 3,
    "targetAccountId": 4,
    "categoryId": 45,
    "amount": 10000.0,
    "date": "2026-10-06",
    "label": "Virement vers Orange Money 2",
    "notes": "De Orange Money (19:50)",
    "type": "transfer"
  },
  {
    "id": 463,
    "accountId": 1,
    "categoryId": 43,
    "amount": 174300.0,
    "date": "2026-10-07",
    "label": "Salary",
    "type": "income",
    "notes": "08:19"
  },
  {
    "id": 464,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-10-07",
    "label": "Dining",
    "type": "expense",
    "notes": "12:20"
  },
  {
    "id": 465,
    "accountId": 1,
    "categoryId": 5,
    "amount": 1000.0,
    "date": "2026-10-07",
    "label": "Beverages",
    "type": "expense",
    "notes": "12:20"
  },
  {
    "id": 466,
    "accountId": 1,
    "categoryId": 30,
    "amount": 15000.0,
    "date": "2026-10-07",
    "label": "Adaptateur HDMI -> VGA",
    "type": "expense",
    "notes": "Office"
  },
  {
    "id": 467,
    "accountId": 1,
    "categoryId": 8,
    "amount": 600.0,
    "date": "2026-10-07",
    "label": "139 : Pont Behoririka - Ambohimiandra",
    "type": "expense",
    "notes": "Bus"
  },
  {
    "id": 468,
    "accountId": 3,
    "targetAccountId": 1,
    "categoryId": 45,
    "amount": 5000.0,
    "date": "2026-10-07",
    "label": "Virement vers Cash (Esp\u00e8ces)",
    "notes": "De Orange Money (14:07)",
    "type": "transfer"
  },
  {
    "id": 469,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-10-08",
    "label": "Dining",
    "type": "expense",
    "notes": "12:00"
  },
  {
    "id": 470,
    "accountId": 1,
    "categoryId": 23,
    "amount": 3000.0,
    "date": "2026-10-08",
    "label": "Go\u00fbter",
    "type": "expense",
    "notes": "19:01"
  },
  {
    "id": 471,
    "accountId": 3,
    "categoryId": 32,
    "amount": 70000.0,
    "date": "2026-10-08",
    "label": "Secret",
    "type": "expense",
    "notes": "19:05"
  },
  {
    "id": 472,
    "accountId": 3,
    "targetAccountId": 5,
    "categoryId": 45,
    "amount": 6000.0,
    "date": "2026-10-08",
    "label": "Virement vers Redotpay",
    "notes": "De Orange Money (19:11)",
    "type": "transfer"
  },
  {
    "id": 473,
    "accountId": 2,
    "categoryId": 44,
    "amount": 186900.0,
    "date": "2026-10-08",
    "label": "Side job",
    "type": "income",
    "notes": "19:12"
  },
  {
    "id": 474,
    "accountId": 2,
    "categoryId": 44,
    "amount": 25000.0,
    "date": "2026-10-08",
    "label": "Side job",
    "type": "income",
    "notes": "22:18"
  }
,
  {
    "id": 475,
    "accountId": 1,
    "categoryId": 14,
    "amount": 8500.0,
    "date": "2026-10-09",
    "label": "Achat Souris",
    "notes": "Souris: 6 000 Ar, Frais livraison: 2 500 Ar (11:50)",
    "type": "expense"
  },
  {
    "id": 476,
    "accountId": 1,
    "categoryId": 15,
    "amount": 2000.0,
    "date": "2026-10-09",
    "label": "Déjeuner",
    "notes": "Déjeuner (13:00)",
    "type": "expense"
  },
  {
    "id": 477,
    "accountId": 2,
    "targetAccountId": 5,
    "categoryId": 45,
    "amount": 25000.0,
    "date": "2026-10-09",
    "label": "Transfert vers Redotpay",
    "notes": "Reçu 5.00 $ sur Redotpay (1$ frais) (15:00)",
    "type": "transfer"
  },
  {
    "id": 478,
    "accountId": 5,
    "categoryId": 11,
    "amount": 3.0,
    "date": "2026-10-09",
    "label": "SMSpool",
    "notes": "Crédit SMS 3$ (15:30)",
    "type": "expense"
  },
  {
    "id": 479,
    "accountId": 2,
    "categoryId": 45,
    "amount": 20000.0,
    "date": "2026-10-09",
    "label": "Transfert Harena M",
    "notes": "Envoi vers Harena M (17:25)",
    "type": "expense"
  },
  {
    "id": 480,
    "accountId": 2,
    "categoryId": 45,
    "amount": 250.0,
    "date": "2026-10-09",
    "label": "Frais transfert Mvola",
    "notes": "Frais envoi Harena M (17:25)",
    "type": "expense"
  },
  {
    "id": 481,
    "accountId": 1,
    "categoryId": 41,
    "amount": 20500.0,
    "date": "2026-10-09",
    "label": "Reçu de Harena",
    "notes": "Espèces reçues de Harena M (17:27)",
    "type": "income"
  },
  {
    "id": 482,
    "accountId": 1,
    "categoryId": 15,
    "amount": 10000.0,
    "date": "2026-10-09",
    "label": "Resto",
    "notes": "PatteSeche au poulet: 7 000 Ar, Tacos simple: 3 000 Ar (18:00)",
    "type": "expense"
  },
  {
    "id": 483,
    "accountId": 2,
    "categoryId": 15,
    "amount": 33000.0,
    "date": "2026-10-09",
    "label": "Score",
    "notes": "Vin Blanc: 24 000 Ar, Gourde: 6 000 Ar, Achard Sakoa: 3 000 Ar (19:00)",
    "type": "expense"
  }
];
