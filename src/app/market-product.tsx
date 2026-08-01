import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { images } from "../constants/images";

export default function MarketProductScreen() {
  const { title, price, imageKey } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const productTitle = (title as string) || "Emulsion 4 Ltrs";
  const productPrice = (price as string) || "4,500.00";
  const catKey = imageKey as string;

  let imageSource = images.paintBucket;
  if (catKey === "Washing Machines") imageSource = images.washingMachine;
  else if (catKey === "Refrigerators") imageSource = images.refrigerator;
  else if (catKey === "Air Conditioners") imageSource = images.airConditioner;
  else if (catKey === "Inverters/ Generators") imageSource = images.generator;
  else if (catKey === "Small Appliances") imageSource = images.smallAppliances;
  else if (catKey === "Cooking Appliances") imageSource = images.cookingAppliances;
  else if (catKey === "Internet/ Phone") imageSource = images.internetRouter;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center absolute top-0 left-0 z-10 w-full" style={{ paddingTop: 40 }}>
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full bg-white/50">
          <Ionicons name="chevron-back" size={24} color="#0F2846" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View className="w-full h-80 bg-gray-100 items-center justify-center">
          <Image 
            source={imageSource} 
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>

        {/* Slider dots (dummy) */}
        <View className="flex-row justify-center items-center mt-4">
          <View className="w-2 h-2 rounded-full bg-[#0A58FF]" />
        </View>

        {/* Product Info */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[#0F2846] font-bold text-xl flex-1 mr-2">{productTitle}</Text>
            <Text className="text-[#0F2846] font-bold text-lg">₦{productPrice}</Text>
          </View>

          <View className="h-[2px] w-full bg-[#00B7FF] opacity-50 mb-6" />

          <Text className="text-[#0F2846] text-sm text-center leading-5 mb-2">
            Top quality, built to last.
          </Text>
          <Text className="text-[#0F2846] text-sm text-center leading-5">
            Delivery not inclusive
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="px-4 pb-6 pt-4 border-t border-gray-100 bg-white">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[#0F2846] font-bold text-lg">₦{productPrice}</Text>
          
          <View className="flex-row items-center border border-[#00B7FF] rounded-full px-4 py-1.5">
            <TouchableOpacity onPress={decrement} className="p-1">
              <Ionicons name="remove" size={20} color="#0F2846" />
            </TouchableOpacity>
            <Text className="text-[#0F2846] font-bold mx-4 text-base">{quantity}</Text>
            <TouchableOpacity onPress={increment} className="p-1">
              <Ionicons name="add" size={20} color="#0F2846" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center mb-4">
          <Ionicons name="information-circle-outline" size={16} color="#4B5563" />
          <Text className="text-gray-600 text-xs ml-2">
            Contact store to make all purchases
          </Text>
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity className="flex-1 bg-[#1E3A8A] rounded-xl py-3.5 items-center mr-2" activeOpacity={0.8}>
            <Text className="text-white font-semibold text-base">Contact Store</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-[#00B7FF] rounded-xl py-3.5 items-center ml-2" activeOpacity={0.8}>
            <Text className="text-white font-semibold text-base">Pay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
