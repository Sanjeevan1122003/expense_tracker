// src/components/loaders/TableSkeleton.jsx

/**
 * TableSkeleton — A shimmering skeleton placeholder for table loading states.
 * Displays a title bar and multiple animated rows while data is being fetched.
 */
const TableSkeleton = () => {
  return (
    <div className="p-4">
      {/* Title bar placeholder */}
      <div className="h-8 bg-muted animate-pulse rounded w-40 mb-4" />

      {/* Simulated table rows */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
