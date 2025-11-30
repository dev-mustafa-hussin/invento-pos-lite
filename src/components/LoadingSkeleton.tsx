import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function LoadingSkeleton({ className = '', count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`bg-muted/50 rounded-lg ${className}`}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 p-4 md:p-6 border border-border rounded-lg">
      <LoadingSkeleton className="h-6 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <div className="flex gap-2 mt-4">
        <LoadingSkeleton className="h-10 flex-1" />
        <LoadingSkeleton className="h-10 w-20" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <LoadingSkeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <LoadingSkeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-4 md:p-6 border border-border rounded-lg space-y-3">
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-8 w-3/4" />
      <LoadingSkeleton className="h-3 w-1/3" />
    </div>
  );
}
