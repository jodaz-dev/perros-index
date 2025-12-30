import { useEffect, useState, useCallback } from 'react';
import { reportService } from '@/services/reportService';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Report } from '@/lib/database.types';

interface UseReportsResult {
  reports: Report[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isConfigured: boolean;
}

export const useReports = (): UseReportsResult => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isConfigured = isSupabaseConfigured();

  const fetchReports = useCallback(async () => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await reportService.getAll();
      setReports(data ?? []);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [isConfigured]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Set up real-time subscription
  useEffect(() => {
    if (!isConfigured) return;

    const subscription = reportService.subscribeToReports((payload) => {
      if (payload.eventType === 'INSERT') {
        setReports((prev) => [payload.new as Report, ...prev]);
      } else if (payload.eventType === 'DELETE') {
        setReports((prev) => prev.filter((r) => r.id !== payload.old.id));
      } else if (payload.eventType === 'UPDATE') {
        setReports((prev) =>
          prev.map((r) => (r.id === payload.new.id ? (payload.new as Report) : r))
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  return {
    reports,
    loading,
    error,
    refetch: fetchReports,
    isConfigured,
  };
};
