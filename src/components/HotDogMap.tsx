import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore, HotDogEntry } from '@/store/useAppStore';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom hot dog marker icon
const createHotDogIcon = (price: number, avgPrice: number) => {
  const ratio = avgPrice > 0 ? price / avgPrice : 1;
  let color = '#22c55e'; // green - cheap
  if (ratio > 1.1) color = '#ef4444'; // red - expensive
  else if (ratio > 0.9) color = '#FFDB58'; // mustard - average

  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 2px solid rgba(255,255,255,0.3);
      ">🌭</div>
    `,
    className: 'custom-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const createUserIcon = () => {
  return L.divIcon({
    html: `<div style="
      background: hsl(50, 100%, 67%);
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 20px rgba(255, 219, 88, 0.6);
    "></div>`,
    className: 'user-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

function LocationMarker() {
  const { setUserLocation, userLocation } = useAppStore();
  const map = useMapEvents({
    locationfound(e) {
      setUserLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  useEffect(() => {
    map.locate({ setView: false });
  }, [map]);

  if (!userLocation) return null;

  return (
    <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserIcon()} />
  );
}

interface EntryMarkersProps {
  entries: HotDogEntry[];
  avgPrice: number;
}

function EntryMarkers({ entries, avgPrice }: EntryMarkersProps) {
  return (
    <>
      {entries.map((entry) => (
        <Marker
          key={entry.id}
          position={[entry.lat, entry.lng]}
          icon={createHotDogIcon(entry.price, avgPrice)}
        >
          <Popup>
            <div className="p-1 min-w-[160px]">
              <h3 className="font-semibold text-2xl text-yellow-400 tracking-[1px]">{entry.businessName}</h3>

              <span className="text-xs text-gray-500 mt-1">
                {new Date(entry.createdAt).toLocaleDateString('es-VE')}
              </span>
              {entry.photo && (
                <img 
                  src={entry.photo} 
                  alt={entry.businessName}
                  className="w-full h-32 object-cover rounded-lg my-2" 
                />
              )}
              
              <div className="mt-2">
                <div className="flex items-center justify-between m-0">
                  <span className="text-sm text-gray-600">BCV:</span>
                  <span className="text-xl font-bold text-red-500 m-0">
                    ${(entry.priceBcv || entry.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between m-0">
                  <span className="text-sm text-gray-600 m-0">USDT:</span>
                  <span className="text-xl font-bold text-green-500 m-0">
                    ${entry.price.toFixed(2)}
                  </span>
                </div>
                {entry.priceBs && (
                  <div className="flex items-center justify-between pt-1 border-t border-gray-700 mt-3">
                    <span className="text-sm text-gray-600">Bs:</span>
                    <span className="text-sm font-bold text-gray-900">
                      {entry.priceBs.toFixed(2)} Bs
                    </span>
                  </div>
                )}
              </div>

              {entry.state && (
                <p className="text-sm text-gray-500 mt-2">{entry.state}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export const HotDogMap = () => {
  const { entries, getNationalAverage } = useAppStore();
  const avgPrice = getNationalAverage();

  // Center on Venezuela
  const venezuelaCenter: [number, number] = [8.0, -66.0];

  return (
    <MapContainer
      center={venezuelaCenter}
      zoom={6}
      className="w-full h-full"
      style={{ background: 'hsl(0, 0%, 10%)' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <LocationMarker />
      <EntryMarkers entries={entries} avgPrice={avgPrice} />
    </MapContainer>
  );
};
