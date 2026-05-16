import { useReducer, useEffect } from 'react'
import { mathHelper } from '../utils/mathHelper'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
  SINGLE_OP: 'single-op',
  CLEAR_HISTORY: 'clear-history'
}

function calculate({ currentValue, previousValue, operation }) {
  switch (operation) {
    case '+': return mathHelper.add(previousValue, currentValue)
    case '-': return mathHelper.subtract(previousValue, currentValue)
    case '*': return mathHelper.multiply(previousValue, currentValue)
    case '/': return mathHelper.divide(previousValue, currentValue)
    case '%': return mathHelper.mod(previousValue, currentValue)
    case '^': return mathHelper.pow(previousValue, currentValue)
    default: return currentValue
  }
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT: {
      if (state.overwrite) {
        return {
          ...state,
          currentValue: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === '0' && state.currentValue === '0') return state
      if (payload.digit === '.' && state.currentValue.includes('.')) return state
      if (state.currentValue === '0' && payload.digit !== '.') {
        return { ...state, currentValue: payload.digit }
      }
      return {
        ...state,
        currentValue: `${state.currentValue}${payload.digit}`
      }
    }

    case ACTIONS.CHOOSE_OPERATION: {
      if (state.currentValue === '0' && state.previousValue == null) return state
      if (state.previousValue != null && state.operation && !state.overwrite && state.currentValue === '0') {
        return { ...state, operation: payload.operation }
      }
      if (state.previousValue == null) {
        return {
          ...state,
          operation: payload.operation,
          previousValue: state.currentValue,
          overwrite: true
        }
      }
      const result = calculate(state)
      return {
        ...state,
        previousValue: result,
        operation: payload.operation,
        currentValue: result,
        overwrite: true
      }
    }

    case ACTIONS.EVALUATE: {
      if (state.operation == null || state.previousValue == null) return state
      const finalResult = calculate(state)
      const newHistoryItem = {
        equation: `${state.previousValue} ${state.operation} ${state.currentValue} =`,
        result: finalResult
      }
      return {
        ...state,
        overwrite: true,
        previousValue: null,
        operation: null,
        currentValue: finalResult,
        history: [newHistoryItem, ...state.history]
      }
    }

    case ACTIONS.SINGLE_OP: {
      if (payload.op === 'sqrt') {
        const res = mathHelper.sqrt(state.currentValue)
        return { ...state, currentValue: res, overwrite: true }
      }
      if (payload.op === 'negate') {
        if (state.currentValue === '0') return state
        const res = state.currentValue.startsWith('-')
          ? state.currentValue.slice(1)
          : `-${state.currentValue}`
        return { ...state, currentValue: res }
      }
      return state
    }

    case ACTIONS.CLEAR:
      return {
        currentValue: '0',
        previousValue: null,
        operation: null,
        overwrite: false,
        history: state.history
      }

    case ACTIONS.CLEAR_HISTORY:
      return { ...state, history: [] }

    case ACTIONS.DELETE_DIGIT: {
      if (state.overwrite) return { ...state, overwrite: false, currentValue: '0' }
      if (state.currentValue.length === 1) return { ...state, currentValue: '0' }
      return { ...state, currentValue: state.currentValue.slice(0, -1) }
    }

    default:
      return state
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, {
    currentValue: '0',
    previousValue: null,
    operation: null,
    overwrite: false,
    history: JSON.parse(localStorage.getItem('calc_history')) || []
  })

  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(state.history))
  }, [state.history])

  return { state, dispatch, ACTIONS }
}
