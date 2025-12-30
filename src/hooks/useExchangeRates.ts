import { useEffect, useState } from 'react';
import { exchangeRateService, ExchangeRates } from '@/services/exchangeRateService';
import { EXCHANGE_RATES } from '@/store/useAppStore';

interface UseExchangeRatesResult {
  rates: ExchangeRates;
  loading: boolean;
  error: Error | null;
}

// Default fallback rates (from store)
const defaultRates: ExchangeRates = {
  bcvRate: EXCHANGE_RATES.BCV,
  usdtRate: EXCHANGE_RATES.USDT,
  effectiveDate: new Date().toISOString().split('T')[0],
};

export const useExchangeRates = (): UseExchangeRatesResult => {
  const [rates, setRates] = useState<ExchangeRates>(defaultRates);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const data = await exchangeRateService.getLatest();
        if (data) {
          setRates(data);
        }
        // If null, keep default rates
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return { rates, loading, error };
};
