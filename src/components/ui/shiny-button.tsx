"use client";

import React from "react";
import { motion } from "motion/react";

import { cn } from "../../lib/utils";

interface ShinyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const ShinyButton: React.FC<ShinyButtonProps> = ({
  children,
  className,
  onClick,
  disabled,
  type,
  ...restProps
}) => {
  return (
    <motion.button
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cn(
        "relative rounded-lg px-6 py-2 font-medium transition-all duration-300 ease-in-out hover:shadow-lg",
        className
      )}
    >
      <span className="relative block w-full h-full text-sm font-semibold">
        {children}
      </span>
    </motion.button>
  );
};

export default { ShinyButton };
