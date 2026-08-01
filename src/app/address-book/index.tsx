import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function AddressBookScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (params.newAddress) {
      setAddress(params.newAddress as string);
    }
  }, [params.newAddress]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="arrow-left" size={24} color="#1a365d" />
        </TouchableOpacity>
        <Text className="text-[22px] font-bold text-[#1a365d]">Address Book</Text>
      </View>

      <View className="flex-1">
        {address ? (
          <View className="px-5 pt-6">
            <View className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex-row items-start">
              <View className="mt-1 mr-3">
                <Feather name="map-pin" size={20} color="#0ea5e9" />
              </View>
              <View className="flex-1">
                <Text className="text-[#1a365d] font-bold text-base mb-1">Service Location</Text>
                <Text className="text-gray-500 leading-5">{address}</Text>
              </View>
              <TouchableOpacity onPress={() => setAddress(null)} className="ml-2 mt-1 p-2">
                <Feather name="trash-2" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
             <Text className="text-[#1a365d] font-medium text-[15px]">No Records Found!</Text>
          </View>
        )}
      </View>

      {/* Add Button */}
      <View className="px-5 py-6 items-end">
        <TouchableOpacity 
          onPress={() => router.push("/address-book/add")}
          className="flex-row items-center border border-blue-500 rounded-full px-5 py-2.5 bg-white"
        >
          <Feather name="plus" size={18} color="#3b82f6" />
          <Text className="text-blue-500 font-medium ml-2">Add Service Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
