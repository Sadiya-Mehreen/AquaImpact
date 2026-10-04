import React, { useState } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "danger";

interface RippleSpot {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-aqua-gradient text-white shadow-aqua hover:shadow-aqua-lg hover:-translate-y-0.5",
  secondary: "bg-white text-aqua-700 border border-aqua-200 hover:bg-aqua-50 hover:-translate-y-0.5",
  ghost: "bg-transparent text-aqua-700 hover:bg-aqua-50",
  dark: "bg-aqua-900 text-white hover:bg-aqua-800 hover:-translate-y-0.5",
  danger: "bg-white text-red-500 border border-red-200 hover:bg-red-50",
};

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  onClick,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const [ripples, setRipples] = useState<RippleSpot[]>([]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.7;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const rippleId = Date.now() + Math.random();
    setRipples((r) => [...r, { id: rippleId, x, y, size }]);
    setTimeout(() => setRipples((r) => r.filter((s) => s.id !== rippleId)), 700);
    onClick?.(e);
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : handleClick}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 md:text-base ${VARIANT_CLASSES[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-dot animate-ripple"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
