export default function HistoryPanel({ history, dispatch, ACTIONS }) {
  const handleClearHistory = () => {
    dispatch({ type: ACTIONS.CLEAR_HISTORY })
  }

  return (
    <div className="w-full md:w-64 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-300">历史记录</h3>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            清空
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 min-h-[300px]">
        {history.length === 0 ? (
          <p className="text-xs text-slate-600 text-center mt-8">暂无记录</p>
        ) : (
          history.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-800 rounded-lg p-2 text-right"
            >
              <div className="text-xs text-slate-500 truncate">{item.equation}</div>
              <div className="text-sm font-mono font-bold text-white truncate">
                {item.result}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
