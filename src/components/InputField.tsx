import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
}

export function InputField({
  label,
  error,
  secureTextEntry,
  leftIcon,
  className,
  ...props
}: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = secureTextEntry !== undefined;

  return (
    <View className={`w-full mb-4 ${className || ""}`}>
      {label ? (
        <Text
          className="text-[14px] text-[#003B73] mb-1.5"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          {label}
        </Text>
      ) : null}

      <View
        className={`flex-row items-center border rounded-2xl bg-white px-4 h-14 ${
          error
            ? "border-error bg-red-50/20"
            : isFocused
              ? "border-[#00A8E8] bg-[#F8FDFF]"
              : "border-[#D0E8F8]"
        }`}
      >
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? "#00A8E8" : "#6889A8"}
            style={{ marginRight: 10 }}
          />
        ) : null}

        <TextInput
          className="flex-1 text-[15px] text-[#003B73] h-full"
          style={{ fontFamily: "Poppins-Regular" }}
          placeholderTextColor="#7A9BB8"
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="ml-2 p-1.5"
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6889A8"
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text className="text-error body-sm mt-1">{error}</Text> : null}
    </View>
  );
}
