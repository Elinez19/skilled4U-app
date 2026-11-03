import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { images } from "../../constants/images";
import { tokenCache } from "../../lib/tokenCache";
import { logout } from "../../services/features/customerAuth/customerAuthSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const CUSTOMER_MENU_ITEMS = [
  {
    id: "bookings",
    title: "My Bookings",
    icon: "calendar-outline" as const,
  },
  {
    id: "wallet",
    title: "Wallet & Payments",
    icon: "wallet-outline" as const,
  },
  {
    id: "addresses",
    title: "Addresses",
    icon: "location-outline" as const,
  },
  {
    id: "reviews",
    title: "Reviews",
    icon: "star-outline" as const,
  },
  {
    id: "help",
    title: "Help & Support",
    icon: "help-circle-outline" as const,
  },
  {
    id: "settings",
    title: "Settings",
    icon: "settings-outline" as const,
  },
];

const ARTISAN_MENU_ITEMS = [
  {
    id: "edit-profile",
    title: "Edit Profile",
    icon: "create-outline" as const,
  },
  {
    id: "skills",
    title: "Skills & Experience",
    icon: "construct-outline" as const,
  },
  {
    id: "documents",
    title: "Documents",
    icon: "document-text-outline" as const,
  },
  {
    id: "service-area",
    title: "Service Area",
    icon: "location-outline" as const,
  },
  {
    id: "notifications",
    title: "Notification Settings",
    icon: "notifications-outline" as const,
  },
  {
    id: "help",
    title: "Help & Support",
    icon: "help-circle-outline" as const,
  },
];

export default function AccountScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.customerAuth.user);

  const [role, setRole] = useState<"customer" | "artisan">("customer");
  const [displayName, setDisplayName] = useState("Elijah A.");
  const [displayEmail, setDisplayEmail] = useState("elijah@example.com");
  const [craftLabel, setCraftLabel] = useState("Plumber");

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        if (authUser?.fullName || authUser?.firstName) {
          setDisplayName(
            authUser.fullName ||
              `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim()
          );
          if (authUser.email) {
            setDisplayEmail(authUser.email);
          }
        }
        try {
          const raw = await AsyncStorage.getItem("skilled4u_user_draft");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.role === "artisan" || parsed.role === "customer") {
              setRole(parsed.role);
            }
            if (parsed.fullName) {
              setDisplayName(parsed.fullName);
            }
            if (parsed.email) {
              setDisplayEmail(parsed.email);
            }
            if (parsed.craftCategory) {
              setCraftLabel(
                parsed.craftCategory.charAt(0).toUpperCase() +
                  parsed.craftCategory.slice(1)
              );
            }
          }
        } catch {
          // ignore
        }
      };
      loadProfile();
    }, [authUser])
  );

  const handleToggleRole = async () => {
    const nextRole = role === "customer" ? "artisan" : "customer";
    setRole(nextRole);
    try {
      const raw = await AsyncStorage.getItem("skilled4u_user_draft");
      const existing = raw ? JSON.parse(raw) : {};
      await AsyncStorage.setItem(
        "skilled4u_user_draft",
        JSON.stringify({ ...existing, role: nextRole })
      );
    } catch {
      // ignore
    }
  };

  const handleMenuPress = (id: string) => {
    switch (id) {
      case "bookings":
        router.push("/(tabs)/jobs");
        break;
      case "wallet":
        router.push("/(tabs)/market");
        break;
      case "addresses":
      case "service-area":
        router.push("/address-book");
        break;
      case "edit-profile":
      case "settings":
        router.push("/profile-details");
        break;
      case "skills":
        router.push("/(auth)/profile-setup?role=artisan&step=3");
        break;
      case "help":
        router.push("/(tabs)/support");
        break;
      default:
        Toast.show({
          type: "info",
          text1: "Profile Updated",
          text2: "All documents and reviews are verified.",
        });
    }
  };

  const handleLogOut = async () => {
    dispatch(logout());
    await tokenCache.deleteToken("userToken");
    router.replace("/(auth)/sign-in");
  };

  const menuItems =
    role === "artisan" ? ARTISAN_MENU_ITEMS : CUSTOMER_MENU_ITEMS;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <Image
        source={images.onboardingBg}
        style={styles.bgOverlay}
        resizeMode="cover"
      />

      {/* Top Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="w-10 h-10 rounded-full bg-white border border-[#D6ECFA] items-center justify-center mr-3"
          >
            <Ionicons name="arrow-back" size={20} color="#003B73" />
          </TouchableOpacity>
          <Text
            className="text-[20px] text-[#003B73]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            My Profile
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleToggleRole}
          className="flex-row items-center bg-white border border-[#D6ECFA] px-3 py-1.5 rounded-full"
        >
          <Ionicons name="swap-horizontal" size={13} color="#00A8E8" />
          <Text
            className="text-[11px] text-[#003B73] ml-1"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            {role === "artisan" ? "Artisan Profile" : "Customer Profile"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        {role === "artisan" ? (
          /* ============================================================
             ARTISAN PROFILE CARD (Screen 8: Profile & Settings)
             ============================================================ */
          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-4 mb-4 border border-[#DCEFFB] flex-row items-center"
          >
            <View className="w-18 h-18 rounded-full overflow-hidden bg-[#E6F7FF] border-2 border-[#B8E2F8]">
              <Image
                source={images.artisanEmeka}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <View className="ml-4 flex-1">
              <Text
                className="text-[18px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                {displayName === "Elijah A." ? "Emeka Okafor" : displayName}
              </Text>
              <Text
                className="text-[13px] text-[#5B7C99] mb-1"
                style={{ fontFamily: "Poppins-Medium" }}
              >
                {craftLabel}
              </Text>

              <View className="flex-row items-center mb-1.5">
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text
                  className="text-[12.5px] text-[#003B73] ml-1"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  4.8
                </Text>
                <Text
                  className="text-[12px] text-[#5B7C99] ml-1"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  (124 reviews)
                </Text>
              </View>

              <View className="flex-row items-center self-start bg-[#E8F8F0] border border-[#B2F0D2] px-2.5 py-0.5 rounded-full">
                <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                <Text
                  className="text-[11px] text-[#059669] ml-1"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  Verified
                </Text>
              </View>
            </View>
          </View>
        ) : (
          /* ============================================================
             CUSTOMER PROFILE CARD
             Matches skilled4-customer-profile-and-Settings-screen-.png
             ============================================================ */
          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-4 mb-4 border border-[#DCEFFB] flex-row items-center"
          >
            <View className="w-16 h-16 rounded-full overflow-hidden bg-[#E6F7FF] border-2 border-[#B8E2F8]">
              <Image
                source={images.artisanTunde}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <View className="ml-4 flex-1">
              <Text
                className="text-[18px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                {displayName}
              </Text>
              <Text
                className="text-[13px] text-[#5B7C99] mt-0.5"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                {displayEmail}
              </Text>
            </View>
          </View>
        )}

        {/* Menu Items List */}
        <View className="mb-3">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.82}
              onPress={() => handleMenuPress(item.id)}
              style={styles.cardShadow}
              className="bg-white rounded-2xl p-4 mb-2.5 border border-[#DCEFFB] flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-xl bg-[#F0F9FF] items-center justify-center mr-3">
                  <Ionicons name={item.icon} size={20} color="#003B73" />
                </View>
                <Text
                  className="text-[14.5px] text-[#003B73]"
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  {item.title}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#7A9BB8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Log Out Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleLogOut}
          style={styles.cardShadow}
          className="bg-white rounded-2xl p-4 border border-[#DCEFFB] flex-row items-center"
        >
          <View className="w-9 h-9 rounded-xl bg-[#FEE2E2] items-center justify-center mr-3">
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          </View>
          <Text
            className="text-[14.5px] text-[#EF4444]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
