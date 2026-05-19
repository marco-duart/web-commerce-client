import { styled, keyframes } from "../../assets/styles/stitches.config";

const pulse = keyframes({
  "0%": { transform: "scale(0.95)", opacity: 0.8 },
  "50%": { transform: "scale(1.05)", opacity: 1 },
  "100%": { transform: "scale(0.95)", opacity: 0.8 },
});

const rotate = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const rotateReverse = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(-360deg)" },
});

const rotateSlow = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const Overlay = styled("div", {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  backdropFilter: "blur(4px)",
});

export const Container = styled("div", {
  background: "$white",
  borderRadius: "16px",
  padding: "$xlarge",
  textAlign: "center",
  boxShadow: "$large",
  animation: `${pulse} 2s ease-in-out infinite`,
  maxWidth: "400px",
  width: "90%",
});

export const Spinner = styled("div", {
  position: "relative",
  width: "80px",
  height: "80px",
  margin: "0 auto $medium",
});

export const SpinnerRing = styled("div", {
  position: "absolute",
  border: "3px solid transparent",
  borderRadius: "50%",

  "&:nth-child(1)": {
    width: "100%",
    height: "100%",
    borderTop: "3px solid $primary",
    animation: `${rotate} 1.5s linear infinite`,
  },

  "&:nth-child(2)": {
    width: "70%",
    height: "70%",
    top: "15%",
    left: "15%",
    borderRight: "3px solid $primaryDark",
    animation: `${rotateReverse} 1s linear infinite`,
  },

  "&:nth-child(3)": {
    width: "40%",
    height: "40%",
    top: "30%",
    left: "30%",
    borderBottom: "3px solid $secondary",
    animation: `${rotateSlow} 2s linear infinite`,
  },
});

export const Message = styled("h3", {
  color: "$primary",
  fontSize: "$large",
  fontWeight: "$bold",
  marginBottom: "$small",
});

export const SubMessage = styled("p", {
  color: "$primaryDark",
  fontSize: "$small",
  opacity: 0.8,
});
