import type { HotDogEntry } from '@/store/useAppStore';

// Mock data for Venezuela (used when Supabase is not configured)
export const mockEntries: HotDogEntry[] = [
  { 
    id: '1', 
    price: 2.50, 
    priceBs: 133,
    priceBcv: 2.92,
    businessName: 'Perros El Gordo', 
    lat: 10.4806, 
    lng: -66.9036, 
    createdAt: new Date(Date.now() - 3600000).toISOString(), 
    state: 'Distrito Capital' 
  },
  { 
    id: '2', 
    price: 2.00, 
    priceBs: 106.4,
    priceBcv: 2.33,
    businessName: 'Hot Dogs Express', 
    lat: 10.4696, 
    lng: -66.8037, 
    createdAt: new Date(Date.now() - 7200000).toISOString(), 
    state: 'Miranda' 
  },
  { 
    id: '3', 
    price: 3.00, 
    priceBs: 159.6,
    priceBcv: 3.50,
    businessName: 'Perros Premium', 
    lat: 10.0678, 
    lng: -69.3583, 
    createdAt: new Date(Date.now() - 10800000).toISOString(), 
    state: 'Lara' 
  },
  { 
    id: '4', 
    price: 1.80, 
    priceBs: 95.76,
    priceBcv: 2.10,
    businessName: 'La Esquina del Perro', 
    lat: 10.6417, 
    lng: -71.6394, 
    createdAt: new Date(Date.now() - 14400000).toISOString(), 
    state: 'Zulia' 
  },
  { 
    id: '5', 
    price: 2.20, 
    priceBs: 117.04,
    priceBcv: 2.57,
    businessName: 'Perros Callejeros', 
    lat: 8.5897, 
    lng: -71.1561, 
    createdAt: new Date(Date.now() - 18000000).toISOString(), 
    state: 'Mérida' 
  },
  { 
    id: '6', 
    price: 2.75, 
    priceBs: 146.3,
    priceBcv: 3.21,
    businessName: 'Hot Dogs Valencia', 
    lat: 10.1579, 
    lng: -67.9972, 
    createdAt: new Date(Date.now() - 21600000).toISOString(), 
    state: 'Carabobo' 
  },
];
