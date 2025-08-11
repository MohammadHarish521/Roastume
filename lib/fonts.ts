import { Bangers, Kalam } from "next/font/google";

// Display font for headings and titles
export const display = Bangers({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Body font for regular text
export const body = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

// Font class names for easy access
export const fonts = {
  display: display.className,
  body: body.className,
} as const;
