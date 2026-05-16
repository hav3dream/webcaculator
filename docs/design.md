# Web 计算器项目开发设计文档 (Development Design Document)

本规划文档旨在为基于 **pnpm + Vite + React** 技术栈的现代化 Web 计算器应用提供清晰的系统架构、模块设计、状态管理流转以及规范的工程化实施路径。本设计充分考量了软件工程中“高内聚、低耦合”、“单一职责原则”及“可复用性”，能够完美支撑包含四则运算、取模、开根号、幂次等计算功能，并提供优良的扩展性。

---

## 1. 项目概述与技术栈选型

### 1.1 项目目标
构建一个具备优秀用户体验、界面精美、计算精准且逻辑解耦的 Web 计算器。作为软件工程课程的实践作业，本项目通过规范的架构设计与状态机思维，展现纯前端工程的高标准交付能力。

### 1.2 技术栈核心组件
* **包管理工具**: `pnpm` —— 基于内容寻址的依赖管理，速度极快，磁盘空间利用率高。
* **构建工具**: `Vite` —— 极速的冷启动与热更新（HMR），提供现代化的前端开发体验。
* **前端框架**: `React 18+` —— 采用声明式组件开发与自定义 Hook 进行逻辑抽象。
* **样式框架**: `Tailwind CSS` —— 原子化 CSS 框架，便于快速实现精致的响应式 UI（如现代暗黑风格或玻璃拟态风格）。
* **数学精度库**: `big.js` —— 解决 JavaScript 固有的浮点数精度丢失问题（如 `0.1 + 0.2 !== 0.3`），确保科学计算的严谨性。
* **测试框架**: `Vitest` —— 原生支持 Vite 的轻量级高能测试框架，用于核心计算逻辑的单元测试。

---

## 2. 规范化目录结构

项目目录严格划分了静态资源、表现层（UI 组件）、逻辑层（自定义 Hooks）和数据处理层（工具函数），保证各模块边界清晰。

Code outputFile generated successfully.

```text
src/
├── assets/          # 静态资源（图标、特殊字体等）
├── components/      # UI 组件（纯渲染组件，低耦合，负责呈现与事件触发）
│   ├── Calculator.jsx     # 主计算器外壳组件（容器组件，组合子组件）
│   ├── Display.jsx        # 显示屏组件（展示当前输入、历史算式及计算结果）
│   ├── Keypad.jsx         # 按键面板组件（渲染数字、运算符与控制键）
│   └── HistoryPanel.jsx   # 历史记录侧边栏组件（本地存储的计算历史回溯）
├── hooks/           # 自定义 Hook（抽离核心业务与状态流转逻辑）
│   └── useCalculator.js   # 驱动计算器状态机的核心逻辑状态 Hook
├── utils/           # 工具函数层
│   └── mathHelper.js      # 基于 big.js 封装的高精度数学运算函数
├── App.jsx          # 应用根组件，配置全局布局或主题
└── main.jsx         # 应用程序挂载入口
```
## 3. 核心模块详细设计

### 3.1 数据处理层：
src/utils/mathHelper.jsJavaScript 的 Number 类型基于 IEEE 754 双精度浮点数标准，直接进行四则运算极易出现精度异常。本模块采用 big.js 进行二次封装，向外暴露安全的运算接口。核心代码骨架与设计：JavaScriptimport Big from 'big.js';

// 配置 Big.js 的全局错误处理或边界
// 例如，防止除以零引发内部崩溃，交由业务逻辑判断
Big.RM = 1; // 四舍五入模式

export const mathHelper = {
  add: (a, b) => new Big(a).plus(b).toString(),
  subtract: (a, b) => new Big(a).minus(b).toString(),
  multiply: (a, b) => new Big(a).times(b).toString(),
  divide: (a, b) => {
    const bigA = new Big(a);
    const bigB = new Big(b);
    if (bigB.eq(0)) return 'Error: Div by 0';
    return bigA.div(bigB).toString();
  },
  mod: (a, b) => {
    const bigB = new Big(b);
    if (bigB.eq(0)) return 'Error: Mod by 0';
    return new Big(a).mod(bigB).toString();
  },
  sqrt: (a) => {
    const bigA = new Big(a);
    if (bigA.lt(0)) return 'Error: Invalid Input';
    return bigA.sqrt().toString();
  },
  pow: (a, b) => {
    // big.js 的 pow 要求指数必须是整数，若支持小数幂次可结合原生 Math 并做精度修正
    try {
      return new Big(a).pow(Number(b)).toString();
    } catch (e) {
      return Math.pow(Number(a), Number(b)).toString();
    }
  }
};
### 3.2 逻辑层（有限状态机）：src/hooks/useCalculator.
js计算器输入是一个典型的有限状态机 (FSM)。按键动作（数字、运算符、等号、清除、功能键）触发状态流转。为了保证逻辑的单一性与可测试性，使用 useReducer 管理复杂状态。状态模型设计 (State Object)属性名类型说明currentValueString当前屏幕上正在输入的数字或最终显示的计算结果，默认为 '0'previousValueString | null缓存的上一个操作数，用于双目运算operationString | null当前激活的运算符（如 +, -, *, /, ^, %）overwriteBoolean标记下次输入数字时，是追加在当前数字后，还是直接覆盖当前数字（如按下“=”后输入新数字）historyArray存储历史记录项，每项包含 { equation: string, result: string }动作类型 (Action Types)ADD_DIGIT: 用户点击数字或小数点。CHOOSE_OPERATION: 用户点击双目运算符（+, -, *, /, %, ^）。CLEAR: 按下 AC 键，清空所有状态。DELETE_DIGIT: 按下退格键（C / Backspace）。EVALUATE: 按下等号键，执行计算。SINGLE_OP: 按下单目运算符（如 $\sqrt{x}$、正负号转换）。状态机流转逻辑设计：
```JavaScriptimport
{ useReducer, useEffect } from 'react';
import { mathHelper } from '../utils/mathHelper';

const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
  SINGLE_OP: 'single-op'
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentValue: payload.digit,
          overwrite: false
        };
      }
      if (payload.digit === '0' && state.currentValue === '0') return state;
      if (payload.digit === '.' && state.currentValue.includes('.')) return state;
      if (state.currentValue === '0' && payload.digit !== '.') {
        return { ...state, currentValue: payload.digit };
      }
      return {
        ...state,
        currentValue: `${state.currentValue}${payload.digit}`
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentValue === '0' && state.previousValue == null) return state;
      // 允许点击不同运算符来切换当前操作
      if (state.previousValue != null && state.operation && !state.overwrite && state.currentValue === '0') {
        return { ...state, operation: payload.operation };
      }
      // 连等/连续计算逻辑 (例如 输入 5 + 5 + ... 自动将前一个结果转为左操作数)
      if (state.previousValue == null) {
        return {
          ...state,
          operation: payload.operation,
          previousValue: state.currentValue,
          overwrite: true
        };
      }
      
      const result = calculate(state);
      return {
        ...state,
        previousValue: result,
        operation: payload.operation,
        currentValue: result,
        overwrite: true
      };

    case ACTIONS.EVALUATE:
      if (state.operation == null || state.previousValue == null) return state;
      const finalResult = calculate(state);
      const newHistoryItem = {
        equation: `${state.previousValue} ${state.operation} ${state.currentValue} =`,
        result: finalResult
      };
      return {
        ...state,
        overwrite: true,
        previousValue: null,
        operation: null,
        currentValue: finalResult,
        history: [newHistoryItem, ...state.history]
      };

    case ACTIONS.SINGLE_OP:
      // 处理开根号等单目运算
      if (payload.op === 'sqrt') {
        const res = mathHelper.sqrt(state.currentValue);
        return { ...state, currentValue: res, overwrite: true };
      }
      if (payload.op === 'negate') {
        if (state.currentValue === '0') return state;
        const res = state.currentValue.startsWith('-') ? state.currentValue.slice(1) : `-${state.currentValue}`;
        return { ...state, currentValue: res };
      }
      return state;

    case ACTIONS.CLEAR:
      return { currentValue: '0', previousValue: null, operation: null, overwrite: false, history: state.history };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) return { ...state, overwrite: false, currentValue: '0' };
      if (state.currentValue.length === 1) return { ...state, currentValue: '0' };
      return { ...state, currentValue: state.currentValue.slice(0, -1) };

    default:
      return state;
  }
}

function calculate({ currentValue, previousValue, operation }) {
  switch (operation) {
    case '+': return mathHelper.add(previousValue, currentValue);
    case '-': return mathHelper.subtract(previousValue, currentValue);
    case '*': return mathHelper.multiply(previousValue, currentValue);
    case '/': return mathHelper.divide(previousValue, currentValue);
    case '%': return mathHelper.mod(previousValue, currentValue);
    case '^': return mathHelper.pow(previousValue, currentValue);
    default: return currentValue;
  }
}

export function useCalculator() {
  // 从 LocalStorage 初始化历史记录以体现工程严谨性
  const [state, dispatch] = useReducer(reducer, {
    currentValue: '0',
    previousValue: null,
    operation: null,
    overwrite: false,
    history: JSON.parse(localStorage.getItem('calc_history')) || []
  });

  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(state.history));
  }, [state.history]);

  return { state, dispatch, ACTIONS };
}
```
## 4. UI 表现层设计规范为了保证应用的高颜值，推荐采用现代极简微渐变或暗黑极简风。
### 4.1 全局主题与 Calculator.jsx 布局计算器整体使用固定宽高或在移动端自适应，通过两栏或侧边栏抽屉模式容纳 HistoryPanel。
JavaScript// src/components/Calculator.jsx 伪代码参考
```JavaScript
import React from 'react';
import Display from './Display';
import Keypad from './Keypad';
import HistoryPanel from './HistoryPanel';
import { useCalculator } from '../hooks/useCalculator';

export default function Calculator() {
  const { state, dispatch, ACTIONS } = useCalculator();

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-4xl mx-auto bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 backdrop-blur-lg">
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
  );
}
```
### 4.2 视觉设计规范 (Tailwind CSS 建议类名)
主体背景: 采用深色调 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 营造沉浸科技感。
按键网格 (Keypad.jsx): 使用 grid grid-cols-4 gap-3 实现紧凑对齐。
按键色调分级:数字键: bg-slate-800 text-slate-100 hover:bg-slate-700 active:scale-95 transition-all rounded-xl shadow-md核心算符键 ($+, -, \times, \div, =$): bg-amber-500 text-white hover:bg-amber-400 font-bold shadow-amber-500/20 shadow-lg
功能控制键 ($AC, C, \%, \sqrt{x}$): bg-slate-700 text-teal-400 hover:bg-slate-600 font-semibold
显示屏 (Display.jsx):整体靠右对齐：text-right font-mono flex flex-col justify-end p-4 min-h-[120px]
上层小字显示历史公式：text-sm text-slate-400 tracking-wide mb-1 min-h-[20px]
下层大字显示当前输入：text-4xl font-bold text-white overflow-x-auto whitespace-nowrap scrollbar-none
## 5. 工程化交付与质量保障措施
### 5.1 键盘映射与无障碍支持 (Accessibility)
在软件工程的高分评定中，对键盘快捷键支持等细节的处理能极大增加作业亮点。
可在 Calculator.jsx 中统一监听键盘事件并转发至 dispatch：
数字 0-9 与 .$\rightarrow$ 触发 ADD_DIGIT
+, -, *, /, %, ^$\rightarrow$ 触发 CHOOSE_OPERATION
Enter 或 =$\rightarrow$ 触发 EVALUATE
 Escape$\rightarrow$ 触发 CLEAR
Backspace$\rightarrow$ 触发 DELETE_DIGIT
### 5.2 核心算法单元测试 (Vitest)
测试是验证软件质量的核心。针对 mathHelper.js 编写完备的边界测试：
JavaScript
// src/utils/mathHelper.test.js
import { describe, it, expect } from 'vitest';
import { mathHelper } from './mathHelper';

describe('高精度数学计算工具链测试', () => {
  it('应当正确处理 JavaScript 经典浮点数精度漏洞', () => {
    expect(mathHelper.add('0.1', '0.2')).toBe('0.3');
  });

  it('应当在除以零时返回优雅的错误提示而不是崩溃', () => {
    expect(mathHelper.divide('5', '0')).toBe('Error: Div by 0');
  });

  it('单目运算符开根号测试', () => {
    expect(mathHelper.sqrt('9')).toBe('3');
    expect(mathHelper.sqrt('-4')).toBe('Error: Invalid Input');
  });
  
  it('幂次运算测试', () => {
    expect(mathHelper.pow('2', '3')).toBe('8');
  });
});

## 6. 部署与交付说明
地基环境准备: 确保本地安装 Node.js 环境，执行 npm install -g pnpm。
依赖安装: 项目根目录下执行 pnpm install。
开发热构建: 执行 pnpm run dev 启动 Vite 开发服务器。
生产环境构建: 执行 pnpm run build，Vite 将进行高效的 Tree-shaking 压缩打包，产物将无缝输出至 dist/ 文件夹。
纯前端无缝部署: 由于去除后端依赖，产物 dist/ 可直接挂载至 GitHub Pages、Vercel 或学校内网静态服务器上，具备天然的零维护优势。