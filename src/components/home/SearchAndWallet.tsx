import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export function SearchAndWallet() {
  return (
    <View className="mb-8 mt-4">
      <Text className="text-xl font-bold text-neutral-800 mb-4" style={{ fontFamily: "Poppins-SemiBold" }}>
        What help do you need?
      </Text>
      
      <View className="flex-row items-center gap-3">
        {/* Search Bar */}
        <View className="flex-1 flex-row items-center bg-white border border-neutral-200 rounded-xl px-4 h-14">
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-base text-neutral-900 h-full"
            placeholder="Search Services"
            placeholderTextColor="#9ca3af"
            style={{ fontFamily: "Poppins-Regular" }}
          />
        </View>

        {/* Wallet Block */}
        <TouchableOpacity className="flex-row items-center bg-white border border-neutral-200 rounded-xl px-4 h-14 w-[140px] justify-between">
          <View className="flex-row items-center">
            <FontAwesome5 name="wallet" size={16} color="#001328" />
            <Text className="ml-2 text-base font-bold text-neutral-800" style={{ fontFamily: "Poppins-SemiBold" }}>
              ₦ 0.00
            </Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={24} color="#00B7FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
