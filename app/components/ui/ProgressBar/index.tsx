export function ProgressBar({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div className="h-full bg-[#242EDB] animate-pulse rounded-r" />
    </div>
  );
}
