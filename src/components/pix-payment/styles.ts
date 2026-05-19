import { styled } from "../../assets/styles/stitches.config"

export const Container = styled("div", {
  textAlign: "center",
  padding: "30px",
  background: "#f9f9f9",
  borderRadius: "8px",
  border: "1px solid #eee",
});

export const QrCodeImage = styled("img", {
  maxWidth: "250px",
  margin: "20px auto",
  border: "1px solid #ddd",
  borderRadius: "4px",
});

export const CodeBox = styled("div", {
  background: "#fff",
  border: "1px dashed #ccc",
  padding: "15px",
  margin: "20px 0",
  wordBreak: "break-all",
  fontFamily: "monospace",
  fontSize: "0.9rem",
  color: "#555",
  position: "relative",
  cursor: "pointer",
  "&:hover": {
    background: "#f0f0f0",
  },
});

export const CopyButton = styled("button", {
  background: "#27ae60",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  margin: "0 auto",
  fontWeight: "bold",
  "&:hover": {
    background: "#219150",
  },
});

export const ExpiryText = styled("p", {
  color: "#e67e22",
  fontSize: "0.9rem",
  marginTop: "15px",
});