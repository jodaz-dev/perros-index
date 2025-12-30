import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { EXCHANGE_RATES } from '@/store/useAppStore';

interface CreateReportInput {
  businessName: string;
  priceBs: number;
  lat: number;
  lng: number;
  state?: string;
  photoFile?: File;
}

export const reportService = {
  /**
   * Fetch all reports, ordered by newest first
   */
  async getAll() {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase!
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Fetch reports near a location
   */
  async getNearby(lat: number, lng: number, radiusKm: number = 50) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase!
      .rpc('nearby_reports', {
        user_lat: lat,
        user_lng: lng,
        radius_km: radiusKm,
      });

    if (error) throw error;
    return data;
  },

  /**
   * Create a new report
   */
  async create(input: CreateReportInput) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    let photoUrl: string | null = null;

    // Upload photo if provided
    if (input.photoFile) {
      const fileName = `${Date.now()}-${input.photoFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase!.storage
        .from('report-photos')
        .upload(fileName, input.photoFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase!.storage
        .from('report-photos')
        .getPublicUrl(uploadData.path);

      photoUrl = urlData.publicUrl;
    }

    // Calculate USD prices from Bs using current rates
    const priceUsdt = input.priceBs / EXCHANGE_RATES.USDT;
    const priceBcv = input.priceBs / EXCHANGE_RATES.BCV;

    const { data, error } = await supabase!
      .from('reports')
      .insert({
        business_name: input.businessName,
        price_bs: input.priceBs,
        price_usdt: priceUsdt,
        price_bcv: priceBcv,
        lat: input.lat,
        lng: input.lng,
        state: input.state,
        photo_url: photoUrl,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Subscribe to real-time report updates
   */
  subscribeToReports(callback: (payload: any) => void) {
    if (!isSupabaseConfigured()) {
      return { unsubscribe: () => {} };
    }

    const channel = supabase!
      .channel('reports-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        callback
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase!.removeChannel(channel);
      },
    };
  },
};
