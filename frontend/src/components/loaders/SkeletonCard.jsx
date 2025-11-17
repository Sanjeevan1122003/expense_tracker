// src/components/loaders/SkeletonCard.jsx

/**
 * SkeletonCard — a shimmering placeholder card for loading states.
 * Commonly used while fetching dashboard or card data.
 */
const SkeletonCard = () => {
  return (
    <div className="p-6 bg-gradient-card shadow-soft border border-border/50 rounded-xl">
      <div className="h-4 w-28 bg-muted animate-pulse rounded mb-3" />
      <div className="h-8 w-40 bg-muted animate-pulse rounded" />
    </div>
  );
};

export default SkeletonCard;
