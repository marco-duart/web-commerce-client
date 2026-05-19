import { createStitches } from "@stitches/react";

export const { styled, css, globalCss, keyframes, createTheme, config } =
  createStitches({
    theme: {
      colors: {
        primary: "#0F766E",
        primaryDark: "#134E4A",
        primaryLight: "#2DD4BF",

        secondary: "#1E3A5F",
        secondaryDark: "#152A44",
        secondaryLight: "#2E5A8B",

        accent: "#F97316",
        accentLight: "#FDBA74",
        accentDark: "#C2410C",

        success: "#16A34A",
        successLight: "#4ADE80",
        successDark: "#166534",

        error: "#DC2626",
        errorLight: "#F87171",
        errorDark: "#991B1B",

        warning: "#D97706",
        warningLight: "#FBBF24",
        warningDark: "#92400E",

        info: "#0369A1",
        infoLight: "#38BDF8",
        infoDark: "#0C4A6E",

        white: "#FFFFFF",
        black: "#000000",

        lightGray: "#F1F5F9",
        mediumGray: "#CBD5E1",
        darkGray: "#1E293B",

        background: "#F8FAFC",
        text: "#0F172A",

        shadow: "rgba(0, 0, 0, 0.25)",
        overlay: "rgba(0, 0, 0, 0.5)",
      },

      fonts: {
        primary:
          '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        code:
          'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
      },

      fontWeights: {
        light: 300,
        regular: 400,
        bold: 700,
        extraBold: 800,
      },

      fontSizes: {
        base: "10px",
        small: "1.1em",
        regular: "1.2em",
        medium: "1.3em",
        large: "1.6em",
        xlarge: "2.6em",
        xxlarge: "2.8em",
        huge: "4em",
      },

      space: {
        xsmall: "5px",
        small: "8px",
        medium: "16px",
        large: "20px",
        xlarge: "30px",
        xxlarge: "60px",
      },

      shadows: {
        small: "0 2px 6px rgba(0,0,0,0.15)",
        medium: "0 4px 12px rgba(0,0,0,0.2)",
        large: "0 8px 24px rgba(0,0,0,0.25)",
      },

      breakpoints: {
        mobileS: "(min-width: 320px)",
        mobileM: "(min-width: 375px)",
        mobileL: "(min-width: 425px)",
        tablet: "(min-width: 768px)",
        desktop: "(min-width: 1024px)",
        fullHd: "(min-width: 1920px)",
      },
    },
  });

export type Theme = typeof config.theme;
