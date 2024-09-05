# Safari OS Calculator

## Overview

This project was designed to explore micro interactions and simple algorithms, with inspiration drawn from Apple's fluid animations and user interfaces. The goal was to recreate the seamless experience of using native Apple apps in a web browser environment.

## Micro Interactions

Apple's mobile user interfaces are renowned for their smooth and intuitive micro interactions. These subtle details enhance the overall user experience, making interactions feel natural. One notable feature in Apple's calculator app is the ability to press a button and drag your finger away to cancel the action, with visual feedback reflecting the interaction state.

While exploring iOS UI elements, I found that Apple's calculator allows users to change their selection mid-interaction by dragging across buttons, providing instant visual feedback. This is the kind of polish I wanted to bring to my web-based calculator.

## Why a Calculator?

At first glance, a calculator may seem like a simple project, but it offers a surprising depth of complexity. Most online calculator tutorials cover basic operations without addressing more advanced concepts like order of operations (PEMDAS). To truly capture the functionality of Apple's iOS calculator, I needed to implement more sophisticated logic—leading me to the [Shunting Yard Algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm).

This algorithm, while not overly complex, provided a solid challenge beyond standard algorithms like sorting or searching. It was a great way to practice implementing a more nuanced mathematical solution in a web app.

## Challenges & Solutions

### Micro Interactions

One of the key challenges was replicating the smooth button interaction from Apple's calculator. In a browser environment, when you add a `pointerdown` event to an element, the pointer (whether finger, mouse, or stylus) is captured by that element. As a result, if the pointer moves to a different element, the new element doesn't recognize the interaction because the pointer is still captured by the original element. This created a problem when trying to implement the drag-to-cancel interaction.

To solve this, I added the `pointerdown` event listener to the parent element and manually managed the press state and event listeners. Inspired by [React Aria Components](https://react-spectrum.adobe.com/react-aria/index.html), I used data attributes to manage the press state, allowing me to style elements easily with Tailwind CSS. By leveraging pointer events, I was able to track pointer movements across elements. I used a single listener for the parent `pointerdown` event, saved the target element in a variable, and updated the target's pressed state as the pointer moved. On `pointerup`, I removed the `pointermove` listener, ensuring efficient interaction handling.

### Shunting Yard Algorithm

The next challenge involved implementing the Shunting Yard Algorithm to handle order of operations in mathematical expressions. This algorithm converts infix notation (which we normally use, e.g., "3 + 5") to postfix notation (a format that makes evaluation simpler). It requires understanding operator precedence and the conversion between infix and postfix forms.

In simple terms, the algorithm processes an input of tokens (numbers and operators). Operands are pushed directly to the output array, while operators are pushed based on their precedence. This effectively sorts operators and removes parentheses by maintaining a stack. Once the input is converted to postfix notation, the evaluation process becomes straightforward—numbers are pushed to the results array, and operators use them to compute the final result.

## Tech Stack

- **React** with **Next.js**: For building reusable components and handling client-side rendering.
- **Zustand**: Lightweight state management to store and manipulate calculator inputs.
- **TypeScript**: Ensures type safety and reduces errors during development.
- **Tailwind CSS**: For efficient styling and responsiveness, ensuring a clean UI.
- **Shunting Yard Algorithm**: Implemented to handle order of operations in mathematical expressions.

## Potential Improvements

While this project has fulfilled its learning objectives, there are a few enhancements that could be added:

- **Scientific Calculator Features**: Expanding functionality to include advanced operations.
- **Accessibility**: Improving compatibility with screen readers and other assistive technologies.
- **Unit Testing**: Ensuring calculator functions accurately across all edge cases.
- **Theming**: Implementing light and dark mode support for user preferences.
