import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Bricolage Grotesque", "system-ui", "sans-serif"],
        body: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"]
      },
      keyframes: {
        floatA: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-20px) translateX(12px)" }
        },
        floatB: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(18px) translateX(-10px)" }
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        pulseRing: {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.08)" }
        }
      },
      animation: {
        "float-a": "floatA 9s ease-in-out infinite",
        "float-b": "floatB 12s ease-in-out infinite",
        "spin-slow": "spinSlow 20s linear infinite",
        "pulse-ring": "pulseRing 4.5s ease-in-out infinite"
      },
      boxShadow: {
        glow: "0 10px 35px rgba(255, 106, 61, 0.25)",
        mint: "0 10px 35px rgba(0, 184, 169, 0.24)"
      }
    }
  },
  plugins: []
};

export default config;
