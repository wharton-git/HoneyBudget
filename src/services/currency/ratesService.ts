export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2 },
  { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimals: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', decimals: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimals: 0 },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar', decimals: 0 },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH', decimals: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimals: 2 },
  { code: 'XOF', name: 'CFA Franc BCEAO', symbol: 'CFA', decimals: 0 },
];

export const DEFAULT_RATES_FROM_EUR: Record<string, number> = {
  EUR: 1.0,
  USD: 1.08,
  GBP: 0.85,
  CHF: 0.96,
  CAD: 1.48,
  JPY: 165.2,
  MGA: 4950.0,
  MAD: 10.8,
  AUD: 1.64,
  XOF: 655.95,
};

export const getCurrencySymbol = (code: string): string => {
  const found = SUPPORTED_CURRENCIES.find((c) => c.code === code);
  return found ? found.symbol : code;
};

export const getCurrencyDecimals = (code: string): number => {
  const found = SUPPORTED_CURRENCIES.find((c) => c.code === code);
  return found ? found.decimals : 2;
};

/**
 * Format money with typography symbols (NO emojis).
 */
export const formatMoney = (amount: number, currencyCode: string, locale: string = 'fr-FR'): string => {
  const decimals = getCurrencyDecimals(currencyCode);
  const symbol = getCurrencySymbol(currencyCode);

  const formattedNum = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return `${formattedNum} ${symbol}`;
};

/**
 * Convert an amount from fromCurrency to toCurrency given a base currency and exchange rates relative to that base.
 */
export const convertCurrency = (
  amount: number,
  fromCode: string,
  toCode: string,
  rates: Record<string, number>,
  baseCode: string = 'EUR'
): number => {
  if (fromCode === toCode) return amount;
  if (amount === 0) return 0;

  // Rate of code relative to baseCode: 1 baseCode = rate[code] code
  const fromRate = fromCode === baseCode ? 1.0 : (rates[fromCode] || DEFAULT_RATES_FROM_EUR[fromCode] || 1.0);
  const toRate = toCode === baseCode ? 1.0 : (rates[toCode] || DEFAULT_RATES_FROM_EUR[toCode] || 1.0);

  // amount in base:
  const amountInBase = amount / fromRate;
  // amount in target:
  return amountInBase * toRate;
};

/**
 * Fetch latest rates from open free exchange rate API (No API key needed)
 */
export const fetchLiveRates = async (baseCurrency: string = 'EUR'): Promise<Record<string, number> | null> => {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        return data.rates as Record<string, number>;
      }
    }
  } catch (err) {
    console.warn('Network rate fetch failed, trying fallback...', err);
  }

  // Fallback endpoint: frankfurter
  try {
    const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=${baseCurrency}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        return {
          ...data.rates,
          [baseCurrency]: 1.0,
        };
      }
    }
  } catch (err) {
    console.warn('Fallback rate fetch failed:', err);
  }

  return null;
};
