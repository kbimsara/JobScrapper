export function SkeletonJobRow() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 border border-border bg-surface rounded-lg animate-pulse">
      <div className="flex-1 min-w-0 w-full">
        <div className="h-5 bg-border rounded w-3/4 max-w-[300px] mb-3"></div>
        
        <div className="flex flex-wrap items-center gap-4 mb-3">
          <div className="h-4 bg-border rounded w-24"></div>
          <div className="h-4 bg-border rounded w-32"></div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="h-5 bg-border rounded w-20"></div>
          <div className="h-4 bg-border rounded w-24"></div>
          <div className="h-4 bg-border rounded w-24"></div>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
        <div className="h-8 bg-border rounded w-full sm:w-16"></div>
        <div className="h-8 bg-border rounded w-full sm:w-20"></div>
      </div>
    </div>
  );
}
