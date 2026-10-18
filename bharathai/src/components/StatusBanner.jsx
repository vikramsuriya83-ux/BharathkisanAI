export default function StatusBanner({
  loading = false,
  error = "",
  empty = false,
  emptyText = "No records are available for this selection.",
  onRetry,
}) {
  if (loading) {
    return (
      <div className="rounded-[10px] border border-[#e4eee2] bg-[#e8f3e5] px-[11px] py-[9px] text-[10px] font-semibold text-[#416c49]">
        Loading live data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[10px] border border-[#f0d9d4] bg-[#fff4f1] px-[11px] py-[9px]">
        <p className="text-[10px] font-semibold text-[#9a4d3f]">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 rounded-md bg-[#194831] px-3 py-1.5 text-[9px] font-semibold text-white"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="rounded-[10px] border border-[#e4eee2] bg-white px-[11px] py-[9px] text-[10px] text-[#7a8d7d]">
        {emptyText}
      </div>
    );
  }

  return null;
}
