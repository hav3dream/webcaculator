import { useCallback, useEffect } from 'react'
import Display from './Display'
import Keypad from './Keypad'
import HistoryPanel from './HistoryPanel'
import { useCalculator } from '../hooks/useCalculator'

export default function Calculator() {
  const { state, dispatch, ACTIONS } = useCalculator()

  const handleKeyDown = useCallback((e) => {
    const key = e.key
    if (key >= '0' && key <= '9' || key === '.') {
      dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: key } })
      return
    }
    const opMap = { '+': '+', '-': '-', '*': '*', '/': '/', '%': '%', '^': '^' }
    if (key in opMap) {
      dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: opMap[key] } })
      return
    }
    if (key === 'Enter' || key === '=') {
      dispatch({ type: ACTIONS.EVALUATE })
      return
    }
    if (key === 'Escape') {
      dispatch({ type: ACTIONS.CLEAR })
      return
    }
    if (key === 'Backspace') {
      dispatch({ type: ACTIONS.DELETE_DIGIT })
      return
    }
  }, [dispatch, ACTIONS])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-4xl mx-auto bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl shadow-2xl border border-slate-800 backdrop-blur-lg">
      <div className="flex-1 flex flex-col justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <Display
          current={state.currentValue}
          previous={state.previousValue}
          operation={state.operation}
        />
        <Keypad dispatch={dispatch} ACTIONS={ACTIONS} />
      </div>
      <HistoryPanel history={state.history} dispatch={dispatch} ACTIONS={ACTIONS} />
    </div>
  )
}
