import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { images } from "../../constants/images";
import { ARTISANS, Artisan } from "../../data/artisans";
import { Category, CUSTOMER_ONBOARDING_SERVICES } from "../../data/categories";
import { InteractiveMapCanvas } from "../location/InteractiveMapCanvas";

interface CustomerHomeViewProps {
  locationTitle: string;
  coords: { lat: number; lon: number };
  onCoordsChange: (lat: number, lon: number) => void;
  onEditLocation: () => void;
  onCategoryPress: (category: Category) => void;
  onSwitchRole: (nextRole: "customer" | "artisan") => void;
}

const MAP_PIN_POSITIONS = [
  { top: "24%", left: "26%" },
  { top: "22%", left: "62%" },
  { top: "42%", left: "48%" },
  { top: "58%", left: "22%" },
  { top: "54%", left: "72%" },
] as const;

export function CustomerHomeView({
  locationTitle,
  coords,
  onCoordsChange,
  onEditLocation,
  onSwitchRole,
}: CustomerHomeViewProps) {
  const [selectedServiceFilter, setSelectedServiceFilter] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [mapZoom, setMapZoom] = useState(14);

  const filteredArtisans = ARTISANS.filter((artisan) => {
    const matchesCategory =
      selectedServiceFilter === "all" ||
      artisan.serviceKey === selectedServiceFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.skills.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const displayedArtisans =
    filteredArtisans.length > 0 ? filteredArtisans : ARTISANS.slice(0, 3);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <View className="flex-1">
      {/* Top Role Switcher Bar for Seamless Customer <-> Artisan Testing */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center bg-[#E6F7FF] border border-[#B8E2F8] px-3 py-1 rounded-full">
          <View className="w-2 h-2 rounded-full bg-[#00A8E8] mr-1.5" />
          <Text
            className="text-[11px] text-[#003B73]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Customer View
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSwitchRole("artisan")}
          className="flex-row items-center bg-white border border-[#D6ECFA] px-3 py-1 rounded-full"
        >
          <Ionicons name="swap-horizontal" size={13} color="#00A8E8" />
          <Text
            className="text-[11px] text-[#003B73] ml-1"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            Switch to Artisan
          </Text>
        </TouchableOpacity>
      </View>

      {/* ============================================================
          1. BRAND & PROFILE HEADER
          Matches Skilled4U-Customer-Screens.png (Screen 4)
         ============================================================ */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Image
            source={images.logoIcon}
            style={{ width: 38, height: 38 }}
            resizeMode="contain"
          />
          <Text
            className="ml-1.5 text-[22px] text-[#003B73]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Skilled<Text className="text-[#00A8E8]">4U</Text>
          </Text>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowSearchInput((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-white border border-[#D6ECFA] items-center justify-center mr-2.5"
          >
            <Ionicons
              name={showSearchInput ? "close" : "search-outline"}
              size={19}
              color="#003B73"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/(tabs)/account")}
            className="w-10 h-10 rounded-full bg-[#E6F7FF] border border-[#B8E2F8] items-center justify-center"
          >
            <Ionicons name="person-outline" size={20} color="#003B73" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Optional Expandable Service Search Input */}
      {showSearchInput && (
        <View className="flex-row items-center bg-white border border-[#B8E2F8] rounded-full px-4 h-11 mb-3.5">
          <Ionicons name="search-outline" size={18} color="#0099DF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search plumber, electrician, leak repair..."
            placeholderTextColor="#8AA8C4"
            className="flex-1 ml-2 text-[13.5px] text-[#003B73] h-full"
            style={{ fontFamily: "Poppins-Regular" }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#8AA8C4" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* ============================================================
          2. NEARBY ARTISANS LOCATION BAR CARD
          Matches Skilled4U-Customer-Screens.png (Screen 4)
         ============================================================ */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onEditLocation}
        style={styles.cardShadow}
        className="bg-white rounded-2xl px-4 py-3 mb-3.5 border border-[#DCEFFB] flex-row items-center justify-between"
      >
        <View className="flex-row items-center flex-1 mr-3">
          <View className="w-9 h-9 rounded-full bg-[#E6F7FF] items-center justify-center mr-3">
            <Ionicons name="location" size={19} color="#0099DF" />
          </View>
          <View className="flex-1">
            <Text
              className="text-[11.5px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Nearby Artisans
            </Text>
            <Text
              className="text-[15px] text-[#003B73]"
              style={{ fontFamily: "Poppins-Bold" }}
              numberOfLines={1}
            >
              {locationTitle || "Abuja, FCT"}
            </Text>
          </View>
        </View>

        <View className="w-8 h-8 rounded-full bg-[#F0F9FF] border border-[#D6ECFA] items-center justify-center">
          <Ionicons name="locate-outline" size={17} color="#0099DF" />
        </View>
      </TouchableOpacity>

      {/* ============================================================
          3. SERVICE CATEGORY FILTER PILLS
          Connects Choose Service (Screen 3) & Map Discovery (Screen 4)
         ============================================================ */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        className="mb-3.5"
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelectedServiceFilter("all")}
          className={`flex-row items-center px-3.5 py-2 rounded-full mr-2 border ${
            selectedServiceFilter === "all"
              ? "bg-[#00A8E8] border-[#00A8E8]"
              : "bg-white border-[#DCEFFB]"
          }`}
        >
          <Ionicons
            name="apps-outline"
            size={14}
            color={selectedServiceFilter === "all" ? "#FFFFFF" : "#0099DF"}
          />
          <Text
            className={`text-[12px] ml-1.5 ${
              selectedServiceFilter === "all" ? "text-white" : "text-[#003B73]"
            }`}
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            All Nearby
          </Text>
        </TouchableOpacity>

        {CUSTOMER_ONBOARDING_SERVICES.slice(0, 6).map((service) => {
          const isSelected = selectedServiceFilter === service.id;
          const cleanTitle = service.title.replace("\n", " ");
          return (
            <TouchableOpacity
              key={service.id}
              activeOpacity={0.8}
              onPress={() => {
                if (service.id === "more") {
                  router.push("/all-services");
                } else {
                  setSelectedServiceFilter(
                    isSelected ? "all" : service.id
                  );
                }
              }}
              className={`flex-row items-center px-3.5 py-2 rounded-full mr-2 border ${
                isSelected
                  ? "bg-[#00A8E8] border-[#00A8E8]"
                  : "bg-white border-[#DCEFFB]"
              }`}
            >
              {service.iconFamily === "MaterialCommunityIcons" ? (
                <MaterialCommunityIcons
                  name={service.iconName as any}
                  size={14}
                  color={isSelected ? "#FFFFFF" : "#0099DF"}
                />
              ) : (
                <Ionicons
                  name={service.iconName as any}
                  size={14}
                  color={isSelected ? "#FFFFFF" : "#0099DF"}
                />
              )}
              <Text
                className={`text-[12px] ml-1.5 ${
                  isSelected ? "text-white" : "text-[#003B73]"
                }`}
                style={{ fontFamily: "Poppins-Medium" }}
              >
                {cleanTitle}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/all-services")}
          className="flex-row items-center px-3.5 py-2 rounded-full bg-[#E6F7FF] border border-[#B8E2F8]"
        >
          <Text
            className="text-[12px] text-[#003B73] mr-1"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            All Services
          </Text>
          <Ionicons name="chevron-forward" size={13} color="#0099DF" />
        </TouchableOpacity>
      </ScrollView>

      {/* ============================================================
          4. INTERACTIVE NEARBY ARTISANS MAP
          Matches Skilled4U-Customer-Screens.png (Screen 4 / skilled4-add-location.png)
         ============================================================ */}
      <View className="mb-5">
        <InteractiveMapCanvas
          lat={coords.lat}
          lon={coords.lon}
          zoom={mapZoom}
          mapLayer="streets"
          pinSize="md"
          defaultDimensions={{ width: 340, height: 225 }}
          onPinMoved={onCoordsChange}
          containerStyle={styles.mapContainer}
          renderOverlays={() => (
            <>
              {/* Surrounding Blue Artisan Pins on the Map */}
              {displayedArtisans.slice(0, 5).map((artisan, idx) => {
                const pos =
                  MAP_PIN_POSITIONS[idx % MAP_PIN_POSITIONS.length];
                return (
                  <TouchableOpacity
                    key={artisan.id}
                    activeOpacity={0.85}
                    onPress={() => setSelectedArtisan(artisan)}
                    style={[
                      styles.artisanMapPinWrapper,
                      { top: pos.top, left: pos.left },
                    ]}
                    className="items-center"
                  >
                    <View
                      style={styles.pinShadow}
                      className="w-9 h-9 rounded-full bg-[#0099DF] border-2 border-white items-center justify-center"
                    >
                      <View className="w-2.5 h-2.5 rounded-full bg-white" />
                    </View>
                    <View className="w-2.5 h-2.5 bg-[#0099DF] rotate-45 -mt-1" />
                  </TouchableOpacity>
                );
              })}

              {/* Center Floating Pill Badge: "3 nearby artisans" */}
              <View
                pointerEvents="none"
                style={[styles.centerCountBadge, styles.badgeShadow]}
                className="bg-white/95 px-4 py-1.5 rounded-full border border-[#B8E2F8] flex-row items-center"
              >
                <View className="w-2 h-2 rounded-full bg-[#00A8E8] mr-1.5" />
                <Text
                  className="text-[12px] text-[#003B73]"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {displayedArtisans.slice(0, 3).length} nearby artisans
                </Text>
              </View>

              {/* Bottom-Right Floating GPS Recenter Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  setMapZoom(14);
                  onCoordsChange(9.0765, 7.4765);
                  Toast.show({
                    type: "info",
                    text1: "Map Recentered",
                    text2: `Showing artisans near ${locationTitle || "Abuja, FCT"}`,
                  });
                }}
                style={[styles.gpsButton, styles.badgeShadow]}
                className="w-11 h-11 rounded-full bg-white border border-[#DCEFFB] items-center justify-center"
              >
                <MaterialCommunityIcons
                  name="crosshairs-gps"
                  size={20}
                  color="#0099DF"
                />
              </TouchableOpacity>
            </>
          )}
        />
      </View>

      {/* ============================================================
          5. AVAILABLE ARTISANS NEAR YOU
          Matches Skilled4U-Customer-Screens.png (Screen 4)
         ============================================================ */}
      <View className="flex-row items-center justify-between mb-3">
        <Text
          className="text-[17px] text-[#003B73]"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          Available Artisans Near You
        </Text>
        <TouchableOpacity onPress={() => router.push("/service-providers")}>
          <Text
            className="text-[13px] text-[#00A8E8]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-2">
        {displayedArtisans.slice(0, 3).map((artisan) => (
          <TouchableOpacity
            key={artisan.id}
            activeOpacity={0.88}
            onPress={() => setSelectedArtisan(artisan)}
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-3.5 mb-3 border border-[#DCEFFB] flex-row items-center"
          >
            {/* Artisan Portrait */}
            <View className="w-16 h-16 rounded-2xl overflow-hidden bg-[#E6F7FF] border border-[#D6ECFA]">
              <Image
                source={artisan.avatarSource}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* Artisan Info */}
            <View className="flex-1 ml-3.5 pr-2">
              <Text
                className="text-[15.5px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Bold" }}
                numberOfLines={1}
              >
                {artisan.name}
              </Text>
              <Text
                className="text-[13px] text-[#5B7C99] mb-1.5"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                {artisan.trade}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text
                  className="text-[13px] text-[#003B73] ml-1"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  {artisan.rating}
                </Text>
                <Text
                  className="text-[12.5px] text-[#5B7C99] ml-1"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  ({artisan.reviews})
                </Text>
              </View>
            </View>

            {/* Right Meta Column: Chevron + Distance + Available Now Pill */}
            <View className="items-end justify-between self-stretch py-0.5">
              <Ionicons name="chevron-forward" size={16} color="#7A9BB8" />

              <Text
                className="text-[12.5px] text-[#5B7C99] my-1"
                style={{ fontFamily: "Poppins-Medium" }}
              >
                {artisan.distance}
              </Text>

              <View className="flex-row items-center bg-[#E8F8F0] border border-[#B2F0D2] px-2.5 py-0.5 rounded-full">
                <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                <Text
                  className="text-[10.5px] text-[#059669] ml-1"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  Available Now
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ============================================================
          MODAL: ARTISAN PROFILE & BOOK NOW
          Matches Screen 5 (skilled4-see-artisan-near-you.png)
         ============================================================ */}
      <Modal
        visible={!!selectedArtisan}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedArtisan(null)}
      >
        <View style={styles.modalBackdrop}>
          {selectedArtisan && (
            <View
              style={styles.modalSheet}
              className="bg-white rounded-t-3xl overflow-hidden pb-6"
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Portrait Header with Back, Favorite & Verified Badge */}
                <View className="w-full h-56 bg-[#E6F7FF] relative">
                  <Image
                    source={selectedArtisan.avatarSource}
                    className="w-full h-full"
                    resizeMode="cover"
                  />

                  <TouchableOpacity
                    onPress={() => setSelectedArtisan(null)}
                    className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/95 items-center justify-center"
                  >
                    <Ionicons name="arrow-back" size={20} color="#003B73" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => toggleFavorite(selectedArtisan.id)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 items-center justify-center"
                  >
                    <Ionicons
                      name={
                        favoriteIds.includes(selectedArtisan.id)
                          ? "heart"
                          : "heart-outline"
                      }
                      size={20}
                      color={
                        favoriteIds.includes(selectedArtisan.id)
                          ? "#EF4444"
                          : "#003B73"
                      }
                    />
                  </TouchableOpacity>

                  {/* Floating Verified Badge */}
                  <View className="absolute top-16 right-4 bg-white/95 px-3 py-1 rounded-full flex-row items-center border border-[#D6ECFA]">
                    <Ionicons
                      name="shield-checkmark"
                      size={14}
                      color="#00A8E8"
                    />
                    <Text
                      className="text-[11.5px] text-[#003B73] ml-1"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      Verified
                    </Text>
                  </View>
                </View>

                <View className="px-5 pt-4">
                  {/* Name & Trade */}
                  <Text
                    className="text-[22px] text-[#003B73]"
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    {selectedArtisan.name}
                  </Text>

                  <View className="flex-row items-center mt-0.5 mb-2">
                    <Ionicons name="location" size={16} color="#00A8E8" />
                    <Text
                      className="text-[14px] text-[#5B7C99] ml-1"
                      style={{ fontFamily: "Poppins-Medium" }}
                    >
                      {selectedArtisan.trade}
                    </Text>
                  </View>

                  {/* Rating & Distance Row */}
                  <View className="flex-row items-center justify-between mb-3.5">
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color="#F59E0B" />
                      <Text
                        className="text-[14px] text-[#003B73] ml-1"
                        style={{ fontFamily: "Poppins-Bold" }}
                      >
                        {selectedArtisan.rating}
                      </Text>
                      <Text
                        className="text-[13px] text-[#5B7C99] ml-1"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        ({selectedArtisan.reviews} reviews)
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Ionicons
                        name="location-outline"
                        size={15}
                        color="#5B7C99"
                      />
                      <Text
                        className="text-[13px] text-[#5B7C99] ml-1"
                        style={{ fontFamily: "Poppins-Medium" }}
                      >
                        {selectedArtisan.distance}
                      </Text>
                    </View>
                  </View>

                  {/* 3 Verification Pills: Verified | Background Checked | Insured */}
                  <View className="flex-row flex-wrap mb-4">
                    <View className="flex-row items-center bg-[#E8F8F0] border border-[#B2F0D2] px-2.5 py-1 rounded-full mr-2 mb-1.5">
                      <Ionicons
                        name="shield-checkmark"
                        size={13}
                        color="#10B981"
                      />
                      <Text
                        className="text-[11px] text-[#059669] ml-1"
                        style={{ fontFamily: "Poppins-SemiBold" }}
                      >
                        Verified
                      </Text>
                    </View>

                    <View className="flex-row items-center bg-[#EBF7FF] border border-[#C6E6FC] px-2.5 py-1 rounded-full mr-2 mb-1.5">
                      <Ionicons
                        name="checkmark-done-circle"
                        size={13}
                        color="#0099DF"
                      />
                      <Text
                        className="text-[11px] text-[#003B73] ml-1"
                        style={{ fontFamily: "Poppins-SemiBold" }}
                      >
                        Background Checked
                      </Text>
                    </View>

                    <View className="flex-row items-center bg-[#EBF7FF] border border-[#C6E6FC] px-2.5 py-1 rounded-full mb-1.5">
                      <Ionicons name="ribbon" size={13} color="#0099DF" />
                      <Text
                        className="text-[11px] text-[#003B73] ml-1"
                        style={{ fontFamily: "Poppins-SemiBold" }}
                      >
                        Insured
                      </Text>
                    </View>
                  </View>

                  {/* About */}
                  <Text
                    className="text-[15px] text-[#003B73] mb-1"
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    About
                  </Text>
                  <Text
                    className="text-[13px] text-[#5B7C99] mb-3.5"
                    style={{ fontFamily: "Poppins-Regular", lineHeight: 20 }}
                  >
                    {selectedArtisan.about}
                  </Text>

                  {/* Skill Chips */}
                  <View className="flex-row flex-wrap mb-4">
                    {selectedArtisan.skills.map((skill) => (
                      <View
                        key={skill}
                        className="bg-[#F0F9FF] border border-[#D6ECFA] px-3.5 py-1.5 rounded-full mr-2 mb-2"
                      >
                        <Text
                          className="text-[12px] text-[#003B73]"
                          style={{ fontFamily: "Poppins-Medium" }}
                        >
                          {skill}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Recent Work */}
                  <Text
                    className="text-[15px] text-[#003B73] mb-2"
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    Recent Work
                  </Text>
                  <View className="flex-row justify-between mb-5">
                    {selectedArtisan.recentWork.map((workImg, idx) => (
                      <View
                        key={idx}
                        style={{ width: "31.5%" }}
                        className="h-24 rounded-xl overflow-hidden bg-[#E6F7FF] border border-[#DCEFFB]"
                      >
                        <Image
                          source={workImg}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                  </View>

                  {/* Book Now CTA */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                      const artisanToBook = selectedArtisan;
                      setSelectedArtisan(null);
                      router.push({
                        pathname: "/schedule-appointment",
                        params: {
                          artisanName: artisanToBook.name,
                          artisanTrade: artisanToBook.trade,
                        },
                      });
                    }}
                    style={styles.bookBtnShadow}
                    className="w-full bg-[#00A8E8] py-3.5 rounded-full items-center"
                  >
                    <Text
                      className="text-[15px] text-white"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      Book Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  filterScroll: {
    paddingRight: 8,
  },
  mapContainer: {
    width: "100%",
    height: 225,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#D0E8F8",
    backgroundColor: "#E8F4FC",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  artisanMapPinWrapper: {
    position: "absolute",
    zIndex: 10,
  },
  centerCountBadge: {
    position: "absolute",
    top: "52%",
    alignSelf: "center",
    zIndex: 15,
  },
  gpsButton: {
    position: "absolute",
    bottom: 14,
    right: 14,
    zIndex: 15,
  },
  pinShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  badgeShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
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
  bookBtnShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#0088CC",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 31, 63, 0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    maxHeight: "90%",
  },
});

