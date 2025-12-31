import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockEntries, DEFAULT_EXCHANGE_RATES, type ExchangeRatesData } from '@/mocks';
import { haversineDistance } from '@/utils/helpers';

export interface HotDogEntry {
  id: string;
  price: number; // Main USD price (USDT based)
  priceBs?: number; // Price in Bolivares
  priceBcv?: number; // Price in USD at BCV rate
  businessName: string;
  lat: number;
  lng: number;
  photo?: string;
  createdAt: string;
  state?: string;
}

interface AppState {
  entries: HotDogEntry[];
  userLocation: { lat: number; lng: number } | null;
  isUsingMockData: boolean;
  exchangeRates: ExchangeRatesData;
  addEntry: (entry: Omit<HotDogEntry, 'id' | 'createdAt'>) => void;
  setEntries: (entries: HotDogEntry[]) => void;
  prependEntry: (entry: HotDogEntry) => void;
  setUserLocation: (location: { lat: number; lng: number }) => void;
  setUsingMockData: (value: boolean) => void;
  setExchangeRates: (rates: ExchangeRatesData) => void;
  getNationalAverage: () => number;
  getLocalAverage: (lat: number, lng: number, radiusKm: number) => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      entries: mockEntries,
      userLocation: null,
      isUsingMockData: true,
      exchangeRates: DEFAULT_EXCHANGE_RATES,

      addEntry: (entry) => {
        const newEntry: HotDogEntry = {
          ...entry,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ entries: [newEntry, ...state.entries] }));
      },

      setEntries: (entries) => set({ entries, isUsingMockData: false }),

      prependEntry: (entry) => set((state) => ({ 
        entries: [entry, ...state.entries] 
      })),

      setUserLocation: (location) => set({ userLocation: location }),

      setUsingMockData: (value) => set({ isUsingMockData: value }),

      setExchangeRates: (rates) => set({ exchangeRates: rates }),

      getNationalAverage: () => {
        const entries = get().entries;
        if (entries.length === 0) return 0;
        return entries.reduce((sum, e) => sum + e.price, 0) / entries.length;
      },

      getLocalAverage: (lat, lng, radiusKm = 50) => {
        const entries = get().entries;
        const nearby = entries.filter(e => haversineDistance(lat, lng, e.lat, e.lng) <= radiusKm);
        if (nearby.length === 0) return 0;
        return nearby.reduce((sum, e) => sum + e.price, 0) / nearby.length;
      },
    }),
    { name: 'perros-index-storage' }
  )
);
