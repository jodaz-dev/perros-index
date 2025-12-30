import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, MapPin, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitModal = ({ isOpen, onClose }: SubmitModalProps) => {
  const [price, setPrice] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addEntry, userLocation } = useAppStore();

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!price || !businessName) {
      toast.error('Completa todos los campos requeridos');
      return;
    }

    const submitLocation = location || userLocation;
    if (!submitLocation) {
      toast.error('Necesitamos tu ubicación');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    addEntry({
      price: parseFloat(price),
      businessName,
      lat: submitLocation.lat,
      lng: submitLocation.lng,
      photo: photo || undefined,
    });

    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setPrice('');
    setBusinessName('');
    setPhoto(null);
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

                    {/* Price input */}
                    <div>
                      <Label htmlFor="price">Precio (USD) *</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="2.50"
                          className="pl-8 bg-secondary border-none text-lg"
                        />
                      </div>
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
                      disabled={isSubmitting || !price || !businessName}
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
