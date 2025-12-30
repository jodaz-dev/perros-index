import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface ExchangeRates {
  bcvRate: number;
  usdtRate: number;
  effectiveDate: string;
}

export const exchangeRateService = {
  /**
   * Fetch the latest exchange rates
   */
  async getLatest(): Promise<ExchangeRates | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const { data, error } = await supabase!
      .from('exchange_rates')
      .select('*')
      .order('effective_date', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching exchange rates:', error);
      return null;
    }

    return {
      bcvRate: data.bcv_rate,
      usdtRate: data.usdt_rate,
      effectiveDate: data.effective_date,
    };
  },
};
