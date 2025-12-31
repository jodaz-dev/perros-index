import { useState } from 'react';
import { PerroTicker } from '@/components/PerroTicker';
import { HotDogMap } from '@/components/HotDogMap';
import { SubmitFAB } from '@/components/SubmitFAB';
import { SubmitModal } from '@/components/SubmitModal';
import { BottomSheet } from '@/components/BottomSheet';
import { useExchangeRates } from '@/hooks/useExchangeRates';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useExchangeRates();

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background">
      {/* Top ticker */}
      <PerroTicker />

      {/* Full-screen map */}
      <div className="flex-1 relative z-0">
        <HotDogMap />
      </div>

      {/* Submit FAB */}
      <SubmitFAB onClick={() => setIsModalOpen(true)} />

      {/* Submit Modal */}
      <SubmitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Bottom sheet with entries */}
      <BottomSheet />
    </div>
  );
};

export default Index;
