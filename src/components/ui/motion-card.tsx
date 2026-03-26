import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MotionCardProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
}

const MotionCard = React.forwardRef<HTMLDivElement, MotionCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          className
        )}
        whileHover={{
          y: -4,
          boxShadow: "0 12px 24px -8px hsl(var(--primary) / 0.12)",
        }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
MotionCard.displayName = "MotionCard";

export { MotionCard };
