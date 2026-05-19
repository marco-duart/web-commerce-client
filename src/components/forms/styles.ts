import { styled } from "../../assets/styles/stitches.config";

export const FormContainer = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "$medium",
  width: "100%",
});

export const SectionTitle = styled("h3", {
  fontSize: "$medium",
  color: "$primaryDark",
  marginBottom: "$small",
  fontWeight: "$bold",
  display: "flex",
  alignItems: "center",
  gap: "$small",

  "&::before": {
    content: "''",
    width: "4px",
    height: "24px",
    backgroundColor: "$primary",
    borderRadius: "2px",
    display: "block",
  },

  "@media (max-width: 768px)": {
    fontSize: "1.35em",
  },
});

export const FormGroup = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  width: "100%",
});

export const FormGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "$medium",

  "@tablet": {
    gridTemplateColumns: "repeat(12, 1fr)",
  },
});

export const GridItem = styled("div", {
  gridColumn: "span 12",

  variants: {
    span: {
      3: { "@tablet": { gridColumn: "span 3" } },
      4: { "@tablet": { gridColumn: "span 4" } },
      6: { "@tablet": { gridColumn: "span 6" } },
      8: { "@tablet": { gridColumn: "span 8" } },
      9: { "@tablet": { gridColumn: "span 9" } },
      12: { "@tablet": { gridColumn: "span 12" } },
    },
  },
});

export const SmallErrorMessage = styled("div", {
  color: "#D91B5B",
  fontSize: "0.9rem",
  marginTop: "8px",
  textAlign: "center",
  fontWeight: "bold",

  "@media (max-width: 768px)": {
    fontSize: "1rem",
  },
});

export const Label = styled("label", {
  fontSize: "0.9rem",
  color: "$secondary",
  fontWeight: "$bold",
  marginLeft: "2px",

  "@media (max-width: 768px)": {
    fontSize: "1rem",
  },
});

export const LabelProduct = styled("div", { 
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "8px 0",
  });

export const Input = styled("input", {
  width: "100%",
  height: "48px",
  padding: "0 16px",
  fontSize: "1rem",
  color: "$text",
  backgroundColor: "$white",
  border: "1px solid $mediumGray",
  borderRadius: "6px",
  transition: "all 0.2s ease",
  outline: "none",
  fontFamily: "$primary",

  "&::placeholder": {
    color: "#A0A0A0",
  },

  "&:focus": {
    borderColor: "$primary",
    boxShadow: "0 0 0 4px $colors$accentLight",
    backgroundColor: "$background",
  },

  "&:disabled": {
    backgroundColor: "#F0F0F0",
    cursor: "not-allowed",
  },

  "@media (max-width: 768px)": {
    fontSize: "1.1rem",
    height: "52px",
  },

  variants: {
    hasError: {
      true: {
        borderColor: "$error",
        "&:focus": {
          borderColor: "$error",
          boxShadow: "0 0 0 4px $colors$errorLight",
        },
      },
    },
  },
});

export const Select = styled("select", {
  width: "100%",
  height: "48px",
  padding: "0 16px",
  fontSize: "1rem",
  color: "$text",
  backgroundColor: "$white",
  border: "1px solid $mediumGray",
  borderRadius: "6px",
  transition: "all 0.2s ease",
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%232D4068%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 16px top 50%",
  backgroundSize: "12px auto",

  "&:focus": {
    borderColor: "$primary",
    boxShadow: "0 0 0 4px $colors$accentLight",
  },

  "@media (max-width: 768px)": {
    fontSize: "1.1rem",
    height: "52px",
  },
});

export const ErrorMessage = styled("span", {
  fontSize: "0.75rem",
  color: "$error",
  fontWeight: "600",
  marginTop: "2px",
  height: "14px",

  "@media (max-width: 768px)": {
    fontSize: "0.85rem",
    height: "auto",
  },
});

export const PhoneWrapper = styled("div", {
  display: "flex",
  gap: "$small",
  width: "100%",
});

export const DDILabel = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 12px",
  backgroundColor: "$lightGray",
  borderRadius: "4px",
  fontSize: "$small",
  color: "$primaryDark",
  fontWeight: "$medium",
  flexShrink: 0,
  whiteSpace: "nowrap",
  minWidth: "auto",

  "& span:first-child": {
    fontSize: "18px",
  },

  "& span:nth-child(2)": {
    fontWeight: "$bold",
  },

  "& span:last-child": {
    fontSize: "12px",
    color: "$gray",
    marginLeft: "4px",
  },

  "@media (max-width: 768px)": {
    fontSize: "1.1em",
  },
});

export const ProductSummaryWrapper = styled("div", {
  borderBottom: "1px solid $lightGray",
  "&:last-child": { borderBottom: "none" },
  padding: "0px 8px",
});

export const ProductSummaryMain = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  ".name": {
    color: "$text",
    fontWeight: "600",
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  ".qty": {
    color: "$secondary",
    fontWeight: "bold",
    backgroundColor: "$lightGray",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.85rem",
  },

  "@media (max-width: 768px)": {
    ".name": {
      fontSize: "1.05rem",
    },
    ".qty": {
      fontSize: "0.95rem",
    },
  },
});

export const BonusSummaryItem = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "4px",
  paddingLeft: "24px",
  position: "relative",
  color: "$secondary",
  fontSize: "0.85rem",

  "&::before": {
    content: "''",
    position: "absolute",
    left: "8px",
    top: "-10px",
    bottom: "50%",
    width: "10px",
    borderLeft: "2px solid #E0E0E0",
    borderBottom: "2px solid #E0E0E0",
    borderBottomLeftRadius: "4px",
  },

  ".name": {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontStyle: "italic",
    opacity: 0.9,
  },

  ".badge": {
    fontSize: "0.7rem",
    textTransform: "uppercase",
    backgroundColor: "$warningLight",
    color: "$warningDark",
    padding: "1px 4px",
    borderRadius: "2px",
    fontWeight: "bold",
    marginRight: "4px",
  },

  "@media (max-width: 768px)": {
    fontSize: "0.95rem",
  },
});

export const PriceContainer = styled("div", {
  backgroundColor: "$lightGray",
  borderRadius: "6px",
  padding: "$medium",
  marginTop: "$medium",
  border: "1px solid #E0E0E0",
});

export const CouponCard = styled("div", {
  marginTop: "$medium",
  padding: "$medium",
  borderRadius: "10px",
  border: "1px solid rgba(45, 64, 104, 0.12)",
  background:
    "linear-gradient(135deg, rgba(57, 116, 187, 0.12) 0%, rgba(45, 64, 104, 0.04) 100%)",
  boxShadow: "0 12px 24px rgba(45, 64, 104, 0.08)",
});

export const CouponHeader = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "$small",
  marginBottom: "$small",

  h4: {
    margin: 0,
    fontSize: "0.95rem",
    letterSpacing: "0.3px",
    textTransform: "uppercase",
    color: "$primaryDark",
  },

  "@media (max-width: 768px)": {
    h4: {
      fontSize: "1.1rem",
    },
  },
});

export const CouponContainer = styled("div", {
  display: "flex",
  gap: "$medium",
});

export const CouponHint = styled("span", {
  fontSize: "0.8rem",
  color: "$secondary",
  opacity: 0.85,

  "@media (max-width: 768px)": {
    fontSize: "0.95rem",
  },
});

export const CouponTag = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "4px 10px",
  borderRadius: "999px",
  backgroundColor: "rgba(39, 174, 96, 0.15)",
  color: "$successDark",
  fontSize: "0.78rem",
  fontWeight: "$bold",
});

export const CouponInputRow = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "$small",
  alignItems: "center",
});

export const CouponButton = styled("button", {
  height: "36px",
  padding: "0 16px",
  borderRadius: "8px",
  fontSize: "0.95rem",
  fontWeight: "$bold",
  cursor: "pointer",
  transition: "transform 0.15s ease, box-shadow 0.2s ease, background 0.2s",
  whiteSpace: "nowrap",
  border: "none",

  variants: {
    tone: {
      primary: {
        backgroundColor: "$primary",
        color: "$white",
        boxShadow: "0 8px 16px rgba(57, 116, 187, 0.2)",
        "&:hover": {
          backgroundColor: "$primaryDark",
          transform: "translateY(-1px)",
        },
      },
      neutral: {
        backgroundColor: "$white",
        color: "$primaryDark",
        border: "1px solid rgba(45, 64, 104, 0.2)",
        "&:hover": { backgroundColor: "rgba(45, 64, 104, 0.05)" },
      },
    },
  },

  defaultVariants: {
    tone: "primary",
  },
});

export const CouponMessage = styled("div", {
  marginTop: "$small",
  padding: "10px 14px",
  borderRadius: "8px",
  fontSize: "0.9rem",
  fontWeight: "$bold",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  animation: "fadeIn 0.3s ease-in",

  variants: {
    tone: {
      success: {
        backgroundColor: "rgba(39, 174, 96, 0.12)",
        color: "$successDark",
        border: "1px solid rgba(39, 174, 96, 0.4)",
      },
      error: {
        backgroundColor: "rgba(231, 76, 60, 0.12)",
        color: "$error",
        border: "1px solid rgba(231, 76, 60, 0.35)",
      },
    },
  },
});

export const PriceRow = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "$small",
  fontSize: "0.95rem",
  color: "$secondary",

  variants: {
    highlight: {
      true: {
        color: "$successDark",
        fontWeight: "$bold",
        fontSize: "1.1rem",
        marginTop: "$small",
        paddingTop: "$small",
        borderTop: "1px dashed #CCC",
      },
    },
  },
});

export const CounterWrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$small",
  border: "1px solid $mediumGray",
  borderRadius: "6px",
  padding: "4px",
  width: "fit-content",
  backgroundColor: "$white",
});

export const CounterButton = styled("button", {
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "$primaryLight",
  color: "$white",
  fontSize: "1.2rem",
  cursor: "pointer",
  transition: "background 0.2s",

  "&:hover": {
    backgroundColor: "$primary",
  },

  "&:disabled": {
    backgroundColor: "$mediumGray",
    cursor: "not-allowed",
  },
});

export const CounterValue = styled("span", {
  minWidth: "40px",
  textAlign: "center",
  fontSize: "1.1rem",
  fontWeight: "bold",
  color: "$primaryDark",
});

export const ProductSummaryItem = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.9rem",
  padding: "8px 0",
  borderBottom: "1px solid $lightGray",

  "&:last-child": {
    borderBottom: "none",
  },

  ".name": {
    color: "$text",
    flex: 1,
  },

  ".qty": {
    color: "$secondary",
    fontWeight: "bold",
    marginLeft: "10px",
    whiteSpace: "nowrap",
  },
});

export const TabsContainer = styled("div", {
  display: "flex",
  backgroundColor: "$lightGray",
  borderRadius: "8px",
  padding: "4px",
  marginBottom: "$large",
});

export const Tab = styled("button", {
  flex: 1,
  padding: "12px",
  border: "none",
  borderRadius: "6px",
  fontSize: "0.9rem",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s",
  color: "$secondary",
  backgroundColor: "transparent",

  variants: {
    isActive: {
      true: {
        backgroundColor: "$white",
        color: "$primary",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
      false: {
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

export const HelperText = styled("span", {
  fontSize: "0.85rem",
  color: "$text",
  opacity: 0.8,
  marginTop: "4px",
  display: "block",
});

export const FadeIn = styled("div", {
  animation: "fadeIn 0.3s ease-in",
  "@keyframes fadeIn": {
    "0%": { opacity: 0, transform: "translateY(5px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
});

export const SubmitButton = styled("button", {
  marginTop: "24px",
  width: "100%",
  padding: "16px",
  backgroundColor: "$success",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background 0.2s",

  "&:hover": { backgroundColor: "$successDark" },
  "&:disabled": { backgroundColor: "$mediumGray", cursor: "not-allowed" },
});
