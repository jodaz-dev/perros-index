import { useEffect, useCallback } from 'react';
import { useAppStore, HotDogEntry } from '@/store/useAppStore';
import { reportService } from '@/services/reportService';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Report } from '@/lib/database.types';

// Transform Supabase report to app store format
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

/**
 * DataProvider component that syncs Supabase data to the app store.
 * When Supabase is configured, it fetches data and sets up real-time subscriptions.
 * Falls back to mock data when Supabase is not configured.
 */
export const DataProvider = ({ children }: DataProviderProps) => {
  const { setEntries, prependEntry, setUsingMockData } = useAppStore();

  const loadData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUsingMockData(true);
      return;
    }

    try {
      const reports = await reportService.getAll();
      if (reports) {
        const entries = reports.map(mapReportToEntry);
        setEntries(entries);
      }
    } catch (error) {
      console.error('Failed to load reports from Supabase:', error);
      setUsingMockData(true);
    }
  }, [setEntries, setUsingMockData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Set up real-time subscription
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const subscription = reportService.subscribeToReports((payload) => {
      if (payload.eventType === 'INSERT') {
        const newEntry = mapReportToEntry(payload.new as Report);
        prependEntry(newEntry);
      }
      // For simplicity, we'll refetch on UPDATE/DELETE
      // In production, handle these more granularly
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [prependEntry]);

  return <>{children}</>;
};
