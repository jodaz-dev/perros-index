import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/reportService';
import { isSupabaseConfigured } from '@/lib/supabase';

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return null; // Fallback to mock data handled in store
      }
      return reportService.getAll();
    },
    refetchInterval: 15000, // Poll every 15 seconds
    staleTime: 30000,
  });
};
