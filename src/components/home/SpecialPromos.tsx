import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SPECIAL_PROMOS } from "../../data/homeSections";

export function SpecialPromos() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
      {SPECIAL_PROMOS.map((promo) => (
        <TouchableOpacity
          key={promo.id}
          className="mr-4 rounded-2xl p-4 justify-center"
          style={{
            width: 260,
            height: 120,
            backgroundColor: promo.color,
          }}
        >
          <Text className="text-white font-bold text-lg mb-1" style={{ fontFamily: "Poppins-Bold" }}>
            {promo.title}
          </Text>
          <Text className="text-white opacity-90 text-sm" style={{ fontFamily: "Poppins-Regular" }}>
            {promo.description}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
