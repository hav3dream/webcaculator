import Big from 'big.js'

Big.RM = 1

export const mathHelper = {
  add: (a, b) => new Big(a).plus(b).toString(),
  subtract: (a, b) => new Big(a).minus(b).toString(),
  multiply: (a, b) => new Big(a).times(b).toString(),
  divide: (a, b) => {
    const bigA = new Big(a)
    const bigB = new Big(b)
    if (bigB.eq(0)) return 'Error: Div by 0'
    return bigA.div(bigB).toString()
  },
  mod: (a, b) => {
    const bigB = new Big(b)
    if (bigB.eq(0)) return 'Error: Mod by 0'
    return new Big(a).mod(bigB).toString()
  },
  sqrt: (a) => {
    const bigA = new Big(a)
    if (bigA.lt(0)) return 'Error: Invalid Input'
    return bigA.sqrt().toString()
  },
  pow: (a, b) => {
    try {
      return new Big(a).pow(Number(b)).toString()
    } catch {
      return Math.pow(Number(a), Number(b)).toString()
    }
  }
}
