import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Keyboard,
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
import { LocationResult, MapLayerType } from "../../data/locations";
import {
  deleteAddress,
  getSavedAddresses,
  saveAddress,
  SavedAddress,
  selectActiveAddress,
} from "../../services/features/location/addressStorage";
import { setLocation } from "../../services/features/location/locationSlice";
import { useAppDispatch } from "../../store/hooks";
import {
  getDeviceGpsCoordinates,
  getNextMapLayer,
  reverseGeocodeCoordinates,
  searchFreeLocationsApi,
} from "../../utils/locationUtils";
import { InteractiveMapCanvas } from "./InteractiveMapCanvas";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export type AddressFlowStep =
  | "discover" // screen-01.jpeg (Discover What is Available near you)
  | "list" // screen-1.jpeg (empty) or screen-4.jpeg (saved addresses)
  | "add" // screen-2.jpeg (Add new address form)
  | "success"; // screen-5.jpeg (You're All Set!)

interface AddressManagerViewProps {
  role?: "customer" | "artisan";
  initialStep?: AddressFlowStep;
  titleOverride?: string;
  primaryButtonLabel?: string;
  onAddressConfirmed?: (address: SavedAddress) => void;
  onClose?: () => void;
  showBackButton?: boolean;
}

const QUICK_LABELS = ["Home", "Office", "Workshop", "Site", "Wuye"];

export function AddressManagerView({
  role = "customer",
  initialStep = "list",
  titleOverride,
  primaryButtonLabel,
  onAddressConfirmed,
  onClose,
  showBackButton = true,
}: AddressManagerViewProps) {
  const dispatch = useAppDispatch();

  // Navigation flow state
  const [currentStep, setCurrentStep] = useState<AddressFlowStep>(initialStep);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // Map state
  const [mapCoords, setMapCoords] = useState<{ lat: number; lon: number }>({
    lat: 9.0563,
    lon: 7.4298, // Wuye, Abuja
  });
  const [mapZoom, setMapZoom] = useState(15);
  const [mapLayer, setMapLayer] = useState<MapLayerType>("satellite");

  // Add Address Form State (screen-2)
  const [addressLabel, setAddressLabel] = useState("Wuye");
  const [addressInput, setAddressInput] = useState("");
  const [selectedFullAddress, setSelectedFullAddress] = useState("");
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Autocomplete suggestions
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<any>(null);

  // Success screen animation
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Screen header title
  const sheetTitle =
    titleOverride ||
    (role === "artisan" ? "Work Location" : "Delivery Address");

  // Load saved addresses on mount
  useEffect(() => {
    loadAddresses();
  }, [role]);

  const loadAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const list = await getSavedAddresses(role);
      setSavedAddresses(list);
      if (list.length > 0) {
        const defaultOrFirst = list.find((a) => a.isDefault) || list[0];
        setSelectedAddressId(defaultOrFirst.id);
        setMapCoords({
          lat: defaultOrFirst.latitude,
          lon: defaultOrFirst.longitude,
        });
        setSelectedFullAddress(defaultOrFirst.address);
      } else {
        // If empty and initial step is list, start on empty state (screen-1)
        setSelectedFullAddress("");
      }
    } catch {
      // Storage error fallback
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Perform live address search with debouncing
  const handleAddressInputChange = (text: string) => {
    setAddressInput(text);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!text.trim()) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchFreeLocationsApi(text.trim(), mapCoords, []);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 380);
  };

  // Select an autocomplete suggestion
  const handleSelectSuggestion = (item: LocationResult) => {
    Keyboard.dismiss();
    setAddressInput(item.display_name);
    setSelectedFullAddress(item.display_name);
    setSuggestions([]);

    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      setMapCoords({ lat, lon });
      if (!addressLabel || addressLabel === "Wuye") {
        setAddressLabel(item.short_name || "Location");
      }
    }
  };

  // Handle pin moved on map
  const handlePinMoved = async (lat: number, lon: number) => {
    setMapCoords({ lat, lon });
    setIsReverseGeocoding(true);
    try {
      const geo = await reverseGeocodeCoordinates(lat, lon);
      setSelectedFullAddress(geo.display_name);
      setAddressInput(geo.display_name);
      if (!addressLabel || addressLabel === "Wuye") {
        setAddressLabel(geo.short_name || "Pinned Location");
      }
    } catch {
      // ignore
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Use Your Current Location (screen-00 / screen-3)
  const handleUseCurrentLocation = async () => {
    Keyboard.dismiss();
    setIsLocatingGps(true);
    try {
      const gps = await getDeviceGpsCoordinates();
      if (gps) {
        setMapCoords({ lat: gps.latitude, lon: gps.longitude });
        setMapZoom(16);
        setIsReverseGeocoding(true);
        const geo = await reverseGeocodeCoordinates(gps.latitude, gps.longitude);
        setSelectedFullAddress(geo.display_name);
        setAddressInput(geo.display_name);
        setAddressLabel(geo.short_name || "Current Location");
        Toast.show({
          type: "success",
          text1: "Location Found",
          text2: geo.short_name || "Updated to your current GPS position",
        });
      } else {
        // Fallback to Abuja default if in emulator without GPS
        const fallbackLat = 9.0563;
        const fallbackLon = 7.4298;
        setMapCoords({ lat: fallbackLat, lon: fallbackLon });
        const fallbackAddress =
          "Wuye Ultra Modern Market, Plot 697, Ngozi Okonjo-Iweala, Wuye, Abuja, Municipal Area Council, Federal Capital Territory, 900108, Nigeria";
        setSelectedFullAddress(fallbackAddress);
        setAddressInput(fallbackAddress);
        setAddressLabel("Wuye");
        Toast.show({
          type: "info",
          text1: "Using Default Location",
          text2: "GPS unavailable. Positioned at Wuye, Abuja.",
        });
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Location Error",
        text2: "Could not access device GPS.",
      });
    } finally {
      setIsLocatingGps(false);
      setIsReverseGeocoding(false);
    }
  };

  // Save Address action from Screen 2
  const handleSaveAddress = async () => {
    const finalAddress =
      selectedFullAddress.trim() ||
      addressInput.trim() ||
      "Wuye Ultra Modern Market, Plot 697, Ngozi Okonjo-Iweala, Wuye, Abuja";
    const finalLabel = addressLabel.trim() || "Address";

    setIsSaving(true);
    try {
      const created = await saveAddress({
        label: finalLabel,
        address: finalAddress,
        latitude: mapCoords.lat,
        longitude: mapCoords.lon,
        isCurrentLocation: true,
        isDefault: true,
        role: role === "artisan" ? "artisan" : "customer",
      });

      // Update Redux location slice
      dispatch(
        setLocation({
          address: created.address,
          latitude: created.latitude,
          longitude: created.longitude,
          status: "success",
        })
      );

      // Reload addresses list
      const updatedList = await getSavedAddresses(role);
      setSavedAddresses(updatedList);
      setSelectedAddressId(created.id);

      // Trigger celebration step (screen-5)
      setCurrentStep("success");
      startCelebrationAnimation();
    } catch {
      Toast.show({
        type: "error",
        text1: "Error Saving",
        text2: "Could not save address. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const startCelebrationAnimation = () => {
    bounceAnim.setValue(0);
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Delete saved address
  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to remove this saved address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const nextList = await deleteAddress(id);
            setSavedAddresses(nextList);
            if (selectedAddressId === id) {
              const nextSelected = nextList[0];
              setSelectedAddressId(nextSelected ? nextSelected.id : null);
              if (nextSelected) {
                setMapCoords({
                  lat: nextSelected.latitude,
                  lon: nextSelected.longitude,
                });
                dispatch(
                  setLocation({
                    address: nextSelected.address,
                    latitude: nextSelected.latitude,
                    longitude: nextSelected.longitude,
                  })
                );
              }
            }
            Toast.show({
              type: "success",
              text1: "Address Deleted",
            });
          },
        },
      ]
    );
  };

  // Select an address card
  const handleSelectAddressCard = async (item: SavedAddress) => {
    setSelectedAddressId(item.id);
    setMapCoords({ lat: item.latitude, lon: item.longitude });
    await selectActiveAddress(item);

    dispatch(
      setLocation({
        address: item.address,
        latitude: item.latitude,
        longitude: item.longitude,
        status: "success",
      })
    );
  };

  // Confirm final address selection ("Finish Account Setup" / "Confirm Address")
  const handleFinishSetupOrConfirm = () => {
    const active = savedAddresses.find((a) => a.id === selectedAddressId);
    if (active) {
      onAddressConfirmed?.(active);
    }
    if (onClose) {
      onClose();
    }
  };

  // ==========================================
  // RENDER STEP 5: "You're All Set!" (screen-5)
  // ==========================================
  if (currentStep === "success") {
    return (
      <View style={styles.successContainer}>
        {/* Confetti & Celebration Glow Background */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={styles.confettiGlow} />
        </View>

        <Animated.View
          style={[
            styles.successContent,
            {
              transform: [
                {
                  scale: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1],
                  }),
                },
                {
                  translateY: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* 3D Joyful Character Illustration */}
          <View style={styles.characterContainer}>
            <Image
              source={images.addressSuccessCelebration}
              style={styles.characterImage}
              resizeMode="contain"
            />
          </View>

          {/* Heading & Subtitle */}
          <Text
            className="text-[30px] text-white text-center mb-2"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            You're All Set!
          </Text>

          <Text
            className="text-[14.5px] text-white/90 text-center px-6 leading-6 mb-8"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            {role === "artisan"
              ? "Your service address has been saved successfully. Start receiving nearby job leads and custom requests."
              : "Your delivery address has been saved successfully. Explore nearby verified artisans and book your first service."}
          </Text>
        </Animated.View>

        {/* Bottom CTA */}
        <View className="px-6 pb-8 pt-2">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              setCurrentStep("list");
            }}
            className="w-full bg-white py-4 rounded-full items-center justify-center shadow-lg"
          >
            <Text
              className="text-[#003B73] text-[16px]"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              View Saved Addresses
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ==========================================
  // RENDER STEP 0: Discover Banner (screen-01)
  // ==========================================
  if (currentStep === "discover") {
    return (
      <View style={styles.rootContainer}>
        {/* Top Half Satellite Map */}
        <InteractiveMapCanvas
          lat={mapCoords.lat}
          lon={mapCoords.lon}
          zoom={15}
          mapLayer="satellite"
          containerStyle={styles.topMapBanner}
          onPinMoved={handlePinMoved}
        />

        {/* Bottom Gradient Card */}
        <View style={styles.discoverBottomCard}>
          {showBackButton && (
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mb-4 border border-white/20"
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          <Text
            className="text-[28px] text-white leading-9 mb-1"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Discover What is
          </Text>
          <Text
            className="text-[28px] text-white leading-9 mb-6"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Available near you
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setCurrentStep("add")}
            className="flex-row items-center justify-between bg-white/20 border border-white/30 rounded-full py-3.5 px-4 mb-4"
          >
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-white items-center justify-center mr-3">
                <Ionicons name="location" size={20} color="#00A8E8" />
              </View>
              <Text
                className="text-white text-[15px]"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                {role === "artisan"
                  ? "Add Service Address"
                  : "Add Delivery Address"}
              </Text>
            </View>
            <View className="w-8 h-8 rounded-full bg-white/30 items-center justify-center">
              <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ============================================================
  // RENDER STEPS 1, 2, 4: MAP BACKGROUND + INTERACTIVE BOTTOM SHEET
  // ============================================================
  const isEmptyList = savedAddresses.length === 0;

  return (
    <View style={styles.rootContainer}>
      {/* 1. MAP BACKGROUND VIEWPORT (screen-1, 2, 4) */}
      <View style={styles.mapViewportContainer}>
        <InteractiveMapCanvas
          lat={mapCoords.lat}
          lon={mapCoords.lon}
          zoom={mapZoom}
          mapLayer={mapLayer}
          pinSize="lg"
          containerStyle={styles.interactiveMap}
          onPinMoved={handlePinMoved}
        >
          {/* Top Floating Controls on Map */}
          <View style={styles.mapFloatingBar}>
            {showBackButton && (
              <TouchableOpacity
                onPress={() => {
                  if (currentStep === "add" && savedAddresses.length > 0) {
                    setCurrentStep("list");
                  } else if (onClose) {
                    onClose();
                  }
                }}
                className="w-10 h-10 rounded-full bg-white/95 border border-[#D6ECFA] items-center justify-center shadow-sm"
              >
                <Feather name="arrow-left" size={20} color="#003B73" />
              </TouchableOpacity>
            )}

            <View className="flex-row items-center">
              {/* Satellite / Streets toggle */}
              <TouchableOpacity
                onPress={() => setMapLayer(getNextMapLayer(mapLayer))}
                className="bg-white/95 border border-[#D6ECFA] px-3 py-2 rounded-full flex-row items-center shadow-sm mr-2"
              >
                <Ionicons
                  name={mapLayer === "satellite" ? "earth" : "map-outline"}
                  size={15}
                  color="#00A8E8"
                />
                <Text
                  className="text-[11.5px] text-[#003B73] ml-1.5"
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  {mapLayer === "satellite" ? "Satellite" : "Streets"}
                </Text>
              </TouchableOpacity>

              {/* GPS Target button */}
              <TouchableOpacity
                onPress={handleUseCurrentLocation}
                className="w-10 h-10 rounded-full bg-white/95 border border-[#D6ECFA] items-center justify-center shadow-sm"
              >
                {isLocatingGps ? (
                  <ActivityIndicator size="small" color="#00A8E8" />
                ) : (
                  <Ionicons name="locate" size={20} color="#00A8E8" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </InteractiveMapCanvas>
      </View>

      {/* 2. BOTTOM SHEET CARD (screen-1, screen-2, screen-4) */}
      <View style={styles.bottomSheetCard}>
        {/* Sheet Top Drag Handle */}
        <View className="items-center pt-3 pb-2">
          <View className="w-12 h-1.5 rounded-full bg-[#D6ECFA]" />
        </View>

        {/* ======================================================== */}
        {/* SUB-VIEW A: ADD NEW ADDRESS (screen-2.jpeg)             */}
        {/* ======================================================== */}
        {currentStep === "add" ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.addScrollContent}
          >
            {/* Header with Back button and Title */}
            <View className="flex-row items-center justify-between mb-4">
              <TouchableOpacity
                onPress={() => {
                  if (savedAddresses.length > 0) {
                    setCurrentStep("list");
                  } else if (onClose) {
                    onClose();
                  }
                }}
                className="w-10 h-10 rounded-full bg-[#F4FAFF] border border-[#D6ECFA] items-center justify-center"
              >
                <Feather name="chevron-left" size={22} color="#003B73" />
              </TouchableOpacity>

              <Text
                className="text-[20px] text-[#003B73] text-center flex-1 mr-10"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                Add new address
              </Text>
            </View>

            {/* Label 1: Add Address Label */}
            <Text
              className="text-[14.5px] text-[#003B73] mb-1.5"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Add Address Label
            </Text>

            <TextInput
              value={addressLabel}
              onChangeText={setAddressLabel}
              placeholder="e.g. Wuye, Home, Office, Workshop"
              placeholderTextColor="#8AA8C4"
              className="bg-[#F4FAFF] border border-[#D6ECFA] rounded-full px-5 py-3.5 text-[14.5px] text-[#003B73] mb-2"
              style={{ fontFamily: "Poppins-Medium" }}
            />

            {/* Quick label pill chips */}
            <View className="flex-row flex-wrap mb-4">
              {QUICK_LABELS.map((label) => {
                const isSelected = addressLabel.toLowerCase() === label.toLowerCase();
                return (
                  <TouchableOpacity
                    key={label}
                    onPress={() => setAddressLabel(label)}
                    className={`px-3.5 py-1.5 rounded-full mr-2 mb-1.5 border ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "bg-white border-[#D6ECFA]"
                    }`}
                  >
                    <Text
                      className={`text-[12px] ${
                        isSelected ? "text-white" : "text-[#5B7C99]"
                      }`}
                      style={{
                        fontFamily: isSelected
                          ? "Poppins-SemiBold"
                          : "Poppins-Regular",
                      }}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Label 2: Enter Address (Search / Autocomplete) */}
            <Text
              className="text-[14.5px] text-[#003B73] mb-1.5"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Enter Address
            </Text>

            <View className="bg-[#F4FAFF] border border-[#D6ECFA] rounded-full px-4 py-1.5 flex-row items-center mb-3">
              <Ionicons name="search" size={18} color="#5B7C99" />
              <TextInput
                value={addressInput}
                onChangeText={handleAddressInputChange}
                placeholder="Search street, area or market..."
                placeholderTextColor="#8AA8C4"
                className="flex-1 ml-2 py-2 text-[14.5px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Regular" }}
              />
              {isSearching && (
                <ActivityIndicator
                  size="small"
                  color="#00A8E8"
                  style={{ marginRight: 4 }}
                />
              )}
              {addressInput.length > 0 && !isSearching && (
                <TouchableOpacity
                  onPress={() => {
                    setAddressInput("");
                    setSuggestions([]);
                  }}
                  className="p-1"
                >
                  <Ionicons name="close-circle" size={18} color="#8AA8C4" />
                </TouchableOpacity>
              )}
            </View>

            {/* Autocomplete Dropdown */}
            {suggestions.length > 0 && (
              <View className="bg-white border border-[#D6ECFA] rounded-2xl mb-4 overflow-hidden shadow-sm">
                {suggestions.map((item, index) => (
                  <TouchableOpacity
                    key={String(item.place_id || index)}
                    onPress={() => handleSelectSuggestion(item)}
                    className="p-3.5 border-b border-[#F0F6FA] flex-row items-center"
                  >
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color="#00A8E8"
                      style={{ marginRight: 10 }}
                    />
                    <View className="flex-1">
                      <Text
                        className="text-[13.5px] text-[#003B73]"
                        style={{ fontFamily: "Poppins-SemiBold" }}
                      >
                        {item.short_name || item.display_name.split(",")[0]}
                      </Text>
                      <Text
                        className="text-[11.5px] text-[#5B7C99]"
                        style={{ fontFamily: "Poppins-Regular" }}
                        numberOfLines={1}
                      >
                        {item.display_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* "Use Your Current Location" button row (screen-2 & 3) */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleUseCurrentLocation}
              className="flex-row items-center py-2.5 mb-4"
            >
              <View className="w-8 h-8 rounded-full bg-primary-50 border border-[#B8E2F8] items-center justify-center mr-3">
                <Ionicons name="navigate-circle" size={20} color="#00A8E8" />
              </View>
              <Text
                className="text-[15px] text-[#003B73]"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                Use Your Current Location
              </Text>
            </TouchableOpacity>

            {/* Selected Address Preview Card (screen-2.jpeg) */}
            {(selectedFullAddress || addressInput) && (
              <View className="bg-white border border-[#D6ECFA] rounded-2xl p-4 mb-5 shadow-sm flex-row items-start">
                <View className="w-8 h-8 rounded-full bg-primary-50 items-center justify-center mr-3 mt-0.5">
                  {isReverseGeocoding ? (
                    <ActivityIndicator size="small" color="#00A8E8" />
                  ) : (
                    <Ionicons name="location" size={18} color="#00A8E8" />
                  )}
                </View>
                <View className="flex-1">
                  <Text
                    className="text-[13px] text-[#003B73] leading-5"
                    style={{ fontFamily: "Poppins-Medium" }}
                  >
                    {selectedFullAddress || addressInput}
                  </Text>
                </View>
              </View>
            )}

            {/* Primary Action Button: "Save Address" */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSaveAddress}
              disabled={isSaving}
              className="w-full bg-primary py-4 rounded-full items-center justify-center shadow-md mb-6"
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text
                  className="text-white text-[16px]"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  Save Address
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        ) : isEmptyList ? (
          /* ======================================================== */
          /* SUB-VIEW B: EMPTY STATE (screen-1.jpeg)                   */
          /* ======================================================== */
          <View className="px-6 py-4 items-center">
            {/* Title */}
            <Text
              className="text-[22px] text-[#003B73] text-center mb-6"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              {sheetTitle}
            </Text>

            {/* Empty State Crossed Pin Icon */}
            <View className="w-24 h-24 rounded-full bg-[#F4FAFF] border border-[#DCEFFB] items-center justify-center mb-5">
              <MaterialCommunityIcons
                name="map-marker-off-outline"
                size={40}
                color="#8AA8C4"
              />
            </View>

            {/* Subheadings */}
            <Text
              className="text-[19px] text-[#003B73] text-center mb-2"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              No Saved Addresses
            </Text>
            <Text
              className="text-[13.5px] text-[#5B7C99] text-center px-4 leading-5 mb-8"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              {role === "artisan"
                ? "Save your work location to receive client booking requests and jobs in your operational zone."
                : "Save an address to enjoy faster checkout and seamless service booking."}
            </Text>

            {/* "+ Add New Address" outline button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setCurrentStep("add")}
              className="w-full border-2 border-[#00A8E8] rounded-full py-3.5 items-center justify-center flex-row mb-6 bg-white"
            >
              <Feather name="plus" size={18} color="#00A8E8" />
              <Text
                className="text-[#00A8E8] text-[15.5px] ml-2"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                Add New Address
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ======================================================== */
          /* SUB-VIEW C: SAVED ADDRESSES LIST (screen-4.jpeg)         */
          /* ======================================================== */
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listScrollContent}
          >
            {/* Title */}
            <Text
              className="text-[22px] text-[#003B73] text-center mb-4"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              {sheetTitle}
            </Text>

            {/* List of Saved Addresses */}
            {savedAddresses.map((item) => {
              const isSelected = item.id === selectedAddressId;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  onPress={() => handleSelectAddressCard(item)}
                  className={`bg-white rounded-2xl p-4 mb-3 border-2 ${
                    isSelected ? "border-[#00A8E8] bg-[#F4FAFF]" : "border-[#E5E7EB]"
                  } shadow-sm`}
                >
                  {/* Badges row: [Wuye] [Current location] */}
                  <View className="flex-row items-center mb-2.5">
                    <View className="bg-[#E5E7EB] px-3 py-1 rounded-full mr-2">
                      <Text
                        className="text-[12px] text-[#4B5563]"
                        style={{ fontFamily: "Poppins-Medium" }}
                      >
                        {item.label || "Address"}
                      </Text>
                    </View>

                    {item.isCurrentLocation && (
                      <View className="border border-[#00A8E8] px-3 py-1 rounded-full">
                        <Text
                          className="text-[11.5px] text-[#00A8E8]"
                          style={{ fontFamily: "Poppins-Medium" }}
                        >
                          Current location
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Full Address Text & Delete Icon */}
                  <View className="flex-row items-start justify-between">
                    <Text
                      className="text-[13.5px] text-[#003B73] leading-5 flex-1 pr-3"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      {item.address}
                    </Text>

                    <TouchableOpacity
                      onPress={() => handleDeleteAddress(item.id)}
                      className="p-1.5"
                    >
                      <Feather name="trash-2" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* "+ Add New Address" button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setCurrentStep("add")}
              className="w-full border-2 border-[#00A8E8] rounded-full py-3.5 items-center justify-center flex-row mb-4 bg-white"
            >
              <Feather name="plus" size={18} color="#00A8E8" />
              <Text
                className="text-[#00A8E8] text-[15.5px] ml-2"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                Add New Address
              </Text>
            </TouchableOpacity>

            {/* Bottom Primary Button: "Finish Account Setup" / "Confirm Address" */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleFinishSetupOrConfirm}
              className="w-full bg-primary py-4 rounded-full items-center justify-center shadow-md mb-6"
            >
              <Text
                className="text-white text-[16px]"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                {primaryButtonLabel || "Finish Account Setup"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#F4FAFF",
  },
  mapViewportContainer: {
    flex: 1,
    minHeight: SCREEN_HEIGHT * 0.38,
    position: "relative",
  },
  interactiveMap: {
    flex: 1,
    width: "100%",
    backgroundColor: "#12263A",
    overflow: "hidden",
  },
  mapFloatingBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  bottomSheetCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: SCREEN_HEIGHT * 0.65,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  addScrollContent: {
    paddingBottom: 24,
  },
  listScrollContent: {
    paddingBottom: 24,
  },
  // Screen-01 styles
  topMapBanner: {
    height: "55%",
    width: "100%",
  },
  discoverBottomCard: {
    flex: 1,
    backgroundColor: "#003B73",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    justifyContent: "center",
  },
  // Screen-5 celebration styles
  successContainer: {
    flex: 1,
    backgroundColor: "#003B73",
    justifyContent: "space-between",
  },
  confettiGlow: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  successContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  characterContainer: {
    width: 280,
    height: 320,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  characterImage: {
    width: "100%",
    height: "100%",
  },
});

