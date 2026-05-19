import { styled, keyframes } from "../../assets/styles/stitches.config";

const neonPulse = keyframes({
  "0%": {
    borderColor: "rgba(255, 107, 53, 0.4)",
    boxShadow: "0 0 5px rgba(255, 107, 53, 0.2)",
  },
  "50%": {
    borderColor: "rgba(255, 107, 53, 1)",
    boxShadow: "0 0 15px rgba(255, 107, 53, 0.6)",
  },
  "100%": {
    borderColor: "rgba(255, 107, 53, 0.4)",
    boxShadow: "0 0 5px rgba(255, 107, 53, 0.2)",
  },
});

export const Wrapper = styled("div", {
  position: "relative",
  borderRadius: "8px",
  backgroundColor: "rgba(255, 107, 53, 0.02)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-2px",
    left: "-2px",
    right: "-2px",
    bottom: "-2px",
    borderRadius: "inherit",
    border: "2px solid rgba(255, 107, 53, 0.5)",
    animation: `${neonPulse} 1.5s ease-in-out infinite`,
    pointerEvents: "none",
    zIndex: 1,
  },

  "&:hover > .tooltip": {
    opacity: 1,
    visibility: "visible",
    transform: "translateX(-50%) translateY(0)",
  },
});

export const Tooltip = styled("div", {
  position: "absolute",
  top: "-55px",
  left: "50%",
  transform: "translateX(-50%) translateY(10px)",
  backgroundColor: "#F39C12",
  color: "#fff",
  padding: "8px 16px",
  fontSize: "1.1rem",
  borderRadius: "6px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
  opacity: 0,
  visibility: "hidden",
  transition: "all 0.3s ease",
  zIndex: 100,
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",

  "&::after": {
    content: '""',
    position: "absolute",
    top: "100%",
    left: "50%",
    marginLeft: "-6px",
    borderWidth: "6px",
    borderStyle: "solid",
    borderColor: "#F39C12 transparent transparent transparent",
  },
});
