import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";

interface SelectFieldProps {
  label?: string;
  labelSuffix?: string;
  placeholder: string;
  value: string;
  onPress: () => void;
  error?: string;
  className?: string;
  style?: ViewStyle;
  leftIcon?: keyof typeof Ionicons.glyphMap;
}

export function SelectField({
  label,
  labelSuffix,
  placeholder,
  value,
  onPress,
  error,
  className,
  style,
  leftIcon,
}: SelectFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`w-full mb-4 ${className || ""}`} style={style}>
      {label ? (
        <Text className="text-[14px] text-[#003B73] mb-1.5" style={{ fontFamily: "Poppins-SemiBold" }}>
          {label}
          {labelSuffix ? (
            <Text className="text-[#5B7C99]" style={{ fontFamily: "Poppins-Regular" }}>
              {" "}
              {labelSuffix}
            </Text>
          ) : null}
        </Text>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => {
          setIsFocused(true);
          onPress();
          setTimeout(() => setIsFocused(false), 200);
        }}
        className={`flex-row items-center border rounded-2xl bg-white px-4 h-14 ${
          error
            ? "border-error"
            : isFocused
              ? "border-[#00A8E8] bg-[#F8FDFF]"
              : "border-[#D0E8F8]"
        }`}
      >
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={20}
            color="#6889A8"
            style={{ marginRight: 10 }}
          />
        ) : null}

        <Text
          className={`flex-1 text-[15px] ${value ? "text-[#003B73]" : "text-[#7A9BB8]"}`}
          style={{ fontFamily: "Poppins-Regular" }}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>

        <Ionicons name="chevron-down" size={20} color="#3B6998" />
      </TouchableOpacity>

      {error ? <Text className="text-error body-sm mt-1">{error}</Text> : null}
    </View>
  );
}
