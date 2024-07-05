import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./ui/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        black: "#141414",
        text: "var(--text)",
        title: "var(--title)",
        element: "var(--element)",
        hoverElement: "#2e2e2e",
        activeElement: "#333333",
        placeholder: "#666",
        border: "#525252",
        accentViolet: "var(--accentViolet)",
        hoverViolet: "var(--hoverViolet)",
        accentGreen: "var(--accentGreen)",
        hoverGreen: "var(--hoverGreen)",
        accentBlue: "var(--accentBlue)",
        hoverBlue: "var(--hoverBlue)",
        accentRed: "rgb(var(--accentRed) / <alpha-value>)",
        hoverRed: "var(--hoverRed)",
        accentOrange: "var(--accentOrange)",
        hoverOrange: "var(--hoverOrange)",
        disabledOrange: "#a45c0a",
      },
      backgroundImage: {
        "search-icon": "url('/search-icon.svg')",
      },
      gridTemplateColumns: {
        main: "1fr min(900px, 55vw)",
      },
    },
  },
  plugins: [],
};
export default config;
