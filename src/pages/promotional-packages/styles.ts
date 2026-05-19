import { styled } from "../../assets/styles/stitches.config";

export const Container = styled("div", {
  width: "100%",
  minHeight: "100vh",
  backgroundColor: "$lightGray",
  fontFamily: "$primary",
  paddingBottom: "$xxlarge",
  position: "relative",
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

    svg: {
      width: 18,
      height: 18,
    },
  },

  "@media (max-width: 768px)": {
    justifyContent: "flex-start",
    paddingLeft: "$medium",

    "& > div": {
      fontSize: "1.2em",
    },
  },
});

export const OfferValidityBar = styled("div", {
  maxWidth: "1100px",
  margin: "0 auto $medium auto",
  padding: "$small $medium",
  borderRadius: "8px",
  border: "1px solid rgba(211, 84, 0, 0.25)",
  background:
    "linear-gradient(90deg, rgba(255, 243, 224, 1) 0%, rgba(255, 234, 204, 1) 100%)",
  color: "$warningDark",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "$small",
  position: "sticky",
  top: "8px",
  zIndex: 20,
  boxShadow: "$small",

  "@media (max-width: 900px)": {
    margin: "0 $medium $medium $medium",
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

export const OfferValidityLabel = styled("span", {
  fontSize: "$small",
  fontWeight: "$bold",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
});

export const OfferValidityTime = styled("strong", {
  fontSize: "$large",
  lineHeight: 1,
  fontWeight: "$extraBold",
  color: "#B34700",
  fontVariantNumeric: "tabular-nums",
});

export const ContentWrapper = styled("main", {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "0 $medium",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "$xlarge",

  "@breakpoints": {
    tablet: {
      gridTemplateColumns: "1fr",
    },
  },

  "@media (max-width: 900px)": {
    gridTemplateColumns: "1fr",
  },
});

export const PresentationColumn = styled("div", {
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

export const BannerWrapper = styled("div", {
  width: "100%",
  aspectRatio: "3 / 1",
  position: "relative",
  overflow: "hidden",
  backgroundColor: "$primaryDark",

  variants: {
    hasImage: {
      true: {},
      false: {
        background: "linear-gradient(135deg, $primaryDark 0%, $primary 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&::after": {
          content: "'PRODUTO'",
          color: "rgba(255,255,255,0.85)",
          fontSize: "$xlarge",
          fontWeight: "$extraBold",
          letterSpacing: "3px",
          textTransform: "uppercase",
        },
      },
    },
  },
});

export const BannerImage = styled("img", {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.5s ease",

  "&:hover": {
    transform: "scale(1.02)",
  },
});

export const ProductInfo = styled("div", {
  padding: "$large",

  h1: {
    color: "$primaryDark",
    fontSize: "$large",
    fontWeight: "$bold",
    marginBottom: "$small",
    lineHeight: "1.3",
  },

  p: {
    color: "$text",
    fontSize: "$small",
    lineHeight: "1.6",
    opacity: 0.8,
  },

  "@media (max-width: 768px)": {
    h1: {
      fontSize: "1.8em",
    },

    p: {
      fontSize: "1.15em",
    },
  },
});

export const ItemList = styled("div", {
  marginTop: "$medium",
  borderTop: "1px solid $lightGray",
  paddingTop: "$medium",
});

export const ItemRow = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "$small",
  padding: "$small",
  borderRadius: "4px",
  backgroundColor: "$lightGray",

  variants: {
    isBonus: {
      true: {
        backgroundColor: "rgba(243, 156, 18, 0.1)",
        borderLeft: "3px solid $warning",
      },
      false: {
        borderLeft: "3px solid $primary",
      },
    },
  },
});

export const ItemName = styled("span", {
  fontSize: "$small",

  "@media (max-width: 768px)": {
    fontSize: "1.1em",
  },
  fontWeight: "$regular",
  color: "$secondaryDark",
  display: "flex",
  alignItems: "center",
  gap: "$xsmall",

  strong: {
    marginRight: "$xsmall",
    color: "$primary",
  },
});

export const ItemTag = styled("span", {
  fontSize: "0.8em",
  textTransform: "uppercase",
  padding: "2px 6px",
  borderRadius: "4px",
  fontWeight: "$bold",

  variants: {
    type: {
      bonus: {
        color: "$warningDark",
        backgroundColor: "rgba(243, 156, 18, 0.2)",
      },
      product: {
        color: "$primary",

        "@media (max-width: 768px)": {
          fontSize: "0.9em",
          padding: "3px 8px",
        },
        backgroundColor: "rgba(57, 116, 187, 0.1)",
      },
    },
  },
});

export const CheckoutColumn = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$medium",
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
      true: {
        borderTop: "4px solid $success",
      },
      false: {
        borderTop: "4px solid $secondary",
      },
    },
  },

  defaultVariants: {
    highlight: false,
  },
});

export const PriceSummary = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  marginTop: "$large",
  paddingTop: "$medium",
  borderTop: "1px dashed $mediumGray",

  span: {
    "@media (max-width: 768px)": {
      span: {
        fontSize: "1.25em",
      },

      strong: {
        fontSize: "2.1em",
      },
    },
    fontSize: "$regular",
    color: "$text",
  },

  strong: {
    fontSize: "$xlarge",
    color: "$successDark",
    fontWeight: "$extraBold",
  },
});

export const Skeleton = styled("div", {
  backgroundColor: "$mediumGray",
  borderRadius: "4px",
  animation: "pulse 1.5s infinite",

  variants: {
    variant: {
      title: { width: "60%", height: "30px", marginBottom: "10px" },
      text: { width: "100%", height: "15px", marginBottom: "8px" },
      banner: { width: "100%", aspectRatio: "3/1" },
    },
  },
});

export const IconWrapper = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
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

  svg: {
    color: "$primary",
    width: 24,
    height: 24,
  },
});

export const StepContent = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$medium",
});

export const ProductColumn = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$medium",

  "@media (min-width: 901px)": {
    position: "sticky",
    top: "20px",
  },
});

export const ContractTermsContainer = styled("div", {
  backgroundColor: "#f9f9f9",
  borderRadius: "6px",
  border: "1px solid #eee",
});

export const ContractTermsContent = styled("label", {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
  fontSize: "0.9rem",
  color: "#555",
  lineHeight: "1.4",
});

export const SubmitButton = styled("button", {
  marginTop: "20px",
  width: "100%",
  padding: "15px",
  color: "white",
  border: "none",
  borderRadius: "5px",
  fontSize: "1.2em",
  fontWeight: "bold",

  variants: {
    disabled: {
      true: {
        backgroundColor: "#ccc",
        cursor: "not-allowed",
      },
      false: {
        backgroundColor: "#27AE60",
        cursor: "pointer",
      },
    },
  },
});

export const TermsWrapper = styled("div", {
  marginTop: "20px",
  padding: "15px",
  backgroundColor: "#f9f9f9",
  borderRadius: "6px",
  border: "1px solid #eee",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const TermsLabel = styled("label", {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  cursor: "pointer",
  fontSize: "0.9rem",
  color: "#555",
  lineHeight: "1.4",

  "& input": {
    marginTop: "3px",
  },

  "& span b": {
    color: "#2980b9",
    fontWeight: "bold",
    textDecoration: "underline",
  },

  "@media (max-width: 768px)": {
    fontSize: "1rem",
  },
});

export const InstallmentDisclaimer = styled("p", {
  fontSize: "0.9rem",
  color: "#888",
  textAlign: "left",
  fontStyle: "italic",
  lineHeight: "1.4",
  margin: 0,
  paddingLeft: "23px",

  "@media (max-width: 768px)": {
    fontSize: "1rem",
    color: "#666",
  },
});
