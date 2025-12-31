import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronUp, Clock, MapPin, DollarSign, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { haversineDistance } from '@/utils/helpers';

type SortOption = 'newest' | 'closest' | 'cheapest';

export const BottomSheet = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const { entries, userLocation } = useAppStore();

  const sortedEntries = [...entries].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'cheapest':
        return a.price - b.price;
      case 'closest':
        if (!userLocation) return 0;
        const distA = haversineDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = haversineDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      default:
        return 0;
    }
  });

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `hace ${days}d`;
    if (hours > 0) return `hace ${hours}h`;
    return `hace ${mins}m`;
  };

  const getDistance = (lat: number, lng: number) => {
    if (!userLocation) return null;
    const dist = haversineDistance(userLocation.lat, userLocation.lng, lat, lng);
    return dist < 1 ? `${(dist * 1000).toFixed(0)}m` : `${dist.toFixed(1)}km`;
  };

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -50) {
      setIsExpanded(true);
    } else if (info.offset.y > 50) {
      setIsExpanded(false);
    }
  };

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-40 glass-strong rounded-t-3xl"
      initial={{ y: 0 }}
      animate={{ 
        height: isExpanded ? '70vh' : '180px',
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDrag}
    >
      {/* Handle */}
      <div 
        className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
      </div>

      {/* Header */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <h3 className="font-display font-bold text-lg flex items-center gap-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          Reportes recientes
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          </motion.span>
        </h3>

        {/* Sort buttons */}
        {/* <div className="flex gap-1">
          {[
            { key: 'newest' as SortOption, icon: Clock, label: 'Nuevo' },
            { key: 'closest' as SortOption, icon: MapPin, label: 'Cerca' },
            { key: 'cheapest' as SortOption, icon: DollarSign, label: 'Barato' },
          ].map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`p-2 rounded-lg transition-colors ${
                sortBy === key 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div> */}
      </div>

      {/* Entries list */}
      <div className="px-4 overflow-y-auto" style={{ height: isExpanded ? 'calc(70vh - 100px)' : '100px' }}>
        <AnimatePresence mode="popLayout">
          {sortedEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl p-4 mb-3 flex gap-4"
            >
              {entry.photo ? (
                <img 
                  src={entry.photo} 
                  alt={entry.businessName}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 text-3xl">
                  🌭
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display font-bold truncate">{entry.businessName}</h4>
                  <span className="text-xl font-bold text-primary whitespace-nowrap">
                    ${entry.price.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span>{getTimeAgo(entry.createdAt)}</span>
                  {getDistance(entry.lat, entry.lng) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {getDistance(entry.lat, entry.lng)}
                    </span>
                  )}
                  {entry.state && <span>{entry.state}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
