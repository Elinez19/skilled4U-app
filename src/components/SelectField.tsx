import React, { useState } from "react";
import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SelectFieldProps {
  label?: string;
  placeholder: string;
  value: string;
  onPress: () => void;
  error?: string;
  className?: string;
  style?: ViewStyle;
}

export function SelectField({ label, placeholder, value, onPress, error, className, style }: SelectFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`w-full mb-4 ${className || ""}`} style={style}>
      {label && <Text className="body-md font-medium text-neutral-700 mb-1">{label}</Text>}
      
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => {
          setIsFocused(true);
          onPress();
          setTimeout(() => setIsFocused(false), 200); // Visual feedback
        }}
        className={`flex-row items-center border rounded-xl bg-white px-4 h-14 ${
          error ? "border-error" : isFocused ? "border-primary" : "border-neutral-300"
        }`}
      >
        <Text
          className={`flex-1 text-base ${value ? "text-neutral-900" : "text-neutral-400"}`}
          style={{ fontFamily: "Poppins-Regular" }}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        
        <Ionicons name="chevron-down" size={20} color="#001328" />
      </TouchableOpacity>

      {error && (
        <Text className="text-error body-sm mt-1">{error}</Text>
      )}
    </View>
  );
}
