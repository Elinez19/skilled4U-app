import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "text";
  isLoading?: boolean;
}

export function Button({
  title,
  variant = "primary",
  isLoading = false,
  className,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isOutline = variant === "outline";
  const isText = variant === "text";

  const isDisabled = disabled || isLoading;

  const baseClasses = "flex-row items-center justify-center h-14 px-6 rounded-full w-full overflow-hidden";
  const primaryClasses = isPrimary ? "bg-[#00A8E8] border border-[#38C8FF]" : "";
  const secondaryClasses = isSecondary ? "bg-[#E6F7FF] border border-[#B8E4FA]" : "";
  const outlineClasses = isOutline ? "border-2 border-[#00A8E8] bg-white" : "";
  const textClasses = isText ? "bg-transparent h-10 py-1" : "";
  const disabledClasses = isDisabled && !isText ? "opacity-55" : "";

  const containerClasses = [
    baseClasses,
    primaryClasses,
    secondaryClasses,
    outlineClasses,
    textClasses,
    disabledClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const textPrimaryClasses = isPrimary ? "text-white" : "";
  const textSecondaryClasses = isSecondary ? "text-[#003B73]" : "";
  const textOutlineClasses = isOutline ? "text-[#00A8E8]" : "";
  const textTextClasses = isText ? "text-[#5B7C99]" : "";

  const labelClasses = [
    "text-[16px] tracking-wide",
    textPrimaryClasses,
    textSecondaryClasses,
    textOutlineClasses,
    textTextClasses,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isDisabled}
      className={containerClasses}
      style={[isPrimary && !isDisabled ? styles.primaryShadow : undefined, style]}
      {...props}
    >
      {/* Subtle glossy top highlight bar to replicate the reference button gradient */}
      {isPrimary && (
        <View
          pointerEvents="none"
          className="absolute top-0 left-4 right-4 h-[45%] rounded-full bg-white/15"
        />
      )}
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? "#FFFFFF" : "#00A8E8"} />
      ) : (
        <Text
          className={labelClasses}
          style={{ fontFamily: isText ? "Poppins-Medium" : "Poppins-SemiBold" }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#0088CC",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.32,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
