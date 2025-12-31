import { useEffect, useCallback } from 'react';
import { useAppStore, HotDogEntry } from '@/store/useAppStore';
import { reportService } from '@/services/reportService';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useReports } from '@/hooks/useReports';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import type { Report } from '@/lib/database.types';

// Transform Supabase report to app format
const mapReportToEntry = (report: Report): HotDogEntry => ({
  id: report.id,
  businessName: report.business_name,
  price: report.price_usdt,
  priceBs: report.price_bs,
  priceBcv: report.price_bcv,
  lat: report.lat ?? 0,
  lng: report.lng ?? 0,
  state: report.state ?? undefined,
  photo: report.photo_url ?? undefined,
  createdAt: report.created_at ?? new Date().toISOString(),
});

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const { setEntries, prependEntry, setUsingMockData } = useAppStore();
  
  // Initialize queries
  const { data: reports, isError } = useReports();
  // We call useExchangeRates here to ensure it's running globally
  useExchangeRates();

  // Sync reports with global store
  useEffect(() => {
    if (reports) {
      const entries = reports.map(mapReportToEntry);
      setEntries(entries);
      setUsingMockData(false);
    } else if (isError || !isSupabaseConfigured()) {
      setUsingMockData(true);
    }
  }, [reports, isError, setEntries, setUsingMockData]);

  // Set up real-time subscription for immediate updates
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const subscription = reportService.subscribeToReports((payload) => {
      if (payload.eventType === 'INSERT') {
        const newEntry = mapReportToEntry(payload.new as Report);
        prependEntry(newEntry);
      }
      // UPDATE/DELETE can be handled by the next poll
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [prependEntry]);

  return <>{children}</>;
};
