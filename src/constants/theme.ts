// Design tokens — mirrors the Skilled4U design system defined in global.css.
// Use these constants with StyleSheet or runtime styles where NativeWind
// className is not supported (see AGENTS.md Style Exception Rules).

export const colors = {
  primary: {
    purple: "#00A8E8",
    deepPurple: "#003B73",
    blue: "#00B4E6",
    green: "#10B981",
    sky: "#E6F7FF",
    navy: "#003B73",
    border: "#D6ECFA",
  },
  semantic: {
    success: "#10B981",
    warning: "#F59E0B",
    streak: "#FF8A00",
    error: "#EF4444",
    info: "#3B82F6",
  },
  neutral: {
    textPrimary: "#003B73",
    textSecondary: "#5B7C99",
    border: "#D6ECFA",
    surface: "#F4FAFF",
    background: "#FFFFFF",
  },
} as const;

export const fontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export const fontSize = {
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 16,
  bodyLg: 16,
  bodyMd: 14,
  bodySm: 13,
  caption: 11,
} as const;

export const lineHeight = {
  h1: 38,  // 32 × 1.2
  h2: 31,  // 24 × 1.3
  h3: 26,  // 20 × 1.3
  h4: 22,  // 16 × 1.4
  bodyLg: 26, // 16 × 1.6
  bodyMd: 22, // 14 × 1.6
  bodySm: 21, // 13 × 1.6
  caption: 15, // 11 × 1.4
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
} as const;

// Pre-composed text styles for use with StyleSheet.create()
export const textStyles = {
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.h1,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.h1,
    color: colors.neutral.textPrimary,
  },
  h2: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.h2,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.h2,
    color: colors.neutral.textPrimary,
  },
  h3: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.h3,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.h3,
    color: colors.neutral.textPrimary,
  },
  h4: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.h4,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.h4,
    color: colors.neutral.textPrimary,
  },
  bodyLg: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.bodyLg,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.bodyLg,
    color: colors.neutral.textPrimary,
  },
  bodyMd: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.bodyMd,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.bodyMd,
    color: colors.neutral.textPrimary,
  },
  bodySm: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.bodySm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.bodySm,
    color: colors.neutral.textPrimary,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.caption,
    color: colors.neutral.textSecondary,
  },
} as const;
