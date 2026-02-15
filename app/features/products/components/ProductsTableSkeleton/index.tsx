function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

export function ProductsTableSkeleton({ rows = 20 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-4 py-3 w-[48px]">
              <SkeletonBlock className="w-5 h-5 rounded" />
            </th>
            <th className="px-4 py-3 w-[280px]">
              <SkeletonBlock className="w-28 h-4" />
            </th>
            <th className="px-4 py-3 w-[150px]">
              <SkeletonBlock className="w-16 h-4" />
            </th>
            <th className="px-4 py-3 w-[140px]">
              <SkeletonBlock className="w-18 h-4" />
            </th>
            <th className="px-4 py-3 w-[100px]">
              <SkeletonBlock className="w-16 h-4" />
            </th>
            <th className="px-4 py-3 w-[130px]">
              <SkeletonBlock className="w-16 h-4" />
            </th>
            <th className="px-4 py-3 w-[80px]" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, i) => (
            <tr key={i} className="border-b border-gray-50">
              <td className="px-4 py-3">
                <SkeletonBlock className="w-5 h-5 rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <SkeletonBlock className="w-10 h-10 rounded-lg shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <SkeletonBlock className="w-36 h-4" />
                    <SkeletonBlock className="w-20 h-3" />
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <SkeletonBlock className="w-20 h-4" />
              </td>
              <td className="px-4 py-3">
                <SkeletonBlock className="w-24 h-4" />
              </td>
              <td className="px-4 py-3">
                <SkeletonBlock className="w-12 h-4" />
              </td>
              <td className="px-4 py-3">
                <SkeletonBlock className="w-20 h-4" />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <SkeletonBlock className="w-8 h-8 rounded-full" />
                  <SkeletonBlock className="w-8 h-8 rounded-full" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
