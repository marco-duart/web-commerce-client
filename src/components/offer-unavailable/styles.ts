import { styled } from "../../assets/styles/stitches.config";

export const Container = styled("div", {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px",
});

export const Card = styled("div", {
  width: "100%",
  maxWidth: "600px",
  background: "white",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
});

export const BannerWrapper = styled("div", {
  width: "100%",
  height: "200px",
  background: "#f5f5f5",

  variants: {
    hasImage: {
      true: {},
      false: {
        display: "none",
      },
    },
  },
});

export const BannerImage = styled("img", {
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

export const Content = styled("div", {
  padding: "80px",
  textAlign: "center",
});

export const Title = styled("h1", {
  fontSize: "35px",
  fontWeight: 700,
  marginBottom: "16px",
});

export const Description = styled("p", {
  fontSize: "18px",
  marginBottom: "12px",
});

export const SubDescription = styled("p", {
  fontSize: "16px",
  opacity: 0.7,
});

export const SocialSection = styled("div", {
  marginTop: "32px",
  paddingTop: "24px",
  borderTop: "1px solid #eee",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
});

export const SocialText = styled("p", {
  fontSize: "14px",
  color: "#666",
});

export const SocialIcons = styled("div", {
  display: "flex",
  gap: "16px",
});

export const SocialIcon = styled("a", {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "#f3f3f3",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  fontSize: "18px",
  color: "#333",

  transition: "all 0.2s ease",

  "&:hover": {
    transform: "translateY(-2px)",
    background: "#000",
    color: "#fff",
  },
});