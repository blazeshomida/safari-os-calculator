"use client";

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

const FUNCTIONS = ["AC", "+/-", "%"] as const;
const OPERATORS = ["÷", "x", "-", "+", "="] as const;
const DIGITS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
] as const;

const inputPatterns = {
  sign: /[-+]/,
  integer: /^[-+]?\d+$/,
  float: /^[-+]?\d+\.\d+$/,
  hasDecimal: /^[-+]?\d*\.\d*$/,
  decimal: /^\.$/,
  operator: /^[+\-*/]$/,
};

function Calculator() {
  return (
    <div>
      <div className="ml-auto text-right text-7xl">
        <output className="col-span-full ml-auto pr-8 md:pr-10">0</output>
      </div>
      <div
        onPointerDown={handlePointerDown}
        className="grid w-full max-w-md touch-none select-none grid-cols-4 gap-2 p-4 *:grid *:grid-cols-subgrid *:grid-rows-subgrid lg:max-w-xl"
      >
        <div className="col-span-3 row-span-5">
          {FUNCTIONS.map((value) => (
            <Button variant="function" key={value} value={value}>
              {value}
            </Button>
          ))}
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
            {DIGITS.map((value, idx) => (
              <Button
                variant="default"
                size={idx === 0 ? "large" : "default"}
                style={{
                  gridArea: value,
                }}
                key={value}
                value={idx}
              >
                {idx}
              </Button>
            ))}
            <Button
              variant="default"
              style={{
                gridArea: "decimal",
              }}
              value="."
            >
              .
            </Button>
          </div>
        </div>
        <div className="row-span-5">
          {OPERATORS.map((value) => (
            <Button variant="operator" key={value} value={value}>
              {value}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calculator;
