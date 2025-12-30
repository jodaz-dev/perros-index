export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      exchange_rates: {
        Row: {
          id: string
          bcv_rate: number
          usdt_rate: number
          effective_date: string
          created_at: string | null
        }
        Insert: {
          id?: string
          bcv_rate: number
          usdt_rate: number
          effective_date?: string
          created_at?: string | null
        }
        Update: {
          id?: string
          bcv_rate?: number
          usdt_rate?: number
          effective_date?: string
          created_at?: string | null
        }
      }
      reports: {
        Row: {
          id: string
          business_name: string
          price_bs: number
          price_usdt: number
          price_bcv: number
          lat: number | null
          lng: number | null
          state: string | null
          photo_url: string | null
          exchange_rate_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          business_name: string
          price_bs: number
          price_usdt: number
          price_bcv: number
          lat?: number | null
          lng?: number | null
          state?: string | null
          photo_url?: string | null
          exchange_rate_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          business_name?: string
          price_bs?: number
          price_usdt?: number
          price_bcv?: number
          lat?: number | null
          lng?: number | null
          state?: string | null
          photo_url?: string | null
          exchange_rate_id?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      nearby_reports: {
        Args: {
          user_lat: number
          user_lng: number
          radius_km?: number
        }
        Returns: Database['public']['Tables']['reports']['Row'][]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type aliases for easier imports
export type Report = Database['public']['Tables']['reports']['Row'];
export type ReportInsert = Database['public']['Tables']['reports']['Insert'];
export type ExchangeRateRow = Database['public']['Tables']['exchange_rates']['Row'];

