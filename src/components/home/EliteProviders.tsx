import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ELITE_PROVIDERS } from "../../data/homeSections";

export function EliteProviders() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 pl-1 pt-1 pb-2">
      {ELITE_PROVIDERS.map((provider) => (
        <TouchableOpacity
          key={provider.id}
          className="mr-4 bg-white rounded-2xl p-4 items-center"
          style={{
            width: 140,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            zIndex: 10,
          }}
        >
          <Image
            source={provider.image}
            style={{ width: 64, height: 64, borderRadius: 32, marginBottom: 8 }}
            resizeMode="cover"
          />
          <Text className="text-sm font-bold text-neutral-800 text-center" style={{ fontFamily: "Poppins-SemiBold" }} numberOfLines={1}>
            {provider.name}
          </Text>
          <Text className="text-xs text-neutral-500 mb-2 text-center" style={{ fontFamily: "Poppins-Regular" }} numberOfLines={1}>
            {provider.specialty}
          </Text>
          <View className="flex-row items-center bg-neutral-100 px-2 py-1 rounded-full">
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text className="text-xs font-medium ml-1 text-neutral-700">
              {provider.rating}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
