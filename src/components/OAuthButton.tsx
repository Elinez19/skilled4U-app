import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, TouchableOpacityProps, Image } from "react-native";
import { images } from "../constants/images";

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
      {provider === "google" ? (
        <Image source={images.googleIcon} style={{ width: 24, height: 24 }} resizeMode="contain" />
      ) : (
        <Ionicons name={iconName} size={24} color="#000" />
      )}
      <Text className="body-lg ml-3 text-neutral-900 font-medium">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
