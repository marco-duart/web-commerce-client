import { styled, keyframes } from "../../assets/styles/stitches.config";

export const Container = styled("div", {
  position: "absolute",
  top: "85px",
  right: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
  backgroundColor: "$warning",
  color: "$white",
  textAlign: "center",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  zIndex: 1000,
  fontFamily: "$default",
});

export const LabelWrapper = styled("div", {
  marginBottom: "0.5rem",
});

export const Label = styled("span", {
  fontSize: "1rem",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: "1px",
});

export const TimeCapsule = styled("div", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.7rem 1.6rem",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
});

export const Icon = styled("div", {
  marginRight: "0.8rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "42px",
  height: "42px",
  flexShrink: 0,
});

export const Time = styled("span", {
  fontSize: "1.2rem",
  fontWeight: "bold",
});

const sparkleAnimation = keyframes({
  "0%": { transform: "scale(0)", opacity: 0 },
  "50%": { transform: "scale(1)", opacity: 1 },
  "100%": { transform: "scale(0)", opacity: 0 },
});

export const Spark = styled("div", {
  position: "absolute",
  width: "6px",
  height: "6px",
  backgroundColor: "$white",
  borderRadius: "50%",
  animation: `${sparkleAnimation} 1.5s infinite`,
  variants: {
    position: {
      topRight: { top: "-5px", right: "-5px", animationDelay: "0s" },
      topLeft: { top: "-5px", left: "-5px", animationDelay: "0.3s" },
      bottomRight: { bottom: "-5px", right: "-5px", animationDelay: "0.6s" },
      bottomLeft: { bottom: "-5px", left: "-5px", animationDelay: "0.9s" },
    },
  },
});

const fireFlicker = keyframes({
  "0%": {
    transform: "scaleY(1) scaleX(1)",
    filter: "drop-shadow(0 0 4px rgba(255, 255, 255, 0.4))",
  },
  "50%": {
    transform: "scaleY(1.1) scaleX(0.96)",
    filter:
      "drop-shadow(0 0 10px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 20px rgba(255, 200, 50, 0.6))",
  },
  "100%": {
    transform: "scaleY(0.95) scaleX(1.02)",
    filter: "drop-shadow(0 0 6px rgba(255, 255, 255, 0.5))",
  },
});

const innerFlicker = keyframes({
  "0%": { transform: "scaleY(1)", opacity: 0.9 },
  "50%": { transform: "scaleY(1.2) translateY(-2px)", opacity: 1 },
  "100%": { transform: "scaleY(0.9) translateY(1px)", opacity: 0.8 },
});

export const FireIconWrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  flexShrink: 0,
  transformOrigin: "center bottom",
  animation: `${fireFlicker} 0.5s infinite ease-in-out alternate`,

  "& svg": {
    display: "block",
    width: "100%",
    height: "100%",
    overflow: "visible",
  },

  "& .inner-flame": {
    transformOrigin: "center bottom",
    animation: `${innerFlicker} 0.35s infinite ease-in-out alternate`,
  },
});
