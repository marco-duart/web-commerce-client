import { styled, keyframes } from "../../assets/styles/stitches.config";

const fadeIn = keyframes({
  from: { opacity: 0, transform: "scale(0.95)" },
  to: { opacity: 1, transform: "scale(1)" },
});

export const Overlay = styled("div", {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: "20px",
});

export const ModalContainer = styled("div", {
  backgroundColor: "#fff",
  borderRadius: "12px",
  width: "100%",
  maxWidth: "500px",
  padding: "40px 30px",
  textAlign: "center",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  animation: `${fadeIn} 0.3s ease-out`,
  position: "relative",
});

export const IconWrapper = styled("div", {
  color: "#27AE60",
  marginBottom: "20px",
  svg: { width: "80px", height: "80px" },
});

export const Title = styled("h2", {
  fontSize: "1.8rem",
  color: "#2D4068",
  marginBottom: "10px",
});

export const Message = styled("p", {
  color: "#666",
  fontSize: "1.05rem",
  lineHeight: "1.5",
  marginBottom: "30px",
});

export const ActionButton = styled("a", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  backgroundColor: "#25D366",
  color: "#fff",
  padding: "16px 24px",
  borderRadius: "8px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  textDecoration: "none",
  transition: "all 0.2s",
  "&:hover": {
    filter: "brightness(0.9)",
    transform: "translateY(-2px)",
  },
});

export const ActionButtonVoucher = styled("button", {
  display: "flex",
  width: "100%",
  marginTop: "10px",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  backgroundColor: "#4284f5",
  color: "#fff",
  padding: "16px 24px",
  borderRadius: "8px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s",
  "&:hover": {
    filter: "brightness(0.9)",
    transform: "translateY(-2px)",
  },
  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
    transform: "none",
    "&:hover": {
      filter: "none",
    },
  },
});

export const CloseButton = styled("button", {
  marginTop: "20px",
  background: "none",
  border: "none",
  color: "#999",
  fontSize: "0.9rem",
  textDecoration: "underline",
  cursor: "pointer",
  "&:hover": { color: "#666" },
});
