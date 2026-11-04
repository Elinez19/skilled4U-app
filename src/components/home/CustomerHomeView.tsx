import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
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
import { Artisan, ARTISANS } from "../../data/artisans";
import {
  Category,
  CUSTOMER_ONBOARDING_SERVICES,
  POPULAR_CATEGORIES,
} from "../../data/categories";
import { InteractiveMapCanvas } from "../location/InteractiveMapCanvas";
import {
  ArtisanQuickViewModal,
  BookingScheduleData,
  BookingSummaryModal,
  LiveTrackingModal,
  ScheduleBookingModal,
  TrackingData,
} from "../modals";

interface CustomerHomeViewProps {
  customerName?: string;
  locationTitle: string;
  coords: { lat: number; lon: number };
  onCoordsChange: (lat: number, lon: number) => void;
  onEditLocation: () => void;
  onCategoryPress: (category: Category) => void;
  onSwitchRole: (nextRole: "customer" | "artisan") => void;
}

const CUSTOMER_QUICK_ACTIONS = [
  {
    id: "book-service",
    label: "Book Pro",
    iconName: "hammer-wrench" as const,
    iconFamily: "MaterialCommunityIcons" as const,
  },
  {
    id: "my-bookings",
    label: "My Bookings",
    iconName: "calendar-check-outline" as const,
    iconFamily: "MaterialCommunityIcons" as const,
  },
  {
    id: "track-pro",
    label: "Live Track",
    iconName: "map-marker-path" as const,
    iconFamily: "MaterialCommunityIcons" as const,
  },
  {
    id: "wallet",
    label: "Wallet",
    iconName: "wallet-outline" as const,
    iconFamily: "Ionicons" as const,
  },
];

const MAP_PIN_POSITIONS = [
  { top: "24%", left: "26%" },
  { top: "22%", left: "62%" },
  { top: "42%", left: "48%" },
  { top: "58%", left: "22%" },
  { top: "54%", left: "72%" },
] as const;

const DEFAULT_ACTIVE_BOOKING: TrackingData = {
  id: "cb-1",
  artisanName: "Emeka Okafor",
  artisanTrade: "Master Plumber",
  service: "Plumbing Repair",
  avatar: images.artisanEmeka,
  status: "On the Way",
  etaMinutes: 12,
  securityCode: "4921",
  address: "12 Freedom Street, Abuja",
  price: "₦15,000",
};

export function CustomerHomeView({
  customerName = "Sarah Okafor",
  locationTitle,
  coords,
  onCoordsChange,
  onEditLocation,
  onCategoryPress,
  onSwitchRole,
}: CustomerHomeViewProps) {
  const [selectedServiceFilter, setSelectedServiceFilter] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [bookingArtisan, setBookingArtisan] = useState<Artisan | null>(null);
  const [bookingScheduleData, setBookingScheduleData] =
    useState<BookingScheduleData | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [mapZoom, setMapZoom] = useState(14);
  const [showAllArtisans, setShowAllArtisans] = useState(false);

  // Active tracking & hero banner toggle
  const [heroTab, setHeroTab] = useState<"active" | "instant">("active");
  const [activeBooking, setActiveBooking] =
    useState<TrackingData>(DEFAULT_ACTIVE_BOOKING);
  const [showLiveTrackingModal, setShowLiveTrackingModal] = useState(false);

  // Check saved customer bookings in storage for live active booking updates
  useEffect(() => {
    const loadActiveBooking = async () => {
      try {
        const raw = await AsyncStorage.getItem("skilled4u_bookings");
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list) && list.length > 0) {
            const active = list.find(
              (b: any) => b.status === "On the Way" || b.status === "Confirmed"
            );
            if (active) {
              setActiveBooking({
                id: active.id || "cb-1",
                artisanName: active.artisanName || "Emeka Okafor",
                artisanTrade: active.service
                  ? `${active.service} Specialist`
                  : "Master Plumber",
                service: active.service || "Plumbing Repair",
                avatar: images.artisanEmeka,
                status: active.status || "On the Way",
                etaMinutes: 12,
                securityCode: "4921",
                address: active.address || locationTitle || "Abuja, FCT",
                price: active.price || "₦15,000",
              });
            }
          }
        }
      } catch {
        // ignore storage errors
      }
    };
    loadActiveBooking();
  }, [locationTitle]);

  const firstName = customerName ? customerName.trim().split(" ")[0] : "Sarah";
  const featuredArtisan = ARTISANS[0]; // Emeka Okafor

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

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "book-service":
        if (onCategoryPress) {
          onCategoryPress({
            id: "all_services",
            title: "All Services",
            iconName: "grid-outline",
            iconFamily: "Ionicons",
            subServices: [
              "Plumbing Repair & Leak Fixing",
              "Electrical Wiring & Lighting",
              "Carpentry & Furniture",
              "Painting & Wall Screeding",
              "Home & Appliance Repair",
              "Cleaning & Fumigation",
              "AC Servicing & Maintenance",
              "Welding & Fabrication",
            ],
          });
        }
        break;
      case "my-bookings":
        router.push("/(tabs)/jobs");
        break;
      case "track-pro":
        setShowLiveTrackingModal(true);
        break;
      case "wallet":
        router.push("/(tabs)/market");
        break;
    }
  };

  return (
    <View className="flex-1">
      {/* ============================================================
          TOP ROLE SWITCHER BAR (Seamless Customer <-> Artisan Testing)
         ============================================================ */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center bg-primary-50 border border-[#B8E2F8] px-3 py-1 rounded-full">
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
          1. PERSONALIZED HEADER ("Hello, Sarah 👋" + Bell + Avatar)
          Mirrors the Artisan Home Screen aesthetic
         ============================================================ */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-1 pr-3">
          <Text
            className="text-[24px] text-[#003B73]"
            style={{ fontFamily: "Poppins-Bold", lineHeight: 32 }}
            numberOfLines={1}
          >
            Hello, {firstName} 👋
          </Text>
          <Text
            className="text-[14px] text-[#5B7C99] mt-0.5"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            What service do you need today?
          </Text>
        </View>

        <View className="flex-row items-center">
          {/* Notifications Icon with active badge */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              Toast.show({
                type: "info",
                text1: "Live Booking Update 🔔",
                text2: `${activeBooking.artisanName} is on the way to your location!`,
              })
            }
            className="w-10 h-10 rounded-full items-center justify-center mr-2 relative bg-white border border-[#D6ECFA]"
          >
            <Ionicons name="notifications-outline" size={21} color="#003B73" />
            <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00A8E8]" />
          </TouchableOpacity>

          {/* Profile Avatar */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/(tabs)/account")}
            style={styles.avatarShadow}
            className="w-11 h-11 rounded-full border-2 border-white bg-primary-50 overflow-hidden items-center justify-center"
          >
            <Ionicons name="person" size={22} color="#0077B6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ============================================================
          2. LOCATION SELECTOR & SEARCH BAR CARD
         ============================================================ */}
      <View className="mb-4">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onEditLocation}
          style={styles.cardShadow}
          className="bg-white rounded-2xl px-4 py-3 border border-[#DCEFFB] flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-9 h-9 rounded-full bg-primary-50 items-center justify-center mr-3 border border-[#D6ECFA]">
              <Ionicons name="location" size={19} color="#0099DF" />
            </View>
            <View className="flex-1">
              <Text
                className="text-[11px] text-[#5B7C99]"
                style={{ fontFamily: "Poppins-Medium" }}
              >
                Service Address
              </Text>
              <Text
                className="text-[14.5px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Bold" }}
                numberOfLines={1}
              >
                {locationTitle || "12 Freedom Street, Abuja"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowSearchInput((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-[#F0F9FF] border border-[#D6ECFA] items-center justify-center mr-1.5"
            >
              <Ionicons
                name={showSearchInput ? "close" : "search-outline"}
                size={16}
                color="#0099DF"
              />
            </TouchableOpacity>

            <View className="w-8 h-8 rounded-full bg-primary-50 border border-[#D6ECFA] items-center justify-center">
              <Ionicons name="chevron-forward" size={16} color="#0099DF" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Expandable Search Input */}
        {showSearchInput && (
          <View className="flex-row items-center bg-white border border-[#B8E2F8] rounded-full px-4 h-11 mt-2.5">
            <Ionicons name="search-outline" size={18} color="#0099DF" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search plumber, electrician, painter, ac..."
              placeholderTextColor="#8AA8C4"
              className="flex-1 ml-2 text-[13.5px] text-[#003B73] h-full"
              style={{ fontFamily: "Poppins-Regular" }}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color="#8AA8C4" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* ============================================================
          3. CUSTOMER HERO CARD (Parallels "Today's Opportunities")
          Matches exact gradient, glows, pins, and rounded styling
         ============================================================ */}
      <View
        style={styles.heroCardShadow}
        className="w-full rounded-[22px] bg-[#0099DF] p-5 mb-6 overflow-hidden relative border border-[#47C4FF]"
      >
        {/* Decorative Background Glows & Route Rings matching reference */}
        <View
          style={styles.heroCircleLarge}
          className="absolute rounded-full bg-[#24B8FA]/40"
        />
        <View
          style={styles.heroCircleSmall}
          className="absolute rounded-full bg-[#6BD4FF]/30"
        />
        <View
          style={styles.heroRouteWave}
          className="absolute rounded-full border-2 border-white/35"
        />
        <View
          style={styles.heroRouteWaveInner}
          className="absolute rounded-full border border-white/25"
        />

        {/* Right Side Map Pins Cluster Graphic */}
        <View style={styles.heroPinsCluster} pointerEvents="none">
          {/* White Pin with Blue Wrench Badge */}
          <View className="items-center mr-2 -mt-1">
            <View
              style={styles.pinShadow}
              className="w-10 h-10 rounded-full bg-white items-center justify-center"
            >
              <MaterialCommunityIcons
                name="shield-check"
                size={20}
                color="#0099DF"
              />
            </View>
            <View className="w-3 h-3 bg-white rotate-45 -mt-1.5" />
          </View>

          {/* Blue Pin with White Center */}
          <View className="items-center mt-2">
            <View
              style={styles.pinShadow}
              className="w-9 h-9 rounded-full bg-[#0082C8] border-2 border-white/90 items-center justify-center"
            >
              <View className="w-3 h-3 rounded-full bg-white" />
            </View>
            <View className="w-2.5 h-2.5 bg-[#0082C8] rotate-45 -mt-1" />
          </View>
        </View>

        {/* Top Switcher Tag: Active Booking vs Quick Dispatch */}
        <View className="flex-row items-center mb-2">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setHeroTab("active")}
            className={`px-3 py-1 rounded-full mr-2 flex-row items-center ${
              heroTab === "active" ? "bg-white/25" : "bg-transparent"
            }`}
          >
            <View className="w-2 h-2 rounded-full bg-[#10B981] mr-1.5" />
            <Text
              className="text-[11.5px] text-white"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Active Booking
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setHeroTab("instant")}
            className={`px-3 py-1 rounded-full flex-row items-center ${
              heroTab === "instant" ? "bg-white/25" : "bg-transparent"
            }`}
          >
            <Ionicons name="flash" size={11} color="#FFD166" />
            <Text
              className="text-[11.5px] text-white ml-1"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Instant Dispatch
            </Text>
          </TouchableOpacity>
        </View>

        {heroTab === "active" ? (
          <>
            {/* Active Service Content */}
            <Text
              className="text-[13.5px] text-white/90 mb-1"
              style={{ fontFamily: "Poppins-Medium" }}
            >
              {activeBooking.service} • {activeBooking.artisanName}
            </Text>

            <View className="flex-row items-baseline mb-3">
              <Text
                className="text-[34px] text-white mr-2"
                style={{ fontFamily: "Poppins-Bold", lineHeight: 40 }}
              >
                12 mins
              </Text>
              <Text
                className="text-[14px] text-white/95"
                style={{ fontFamily: "Poppins-Medium" }}
              >
                estimated arrival
              </Text>
            </View>

            {/* Bottom Row: Status Tag + "Track Live" Button */}
            <View className="flex-row items-center justify-between mt-1">
              <View className="flex-row items-center bg-white/20 px-3 py-1 rounded-full mr-3">
                <Ionicons name="navigate-circle" size={14} color="#FFFFFF" />
                <Text
                  className="text-[11.5px] text-white ml-1.5"
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  On the Way
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowLiveTrackingModal(true)}
                style={styles.viewBtnShadow}
                className="bg-primary border border-[#8CE0FF] px-6 py-2 rounded-full flex-row items-center"
              >
                <Text
                  className="text-[13.5px] text-white mr-1"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  Track Live
                </Text>
                <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Instant Dispatch / Pros Nearby Content */}
            <Text
              className="text-[15.5px] text-white mb-1.5"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Need an Artisan Now?
            </Text>

            <View className="flex-row items-baseline mb-3">
              <Text
                className="text-[36px] text-white mr-2"
                style={{ fontFamily: "Poppins-Bold", lineHeight: 42 }}
              >
                {displayedArtisans.length}
              </Text>
              <Text
                className="text-[14.5px] text-white/95"
                style={{ fontFamily: "Poppins-Medium" }}
              >
                verified pros near you
              </Text>
            </View>

            {/* Bottom Row: Guarantee Tag + "Book Pro" Button */}
            <View className="flex-row items-center justify-between mt-1">
              <View className="flex-row items-center bg-white/20 px-2.5 py-1 rounded-full mr-3">
                <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
                <Text
                  className="text-[11px] text-white ml-1"
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  Escrow Protected
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleQuickAction("book-service")}
                style={styles.viewBtnShadow}
                className="bg-primary border border-[#8CE0FF] px-6 py-2 rounded-full"
              >
                <Text
                  className="text-[13.5px] text-white"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  Book Pro
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* ============================================================
          4. QUICK ACTIONS (4 Cards: Book Pro, My Bookings, Live Track, Wallet)
          Matches Artisan Dashboard quick action styling
         ============================================================ */}
      <Text
        className="text-[17px] text-[#003B73] mb-3"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Quick Actions
      </Text>

      <View className="flex-row justify-between mb-6">
        {CUSTOMER_QUICK_ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => handleQuickAction(item.id)}
            style={[styles.quickActionCard, styles.cardShadow]}
            className="bg-white rounded-2xl py-3.5 px-1 items-center justify-center border border-[#DCEFFB]"
          >
            <View className="w-11 h-11 rounded-full bg-primary-50 items-center justify-center mb-2">
              {item.iconFamily === "MaterialCommunityIcons" ? (
                <MaterialCommunityIcons
                  name={item.iconName as any}
                  size={21}
                  color="#0099DF"
                />
              ) : (
                <Ionicons
                  name={item.iconName as any}
                  size={21}
                  color="#0099DF"
                />
              )}
            </View>
            <Text
              className="text-[11.5px] text-[#003B73] text-center"
              style={{ fontFamily: "Poppins-Medium" }}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ============================================================
          5. FEATURED ARTISAN SPOTLIGHT CARD
          Customer equivalent to Artisan's "Featured Job"
         ============================================================ */}
      <View className="flex-row items-center justify-between mb-3">
        <Text
          className="text-[17px] text-[#003B73]"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Featured Artisan
        </Text>
        <TouchableOpacity onPress={() => setSelectedArtisan(featuredArtisan)}>
          <Text
            className="text-[13px] text-[#00A8E8]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            View Details
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setSelectedArtisan(featuredArtisan)}
        style={styles.cardShadow}
        className="bg-white rounded-[22px] border border-[#DCEFFB] p-2.5 mb-6"
      >
        {/* Banner with Work Preview */}
        <View className="w-full h-36 rounded-2xl overflow-hidden mb-3 bg-primary-50 relative">
          <Image
            source={featuredArtisan.recentWork[0] || images.featuredSinkPipes}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Floating Rating Badge */}
          <View className="absolute top-2.5 left-2.5 bg-white/95 px-2.5 py-1 rounded-full flex-row items-center border border-[#D6ECFA]">
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text
              className="text-[12px] text-[#003B73] ml-1"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              {featuredArtisan.rating}
            </Text>
            <Text
              className="text-[11px] text-[#5B7C99] ml-1"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              ({featuredArtisan.reviews})
            </Text>
          </View>

          {/* Verified Badge */}
          <View className="absolute top-2.5 right-2.5 bg-[#E8F8F0] px-2.5 py-1 rounded-full flex-row items-center border border-[#B2F0D2]">
            <Ionicons name="checkmark-circle" size={12} color="#10B981" />
            <Text
              className="text-[11px] text-[#059669] ml-1"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Top Rated Pro
            </Text>
          </View>
        </View>

        {/* Content Details */}
        <View className="px-2 pb-1.5">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className="text-[17px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              {featuredArtisan.name}
            </Text>
            <Text
              className="text-[12.5px] text-[#0099DF]"
              style={{ fontFamily: "Poppins-Medium" }}
            >
              {featuredArtisan.trade}
            </Text>
          </View>

          <Text
            className="text-[12.5px] text-[#5B7C99] mb-3"
            style={{ fontFamily: "Poppins-Regular" }}
            numberOfLines={1}
          >
            {featuredArtisan.skills.join(" • ")}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text
                className="text-[14px] text-[#003B73]"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                {featuredArtisan.distance}
              </Text>
              <Text className="text-[14px] text-[#7A9BB8] mx-1.5">•</Text>
              <Text
                className="text-[15px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                From {featuredArtisan.hourlyRate}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setBookingArtisan(featuredArtisan);
              }}
              style={styles.bookBtnShadow}
              className="px-7 py-2.5 rounded-full bg-primary"
            >
              <Text
                className="text-[14px] text-white"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* ============================================================
          6. POPULAR SERVICE CATEGORIES
         ============================================================ */}
      <View className="flex-row items-center justify-between mb-3">
        <Text
          className="text-[17px] text-[#003B73]"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Popular Services
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleQuickAction("book-service")}
        >
          <Text
            className="text-[13px] text-[#00A8E8]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            See All ({CUSTOMER_ONBOARDING_SERVICES.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        className="mb-5"
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelectedServiceFilter("all")}
          className={`flex-row items-center px-3.5 py-2 rounded-full mr-2 border ${
            selectedServiceFilter === "all"
              ? "bg-primary border-primary"
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
            All Services
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
                  handleQuickAction("book-service");
                } else {
                  setSelectedServiceFilter(isSelected ? "all" : service.id);
                }
              }}
              className={`flex-row items-center px-3.5 py-2 rounded-full mr-2 border ${
                isSelected
                  ? "bg-primary border-primary"
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
      </ScrollView>

      {/* ============================================================
          7. INTERACTIVE ARTISAN RADAR (MAP DISCOVERY)
         ============================================================ */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Text
            className="text-[17px] text-[#003B73]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Live Artisan Radar
          </Text>
          <View className="ml-2 bg-[#E8F8F0] px-2 py-0.5 rounded-full border border-[#B2F0D2]">
            <Text
              className="text-[10px] text-[#059669]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              LIVE
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setMapZoom(14);
            onCoordsChange(9.0765, 7.4765);
            Toast.show({
              type: "info",
              text1: "Radar Refreshed",
              text2: `Tracking artisans active in ${locationTitle || "Abuja"}`,
            });
          }}
        >
          <Text
            className="text-[13px] text-[#00A8E8]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Recenter
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-6">
        <InteractiveMapCanvas
          lat={coords.lat}
          lon={coords.lon}
          zoom={mapZoom}
          mapLayer="streets"
          pinSize="md"
          defaultDimensions={{ width: 340, height: 215 }}
          onPinMoved={onCoordsChange}
          containerStyle={styles.mapContainer}
          renderOverlays={() => (
            <>
              {/* Surrounding Blue Artisan Pins on the Map */}
              {displayedArtisans.slice(0, 5).map((artisan, idx) => {
                const pos = MAP_PIN_POSITIONS[idx % MAP_PIN_POSITIONS.length];
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

              {/* Center Floating Pill Badge: "X nearby artisans" */}
              <View
                pointerEvents="none"
                style={[styles.centerCountBadge, styles.badgeShadow]}
                className="bg-white/95 px-4 py-1.5 rounded-full border border-[#B8E2F8] flex-row items-center"
              >
                <View className="w-2 h-2 rounded-full bg-primary mr-1.5" />
                <Text
                  className="text-[12px] text-[#003B73]"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {displayedArtisans.length} verified pros nearby
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
                    text1: "Location Centered",
                    text2: locationTitle || "Abuja, FCT",
                  });
                }}
                style={[styles.gpsButton, styles.badgeShadow]}
                className="w-10 h-10 rounded-full bg-white border border-[#DCEFFB] items-center justify-center"
              >
                <MaterialCommunityIcons
                  name="crosshairs-gps"
                  size={19}
                  color="#0099DF"
                />
              </TouchableOpacity>
            </>
          )}
        />
      </View>

      {/* ============================================================
          8. AVAILABLE ARTISANS NEAR YOU (LIST)
         ============================================================ */}
      <View className="flex-row items-center justify-between mb-3">
        <Text
          className="text-[17px] text-[#003B73]"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Available Artisans Near You
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowAllArtisans((prev) => !prev)}
        >
          <Text
            className="text-[13px] text-[#00A8E8]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            {showAllArtisans ? "Show Less" : "See All"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        {(showAllArtisans ? displayedArtisans : displayedArtisans.slice(0, 3)).map(
          (artisan) => (
            <TouchableOpacity
              key={artisan.id}
              activeOpacity={0.88}
              onPress={() => setSelectedArtisan(artisan)}
              style={styles.cardShadow}
              className="bg-white rounded-2xl p-3.5 mb-3 border border-[#DCEFFB] flex-row items-center"
            >
              {/* Artisan Portrait */}
              <View className="w-16 h-16 rounded-2xl overflow-hidden bg-primary-50 border border-[#D6ECFA]">
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
          )
        )}
      </View>

      {/* ============================================================
          CUSTOMER INTERACTION MODALS
          1. Artisan Quick View Sheet
          2. Schedule & Booking Slot Modal
          3. Order Summary & Escrow Payment Modal
          4. Live GPS Tracking Modal
         ============================================================ */}
      <ArtisanQuickViewModal
        visible={!!selectedArtisan}
        artisan={selectedArtisan}
        isFavorite={
          selectedArtisan ? favoriteIds.includes(selectedArtisan.id) : false
        }
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedArtisan(null)}
        onBookNow={(artisan) => {
          setSelectedArtisan(null);
          setBookingArtisan(artisan);
        }}
        onSendMessage={(artisan) => {
          setSelectedArtisan(null);
          router.push({
            pathname: "/(tabs)/support",
            params: { artisanName: artisan.name, artisanTrade: artisan.trade },
          });
        }}
      />

      <ScheduleBookingModal
        visible={!!bookingArtisan}
        artisan={bookingArtisan}
        defaultAddress={locationTitle}
        onClose={() => setBookingArtisan(null)}
        onProceedToSummary={(data) => {
          setBookingArtisan(null);
          setBookingScheduleData(data);
        }}
      />

      <BookingSummaryModal
        visible={!!bookingScheduleData}
        data={bookingScheduleData}
        onClose={() => setBookingScheduleData(null)}
        onBookingConfirmed={() => {
          setBookingScheduleData(null);
          router.push("/(tabs)/jobs");
        }}
      />

      <LiveTrackingModal
        visible={showLiveTrackingModal}
        data={activeBooking}
        onClose={() => setShowLiveTrackingModal(false)}
        onCallArtisan={(name) => {
          Toast.show({
            type: "info",
            text1: "Calling Artisan",
            text2: `Connecting to ${name} (+234 812 345 6789)...`,
          });
        }}
        onChatArtisan={(name) => {
          setShowLiveTrackingModal(false);
          router.push({
            pathname: "/(tabs)/support",
            params: {
              artisanName: name,
              artisanTrade: activeBooking.artisanTrade,
            },
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filterScroll: {
    paddingRight: 8,
  },
  avatarShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  heroCardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#0088CC",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  heroCircleLarge: {
    width: 170,
    height: 170,
    top: -45,
    right: -35,
  },
  heroCircleSmall: {
    width: 90,
    height: 90,
    bottom: -25,
    right: 65,
  },
  heroRouteWave: {
    width: 150,
    height: 110,
    right: -25,
    bottom: -30,
    transform: [{ rotate: "-18deg" }],
  },
  heroRouteWaveInner: {
    width: 120,
    height: 85,
    right: -15,
    bottom: -20,
    transform: [{ rotate: "-18deg" }],
  },
  heroPinsCluster: {
    position: "absolute",
    top: 16,
    right: 18,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  pinShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  viewBtnShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#002B54",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  quickActionCard: {
    width: "23.5%",
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
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  mapContainer: {
    width: "100%",
    height: 215,
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
    bottom: 12,
    right: 12,
    zIndex: 15,
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
});
