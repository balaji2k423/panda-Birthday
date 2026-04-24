import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type GlowButtonProps = Omit<HTMLMotionProps<"button">, "ref" | "children"> & {
  variant?: "primary" | "ghost";
  children?: ReactNode;
};

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    const base =
      "relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
    const styles =
      variant === "primary"
        ? "bg-gradient-rose text-primary-foreground shadow-card-soft hover:brightness-110"
        : "border border-primary/40 bg-transparent text-foreground hover:bg-primary/10";
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className={cn(base, styles, className)}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {variant === "primary" && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full opacity-70 blur-xl"
            style={{ background: "var(--gradient-rose)" }}
          />
        )}
      </motion.button>
    );
  },
);
GlowButton.displayName = "GlowButton";
