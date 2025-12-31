import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, MapPin, Check, Loader2, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';
import { reportService } from '@/services/reportService';
import { isSupabaseConfigured } from '@/lib/supabase';
import { toast } from 'sonner';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitModal = ({ isOpen, onClose }: SubmitModalProps) => {
  const [priceBs, setPriceBs] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addEntry, userLocation, exchangeRates } = useAppStore();

  const estimates = useMemo(() => {
    const val = parseFloat(priceBs);
    if (isNaN(val)) return null;
    return {
      usdt: val / exchangeRates.USDT,
      bcv: val / exchangeRates.BCV
    };
  }, [priceBs, exchangeRates]);

  const handleGetLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
        toast.success('Ubicación detectada');
      },
      () => {
        setIsLocating(false);
        toast.error('No se pudo obtener la ubicación');
      }
    );
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!priceBs || !businessName) {
      toast.error('Completa todos los campos requeridos');
      return;
    }

    const submitLocation = location || userLocation;
    if (!submitLocation) {
      toast.error('Necesitamos tu ubicación');
      return;
    }

    setIsSubmitting(true);

    try {
      const bsValue = parseFloat(priceBs);

      // Try Supabase first
      if (isSupabaseConfigured()) {
        await reportService.create({
          businessName,
          priceBs: bsValue,
          lat: submitLocation.lat,
          lng: submitLocation.lng,
          photoFile: photoFile || undefined,
        });
      } else {
        // Fallback to local store
        const usdtPrice = bsValue / exchangeRates.USDT;
        const bcvPrice = bsValue / exchangeRates.BCV;

        addEntry({
          price: usdtPrice,
          priceBs: bsValue,
          priceBcv: bcvPrice,
          businessName,
          lat: submitLocation.lat,
          lng: submitLocation.lng,
          photo: photo || undefined,
        });
      }

      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        resetForm();
      }, 1500);
    } catch (error) {
      console.error('Failed to submit report:', error);
      toast.error('Error al enviar el reporte');
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPriceBs('');
    setBusinessName('');
    setPhoto(null);
    setPhotoFile(null);
    setLocation(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            className="relative w-full max-w-md glass-strong rounded-t-3xl sm:rounded-3xl p-6 m-0 sm:m-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-display font-bold"
                  >
                    ¡Precio reportado! 🌭
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-bold">Reportar Precio</h2>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full hover:bg-secondary transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Photo capture (optional) */}
                    <div className="flex justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        ref={fileInputRef}
                        onChange={handlePhotoCapture}
                        className="hidden"
                      />
                      {photo ? (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative"
                        >
                          <img
                            src={photo}
                            alt="Hot dog"
                            className="w-32 h-32 object-cover rounded-2xl"
                          />
                          <button
                            onClick={() => setPhoto(null)}
                            className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-32 h-32 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors"
                        >
                          <Camera className="w-8 h-8 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Foto (opcional)</span>
                        </button>
                      )}
                    </div>

                    {/* Price input (Bolivares) */}
                    <div>
                      <Label htmlFor="price">Precio (Bolívares) *</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">Bs</span>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={priceBs}
                          onChange={(e) => setPriceBs(e.target.value)}
                          placeholder="100.00"
                          className="pl-10 bg-secondary border-none text-lg"
                        />
                      </div>
                      
                      {/* Price Estimates */}
                      {estimates && (
                        <motion.div 
                          className="mt-2 text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg flex flex-col gap-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Calculator className="w-3 h-3" />
                            <span className="font-semibold">Estimado en divisa:</span>
                          </div>
                          <div className="flex justify-between">
                            <span>BCV:</span>
                            <span className="font-bold text-foreground">${estimates.bcv.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>USDT:</span>
                            <span className="font-bold text-foreground">${estimates.usdt.toFixed(2)}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Business name */}
                    <div>
                      <Label htmlFor="business">Nombre del puesto *</Label>
                      <Input
                        id="business"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Ej: Perros El Gordo"
                        className="mt-1 bg-secondary border-none"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <Label>Ubicación</Label>
                      <Button
                        variant="secondary"
                        className="w-full mt-1 justify-start"
                        onClick={handleGetLocation}
                        disabled={isLocating}
                      >
                        {isLocating ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <MapPin className="w-4 h-4 mr-2" />
                        )}
                        {location 
                          ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                          : userLocation
                          ? 'Usar ubicación actual'
                          : 'Detectar ubicación'
                        }
                      </Button>
                    </div>

                    {/* Submit */}
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !priceBs || !businessName}
                      className="w-full h-12 text-lg font-display font-bold"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'Reportar 🌭'
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
