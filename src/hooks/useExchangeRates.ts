import { useEffect, useState } from 'react';
import { exchangeRateService, ExchangeRates } from '@/services/exchangeRateService';
import { useAppStore } from '@/store/useAppStore';
import { DEFAULT_EXCHANGE_RATES } from '@/mocks';

interface UseExchangeRatesResult {
  rates: ExchangeRates;
  loading: boolean;
  error: Error | null;
}

// Default fallback rates (from mocks)
const defaultRates: ExchangeRates = {
  bcvRate: DEFAULT_EXCHANGE_RATES.BCV,
  usdtRate: DEFAULT_EXCHANGE_RATES.USDT,
  effectiveDate: new Date().toISOString().split('T')[0],
};

export const useExchangeRates = (): UseExchangeRatesResult => {
  const exchangeRates = useAppStore((state) => state.exchangeRates);
  const setExchangeRates = useAppStore((state) => state.setExchangeRates);
  
  const [rates, setRates] = useState<ExchangeRates>({
    bcvRate: exchangeRates.BCV,
    usdtRate: exchangeRates.USDT,
    effectiveDate: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const data = await exchangeRateService.getLatest();
        if (data) {
          setRates(data);
          // Update the global store with the fetched rates
          setExchangeRates({
            BCV: data.bcvRate,
            USDT: data.usdtRate,
          });
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
  }, [setExchangeRates]);

  return { rates, loading, error };
};
