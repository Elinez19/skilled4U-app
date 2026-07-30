import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HomeHeaderProps {
  locationTitle: string;
  onEditLocation: () => void;
  onNotificationPress: () => void;
}

export function HomeHeader({ locationTitle, onEditLocation, onNotificationPress }: HomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-6">
      <View>
        <Text className="text-xl font-bold text-neutral-800" style={{ fontFamily: "Poppins-SemiBold" }}>
          {locationTitle}
        </Text>
        <TouchableOpacity onPress={onEditLocation} className="mt-1">
          <Text className="text-primary-500 font-medium" style={{ fontFamily: "Poppins-Medium" }}>
            Edit service location
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onNotificationPress} className="relative">
        <Ionicons name="notifications" size={28} color="#1e293b" />
      </TouchableOpacity>
    </View>
  );
}
