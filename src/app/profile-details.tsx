import React from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileDetailsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="arrow-left" size={24} color="#1a365d" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#1a365d]">Profile details</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1 px-5 pt-2" showsVerticalScrollIndicator={false}>
          {/* Avatar Section */}
          <View className="items-center mb-8 mt-4">
            <View className="relative">
              <View className="w-[120px] h-[120px] bg-[#f0f9ff] rounded-full items-center justify-center">
                <Feather name="image" size={40} color="#9ca3af" />
              </View>
              {/* Camera Badge */}
              <TouchableOpacity className="absolute -bottom-2 left-1/2 -ml-5 w-10 h-10 bg-[#1a365d] rounded-full items-center justify-center border-2 border-white">
                <Ionicons name="camera" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View className="mb-5">
            <Text className="text-[#1a365d] font-semibold mb-2 text-[15px]">Full name</Text>
            <View className="border border-gray-300 rounded-2xl px-4 py-4">
              <TextInput 
                className="text-[15px] text-[#1a365d]"
                value="Ndenwa Elijah"
                editable={false}
              />
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-[#1a365d] font-semibold mb-2 text-[15px]">Email</Text>
            <View className="border border-gray-200 bg-gray-100 rounded-2xl px-4 py-4">
              <TextInput 
                className="text-[15px] text-gray-500"
                value="elijahndenwa19@gmail.com"
                editable={false}
              />
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-[#1a365d] font-semibold mb-2 text-[15px]">Phone number</Text>
            <View className="flex-row">
              <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-2xl px-4 py-4 mr-3">
                <Text className="text-[15px] text-[#1a365d] mr-2">+234</Text>
                <Feather name="chevron-down" size={18} color="#1a365d" />
              </TouchableOpacity>
              <View className="flex-1 border border-gray-300 rounded-2xl px-4 py-4">
                <TextInput 
                  className="text-[15px] text-[#1a365d]"
                  value="9065074197"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-[#1a365d] font-semibold mb-2 text-[15px]">Country</Text>
            <TouchableOpacity className="flex-row items-center justify-between border border-gray-300 rounded-2xl px-4 py-4">
              <Text className="text-[15px] text-[#1a365d]">Nigeria</Text>
              <Feather name="chevron-down" size={20} color="#1a365d" />
            </TouchableOpacity>
          </View>

          <View className="mb-8">
            <Text className="text-[#1a365d] font-semibold mb-2 text-[15px]">State</Text>
            <TouchableOpacity className="flex-row items-center justify-between border border-gray-300 rounded-2xl px-4 py-4">
              <Text className="text-[15px] text-[#1a365d]">Lagos</Text>
              <Feather name="chevron-down" size={20} color="#1a365d" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View className="px-5 py-4 bg-white">
        <TouchableOpacity className="bg-[#cffafe] rounded-2xl py-4 items-center justify-center">
          <Text className="text-white font-bold text-lg">Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
