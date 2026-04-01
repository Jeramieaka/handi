import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:    "#0C0C0B",
        "ink-2":"#161614",
        stone:  "#F7F5F0",
        warm:   "#EFECE6",
        border: "#E2DED7",
        muted:  "#7A7672",
        accent: "#FF4500",
        "accent-hover": "#E03D00",
        "accent-light": "#FFF0EB",
      },
      fontFamily: {
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "d1": ["clamp(3.5rem,10vw,7.5rem)", { lineHeight: "0.97", letterSpacing: "-0.05em", fontWeight: "900" }],
        "d2": ["clamp(2.5rem,6vw,5rem)",   { lineHeight: "1.00", letterSpacing: "-0.04em", fontWeight: "900" }],
        "d3": ["clamp(2rem,4vw,3.25rem)",  { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "800" }],
        "h1": ["clamp(1.5rem,3vw,2.25rem)",{ lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h2": ["1.25rem",                  { lineHeight: "1.3",  letterSpacing: "-0.015em",fontWeight: "600" }],
        "body-lg": ["1.125rem",            { lineHeight: "1.7"  }],
        "body":    ["1rem",                { lineHeight: "1.65" }],
        "sm":      ["0.875rem",            { lineHeight: "1.55" }],
        "xs":      ["0.75rem",             { lineHeight: "1.5"  }],
      },
      spacing: {
        "section": "7rem",
        "section-sm": "4rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "soft":  "0 2px 12px rgba(12,12,11,0.07), 0 0 0 1px rgba(12,12,11,0.04)",
        "card":  "0 4px 24px rgba(12,12,11,0.10), 0 0 0 1px rgba(12,12,11,0.05)",
        "float": "0 20px 60px rgba(12,12,11,0.18), 0 0 0 1px rgba(12,12,11,0.06)",
        "glow":  "0 0 0 4px rgba(255,69,0,0.20)",
      },
      animation: {
        "fade-up":    "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "float-a":    "float 7s ease-in-out infinite",
        "float-b":    "float 5.5s ease-in-out 1.5s infinite",
        "marquee":    "marquee 28s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(28px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)"     },
          "50%":     { transform: "translateY(-12px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
