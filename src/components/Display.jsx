export default function Display({ current, previous, operation }) {
  return (
    <div className="text-right font-mono flex flex-col justify-end p-4 min-h-[120px]">
      <div className="text-sm text-slate-400 tracking-wide mb-1 min-h-[20px]">
        {previous != null && operation != null
          ? `${previous} ${operation}`
          : '\u00A0'}
      </div>
      <div className="text-4xl font-bold text-white overflow-x-auto whitespace-nowrap scrollbar-none">
        {current}
      </div>
    </div>
  )
}
