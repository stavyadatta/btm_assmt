import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "yellow" | "pink" | "white";
};

export function Button({ className, variant = "yellow", ...props }: Props) {
  const base =
    "px-3 py-2 rounded-xl font-extrabold active:translate-y-[1px] border-2";
  const variants = {
    yellow: "bg-yellow-300 hover:bg-yellow-400 text-[#6B3A00] border-yellow-500",
    pink: "bg-pink-300 hover:bg-pink-400 text-[#6B3A00] border-pink-500",
    white: "bg-white text-[#6B3A00] border-yellow-400",
  };
  return <button className={clsx(base, variants[variant], className)} {...props} />;
}

