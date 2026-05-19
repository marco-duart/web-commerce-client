import { styled } from "../../assets/styles/stitches.config";

export const WarningContainer = styled("div", {
  display: "flex",
  alignItems: "flex-start",
  background: "rgba(255, 152, 0, 0.1)",
  border: "1px solid #FF9800",
  borderLeft: "4px solid #FF9800",
  borderRadius: "8px",
  padding: "$medium",
  margin: "$large 0",
  color: "$primaryDark",
  fontSize: "$small",
  lineHeight: 1.5,
  boxShadow: "0 2px 8px rgba(255, 152, 0, 0.12)",
  transition: "all 0.3s ease",

  "&:hover": {
    boxShadow: "0 4px 12px rgba(255, 152, 0, 0.15)",
    transform: "translateY(-1px)",
  },
});
