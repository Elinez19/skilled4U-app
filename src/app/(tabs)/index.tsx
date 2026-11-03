import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ArtisanHomeView } from "../../components/home/ArtisanHomeView";
import { CustomerHomeView } from "../../components/home/CustomerHomeView";
import {
  LocationPermissionModal,
  ServiceSelectionModal,
} from "../../components/modals";
import { images } from "../../constants/images";
import { Category } from "../../data/categories";

export default function TabsIndex() {
  const params = useLocalSearchParams<{ role?: string }>();
  const [role, setRole] = useState<"customer" | "artisan">(
    params.role === "artisan" ? "artisan" : "customer"
  );
  const [userName, setUserName] = useState("Emeka Okafor");
  const [savedAddress, setSavedAddress] = useState("Abuja, FCT");
  const [coords, setCoords] = useState<{ lat: number; lon: number }>({
    lat: 9.0765,
    lon: 7.4765,
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadHomeState = async () => {
        try {
          if (params.role === "artisan" || params.role === "customer") {
            setRole(params.role);
          }

          const draftRaw = await AsyncStorage.getItem("skilled4u_user_draft");
          if (draftRaw) {
            const draft = JSON.parse(draftRaw);
            if (
              !params.role &&
              (draft.role === "artisan" || draft.role === "customer")
            ) {
              setRole(draft.role);
            }
            if (draft.fullName) {
              setUserName(draft.fullName);
            }
            if (draft.address) {
              setSavedAddress(draft.address);
            }
          }

          const locRaw = await AsyncStorage.getItem(
            "skilled4u_selected_location"
          );
          if (locRaw) {
            const parsedLoc = JSON.parse(locRaw);
            if (parsedLoc.address) {
              setSavedAddress(parsedLoc.address);
            }
            if (
              typeof parsedLoc.latitude === "number" &&
              typeof parsedLoc.longitude === "number"
            ) {
              setCoords({
                lat: parsedLoc.latitude,
                lon: parsedLoc.longitude,
              });
            }
          }
        } catch {
          // ignore storage errors
        }
      };
      loadHomeState();
    }, [params.role])
  );

  const handleSwitchRole = async (nextRole: "customer" | "artisan") => {
    setRole(nextRole);
    try {
      const raw = await AsyncStorage.getItem("skilled4u_user_draft");
      const existing = raw ? JSON.parse(raw) : {};
      await AsyncStorage.setItem(
        "skilled4u_user_draft",
        JSON.stringify({
          ...existing,
          role: nextRole,
          fullName: existing.fullName || "Emeka Okafor",
        })
      );
    } catch {
      // ignore storage errors
    }
  };

  const handleCoordsChange = async (lat: number, lon: number) => {
    setCoords({ lat, lon });
    try {
      await AsyncStorage.setItem(
        "skilled4u_selected_location",
        JSON.stringify({
          address: savedAddress,
          latitude: lat,
          longitude: lon,
        })
      );
    } catch {
      // ignore storage errors
    }
  };

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <Image
        source={images.onboardingBg}
        style={styles.bgOverlay}
        resizeMode="cover"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {role === "artisan" ? (
          <ArtisanHomeView
            artisanName={userName}
            onSwitchRole={handleSwitchRole}
          />
        ) : (
          <CustomerHomeView
            locationTitle={savedAddress}
            coords={coords}
            onCoordsChange={handleCoordsChange}
            onEditLocation={() => router.push("/address-book/add")}
            onCategoryPress={handleCategoryPress}
            onSwitchRole={handleSwitchRole}
          />
        )}
      </ScrollView>

      <ServiceSelectionModal
        visible={isModalVisible}
        category={selectedCategory}
        onClose={() => setIsModalVisible(false)}
        onProceed={(selectedSubServices) => {
          setIsModalVisible(false);
        }}
      />

      <LocationPermissionModal
        visible={isLocationModalVisible}
        onRequestPermission={() => {
          setIsLocationModalVisible(false);
          router.push("/address-book/add");
        }}
        onSkip={() => setIsLocationModalVisible(false)}
      />
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },
});
