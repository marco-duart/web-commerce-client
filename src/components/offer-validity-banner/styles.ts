import { styled, keyframes } from "../../assets/styles/stitches.config";

const neonPulse = keyframes({
  "0%": {
    borderColor: "rgba(255, 107, 53, 0.3)",
    boxShadow: "0 0 8px rgba(255, 107, 53, 0.2), inset 0 0 8px rgba(255, 107, 53, 0.1)",
  },
  "50%": {
    borderColor: "rgba(255, 107, 53, 0.8)",
    boxShadow: "0 0 20px rgba(255, 107, 53, 0.5), inset 0 0 12px rgba(255, 107, 53, 0.2)",
  },
  "100%": {
    borderColor: "rgba(255, 107, 53, 0.3)",
    boxShadow: "0 0 8px rgba(255, 107, 53, 0.2), inset 0 0 8px rgba(255, 107, 53, 0.1)",
  },
});

const spark1 = keyframes({
  "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
  "100%": { transform: "translate(38px, -38px) rotate(360deg)", opacity: 0 },
});

const spark2 = keyframes({
  "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
  "100%": { transform: "translate(-38px, -38px) rotate(360deg)", opacity: 0 },
});

const spark3 = keyframes({
  "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
  "100%": { transform: "translate(28px, 28px) rotate(360deg)", opacity: 0 },
});

const spark4 = keyframes({
  "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
  "100%": { transform: "translate(-28px, 28px) rotate(360deg)", opacity: 0 },
});

export const Container = styled("div", {
  position: "fixed",
  top: "$medium",
  right: "$medium",
  width: "auto",
  color: "$warningDark",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  zIndex: 999,

  "@media (max-width: 768px)": {
    top: "$small",
    right: "$small",
  },

  "@media (max-width: 425px)": {
    top: "8px",
    right: "8px",
    gap: "4px",
  },
});

export const LabelWrapper = styled("div", {
  fontSize: "$small",
  fontWeight: "$bold",
  textTransform: "uppercase",
  letterSpacing: "0.3px",
  lineHeight: "1.2",
  textAlign: "right",

  "@media (max-width: 425px)": {
    fontSize: "0.85em",
    lineHeight: "1.1",
  },
});

export const Label = styled("span", {
  display: "block",
});

export const TimeCapsule = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  padding: "10px 16px",
  borderRadius: "50px",
  border: "2px solid rgba(255, 107, 53, 0.35)",
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 245, 235, 0.95) 100%)",
  animation: `${neonPulse} 2s ease-in-out infinite`,
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 0 12px rgba(255, 107, 53, 0.2)",
  minWidth: "auto",

  "@media (max-width: 768px)": {
    padding: "8px 14px",
    gap: "5px",
  },

  "@media (max-width: 425px)": {
    padding: "7px 12px",
    gap: "4px",
  },
});

export const FireIcon = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#FF6B35",
  fontSize: "20px",
  lineHeight: 1,
  flexShrink: 0,

  "@media (max-width: 768px)": {
    fontSize: "18px",
  },

  "@media (max-width: 425px)": {
    fontSize: "16px",
  },
});

export const Time = styled("strong", {
  fontSize: "$large",
  lineHeight: 1,
  fontWeight: "$extraBold",
  color: "#B34700",
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",

  "@media (max-width: 768px)": {
    fontSize: "1.4em",
  },

  "@media (max-width: 425px)": {
    fontSize: "1.2em",
  },
});

export const Spark = styled("div", {
  position: "absolute",
  width: "4px",
  height: "4px",
  borderRadius: "50%",
  pointerEvents: "none",
  willChange: "transform, opacity",

  variants: {
    position: {
      topRight: {
        top: "4px",
        right: "12px",
        background: "#FF6B35",
        animation: `${spark1} 1s ease-out`,
        animationIterationCount: "infinite",
        animationDelay: "0ms",
      },
      topLeft: {
        top: "4px",
        left: "12px",
        background: "#FFB84D",
        animation: `${spark2} 1s ease-out`,
        animationIterationCount: "infinite",
        animationDelay: "0.25s",
      },
      bottomRight: {
        bottom: "2px",
        right: "10px",
        background: "#FF8C42",
        animation: `${spark3} 1s ease-out`,
        animationIterationCount: "infinite",
        animationDelay: "0.5s",
      },
      bottomLeft: {
        bottom: "2px",
        left: "10px",
        background: "#FFB84D",
        animation: `${spark4} 1s ease-out`,
        animationIterationCount: "infinite",
        animationDelay: "0.75s",
      },
    },
  },
});
