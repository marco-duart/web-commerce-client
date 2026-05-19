import { styled, keyframes } from "../../assets/styles/stitches.config";

const orbit = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const pulse = keyframes({
  "0%": { transform: "scale(1)", opacity: 1 },
  "50%": { transform: "scale(1.1)", opacity: 0.7 },
  "100%": { transform: "scale(1)", opacity: 1 },
});

export const Container = styled("div", {
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const SpinnerWrapper = styled("div", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  variants: {
    size: {
      small: { width: "160px", height: "160px" },
      medium: { width: "240px", height: "240px" },
      large: { width: "320px", height: "320px" },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export const OrbitalRing = styled("div", {
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  borderStyle: "solid",
  borderColor: "$primary transparent transparent transparent",
  animation: `${orbit} 1.5s linear infinite`,

  variants: {
    size: {
      small: { borderWidth: "3px" },
      medium: { borderWidth: "4px" },
      large: { borderWidth: "5px" },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export const PulseRing = styled("div", {
  position: "absolute",
  borderRadius: "50%",
  border: "2px solid $primary",
  animation: `${pulse} 2s ease-in-out infinite`,

  "&::after": {
    content: "",
    position: "absolute",
    top: "-2px",
    left: "-2px",
    right: "-2px",
    bottom: "-2px",
    border: "2px solid $primaryDark",
    borderRadius: "50%",
    animation: `${pulse} 2s ease-in-out infinite reverse`,
  },

  variants: {
    size: {
      small: { width: "70%", height: "70%" },
      medium: { width: "75%", height: "75%" },
      large: { width: "80%", height: "80%" },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export const LogoBadge = styled("div", {
  position: "relative",
  zIndex: 2,
  borderRadius: "12px",
  border: "2px solid $primary",
  backgroundColor: "$white",
  color: "$primaryDark",
  fontWeight: "$bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textTransform: "uppercase",
  letterSpacing: "0.08em",

  variants: {
    size: {
      small: { width: "76px", height: "76px", fontSize: "0.95rem" },
      medium: { width: "118px", height: "118px", fontSize: "1.1rem" },
      large: { width: "160px", height: "160px", fontSize: "1.3rem" },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export const LoadingMessage = styled("p", {
  fontFamily: "$primary",
  fontSize: "$regular",
  color: "$primary",
  fontWeight: "$regular",
  textAlign: "center",
  margin: 0,
  maxWidth: "200px",
  lineHeight: 1.4,
});
