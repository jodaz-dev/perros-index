import { Database } from './database.types';

export type Report = Database['public']['Tables']['reports']['Row'];
export type ReportInsert = Database['public']['Tables']['reports']['Insert'];
export type ExchangeRate = Database['public']['Tables']['exchange_rates']['Row'];

// Mapped type for frontend use
export interface HotDogReport {
  id: string;
  businessName: string;
  priceBs: number;
  priceUsdt: number;
  priceBcv: number;
  lat: number;
  lng: number;
  state: string | null;
  photoUrl: string | null;
  createdAt: string;
}

// Transform database row to frontend type
export const mapReportToHotDog = (report: Report): HotDogReport => ({
  id: report.id,
  businessName: report.business_name,
  priceBs: report.price_bs,
  priceUsdt: report.price_usdt,
  priceBcv: report.price_bcv,
  lat: report.lat ?? 0,
  lng: report.lng ?? 0,
  state: report.state,
  photoUrl: report.photo_url,
  createdAt: report.created_at ?? new Date().toISOString(),
});
