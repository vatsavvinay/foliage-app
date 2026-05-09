/**
 * Skeleton component for loading states
 * Displays a placeholder while content is loading
 */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the skeleton is animated
   * @default true
   */
  animate?: boolean;
}

export function Skeleton({ animate = true, className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 rounded-lg ${
        animate ? 'animate-pulse' : ''
      } ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton for product cards
 * Displays loading state while product data is fetched
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[4/3]" />

      <div className="p-3 sm:p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Price and button skeleton */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for text content
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}

/**
 * Skeleton for image content
 */
export function ImageSkeleton({ aspect = '4/3' }: { aspect?: string }) {
  return <Skeleton className={`w-full aspect-[${aspect}]`} />;
}

/**
 * Skeleton for table rows
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-200">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Skeleton grid for multiple items
 */
export function SkeletonGrid({
  count = 6,
  children = <ProductCardSkeleton />,
}: {
  count?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{children}</div>
      ))}
    </div>
  );
}
