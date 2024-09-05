import { inputPatterns } from "@/components/Calculator";
import { create } from "zustand";

// Define types for the calculator
export const OPERATORS = ["÷", "x", "-", "+", "="] as const;
export type Operator = (typeof OPERATORS)[number];
export type Float = `${"-" | ""}${number}${"."}${number}`;
export type Integer = `${"-" | ""}${number}`;
export type PartialNumber = `${Integer}${"." | ""}`;
export type Input = Float | PartialNumber | Operator;

// Define the calculator state type
type CalculatorState = {
  inputs: Input[];
  addInput(value: Input | "."): void;
  addOperator(value: Operator): void;
  clear(): void;
  reset(): void;
  percent(): void;
  invert(): void;
};

// Create the zustand store for the calculator state
const useCalculatorStore = create<CalculatorState>()((set, get) => ({
  inputs: ["0" as Input],
  addInput(value) {
    set((state) => {
      const inputs = [...state.inputs];
      const lastItem = inputs.pop();
      if (!lastItem) return state;
      if (value === "." && lastItem.includes(".")) {
        return { inputs: [...inputs, lastItem] };
      }
      const val = value as Input;
      if (lastItem === "0" && value !== ".") return { inputs: [val] };
      if (inputPatterns.number.test(lastItem)) {
        const limit = lastItem.includes(".") ? 9 : 8;
        const updatedItem =
          lastItem.length < limit ? (lastItem.concat(val) as Input) : lastItem;
        return { inputs: [...inputs, updatedItem] };
      }

      return { inputs: [...state.inputs, val] };
    });
  },
  addOperator(value) {
    set((state) => {
      const inputs = [...state.inputs];
      const lastItem = inputs.pop();
      if (!lastItem) return state;

      if (value === "=") {
        if (state.inputs.length < 2) return state;
        return {
          inputs: [
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            evaluate(infixToPostfix(state.inputs)!)!.slice(0, 10) as Input,
          ],
        };
      }

      const secondToLast = state.inputs.at(-2);
      if (secondToLast === value) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        return { inputs: [evaluate(infixToPostfix(state.inputs)!)!, value] };
      }

      const updatedValue = inputPatterns.operator.test(lastItem)
        ? [...inputs, value]
        : [...state.inputs, value];
      return { inputs: updatedValue };
    });
  },
  clear() {
    set((state) => {
      const inputs = [...state.inputs];
      const lastItem = inputs.at(-1);
      if (!lastItem) return state;
      inputs.pop();
      if (inputPatterns.number.test(lastItem)) {
        return { inputs: [...inputs, "0"] };
      }
      return { inputs };
    });
  },
  reset() {
    set({ inputs: ["0"] });
  },
  percent() {
    set((state) => {
      const lastInput = state.inputs.at(-1);
      const secondLast = state.inputs.at(-2);
      if (!lastInput) return state;
      const value = Number.parseFloat(lastInput) / 100;
      let percent = value;
      const getInputs = () =>
        state.inputs
          .slice(0, -1)
          .concat(percent.toPrecision(9).replace(/\.?0+$/, "") as Input);
      if (!secondLast)
        return {
          inputs: getInputs(),
        };
      if (["+", "-"].includes(secondLast)) {
        const thirdLast = state.inputs.at(-3);
        if (!thirdLast) return state;
        const base = Number.parseFloat(thirdLast);
        percent = base * value;
      }
      return {
        inputs: getInputs(),
      };
    });
  },
  invert() {
    set((state) => {
      const inputs = [...state.inputs];
      const lastItem = inputs.pop();
      if (!lastItem || !inputPatterns.number.test(lastItem)) return state;
      const inverse = Number.parseFloat(lastItem) * -1;
      return { inputs: [...inputs, String(inverse) as Input] };
    });
  },
}));

// Export hooks to use the store state and actions
export const useInputs = () => useCalculatorStore((state) => state.inputs);
export const useAddInput = () => useCalculatorStore((state) => state.addInput);
export const useAddOperator = () =>
  useCalculatorStore((state) => state.addOperator);
export const useReset = () => useCalculatorStore((state) => state.reset);
export const useClear = () => useCalculatorStore((state) => state.clear);
export const usePercent = () => useCalculatorStore((state) => state.percent);
export const useInvert = () => useCalculatorStore((state) => state.invert);

// Define operator precedence for the infix-to-postfix conversion
const operatorMap = new Map([
  ["+", 1],
  ["-", 1],
  ["x", 2],
  ["÷", 2],
]);

// Function to convert infix expressions to postfix
export function infixToPostfix(inputs: Input[]) {
  const operators: Operator[] = [];
  const output: Input[] = [];

  for (const input of inputs) {
    if (!operatorMap.has(input)) {
      output.push(input);
      continue;
    }

    const inputPrecedence = operatorMap.get(input);
    const lastOperator = operators.at(-1);

    if (!lastOperator) {
      operators.push(input as Operator);
      continue;
    }

    const lastItemPrecedence = operatorMap.get(lastOperator);
    if (!lastItemPrecedence || !inputPrecedence) continue;

    while (operators.length > 0) {
      const lastOperator = operators.at(-1);
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const lastItemPrecedence = operatorMap.get(lastOperator!);
      if (!lastItemPrecedence) break;
      if (lastItemPrecedence < inputPrecedence) break;
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      output.push(lastOperator!);
      operators.pop();
    }

    operators.push(input as Operator);
  }

  while (operators.length) {
    const lastItem = operators.pop();
    if (!lastItem) return;
    output.push(lastItem);
  }

  return output;
}

// Function to evaluate postfix expressions
export function evaluate(conversion: Input[]) {
  if (conversion.length === 0) return;
  const results: Input[] = [];
  for (const token of conversion) {
    if (!operatorMap.has(token)) {
      results.push(token);
      continue;
    }
    const b = String(results.pop());
    const a = String(results.pop());
    let total = 0;
    switch (token as Operator) {
      case "+":
        total = Number.parseFloat(a) + Number.parseFloat(b);
        break;
      case "-":
        total = Number.parseFloat(a) - Number.parseFloat(b);
        break;
      case "x":
        total = Number.parseFloat(a) * Number.parseFloat(b);
        break;
      case "÷":
        total = Number.parseFloat(a) / Number.parseFloat(b);
        break;
      default:
        break;
    }

    results.push(String(Number.isNaN(total) ? 0 : total) as Input);
  }

  return results[0];
}
