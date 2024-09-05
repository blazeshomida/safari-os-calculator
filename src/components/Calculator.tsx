"use client";

import {
  type Float,
  type Integer,
  OPERATORS,
  type Operator,
  evaluate,
  infixToPostfix,
  useAddInput,
  useAddOperator,
  useClear,
  useInputs,
  useInvert,
  usePercent,
  useReset,
} from "@/lib/calculatorStore";
import { cn } from "@/lib/utils/cn";
import type React from "react";
import Button from "./Button";

function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
  let target: HTMLButtonElement | undefined;

  function handlePointerMove(e: PointerEvent) {
    if (!target) return;
    target.releasePointerCapture(e.pointerId);
    // Reset the state of the previous target if it's different from the current one
    if (e.target !== target) target.dataset.state = "idle";
    // Update the state of the new target if it's a button
    if (e.target instanceof HTMLButtonElement) {
      target = e.target;
      target.dataset.state = "pressed";
    }
  }

  function handlePointerUp() {
    document.removeEventListener("pointermove", handlePointerMove);
    if (!target) return;
    target.dataset.state = "idle";
  }

  // Check if the initial target is a button and set its state to "pressed"
  if (e.target instanceof HTMLButtonElement) {
    target = e.target;
    target.dataset.state = "pressed";
    // Add event listeners to the document to handle move and up events
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp, { once: true });
  }
}

const DIGITS = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  decimal: ".",
};

export const inputPatterns = {
  sign: /[-+]/,
  integer: /^[-+]?\d+$/,
  number: /^[-+]?\d+\.?\d*$/,
  float: /^[-+]?\d+\.\d+$/,
  hasDecimal: /^[-+]?\d*\.\d*$/,
  decimal: /^\.$/,
  operator: /^[+\-x÷]$/,
};

function Calculator() {
  return (
    <div>
      <Display />
      <div
        onPointerDown={handlePointerDown}
        className="grid w-full max-w-md touch-none select-none grid-cols-4 gap-3 p-4 *:grid *:grid-cols-subgrid *:grid-rows-subgrid lg:max-w-xl"
      >
        <div className="col-span-3 row-span-5">
          <ClearButton />
          <InvertButton />
          <PercentButton />
          <Digits />
        </div>
        <div className="row-span-5">
          <Operators />
        </div>
      </div>
    </div>
  );
}

export default Calculator;

const formatter = new Intl.NumberFormat("en-US");
function formatOutput(output: string) {
  const [integer, decimals = ""] = output.split(".");
  const formattedInteger = formatter.format(Number.parseInt(integer));
  if (!output.includes(".")) return formattedInteger;
  return integer.concat(".", decimals);
}

function Display() {
  const inputs = useInputs();
  const output = inputs.findLast((input) => inputPatterns.number.test(input));
  if (!output) return null;
  return (
    <div
      className={cn("relative pr-8 text-right text-7xl", {
        "py-1.5 text-6xl": output.length > 6,
      })}
    >
      <div className="absolute inset-x-0 -top-[120%] space-y-2 text-left text-xs">
        <div className="flex justify-between">
          <label htmlFor="">Inputs:</label>
          <pre>
            <code>{JSON.stringify(inputs)}</code>
          </pre>
        </div>
        <div className="flex justify-between">
          <label htmlFor="">Conversion:</label>
          <pre>
            <code>{JSON.stringify(infixToPostfix(inputs))}</code>
          </pre>
        </div>
        <div className="flex justify-between">
          <label htmlFor="">Total:</label>
          <pre>
            {/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
            <code>{JSON.stringify(evaluate(infixToPostfix(inputs)!))}</code>
          </pre>
        </div>
      </div>
      <output>{formatOutput(output)}</output>
    </div>
  );
}

function Digits() {
  const addInput = useAddInput();

  return (
    <div
      style={{
        gridTemplateAreas: `
            "seven eight nine"\n
            "four five six"\n
            "one two three"\n
            "zero zero decimal"`,
      }}
      className="col-span-full row-span-5 grid grid-cols-subgrid gap-2"
    >
      {Object.entries(DIGITS).map(([named, value]) => (
        <Button
          variant="default"
          size={value === "0" ? "large" : "default"}
          style={{
            gridArea: named,
          }}
          key={value}
          value={value}
          onPointerUp={(e) =>
            addInput(e.currentTarget.value as Float | Integer | Operator)
          }
        >
          {value}
        </Button>
      ))}
    </div>
  );
}

function Operators() {
  const addOperator = useAddOperator();
  const inputs = useInputs();
  const lastOperator = inputs.findLast((input) =>
    inputPatterns.operator.test(input),
  );
  return OPERATORS.map((value) => (
    <Button
      onPointerUp={() => addOperator(value)}
      variant="operator"
      key={value}
      active={lastOperator === value}
      value={value}
    >
      {value}
    </Button>
  ));
}

function ClearButton() {
  const clear = useClear();
  const reset = useReset();
  const inputs = useInputs();
  const isZero = inputs.at(-1) === "0";
  const handler = isZero ? reset : clear;
  return (
    <Button onPointerUp={handler} variant="function" value="AC">
      {isZero ? "AC" : "C"}
    </Button>
  );
}

function PercentButton() {
  const percent = usePercent();
  return (
    <Button variant="function" onPointerUp={percent} value="%">
      %
    </Button>
  );
}
function InvertButton() {
  const invert = useInvert();
  return (
    <Button variant="function" onPointerUp={invert} value="+/-">
      +/-
    </Button>
  );
}
