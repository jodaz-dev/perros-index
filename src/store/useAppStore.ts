import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HotDogEntry {
  id: string;
  price: number;
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
  addEntry: (entry: Omit<HotDogEntry, 'id' | 'createdAt'>) => void;
  setUserLocation: (location: { lat: number; lng: number }) => void;
  getNationalAverage: () => number;
  getLocalAverage: (lat: number, lng: number, radiusKm: number) => number;
}

// Mock data for Venezuela
const mockEntries: HotDogEntry[] = [
  { id: '1', price: 2.50, businessName: 'Perros El Gordo', lat: 10.4806, lng: -66.9036, createdAt: new Date(Date.now() - 3600000).toISOString(), state: 'Distrito Capital' },
  { id: '2', price: 2.00, businessName: 'Hot Dogs Express', lat: 10.4696, lng: -66.8037, createdAt: new Date(Date.now() - 7200000).toISOString(), state: 'Miranda' },
  { id: '3', price: 3.00, businessName: 'Perros Premium', lat: 10.0678, lng: -69.3583, createdAt: new Date(Date.now() - 10800000).toISOString(), state: 'Lara' },
  { id: '4', price: 1.80, businessName: 'La Esquina del Perro', lat: 10.6417, lng: -71.6394, createdAt: new Date(Date.now() - 14400000).toISOString(), state: 'Zulia' },
  { id: '5', price: 2.20, businessName: 'Perros Callejeros', lat: 8.5897, lng: -71.1561, createdAt: new Date(Date.now() - 18000000).toISOString(), state: 'Mérida' },
  { id: '6', price: 2.75, businessName: 'Hot Dogs Valencia', lat: 10.1579, lng: -67.9972, createdAt: new Date(Date.now() - 21600000).toISOString(), state: 'Carabobo' },
];

const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      entries: mockEntries,
      userLocation: null,

      addEntry: (entry) => {
        const newEntry: HotDogEntry = {
          ...entry,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ entries: [newEntry, ...state.entries] }));
      },

      setUserLocation: (location) => set({ userLocation: location }),

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
