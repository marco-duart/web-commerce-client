import { config } from "../assets/styles/stitches.config";

const { colors, fontSizes, fontWeights, shadows } = config.theme;

export const toastConfig = {
  position: "top-center" as const,
  className: "payment-gateway-toast",
  duration: 5000,

  style: {
    background: colors.white,
    color: colors.secondary,
    border: `1px solid ${colors.mediumGray}`,
    borderRadius: "10px",
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.regular,
    padding: "14px 22px",
    boxShadow: shadows.medium,
    minWidth: "320px",
    maxWidth: "480px",
    minHeight: "90px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1.4,
  },

  success: {
    iconTheme: {
      primary: colors.success,
      secondary: colors.white,
    },
    style: {
      background: `${colors.success}10`,
      border: `1px solid ${colors.success}`,
      color: colors.successDark,
    },
  },

  error: {
    iconTheme: {
      primary: colors.error,
      secondary: colors.white,
    },
    style: {
      background: `${colors.error}10`,
      border: `1px solid ${colors.error}`,
      color: colors.errorDark,
    },
  },

  warning: {
    iconTheme: {
      primary: colors.warningDark,
      secondary: colors.white,
    },
    style: {
      background: `${colors.warning}10`,
      border: `1px solid ${colors.warningDark}`,
      color: colors.warningDark,
    },
  },

  info: {
    iconTheme: {
      primary: colors.infoDark,
      secondary: colors.white,
    },
    style: {
      background: `${colors.info}10`,
      border: `1px solid ${colors.infoDark}`,
      color: colors.infoDark,
    },
  },

  loading: {
    iconTheme: {
      primary: colors.primary,
      secondary: colors.white,
    },
    style: {
      background: `${colors.primary}10`,
      border: `1px solid ${colors.primary}`,
      color: colors.primaryDark,
    },
  },
};
