import { styled } from "../../assets/styles/stitches.config";

export const Container = styled("div", {
  width: "100%",
  minHeight: "100vh",
  backgroundColor: "$lightGray",
  fontFamily: "$primary",
  paddingBottom: "$xxlarge",
});

export const Header = styled("header", {
  width: "100%",
  height: "70px",
  backgroundColor: "$white",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "$large",

  "& > div": {
    display: "flex",
    alignItems: "center",
    gap: "$small",
    color: "$success",
    fontWeight: "$bold",
    fontSize: "$small",
    textTransform: "uppercase",
    letterSpacing: "0.5px",

    svg: { width: 18, height: 18 },
  },

  "@media (max-width: 768px)": {
    "& > div": {
      fontSize: "1.2em",
    },
  },
});

export const ContentWrapper = styled("main", {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "0 $medium",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "$xlarge",

  "@breakpoints": { tablet: { gridTemplateColumns: "1fr" } },
  "@media (max-width: 900px)": { gridTemplateColumns: "1fr" },
});

export const ProductColumn = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$medium",
});

export const CheckoutColumn = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$medium",
});

export const ProductCard = styled("div", {
  backgroundColor: "$white",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "$small",
  border: "1px solid rgba(0,0,0,0.02)",
});

export const CheckoutCard = styled("div", {
  backgroundColor: "$white",
  borderRadius: "8px",
  padding: "$large",
  boxShadow: "$medium",
  border: "1px solid $lightGray",
  marginBottom: "$medium",
  position: "relative",
  overflow: "hidden",

  variants: {
    highlight: {
      true: { borderTop: "4px solid $success" },
      false: { borderTop: "4px solid $secondary" },
    },
  },
  defaultVariants: { highlight: false },
});

export const BannerWrapper = styled("div", {
  width: "100%",
  aspectRatio: "3 / 1",
  position: "relative",
  overflow: "hidden",
  backgroundColor: "$primaryDark",
});

export const BannerImage = styled("img", {
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

export const BannerOverlay = styled("div", {
  width: "100%",
  height: "100%",
  background: "linear-gradient(135deg, $infoDark 0%, $primary 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(255,255,255,0.2)",
  fontSize: "2rem",
  fontWeight: "bold",
});

export const StepHeader = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$small",
  marginBottom: "$medium",
  paddingBottom: "$small",
  borderBottom: "1px solid $lightGray",

  h2: {
    fontSize: "$medium",
    color: "$primaryDark",
    fontWeight: "$bold",
    margin: 0,
  },
  svg: { color: "$primary", width: 24, height: 24 },

  "@media (max-width: 768px)": {
    h2: {
      fontSize: "1.35em",
    },
  },
});

export const StepContent = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$medium",
});

export const InfoGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "$medium",
  "@media (min-width: 768px)": { gridTemplateColumns: "repeat(12, 1fr)" },
});

export const GridItem = styled("div", {
  gridColumn: "span 12",
  variants: {
    span: {
      6: { "@media (min-width: 768px)": { gridColumn: "span 6" } },
      12: { "@media (min-width: 768px)": { gridColumn: "span 12" } },
    },
  },
});

export const InfoGroup = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const Label = styled("span", {
  fontSize: "0.85rem",
  color: "$secondary",
  fontWeight: "bold",
  textTransform: "uppercase",
  opacity: 0.8,

  "@media (max-width: 768px)": {
    fontSize: "0.95rem",
  },
});

export const Value = styled("div", {
  fontSize: "1rem",
  color: "$text",
  padding: "10px 14px",
  backgroundColor: "$lightGray",
  border: "1px solid rgba(0,0,0,0.05)",
  borderRadius: "6px",
  fontWeight: "500",

  "@media (max-width: 768px)": {
    fontSize: "1.1rem",
  },
});

export const ProductRow = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid $lightGray",
  "&:last-child": { borderBottom: "none" },

  variants: {
    isBonus: {
      true: {
        paddingLeft: "16px",
        borderLeft: "3px solid $warning",
        backgroundColor: "rgba(243, 156, 18, 0.05)",
        marginTop: "4px",
        borderRadius: "0 4px 4px 0",
      },
    },
  },
});

export const ProductName = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "$text",
  fontSize: "$regular",
  fontWeight: "500",

  "@media (max-width: 768px)": {
    fontSize: "1.2em",
  },
});

export const ProductEmoji = styled("span", {
  fontSize: "1rem",
});

export const ProductPrice = styled("div", {
  textAlign: "right",
  display: "flex",
  flexDirection: "column",

  strong: { color: "$primaryDark", fontSize: "0.95rem" },
  span: { fontSize: "0.8rem", color: "$secondary" },

  "@media (max-width: 768px)": {
    strong: { fontSize: "1.05rem" },
    span: { fontSize: "0.9rem" },
  },
});

export const BonusTag = styled("span", {
  fontSize: "0.7rem",
  textTransform: "uppercase",
  backgroundColor: "$warningLight",
  color: "$warningDark",
  padding: "2px 6px",
  borderRadius: "4px",
  fontWeight: "bold",
  marginLeft: "8px",

  "@media (max-width: 768px)": {
    fontSize: "0.8rem",
    padding: "3px 8px",
  },
});

export const PriceSummary = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  marginTop: "$large",
  paddingTop: "$medium",
  borderTop: "1px dashed $mediumGray",

  span: { fontSize: "$regular", color: "$text" },
  strong: {
    fontSize: "$xlarge",
    color: "$successDark",
    fontWeight: "$extraBold",
  },

  "@media (max-width: 768px)": {
    span: { fontSize: "1.25em" },
    strong: { fontSize: "2.1em" },
  },
});

export const StatusBox = styled("div", {
  textAlign: "center",
  padding: "30px",
  backgroundColor: "$white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",

  h3: { fontSize: "1.2rem", color: "$success", margin: 0 },
  p: { color: "$secondary", lineHeight: 1.5 },

  svg: { fontSize: "3rem", color: "$success", marginBottom: "10px" },

  "@media (max-width: 768px)": {
    h3: { fontSize: "1.5em" },
    p: { fontSize: "1.1em" },
  },

  variants: {
    type: {
      success: { h3: { color: "$success" }, svg: { color: "$success" } },
      error: { h3: { color: "$error" }, svg: { color: "$error" } },
      pending: { h3: { color: "$warning" }, svg: { color: "$warning" } },
    },
  },
});

export const Skeleton = styled("div", {
  backgroundColor: "$mediumGray",
  borderRadius: "4px",
  animation: "pulse 1.5s infinite",
  variants: {
    variant: {
      banner: { width: "100%", aspectRatio: "3/1" },
      card: { width: "100%", height: "300px", marginBottom: "20px" },
    },
  },
});

export const PixRenewButton = styled("button", {
  marginTop: 20,
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "1rem",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  margin: "0 auto",
  transition: "background 0.2s",

  variants: {
    disabled: {
      true: {
        background: "#ccc",
        cursor: "not-allowed",
      },
      false: {
        background: "#27ae60",
        cursor: "pointer",
      },
    },
  },

  defaultVariants: {
    disabled: false,
  },
});

export const PixRefreshButton = styled("button", {
  background: "#f39c12",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
});

export const RetryPaymentButton = styled("button", {
  background: "#27ae60",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
});

export const RetryPaymentTitle = styled("h3", {
  fontSize: "1.1rem",
  color: "#2c3e50",
  marginBottom: 15,
  borderBottom: "1px solid #eee",
  paddingBottom: 10,

  "@media (max-width: 768px)": {
    fontSize: "1.3rem",
  },
});

export const CancelPaymentButton = styled("button", {
  marginTop: 15,
  background: "transparent",
  border: "none",
  color: "#7f8c8d",
  cursor: "pointer",
  textDecoration: "underline",
  fontSize: "0.9rem",
  width: "100%",

  "@media (max-width: 768px)": {
    fontSize: "1rem",
  },
});
