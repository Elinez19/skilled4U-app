import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { tokenCache } from "../../lib/tokenCache";
import { logout } from "../../services/features/customerAuth/customerAuthSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const MENU_ITEMS = [
  { id: "1", title: "Address Book", icon: "map-pin", type: "Feather" },
  { id: "2", title: "Favourite Providers", icon: "heart", type: "Feather" },
  { id: "3", title: "Wallet and Payments", icon: "wallet-outline", type: "Ionicons" },
];

export default function AccountScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const locationAddress = useAppSelector((state) => state.location.address);
  const authUser = useAppSelector((state) => state.customerAuth.user);

  const [displayName, setDisplayName] = useState("Elijah Ndenwa");

  useEffect(() => {
    const loadProfile = async () => {
      if (authUser?.fullName || authUser?.firstName) {
        setDisplayName(
          authUser.fullName ||
            `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim()
        );
        return;
      }
      try {
        const raw = await AsyncStorage.getItem("skilled4u_user_draft");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.fullName) {
            setDisplayName(parsed.fullName);
          }
        }
      } catch {
        // ignore
      }
    };
    loadProfile();
  }, [authUser]);

  const handleLogOut = async () => {
    dispatch(logout());
    await tokenCache.deleteToken("userToken");
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-[#1a365d] mb-6">Profile</Text>

        {/* Profile Card */}
        <View className="bg-white rounded-3xl p-5 mb-6 border border-gray-100 shadow-sm">
          <View className="flex-row justify-between items-start mb-4">
            <View className="w-17.5 h-17.5 bg-[#E6F7FF] rounded-full items-center justify-center">
              <Ionicons name="person-outline" size={28} color="#00A8E8" />
            </View>
            <TouchableOpacity
              onPress={() => router.push("/profile-details")}
              className="flex-row items-center border border-[#38bdf8] rounded-full px-4 py-2"
            >
              <Text className="text-[#0ea5e9] font-medium mr-1">See Details</Text>
              <Feather name="chevron-right" size={16} color="#0ea5e9" />
            </TouchableOpacity>
          </View>
          <Text className="text-xl font-bold text-[#1a365d] mb-1">{displayName}</Text>
          <TouchableOpacity
            onPress={() => router.push("/address-book/add")}
            className="flex-row items-center"
          >
            <Ionicons name="location" size={16} color="#00A8E8" />
            <Text className="text-[#1a365d] font-medium ml-1" numberOfLines={1}>
              {locationAddress || "Wuse 2, Abuja"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-8">
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                if (item.title === "Address Book") {
                  router.push("/address-book");
                }
              }}
              className="flex-row items-center justify-between bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm"
            >
              <View className="flex-row items-center">
                {item.type === "Feather" ? (
                  <Feather name={item.icon as any} size={20} color="#1a365d" />
                ) : (
                  <Ionicons name={item.icon as any} size={22} color="#1a365d" />
                )}
                <Text className="text-[15px] font-medium text-[#1a365d] ml-3">
                  {item.title}
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#1a365d" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="px-5 pb-6 flex-row justify-between">
        <TouchableOpacity className="flex-1 flex-row items-center justify-center border border-red-300 rounded-2xl py-3.5 bg-white">
          <Feather name="trash-2" size={18} color="#ef4444" />
          <Text className="text-red-500 font-bold ml-2">Delete Account</Text>
        </TouchableOpacity>

        <View className="w-3" />

        <TouchableOpacity
          onPress={handleLogOut}
          className="flex-1 flex-row items-center justify-center border border-blue-300 rounded-2xl py-3.5 bg-white"
        >
          <Text className="text-[#0ea5e9] font-bold mr-2">Log Out</Text>
          <Feather name="log-out" size={18} color="#0ea5e9" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
