const keyDefs = [
  { label: 'AC', action: 'clear', style: 'func' },
  { label: 'C', action: 'delete', style: 'func' },
  { label: '%', action: 'op', value: '%', style: 'func' },
  { label: '√', action: 'single', value: 'sqrt', style: 'func' },
  { label: '7', action: 'digit', value: '7', style: 'num' },
  { label: '8', action: 'digit', value: '8', style: 'num' },
  { label: '9', action: 'digit', value: '9', style: 'num' },
  { label: '/', action: 'op', value: '/', style: 'op' },
  { label: '4', action: 'digit', value: '4', style: 'num' },
  { label: '5', action: 'digit', value: '5', style: 'num' },
  { label: '6', action: 'digit', value: '6', style: 'num' },
  { label: '*', action: 'op', value: '*', style: 'op' },
  { label: '1', action: 'digit', value: '1', style: 'num' },
  { label: '2', action: 'digit', value: '2', style: 'num' },
  { label: '3', action: 'digit', value: '3', style: 'num' },
  { label: '-', action: 'op', value: '-', style: 'op' },
  { label: '±', action: 'single', value: 'negate', style: 'num' },
  { label: '0', action: 'digit', value: '0', style: 'num' },
  { label: '.', action: 'digit', value: '.', style: 'num' },
  { label: '+', action: 'op', value: '+', style: 'op' },
  { label: '^', action: 'op', value: '^', style: 'func' },
  { label: '=', action: 'eval', style: 'eval', span: 3 },
]

const styleMap = {
  num: 'bg-slate-800 text-slate-100 hover:bg-slate-700 active:scale-95 transition-all rounded-xl shadow-md',
  op: 'bg-amber-500 text-white hover:bg-amber-400 font-bold shadow-amber-500/20 shadow-lg active:scale-95 transition-all rounded-xl',
  func: 'bg-slate-700 text-teal-400 hover:bg-slate-600 font-semibold active:scale-95 transition-all rounded-xl',
  eval: 'bg-amber-500 text-white hover:bg-amber-400 font-bold shadow-amber-500/20 shadow-lg active:scale-95 transition-all rounded-xl',
}

export default function Keypad({ dispatch, ACTIONS }) {
  const handleClick = (def) => {
    switch (def.action) {
      case 'digit':
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: def.value } })
        break
      case 'op':
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: def.value } })
        break
      case 'eval':
        dispatch({ type: ACTIONS.EVALUATE })
        break
      case 'clear':
        dispatch({ type: ACTIONS.CLEAR })
        break
      case 'delete':
        dispatch({ type: ACTIONS.DELETE_DIGIT })
        break
      case 'single':
        dispatch({ type: ACTIONS.SINGLE_OP, payload: { op: def.value } })
        break
    }
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {keyDefs.map((def, idx) => (
        <button
          key={idx}
          onClick={() => handleClick(def)}
          className={`py-3 text-lg select-none cursor-pointer ${styleMap[def.style]}`}
          style={def.span ? { gridColumn: `span ${def.span}` } : undefined}
        >
          {def.label}
        </button>
      ))}
    </div>
  )
}
