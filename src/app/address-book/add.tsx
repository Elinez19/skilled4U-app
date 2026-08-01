import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LocationAutocomplete } from "../../components/LocationAutocomplete";

export default function AddAddressScreen() {
  const router = useRouter();
  const [addressInput, setAddressInput] = useState("");

  const isFilled = addressInput.length > 0;

  const handleUpdate = () => {
    if (isFilled) {
      router.replace({ 
        pathname: "/address-book", 
        params: { newAddress: addressInput } 
      });
    }
  };

  const handleSelect = (location: any) => {
    setAddressInput(location.display_name);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="arrow-left" size={24} color="#1a365d" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-5 pt-2 relative z-10">
        <View className="flex-row items-center mb-2">
          <Ionicons name="location" size={22} color="#2563eb" className="mr-2" />
          <Text className="text-xl font-bold text-[#1a365d]">Service Location</Text>
        </View>
        <Text className="text-[#1a365d] mb-6 text-[15px]">Enter the location where you need the service</Text>

        {/* Input */}
        <LocationAutocomplete 
          label="" 
          placeholder="Enter Address" 
          onSelect={handleSelect}
        />

        {/* Current Location Suggestion Box (Fallback) */}
        {!isFilled && (
          <TouchableOpacity 
            className="border border-gray-100 rounded-xl p-4 flex-row items-start mt-2"
          >
            <Ionicons name="location" size={18} color="#0ea5e9" className="mt-0.5 mr-3" />
            <View className="flex-1">
              <Text className="text-[#1a365d] font-medium text-[15px] mb-1">Current Location</Text>
              <Text className="text-[#1a365d] text-sm">Tap for select your current location.</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Button */}
      <View className="px-5 py-4 bg-white z-0">
        <TouchableOpacity 
          onPress={handleUpdate}
          disabled={!isFilled}
          className={`rounded-xl py-4 items-center justify-center ${isFilled ? "bg-[#0ea5e9]" : "bg-[#bae6fd]"}`}
        >
          <Text className="font-bold text-white text-[16px]">Update Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
