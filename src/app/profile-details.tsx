import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { images } from "../constants/images";

export default function ProfileDetailsScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("Elijah A.");
  const [email, setEmail] = useState("elijah@example.com");
  const [phoneNumber, setPhoneNumber] = useState("812 345 6789");
  const [address, setAddress] = useState("12 Freedom Street, Abuja");
  const [role, setRole] = useState<"customer" | "artisan">("customer");

  useFocusEffect(
    useCallback(() => {
      const loadDraft = async () => {
        try {
          const raw = await AsyncStorage.getItem("skilled4u_user_draft");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.fullName) setFullName(parsed.fullName);
            if (parsed.email) setEmail(parsed.email);
            if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
            if (parsed.address) setAddress(parsed.address);
            if (parsed.role === "artisan" || parsed.role === "customer") {
              setRole(parsed.role);
            }
          }
        } catch {
          // ignore
        }
      };
      loadDraft();
    }, [])
  );

  const handleSaveChanges = async () => {
    try {
      const raw = await AsyncStorage.getItem("skilled4u_user_draft");
      const existing = raw ? JSON.parse(raw) : {};
      await AsyncStorage.setItem(
        "skilled4u_user_draft",
        JSON.stringify({
          ...existing,
          fullName: fullName.trim() || "Elijah A.",
          email: email.trim() || "elijah@example.com",
          phoneNumber: phoneNumber.trim(),
          address: address.trim(),
        })
      );
      Toast.show({
        type: "success",
        text1: "Profile Saved!",
        text2: "Your profile details have been updated.",
      });
      router.back();
    } catch {
      // ignore
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <Image
        source={images.onboardingBg}
        style={styles.bgOverlay}
        resizeMode="cover"
      />

      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white border border-[#D6ECFA] items-center justify-center mr-3"
        >
          <Ionicons name="arrow-back" size={20} color="#003B73" />
        </TouchableOpacity>
        <Text
          className="text-[20px] text-[#003B73]"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          Edit Profile
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View className="items-center my-4">
            <View className="relative">
              <View className="w-24 h-24 rounded-full overflow-hidden bg-primary-50 border-2 border-primary">
                <Image
                  source={
                    role === "artisan"
                      ? images.artisanEmeka
                      : images.artisanTunde
                  }
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity
                onPress={() =>
                  Toast.show({
                    type: "info",
                    text1: "Profile Photo",
                    text2: "Photo verified.",
                  })
                }
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary border-2 border-white items-center justify-center"
              >
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View className="mb-4">
            <Text
              className="text-[13.5px] text-[#003B73] mb-1.5"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Full Name
            </Text>
            <View className="bg-white border border-[#DCEFFB] rounded-2xl px-4 h-12 justify-center">
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="e.g. Emeka Okafor"
                placeholderTextColor="#8AA8C4"
                className="text-[14px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Regular" }}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text
              className="text-[13.5px] text-[#003B73] mb-1.5"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Email Address
            </Text>
            <View className="bg-white border border-[#DCEFFB] rounded-2xl px-4 h-12 justify-center">
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="e.g. emeka@example.com"
                placeholderTextColor="#8AA8C4"
                className="text-[14px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Regular" }}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text
              className="text-[13.5px] text-[#003B73] mb-1.5"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Phone Number
            </Text>
            <View className="flex-row">
              <View className="bg-white border border-[#DCEFFB] rounded-2xl px-3.5 h-12 flex-row items-center mr-2.5">
                <Text
                  className="text-[14px] text-[#003B73]"
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  🇳🇬 +234
                </Text>
              </View>
              <View className="flex-1 bg-white border border-[#DCEFFB] rounded-2xl px-4 h-12 justify-center">
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="812 345 6789"
                  placeholderTextColor="#8AA8C4"
                  className="text-[14px] text-[#003B73]"
                  style={{ fontFamily: "Poppins-Regular" }}
                />
              </View>
            </View>
          </View>

          <View className="mb-6">
            <Text
              className="text-[13.5px] text-[#003B73] mb-1.5"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Address
            </Text>
            <View className="bg-white border border-[#DCEFFB] rounded-2xl px-4 h-12 justify-center">
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="e.g. 12 Freedom Street, Abuja"
                placeholderTextColor="#8AA8C4"
                className="text-[14px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Regular" }}
              />
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSaveChanges}
            style={styles.saveBtnShadow}
            className="w-full bg-primary py-3.5 rounded-full items-center"
          >
            <Text
              className="text-[15px] text-white"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Save Changes
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4FAFF",
  },
  bgOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0.65,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  saveBtnShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#0088CC",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
