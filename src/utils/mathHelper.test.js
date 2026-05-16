import { describe, it, expect } from 'vitest'
import { mathHelper } from './mathHelper'

describe('高精度数学计算工具链测试', () => {
  it('应当正确处理 JavaScript 经典浮点数精度漏洞', () => {
    expect(mathHelper.add('0.1', '0.2')).toBe('0.3')
  })

  it('加法测试', () => {
    expect(mathHelper.add('5', '3')).toBe('8')
    expect(mathHelper.add('0', '0')).toBe('0')
    expect(mathHelper.add('-1', '2')).toBe('1')
  })

  it('减法测试', () => {
    expect(mathHelper.subtract('10', '3')).toBe('7')
    expect(mathHelper.subtract('0.3', '0.1')).toBe('0.2')
  })

  it('乘法测试', () => {
    expect(mathHelper.multiply('6', '7')).toBe('42')
    expect(mathHelper.multiply('0.1', '0.2')).toBe('0.02')
  })

  it('应当在除以零时返回优雅的错误提示而不是崩溃', () => {
    expect(mathHelper.divide('5', '0')).toBe('Error: Div by 0')
  })

  it('除法测试', () => {
    expect(mathHelper.divide('10', '2')).toBe('5')
    expect(mathHelper.divide('1', '3')).toBe('0.33333333333333333333')
  })

  it('应当在取模零时返回错误提示', () => {
    expect(mathHelper.mod('5', '0')).toBe('Error: Mod by 0')
  })

  it('取模测试', () => {
    expect(mathHelper.mod('10', '3')).toBe('1')
  })

  it('单目运算符开根号测试', () => {
    expect(mathHelper.sqrt('9')).toBe('3')
    expect(mathHelper.sqrt('-4')).toBe('Error: Invalid Input')
    expect(mathHelper.sqrt('0')).toBe('0')
  })

  it('幂次运算测试', () => {
    expect(mathHelper.pow('2', '3')).toBe('8')
    expect(mathHelper.pow('5', '2')).toBe('25')
    expect(mathHelper.pow('10', '0')).toBe('1')
  })
})
