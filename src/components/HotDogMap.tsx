import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/store/useAppStore';
import 'leaflet/dist/leaflet.css';

// Custom hot dog marker icon
const createHotDogIcon = (price: number, avgPrice: number) => {
  const ratio = price / avgPrice;
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

const LocationMarker = () => {
  const map = useMap();
  const { setUserLocation, userLocation } = useAppStore();

  useEffect(() => {
    map.locate({ setView: false });

    map.on('locationfound', (e) => {
      setUserLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
  }, [map, setUserLocation]);

  return userLocation ? (
    <Marker 
      position={[userLocation.lat, userLocation.lng]}
      icon={L.divIcon({
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
      })}
    />
  ) : null;
};

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
      
      {entries.map((entry) => (
        <Marker
          key={entry.id}
          position={[entry.lat, entry.lng]}
          icon={createHotDogIcon(entry.price, avgPrice)}
        >
          <Popup className="custom-popup">
            <div className="p-2 min-w-[200px]">
              <h3 className="font-display font-bold text-lg">{entry.businessName}</h3>
              <p className="text-2xl font-bold text-mustard">${entry.price.toFixed(2)}</p>
              {entry.state && (
                <p className="text-sm text-muted-foreground">{entry.state}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(entry.createdAt).toLocaleDateString('es-VE')}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
