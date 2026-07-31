import { useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function InputField({ label, error, secureTextEntry, className, ...props }: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = secureTextEntry !== undefined;

  return (
    <View className={`w-full mb-4 ${className || ""}`}>
      <Text className="body-md font-medium text-neutral-700 mb-1">{label}</Text>
      
      <View 
        className={`flex-row items-center border rounded-xl bg-neutral-50 px-4 h-14 ${
          error ? "border-error" : isFocused ? "border-primary" : "border-neutral-300"
        }`}
      >
        <TextInput
          className="flex-1 text-base text-neutral-900 h-full"
          style={{ fontFamily: "Poppins-Regular" }}
          placeholderTextColor="#9ca3af" // neutral-400
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="ml-2 p-2"
          >
            <Text className="text-primary body-sm font-medium">
              {isPasswordVisible ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-error body-sm mt-1">{error}</Text>
      )}
    </View>
  );
}
