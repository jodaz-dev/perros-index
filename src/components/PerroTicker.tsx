import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { TrendingUp, TrendingDown, MapPin } from 'lucide-react';

export const PerroTicker = () => {
  const { getNationalAverage, getLocalAverage, userLocation, entries } = useAppStore();
  
  const nationalAvg = getNationalAverage();
  const nationalAvgBcv = entries.length > 0
    ? entries.reduce((s, e) => s + (e.priceBcv || e.price), 0) / entries.length
    : 0;

  const localAvg = userLocation 
    ? getLocalAverage(userLocation.lat, userLocation.lng, 50) 
    : 0;

  // Calculate trend (mock - comparing to older entries)
  const recentEntries = entries.slice(0, 3);
  const olderEntries = entries.slice(3);
  const recentAvg = recentEntries.length > 0 
    ? recentEntries.reduce((s, e) => s + e.price, 0) / recentEntries.length 
    : 0;
  const olderAvg = olderEntries.length > 0 
    ? olderEntries.reduce((s, e) => s + e.price, 0) / olderEntries.length 
    : recentAvg;
  const trend = recentAvg >= olderAvg ? 'up' : 'down';

  const tickerContent = (
    <div className="flex items-center gap-8 px-4">
      {/* BCV Average */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🌭</span>
        <span className="text-foreground/70">Promedio BCV:</span>
        <span className="font-bold text-yellow-500">${nationalAvgBcv.toFixed(2)}</span>
      </div>

      {/* USDT Average */}
      <div className="flex items-center gap-2">
        <span className="text-foreground/70">Promedio USDT:</span>
        <span className="font-bold text-green-500">${nationalAvg.toFixed(2)}</span>
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-ketchup" />
        ) : (
          <TrendingDown className="w-4 h-4 text-green-500" />
        )}
      </div>
      
      {localAvg > 0 && (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-foreground/70">Tu zona (USDT):</span>
          <span className="font-bold text-primary">${localAvg.toFixed(2)}</span>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <span className="text-foreground/70">Reportes:</span>
        <span className="font-bold text-foreground">{entries.length}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full glass-strong py-3 overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {tickerContent}
        {tickerContent}
        {tickerContent}
        {tickerContent}
      </motion.div>
    </div>
  );
};
