"use client";
import { cn } from "@/lib/utils/cn";
import { type VariantProps, cva } from "class-variance-authority";
import type React from "react";
import type { HTMLAttributes } from "react";

const buttonVariants = cva(
  [
    "inline-flex touch-none select-none items-center justify-center rounded-full duration-500 data-[state=pressed]:transition-colors data-[state=pressed]:duration-0 [&_*]:pointer-events-none ",
  ],
  {
    variants: {
      variant: {
        default: "bg-neutral-700 data-[state=pressed]:bg-neutral-400",
        function:
          "text-neutral-900 bg-neutral-300 data-[state=pressed]:bg-neutral-50",
        operator:
          "data-[active=false]:bg-amber-500 data-[active=true]:bg-white data-[state=pressed]:bg-[rgb(255,193,93)] data-[active=true]:text-amber-500",
      },
      size: {
        small: "p-4 font-medium text-sm md:text-lg aspect-square",
        default: "p-4 text-4xl  aspect-square",
        large: "col-span-2 justify-start text-4xl aspect-auto pl-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;
type ButtonProps = React.PropsWithChildren<
  HTMLAttributes<HTMLButtonElement> &
    ButtonVariantProps & {
      active?: boolean;
      value: string | number;
    }
>;

function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
  const target = e.currentTarget;
  switch (e.code) {
    case "Enter":
    case "Space":
      target.dataset.state = "pressed";
      break;
    case "Tab":
      target.dataset.state = "idle";
      break;
    default:
      break;
  }
}

function handleKeyUp(e: React.KeyboardEvent<HTMLButtonElement>) {
  if (e.code === "Enter" || e.code === "Space") {
    e.currentTarget.dataset.state = "idle";
  }
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  active = false,
  value,
  size,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      value={value}
      className={cn(buttonVariants({ variant, size, className }))}
      data-state={"idle"}
      data-active={active}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
