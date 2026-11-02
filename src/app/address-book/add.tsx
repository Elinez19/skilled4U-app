import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocationAutocomplete, LocationResult } from "../../components/LocationAutocomplete";

export default function AddAddressScreen() {
  const router = useRouter();

  const [addressInput, setAddressInput] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number }>({
    lat: 9.0765,
    lon: 7.4765,
  });

  useEffect(() => {
    const loadSavedAddress = async () => {
      try {
        const raw = await AsyncStorage.getItem("skilled4u_selected_location");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.address) setAddressInput(parsed.address);
          if (parsed.latitude && parsed.longitude) {
            setCoords({ lat: parsed.latitude, lon: parsed.longitude });
          }
        }
      } catch {
        // ignore storage errors
      }
    };
    loadSavedAddress();
  }, []);

  const isFilled = addressInput.trim().length > 0;

  const handleUpdate = async () => {
    if (isFilled) {
      const cleaned = addressInput.trim();
      try {
        await AsyncStorage.setItem(
          "skilled4u_selected_location",
          JSON.stringify({
            address: cleaned,
            latitude: coords.lat,
            longitude: coords.lon,
          })
        );
      } catch {
        // ignore storage errors
      }

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace({
          pathname: "/address-book",
          params: { newAddress: cleaned },
        });
      }
    }
  };

  const handleSelect = (location: LocationResult) => {
    setAddressInput(location.display_name);
    setCoords({
      lat: parseFloat(location.lat) || 9.0765,
      lon: parseFloat(location.lon) || 7.4765,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4FAFF" }}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white border border-[#D6ECFA] items-center justify-center mr-3"
        >
          <Feather name="arrow-left" size={20} color="#003B73" />
        </TouchableOpacity>
        <Text
          className="text-[20px] text-[#003B73]"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          Service Location
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center mb-1">
          <Ionicons name="location" size={20} color="#00A8E8" />
          <Text
            className="text-[15px] text-[#5B7C99] ml-1.5"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Search or select where you need the service
          </Text>
        </View>

        <View className="mt-3">
          <LocationAutocomplete
            label="Full Address"
            placeholder="Search street, neighborhood or city..."
            initialValue={addressInput}
            onChangeText={setAddressInput}
            onSelect={handleSelect}
          />
        </View>
      </ScrollView>

      {/* Update Button */}
      <View className="px-5 py-4 bg-[#F4FAFF]">
        <TouchableOpacity
          onPress={handleUpdate}
          disabled={!isFilled}
          className={`rounded-full py-4 items-center justify-center ${
            isFilled ? "bg-primary" : "bg-[#BAE6FD]"
          }`}
        >
          <Text
            className="text-white text-[16px]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Update Address
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
