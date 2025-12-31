import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, TrendingUp, Building2, Coins, HelpCircle, ExternalLink } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface DisclaimerModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const DisclaimerModal = ({ isOpen: propIsOpen, onClose: propOnClose }: DisclaimerModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const exchangeRates = useAppStore((state) => state.exchangeRates);

  useEffect(() => {
    // Only auto-open if no props are provided (initial disclaimer behavior)
    if (propIsOpen === undefined) {
      const hasSeen = localStorage.getItem('disclaimer_seen');
      if (!hasSeen) {
        setInternalIsOpen(true);
      }
    }
  }, [propIsOpen]);

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      localStorage.setItem('disclaimer_seen', 'true');
      setInternalIsOpen(false);
    }
  };

  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;

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
            className="w-full max-w-md bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="p-6 overflow-y-auto space-y-6 scrollbar-hide">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Info className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display">Información</h2>
                    <p className="text-sm text-muted-foreground">Sobre Perros Index</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* How it works */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <HelpCircle className="w-5 h-5" />
                    <h3 className="font-bold font-display italic">¿Cómo funciona?</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    Nuestra aplicación rastrea el precio de los perros calientes en toda Venezuela. Los usuarios reportan los precios que ven en la calle y nosotros calculamos el promedio nacional y local en tiempo real.
                  </p>
                </div>

                {/* Exchange Rates */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <TrendingUp className="w-5 h-5" />
                    <h3 className="font-bold font-display italic">Tasas de Cambio</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    Mostramos los precios en USDT y BCV basándonos en la tasa del día en que se creó el reporte.
                  </p>
                  
                  <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        <span>Tasa BCV</span>
                      </div>
                      <span className="font-bold">{exchangeRates.BCV.toFixed(2)} VES</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span>Tasa USDT</span>
                      </div>
                      <span className="font-bold">{exchangeRates.USDT.toFixed(2)} VES</span>
                    </div>
                  </div>
                </div>

                {/* Disclaimer footer */}
                <div className="flex gap-3 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <Coins className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    Recuerda que los precios son referenciales y dependen de la veracidad de los reportes de la comunidad.
                  </p>
                </div>

                {/* Credits */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                    Creado por 
                    <a 
                      href="https://jodaz.xyz" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary font-bold hover:underline flex items-center gap-0.5"
                    >
                      Jesus Ordosgoitty <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl active:scale-95 transition-transform mt-4"
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
