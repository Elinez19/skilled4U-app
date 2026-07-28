import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface OAuthButtonProps extends TouchableOpacityProps {
  provider: "google" | "apple";
  title: string;
}

export function OAuthButton({ provider, title, className, ...props }: OAuthButtonProps) {
  const iconName = provider === "google" ? "logo-google" : "logo-apple";
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`flex-row items-center justify-center py-4 px-6 rounded-full w-full border border-neutral-300 bg-white ${className || ""}`}
      {...props}
    >
      <Ionicons name={iconName} size={20} color={provider === "google" ? "#DB4437" : "#000"} />
      <Text className="body-lg ml-3 text-neutral-900 font-medium">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
