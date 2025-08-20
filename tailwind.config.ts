import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Manrope'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'Manrope'", "ui-monospace", "monospace"],
        serif: ["'Manrope'", "ui-serif", "serif"],
      },
      colors: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.1450 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.1450 0 0)",
        popover: "oklch(1 0 0)",
        "popover-foreground": "oklch(0.1450 0 0)",
        primary: "oklch(0.5959 0.1157 284.6800)",
        "primary-foreground": "oklch(0.9850 0 0)",
        secondary: "oklch(0.8594 0.1157 284.6800)",
        "secondary-foreground": "oklch(0.2050 0 0)",
        muted: "oklch(0.9700 0 0)",
        "muted-foreground": "oklch(0.5560 0 0)",
        accent: "oklch(0.9700 0 0)",
        "accent-foreground": "oklch(0.2050 0 0)",
        destructive: "oklch(0.5770 0.2450 27.3250)",
        "destructive-foreground": "oklch(1 0 0)",
        border: "oklch(0.9220 0 0)",
        input: "oklch(0.9220 0 0)",
        ring: "oklch(0.7080 0 0)",
      },
      borderRadius: {
        lg: "0.625rem",
      },
    },
  },
  darkMode: ["class"],
  plugins: [],
};

export default config; 