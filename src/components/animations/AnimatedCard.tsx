import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  whileHover?: boolean;
}

export function AnimatedCard({ 
  children, 
  className = '', 
  onClick,
  whileHover = true 
}: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={whileHover ? { 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={className}
    >
      <Card className={onClick ? 'cursor-pointer' : ''} onClick={onClick}>
        {children}
      </Card>
    </motion.div>
  );
}

export function AnimatedButton({ 
  children, 
  className = '',
  onClick,
  disabled = false,
  ...props 
}: any) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
