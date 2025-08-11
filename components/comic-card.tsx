import { body, display } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type React from "react";

export function ComicCard({
  children,
  className,
  as: Tag = "div",
  variant = "default",
  fontStyle = "body",
  shadow = "medium",
}: {
  children: React.ReactNode;
  className?: string;
  as?: any;
  variant?:
    | "default"
    | "cream"
    | "peach"
    | "yellow"
    | "light"
    | "teal"
    | "gradient";
  fontStyle?: "body" | "display" | "none";
  shadow?: "small" | "medium" | "large";
}) {
  const variantStyles = {
    default: "bg-[#F2D5A3]", // Yellow (current default)
    cream: "bg-[#EFD7B7]", // Cream (matches Home button)
    peach: "bg-[#F8E4C6]", // Light peach (matches Upload button)
    yellow: "bg-[#F2D5A3]", // Yellow (matches Profile button)
    light: "bg-[#EBDDBF]", // Light beige (matches auth dropdown)
    teal: "bg-[#97D4D5]", // Teal (matches navbar background)
    gradient: "bg-gradient-to-r from-[#F2D5A3] to-[#F8E4C6]", // Gradient variation
  };

  const fontStyles = {
    body: body.className,
    display: display.className,
    none: "",
  };

  const shadowStyles = {
    small: "shadow-[3px_3px_0_#2c2c2c]",
    medium: "shadow-[6px_6px_0_#2c2c2c]",
    large: "shadow-[8px_8px_0_#2c2c2c]",
  };

  return (
    <Tag
      className={cn(
        "rounded-2xl border-[3px] border-[#2c2c2c] p-4 transition-transform hover:-translate-y-0.5 text-[#2c2c2c] w-full",
        variantStyles[variant],
        fontStyles[fontStyle],
        shadowStyles[shadow],
        className
      )}
    >
      {children}
    </Tag>
  );
}
