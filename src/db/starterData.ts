import type { Account, Category, AppSettingsRecord } from './index';
import { DEFAULT_RATES_FROM_EUR } from '../services/currency/ratesService';

export const STARTER_SETTINGS: AppSettingsRecord = {
  id: 'current',
  baseCurrency: 'MGA',
  language: 'fr',
  theme: 'honey-mga-real',
  rates: DEFAULT_RATES_FROM_EUR,
  lastRatesUpdate: new Date().toISOString(),
  seedVersion: 7,
};

export const STARTER_ACCOUNTS: Account[] = [
  {
    id: 1,
    name: 'Espèces (Cash)',
    type: 'cash',
    types: ['cash'],
    currencyCode: 'MGA',
    balance: 0,
    color: '#F59E0B',
    iconSvg: 'wallet',
  },
  {
    id: 2,
    name: 'Compte Principal',
    type: 'checking',
    types: ['checking', 'bank'],
    currencyCode: 'MGA',
    balance: 0,
    color: '#10B981',
    iconSvg: 'coin',
  },
];

export const STARTER_CATEGORIES: Category[] = [
  // Dépenses
  {
    id: 1,
    nameKey: 'Alimentation & Repas',
    type: 'expense',
    budgetLimit: 0,
    color: '#F59E0B',
    iconSvg: 'coffee',
  },
  {
    id: 2,
    nameKey: 'Transport & Déplacements',
    type: 'expense',
    budgetLimit: 0,
    color: '#3B82F6',
    iconSvg: 'globe',
  },
  {
    id: 3,
    nameKey: 'Logement & Charges',
    type: 'expense',
    budgetLimit: 0,
    color: '#10B981',
    iconSvg: 'home',
  },
  {
    id: 4,
    nameKey: 'Loisirs & Sorties',
    type: 'expense',
    budgetLimit: 0,
    color: '#EC4899',
    iconSvg: 'heart',
  },
  {
    id: 5,
    nameKey: 'Factures & Télécom',
    type: 'expense',
    budgetLimit: 0,
    color: '#6366F1',
    iconSvg: 'tag',
  },
  {
    id: 6,
    nameKey: 'Santé & Bien-être',
    type: 'expense',
    budgetLimit: 0,
    color: '#14B8A6',
    iconSvg: 'heart',
  },
  {
    id: 7,
    nameKey: 'Achats & Shopping',
    type: 'expense',
    budgetLimit: 0,
    color: '#F97316',
    iconSvg: 'wallet',
  },
  {
    id: 8,
    nameKey: 'Éducation & Livres',
    type: 'expense',
    budgetLimit: 0,
    color: '#8B5CF6',
    iconSvg: 'tag',
  },
  {
    id: 9,
    nameKey: 'Autre Dépense',
    type: 'expense',
    budgetLimit: 0,
    color: '#64748B',
    iconSvg: 'tag',
  },
  // Revenus
  {
    id: 10,
    nameKey: 'Salaire & Revenus',
    type: 'income',
    budgetLimit: 0,
    color: '#10B981',
    iconSvg: 'coin',
  },
  {
    id: 11,
    nameKey: 'Freelance & Projets',
    type: 'income',
    budgetLimit: 0,
    color: '#06B6D4',
    iconSvg: 'coin',
  },
  {
    id: 12,
    nameKey: 'Cadeaux & Dons reçus',
    type: 'income',
    budgetLimit: 0,
    color: '#EC4899',
    iconSvg: 'wallet',
  },
  {
    id: 13,
    nameKey: 'Autre Revenu',
    type: 'income',
    budgetLimit: 0,
    color: '#3B82F6',
    iconSvg: 'coin',
  },
];
