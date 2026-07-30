import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TRENDING_PRODUCTS } from "../../data/homeSections";

export function TrendingProducts() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 pl-1 pt-1 pb-2">
      {TRENDING_PRODUCTS.map((product) => (
        <TouchableOpacity
          key={product.id}
          className="mr-4 bg-white rounded-2xl"
          style={{
            width: 160,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            zIndex: 10,
          }}
        >
          <View className="rounded-t-2xl overflow-hidden">
            <Image source={product.image} style={{ width: "100%", height: 110 }} resizeMode="cover" />
          </View>
          <View className="p-3">
            <Text className="text-xs text-neutral-500 mb-1" style={{ fontFamily: "Poppins-Regular" }}>
              {product.category}
            </Text>
            <Text className="text-sm font-bold text-neutral-800 mb-2" style={{ fontFamily: "Poppins-SemiBold" }} numberOfLines={1}>
              {product.title}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text className="text-xs font-medium ml-1 text-neutral-700">
                {product.rating} ({product.reviews})
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
