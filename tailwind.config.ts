import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        element: "var(--grey14)",
        hoverElement: "var(--grey18)",
        activeElement: "var(--grey20)",
        placeholder: "#666",
        border: "#525252",
        accentViolet: "var(--accentViolet)",
        hoverViolet: "var(--lightViolet)",
        accentGreen: "var(--accentGreen)",
        hoverGreen: "var(--hoverGreen)",
        accentBlue: "var(--accentBlue)",
        hoverBlue: "var(--hoverBlue)",
        accentRed: "var(--accentRed)",
        hoverRed: "var(--hoverRed)",
        accentOrange: "var(--accentOrange)",
        hoverOrange: "var(--hoverOrange)",
        disabledOrange: "var(--disabledOrange)",
        title: "var(--grey80)",
        code: "var(--grey8)",
        text: "var(--grey)",
        black: "var(--grey8)",
      },
      backgroundImage: {
        "search-icon": "url('/search-icon.svg')",
      },
      gridTemplateColumns: {
        main: "750px 1fr",
      },
    },
  },
  plugins: [],
};
export default config;
