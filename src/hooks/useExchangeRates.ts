import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { exchangeRateService, ExchangeRates } from '@/services/exchangeRateService';
import { useAppStore } from '@/store/useAppStore';
import { DEFAULT_EXCHANGE_RATES } from '@/mocks';

interface UseExchangeRatesResult {
  rates: ExchangeRates;
  isLoading: boolean;
  error: Error | null;
}

// Default fallback rates (from mocks)
const defaultRates: ExchangeRates = {
  bcvRate: DEFAULT_EXCHANGE_RATES.BCV,
  usdtRate: DEFAULT_EXCHANGE_RATES.USDT,
  effectiveDate: new Date().toISOString().split('T')[0],
};

export const useExchangeRates = (): UseExchangeRatesResult => {
  const setExchangeRates = useAppStore((state) => state.setExchangeRates);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: () => exchangeRateService.getLatest(),
    refetchInterval: 43200, // Polling every 12 hours
    staleTime: 43200, // Consider data stale after 12 hours
  });

  // Sync with global store when data updates
  useEffect(() => {
    if (data) {
      setExchangeRates({
        BCV: data.bcvRate,
        USDT: data.usdtRate,
      });
    }
  }, [data, setExchangeRates]);

  return { 
    rates: data || defaultRates, 
    isLoading, 
    error: error as Error | null 
  };
};
