import { styled } from "../../assets/styles/stitches.config";

export const CardContainer = styled("div", {
  width: "100%",
  maxWidth: "320px",
  aspectRatio: "1.586 / 1",
  borderRadius: "10px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: "$medium",
  fontFamily: "$code",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  margin: "0 auto",
  backgroundSize: "cover",
});

export const CardHeader = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
});

export const CardChip = styled("img", {
  width: "45px",
  height: "auto",
});

export const CardLogoBadge = styled("div", {
  height: "30px",
  minWidth: "70px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.65)",
  backgroundColor: "rgba(255,255,255,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.65rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
});

export const CardNumber = styled("div", {
  fontSize: "1.4rem",
  letterSpacing: "2px",
  marginTop: "10px",
  textAlign: "center",
  fontWeight: "500",
  whiteSpace: "nowrap",
  textShadow: "0px 1px 2px rgba(0,0,0,0.3)",

  variants: {
    focused: {
      true: { opacity: 1, transform: "scale(1.02)" },
      false: { opacity: 0.9 },
    },
  },
});

export const CardDetails = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginTop: "auto",
});

export const CardLabel = styled("div", {
  fontSize: "0.6rem",
  textTransform: "uppercase",
  opacity: 0.7,
  marginBottom: "2px",
});

export const CardText = styled("div", {
  fontSize: "0.9rem",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "180px",
  textShadow: "0px 1px 1px rgba(0,0,0,0.3)",

  variants: {
    focused: {
      true: { opacity: 1 },
      false: { opacity: 0.8 },
    },
  },
});

export const CardIssuerName = styled("div", {
  position: "absolute",
  top: "20px",
  right: "20px",
  fontWeight: "bold",
  fontSize: "0.9rem",
  opacity: 0.8,
});
