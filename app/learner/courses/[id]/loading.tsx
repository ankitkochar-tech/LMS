export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-[#E5E7EB] rounded w-1/3" />
      <div className="h-32 bg-[#E5E7EB] rounded" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-[#E5E7EB] rounded" />
          <div className="h-64 bg-[#E5E7EB] rounded" />
        </div>
        <div className="h-64 bg-[#E5E7EB] rounded" />
      </div>
    </div>
  )
}
