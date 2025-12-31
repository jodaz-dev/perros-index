import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, TrendingUp, Building2, Coins } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const exchangeRates = useAppStore((state) => state.exchangeRates);

  useEffect(() => {
    const hasSeen = localStorage.getItem('disclaimer_seen');
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('disclaimer_seen', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md bg-card border border-border rounded-3xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Info className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display">Tasa de cambio</h2>
                    <p className="text-sm text-muted-foreground">Información importante</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-foreground/80">
                  Mostramos los precios en USDT y BCV basándonos en la tasa del día en que los usuarios crearon el reporte.
                </p>

                <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      <span>Tasa BCV del día</span>
                    </div>
                    <span className="font-bold">{exchangeRates.BCV.toFixed(2)} VES</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span>Tasa USDT del día</span>
                    </div>
                    <span className="font-bold">{exchangeRates.USDT.toFixed(2)} VES</span>
                  </div>
                </div>

                <div className="flex gap-3 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <Coins className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    Recuerda que los precios son referenciales y pueden variar al momento de la compra.
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl active:scale-95 transition-transform"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
