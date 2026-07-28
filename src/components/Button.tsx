import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

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
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isOutline = variant === "outline";
  const isText = variant === "text";
  
  const isDisabled = disabled || isLoading;

  const baseClasses = "flex-row items-center justify-center py-4 px-6 rounded-full w-full";
  const primaryClasses = isPrimary ? "bg-primary" : "";
  const secondaryClasses = isSecondary ? "bg-neutral-100" : "";
  const outlineClasses = isOutline ? "border-2 border-primary bg-transparent" : "";
  const textClasses = isText ? "bg-transparent py-2" : "";
  const disabledClasses = (isDisabled && !isText) ? "opacity-50" : "";

  const containerClasses = [baseClasses, primaryClasses, secondaryClasses, outlineClasses, textClasses, disabledClasses, className].filter(Boolean).join(" ");

  const textBaseClasses = "body-lg"; // Using body-lg for buttons
  const textPrimaryClasses = isPrimary ? "text-white" : "";
  const textSecondaryClasses = isSecondary ? "text-neutral-900" : "";
  const textOutlineClasses = isOutline ? "text-primary" : "";
  const textTextClasses = isText ? "text-neutral-500" : "";
  
  const labelClasses = [textBaseClasses, textPrimaryClasses, textSecondaryClasses, textOutlineClasses, textTextClasses].filter(Boolean).join(" ");

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      className={containerClasses}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? "white" : "#00B7FF"} />
      ) : (
        <Text className={labelClasses}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
