import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface SubmitFABProps {
  onClick: () => void;
}

export const SubmitFAB = ({ onClick }: SubmitFABProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-24 right-4 z-50 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{
        boxShadow: '0 8px 32px rgba(255, 219, 88, 0.4)',
      }}
    >
      <Plus className="w-8 h-8" />
    </motion.button>
  );
};
