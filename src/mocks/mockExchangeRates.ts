export interface ExchangeRatesData {
  BCV: number;
  USDT: number;
}

// Default fallback exchange rates (used when Supabase is not configured or data is unavailable)
export const DEFAULT_EXCHANGE_RATES: ExchangeRatesData = {
  BCV: 45.50,
  USDT: 53.20,
};
