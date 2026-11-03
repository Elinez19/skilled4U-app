import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BaseBottomSheet } from "../common/BaseBottomSheet";

interface LocationPermissionModalProps {
  visible: boolean;
  onRequestPermission: () => void;
  onSkip: () => void;
}

export function LocationPermissionModal({
  visible,
  onRequestPermission,
  onSkip,
}: LocationPermissionModalProps) {
  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onSkip}
      maxHeight="55%"
      showHandle
    >
      <View className="items-center px-4 pt-2 pb-6">
        <View className="w-16 h-16 bg-[#E6F7FF] rounded-full items-center justify-center mb-4 border border-[#B8E2F8]">
          <Ionicons name="location" size={32} color="#00A8E8" />
        </View>

        <Text
          className="text-[20px] text-[#003B73] mb-2 text-center"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          Enable Location
        </Text>

        <Text
          className="text-[13.5px] text-[#5B7C99] text-center mb-7 px-2"
          style={{ fontFamily: "Poppins-Regular", lineHeight: 20 }}
        >
          We need your location to show you the best verified artisans and services
          available in your area.
        </Text>

        <TouchableOpacity
          className="w-full bg-[#00A8E8] py-3.5 rounded-full mb-3 items-center shadow-sm"
          onPress={onRequestPermission}
          activeOpacity={0.85}
        >
          <Text
            className="text-white text-center text-[15px]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Allow Location Access
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full py-2.5 items-center"
          onPress={onSkip}
          activeOpacity={0.7}
        >
          <Text
            className="text-[#7A9BB8] text-center text-[14px]"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            Not Now
          </Text>
        </TouchableOpacity>
      </View>
    </BaseBottomSheet>
  );
}

