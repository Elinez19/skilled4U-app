import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { InteractiveMapCanvas } from "../../components/location/InteractiveMapCanvas";
import {
  CancelBookingModal,
  JobCompletionModal,
  JobStatusActionModal,
} from "../../components/modals";
import { images } from "../../constants/images";

type BookingStatusTab = "Upcoming" | "Completed" | "Cancelled";

interface CustomerBookingItem {
  id: string;
  service: string;
  artisanName: string;
  dateTime: string;
  price: string;
  status: "On the Way" | "Confirmed" | "Pending" | "Completed" | "Cancelled";
  avatar: ImageSourcePropType;
  address: string;
  tab: BookingStatusTab;
}

interface ArtisanBookingItem {
  id: string;
  title: string;
  clientName: string;
  distance: string;
  dateTime: string;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  image: ImageSourcePropType;
  tab: BookingStatusTab;
}

const INITIAL_CUSTOMER_BOOKINGS: CustomerBookingItem[] = [
  {
    id: "cb-1",
    service: "Plumbing",
    artisanName: "Emeka Okafor",
    dateTime: "Wed, 14 May 2025 • 11:00 AM",
    price: "₦15,000",
    status: "On the Way",
    avatar: images.artisanEmeka,
    address: "12 Freedom Street, Abuja",
    tab: "Upcoming",
  },
  {
    id: "cb-2",
    service: "Electrical",
    artisanName: "Aisha Yusuf",
    dateTime: "Fri, 16 May 2025 • 2:00 PM",
    price: "₦12,000",
    status: "Confirmed",
    avatar: images.artisanAisha,
    address: "12 Freedom Street, Abuja",
    tab: "Upcoming",
  },
  {
    id: "cb-3",
    service: "Carpentry",
    artisanName: "Tunde Bello",
    dateTime: "Mon, 19 May 2025 • 10:00 AM",
    price: "₦20,000",
    status: "Pending",
    avatar: images.artisanTunde,
    address: "12 Freedom Street, Abuja",
    tab: "Upcoming",
  },
  {
    id: "cb-4",
    service: "Plumbing",
    artisanName: "Emeka Okafor",
    dateTime: "Sun, 4 May 2025 • 10:00 AM",
    price: "₦15,000",
    status: "Completed",
    avatar: images.artisanEmeka,
    address: "12 Freedom Street, Abuja",
    tab: "Completed",
  },
  {
    id: "cb-5",
    service: "AC Servicing",
    artisanName: "Samson Adekunle",
    dateTime: "Thu, 1 May 2025 • 3:00 PM",
    price: "₦14,000",
    status: "Cancelled",
    avatar: images.acRepairWork,
    address: "12 Freedom Street, Abuja",
    tab: "Cancelled",
  },
];

const ARTISAN_BOOKINGS: ArtisanBookingItem[] = [
  {
    id: "ab-1",
    title: "Fix leaking kitchen sink",
    clientName: "Aisha Bello",
    distance: "2.3 km",
    dateTime: "May 14, 2025 • 10:00 AM",
    status: "Confirmed",
    image: images.jobSinkRepair,
    tab: "Upcoming",
  },
  {
    id: "ab-2",
    title: "Install ceiling fan",
    clientName: "John Musa",
    distance: "1.8 km",
    dateTime: "May 16, 2025 • 2:00 PM",
    status: "Confirmed",
    image: images.featuredSinkPipes,
    tab: "Upcoming",
  },
  {
    id: "ab-3",
    title: "Electrical wiring repair",
    clientName: "Grace Uche",
    distance: "3.1 km",
    dateTime: "May 18, 2025 • 11:00 AM",
    status: "Pending",
    image: images.electricianWork1,
    tab: "Upcoming",
  },
  {
    id: "ab-4",
    title: "Bathroom pipe replacement",
    clientName: "Chinedu Okafor",
    distance: "1.5 km",
    dateTime: "May 9, 2025 • 1:00 PM",
    status: "Completed",
    image: images.plumberWork1,
    tab: "Completed",
  },
  {
    id: "ab-5",
    title: "Water heater check",
    clientName: "Ngozi Okafor",
    distance: "3.4 km",
    dateTime: "May 3, 2025 • 4:00 PM",
    status: "Cancelled",
    image: images.plumberWork2,
    tab: "Cancelled",
  },
];

const TRACKING_STEPS = ["Booked", "On the Way", "In Progress", "Completed"];

export default function BookingsScreen() {
  const params = useLocalSearchParams<{ view?: string }>();
  const [role, setRole] = useState<"customer" | "artisan">("customer");
  const [activeTab, setActiveTab] = useState<BookingStatusTab>("Upcoming");
  const [customerBookings, setCustomerBookings] = useState<
    CustomerBookingItem[]
  >(INITIAL_CUSTOMER_BOOKINGS);

  // Sub-modals for Customer flow: Track Your Booking & Service Completed Rating
  const [trackingBooking, setTrackingBooking] =
    useState<CustomerBookingItem | null>(null);
  const [trackingStepIndex, setTrackingStepIndex] = useState(1);
  const [completedBookingForRating, setCompletedBookingForRating] =
    useState<CustomerBookingItem | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [mapCoords, setMapCoords] = useState({ lat: 9.0765, lon: 7.4765 });

  // Artisan Job Interaction Modals
  const [artisanBookingsList, setArtisanBookingsList] =
    useState<ArtisanBookingItem[]>(ARTISAN_BOOKINGS);
  const [selectedArtisanJobForAction, setSelectedArtisanJobForAction] =
    useState<ArtisanBookingItem | null>(null);
  const [completingArtisanJob, setCompletingArtisanJob] =
    useState<ArtisanBookingItem | null>(null);

  // Cancellation Modal State
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(
    null
  );
  const [cancellingArtisanName, setCancellingArtisanName] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      const loadBookingContext = async () => {
        try {
          const draftRaw = await AsyncStorage.getItem("skilled4u_user_draft");
          if (draftRaw) {
            const draft = JSON.parse(draftRaw);
            if (draft.role === "artisan" || draft.role === "customer") {
              setRole(draft.role);
            }
          }

          const savedRaw = await AsyncStorage.getItem("skilled4u_bookings");
          if (savedRaw) {
            const parsed = JSON.parse(savedRaw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const mapped: CustomerBookingItem[] = parsed.map(
                (b: any, idx: number) => ({
                  id: b.id || `custom-${idx}`,
                  service: b.service || "Plumbing",
                  artisanName: b.artisanName || "Emeka Okafor",
                  dateTime: b.dateTime || "Wed, 14 May 2025 • 11:00 AM",
                  price: b.price || "₦15,000",
                  status: b.status || "On the Way",
                  avatar: images.artisanEmeka,
                  address: b.address || "12 Freedom Street, Abuja",
                  tab: "Upcoming",
                })
              );
              const merged = [...mapped, ...INITIAL_CUSTOMER_BOOKINGS];
              setCustomerBookings(merged);
              if (params.view === "tracking") {
                setTrackingBooking(merged[0]);
              }
              return;
            }
          }

          if (params.view === "tracking") {
            setTrackingBooking(INITIAL_CUSTOMER_BOOKINGS[0]);
          }
        } catch {
          // ignore
        }
      };
      loadBookingContext();
    }, [params.view])
  );

  const renderStatusPill = (status: string) => {
    if (status === "On the Way") {
      return (
        <View className="flex-row items-center bg-[#E1F4FF] border border-[#B8E2F8] px-3 py-1 rounded-full">
          <Ionicons name="navigate" size={11} color="#0099DF" />
          <Text
            className="text-[11px] text-[#0082C8] ml-1"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            On the Way
          </Text>
        </View>
      );
    }
    if (status === "Confirmed" || status === "Completed") {
      return (
        <View className="flex-row items-center bg-[#E8F8F0] border border-[#B2F0D2] px-3 py-1 rounded-full">
          <Ionicons name="checkmark-circle" size={12} color="#10B981" />
          <Text
            className="text-[11px] text-[#059669] ml-1"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            {status}
          </Text>
        </View>
      );
    }
    if (status === "Pending") {
      return (
        <View className="flex-row items-center bg-[#FEF3C7] border border-[#FDE68A] px-3 py-1 rounded-full">
          <Ionicons name="star" size={11} color="#D97706" />
          <Text
            className="text-[11px] text-[#B45309] ml-1"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Pending
          </Text>
        </View>
      );
    }
    return (
      <View className="flex-row items-center bg-[#FEE2E2] border border-[#FECACA] px-3 py-1 rounded-full">
        <Ionicons name="close-circle" size={12} color="#EF4444" />
        <Text
          className="text-[11px] text-[#DC2626] ml-1"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Cancelled
        </Text>
      </View>
    );
  };

  const filteredCustomerBookings = customerBookings.filter(
    (b) => b.tab === activeTab
  );
  const filteredArtisanBookings = artisanBookingsList.filter(
    (b) => b.tab === activeTab
  );

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
            My Bookings
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            setRole((prev) => (prev === "customer" ? "artisan" : "customer"))
          }
          className="flex-row items-center bg-white border border-[#D6ECFA] px-3 py-1.5 rounded-full"
        >
          <Ionicons name="swap-horizontal" size={13} color="#00A8E8" />
          <Text
            className="text-[11px] text-[#003B73] ml-1"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            {role === "artisan" ? "Artisan View" : "Customer View"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3 Tab Pills: Upcoming | Completed | Cancelled */}
      <View className="flex-row justify-between px-5 mb-4">
        {(["Upcoming", "Completed", "Cancelled"] as BookingStatusTab[]).map(
          (tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.85}
                onPress={() => setActiveTab(tab)}
                style={styles.tabPill}
                className={`py-2.5 rounded-full items-center justify-center border ${
                  isActive
                    ? "bg-primary border-primary"
                    : "bg-[#E9F5FD] border-[#D0E8F8]"
                }`}
              >
                <Text
                  className={`text-[13px] ${
                    isActive ? "text-white" : "text-[#5B7C99]"
                  }`}
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {role === "artisan" ? (
          /* ============================================================
             ARTISAN MY BOOKINGS VIEW
             Matches skilled4-Artisan-Bookings-Screen.png
             ============================================================ */
          filteredArtisanBookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              activeOpacity={0.88}
              onPress={() => {
                if (
                  booking.status === "Completed" ||
                  booking.status === "Cancelled"
                ) {
                  Toast.show({
                    type: "info",
                    text1: booking.title,
                    text2: `Status: ${booking.status} • Client: ${booking.clientName}`,
                  });
                } else {
                  setSelectedArtisanJobForAction(booking);
                }
              }}
              style={styles.cardShadow}
              className="bg-white rounded-2xl p-3.5 mb-3.5 border border-[#DCEFFB] flex-row items-center"
            >
              <Image
                source={booking.image}
                className="w-20 h-20 rounded-xl bg-primary-50"
                resizeMode="cover"
              />

              <View className="flex-1 ml-3.5">
                <Text
                  className="text-[15px] text-[#003B73] mb-0.5"
                  style={{ fontFamily: "Poppins-Bold" }}
                  numberOfLines={1}
                >
                  {booking.title}
                </Text>

                <Text
                  className="text-[12.5px] text-[#5B7C99] mb-1.5"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  {booking.clientName} • {booking.distance}
                </Text>

                <View className="flex-row items-center mb-2">
                  <Ionicons name="calendar" size={13} color="#0099DF" />
                  <Text
                    className="text-[12px] text-[#003B73] ml-1.5"
                    style={{ fontFamily: "Poppins-Medium" }}
                  >
                    {booking.dateTime}
                  </Text>
                </View>

                <View className="flex-row justify-end">
                  {renderStatusPill(booking.status)}
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          /* ============================================================
             CUSTOMER MY BOOKINGS VIEW
             Matches skilled4-customer-bookings-screen-2.png
             ============================================================ */
          filteredCustomerBookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              activeOpacity={0.88}
              onPress={() => {
                if (booking.status === "Completed") {
                  setCompletedBookingForRating(booking);
                } else {
                  setTrackingBooking(booking);
                  setTrackingStepIndex(booking.status === "On the Way" ? 1 : 0);
                }
              }}
              style={styles.cardShadow}
              className="bg-white rounded-2xl p-4 mb-3.5 border border-[#DCEFFB] flex-row items-center"
            >
              <View className="w-15 h-15 rounded-full overflow-hidden bg-primary-50 border border-[#B8E2F8]">
                <Image
                  source={booking.avatar}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <View className="flex-1 ml-3.5">
                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-[15.5px] text-[#003B73]"
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    {booking.service}
                  </Text>
                  <Ionicons name="location" size={15} color="#38BDF8" />
                </View>

                <Text
                  className="text-[13px] text-[#5B7C99] mb-1"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  {booking.artisanName}
                </Text>

                <Text
                  className="text-[12px] text-[#5B7C99] mb-2.5"
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  {booking.dateTime}
                </Text>

                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-[15.5px] text-[#003B73]"
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    {booking.price}
                  </Text>

                  {renderStatusPill(booking.status)}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* ============================================================
          MODAL 1: TRACK YOUR BOOKING
          Matches skilled4-customer-tracking-bookings-screen-1.png
         ============================================================ */}
      <Modal
        visible={!!trackingBooking}
        animationType="slide"
        onRequestClose={() => setTrackingBooking(null)}
      >
        <SafeAreaView style={styles.safeArea}>
          <Image
            source={images.onboardingBg}
            style={styles.bgOverlay}
            resizeMode="cover"
          />

          {trackingBooking && (
            <View className="flex-1">
              {/* Top Bar */}
              <View className="flex-row items-center px-5 pt-2 pb-3">
                <TouchableOpacity
                  onPress={() => setTrackingBooking(null)}
                  className="w-10 h-10 rounded-full bg-white border border-[#D6ECFA] items-center justify-center mr-3"
                >
                  <Ionicons name="arrow-back" size={20} color="#003B73" />
                </TouchableOpacity>
                <Text
                  className="text-[20px] text-[#003B73]"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  Track Your Booking
                </Text>
              </View>

              <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Artisan Header Card with Call & Chat Buttons */}
                <View
                  style={styles.cardShadow}
                  className="bg-white rounded-2xl p-3.5 mb-4 border border-[#DCEFFB] flex-row items-center justify-between"
                >
                  <View className="flex-row items-center flex-1 mr-2">
                    <View className="w-13 h-13 rounded-full overflow-hidden bg-primary-50 border border-[#B8E2F8]">
                      <Image
                        source={trackingBooking.avatar}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="ml-3">
                      <Text
                        className="text-[15.5px] text-[#003B73]"
                        style={{ fontFamily: "Poppins-Bold" }}
                      >
                        {trackingBooking.artisanName}
                      </Text>
                      <Text
                        className="text-[12.5px] text-[#5B7C99]"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        {trackingBooking.service === "Plumbing"
                          ? "Plumber"
                          : trackingBooking.service}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() =>
                        Toast.show({
                          type: "info",
                          text1: `Calling ${trackingBooking.artisanName}...`,
                          text2: "+234 812 345 6789",
                        })
                      }
                      className="w-10 h-10 rounded-full bg-[#F0F9FF] border border-[#D6ECFA] items-center justify-center mr-2.5"
                    >
                      <Ionicons name="call" size={18} color="#0099DF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setTrackingBooking(null);
                        router.push("/(tabs)/support");
                      }}
                      className="w-10 h-10 rounded-full bg-[#F0F9FF] border border-[#D6ECFA] items-center justify-center"
                    >
                      <Ionicons
                        name="chatbubble-ellipses"
                        size={18}
                        color="#0099DF"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* On the Way Map & ETA Card */}
                <View
                  style={styles.cardShadow}
                  className="bg-white rounded-3xl p-4 mb-4 border border-[#DCEFFB]"
                >
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-full bg-[#E1F4FF] items-center justify-center mr-3">
                      <Ionicons name="navigate" size={20} color="#0099DF" />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-[16px] text-[#003B73]"
                        style={{ fontFamily: "Poppins-Bold" }}
                      >
                        {TRACKING_STEPS[trackingStepIndex]}
                      </Text>
                      <Text
                        className="text-[12.5px] text-[#5B7C99]"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        {
                          trackingBooking.artisanName.split(" ")[0]
                        }{" "}
                        is on his way to your location.
                      </Text>
                    </View>
                  </View>

                  {/* Live Tracking Map */}
                  <InteractiveMapCanvas
                    lat={mapCoords.lat}
                    lon={mapCoords.lon}
                    zoom={14}
                    mapLayer="streets"
                    pinSize="md"
                    defaultDimensions={{ width: 320, height: 175 }}
                    onPinMoved={(lat, lon) => setMapCoords({ lat, lon })}
                    containerStyle={styles.trackingMap}
                    renderOverlays={() => (
                      <>
                        {/* Simulated Route Line & Artisan Vehicle Badge */}
                        <View
                          pointerEvents="none"
                          style={styles.routeLineSegment}
                        />
                        <View
                          pointerEvents="none"
                          style={styles.artisanVehicleBadge}
                          className="w-9 h-9 rounded-xl bg-[#0077B6] border-2 border-white items-center justify-center"
                        >
                          <Ionicons name="car" size={18} color="#FFFFFF" />
                        </View>
                      </>
                    )}
                  />

                  {/* ETA & Distance Bar */}
                  <View className="flex-row items-center justify-between pt-3.5 px-1">
                    <View>
                      <Text
                        className="text-[12px] text-[#5B7C99]"
                        style={{ fontFamily: "Poppins-Medium" }}
                      >
                        ETA
                      </Text>
                      <Text
                        className="text-[20px] text-[#003B73]"
                        style={{ fontFamily: "Poppins-Bold" }}
                      >
                        12 <Text className="text-[14px]">mins</Text>
                      </Text>
                    </View>

                    <Text
                      className="text-[14px] text-[#003B73]"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      2.3 km
                    </Text>
                  </View>
                </View>

                {/* Service Details Card */}
                <View
                  style={styles.cardShadow}
                  className="bg-white rounded-2xl p-4 mb-5 border border-[#DCEFFB]"
                >
                  <Text
                    className="text-[14.5px] text-[#003B73] mb-3"
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    Service Details
                  </Text>

                  <View className="flex-row items-center mb-2">
                    <Ionicons name="water-outline" size={16} color="#0099DF" />
                    <Text
                      className="text-[13px] text-[#003B73] ml-2.5"
                      style={{ fontFamily: "Poppins-Medium" }}
                    >
                      Leak Repair
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color="#0099DF"
                    />
                    <Text
                      className="text-[13px] text-[#003B73] ml-2.5"
                      style={{ fontFamily: "Poppins-Medium" }}
                    >
                      {trackingBooking.address}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-4">
                    <Ionicons name="time-outline" size={16} color="#0099DF" />
                    <Text
                      className="text-[13px] text-[#5B7C99] ml-2.5"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      {trackingBooking.dateTime}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                      const finished = trackingBooking;
                      setTrackingBooking(null);
                      setCompletedBookingForRating(finished);
                    }}
                    className="w-full py-2.5 rounded-full bg-[#F0F9FF] border border-[#C6E6FC] items-center"
                  >
                    <Text
                      className="text-[13px] text-[#0099DF]"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      Mark Completed & Rate Service
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 4-Step Progress Stepper: Booked -> On the Way -> In Progress -> Completed */}
                <View className="px-2 pt-1 pb-4">
                  <View className="flex-row items-center justify-between">
                    {TRACKING_STEPS.map((stepLabel, idx) => {
                      const isDone = idx <= trackingStepIndex;
                      return (
                        <React.Fragment key={stepLabel}>
                          <TouchableOpacity
                            onPress={() => {
                              setTrackingStepIndex(idx);
                              if (idx === 3) {
                                const finished = trackingBooking;
                                setTrackingBooking(null);
                                setCompletedBookingForRating(finished);
                              }
                            }}
                            className="items-center"
                          >
                            <View
                              className={`w-4 h-4 rounded-full items-center justify-center ${
                                isDone ? "bg-primary" : "bg-[#CBD5E1]"
                              }`}
                            >
                              {isDone && (
                                <View className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </View>
                          </TouchableOpacity>

                          {idx < TRACKING_STEPS.length - 1 && (
                            <View
                              className={`flex-1 h-1 mx-1 rounded-full ${
                                idx < trackingStepIndex
                                  ? "bg-primary"
                                  : "bg-[#DCEFFB]"
                              }`}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </View>

                  <View className="flex-row items-center justify-between mt-2">
                    {TRACKING_STEPS.map((stepLabel, idx) => {
                      const isCurrent = idx === trackingStepIndex;
                      return (
                        <Text
                          key={stepLabel}
                          className={`text-[11px] ${
                            isCurrent ? "text-[#00A8E8]" : "text-[#64748B]"
                          }`}
                          style={{
                            fontFamily: isCurrent
                              ? "Poppins-SemiBold"
                              : "Poppins-Regular",
                          }}
                        >
                          {stepLabel}
                        </Text>
                      );
                    })}
                  </View>

                  {/* Cancel Booking Action Trigger */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setCancellingBookingId(trackingBooking.id);
                      setCancellingArtisanName(trackingBooking.artisanName);
                    }}
                    className="items-center py-3 mt-4"
                  >
                    <Text
                      className="text-[12.5px] text-[#EF4444]"
                      style={{ fontFamily: "Poppins-Medium" }}
                    >
                      Cancel this Booking
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* ============================================================
          MODAL 2: SERVICE COMPLETED! & 5-STAR REVIEW
          Matches skilled4-customer-rating-screen-1.png
         ============================================================ */}
      <Modal
        visible={!!completedBookingForRating}
        animationType="slide"
        onRequestClose={() => setCompletedBookingForRating(null)}
      >
        <SafeAreaView style={styles.safeArea}>
          <Image
            source={images.onboardingBg}
            style={styles.bgOverlay}
            resizeMode="cover"
          />

          {completedBookingForRating && (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Top Back Button */}
              <View className="pt-2 mb-2">
                <TouchableOpacity
                  onPress={() => setCompletedBookingForRating(null)}
                  className="w-10 h-10 rounded-full bg-white border border-[#D6ECFA] items-center justify-center"
                >
                  <Ionicons name="arrow-back" size={20} color="#003B73" />
                </TouchableOpacity>
              </View>

              {/* Glowing Checkmark Pin Illustration */}
              <View className="items-center justify-center my-3 relative">
                <View className="w-28 h-28 rounded-full bg-[#E1F4FF] items-center justify-center">
                  <View
                    style={styles.confirmBtnShadow}
                    className="w-20 h-20 rounded-full bg-primary border-4 border-[#6BD4FF] items-center justify-center"
                  >
                    <Ionicons name="checkmark" size={42} color="#FFFFFF" />
                  </View>
                </View>
                <View className="w-5 h-5 bg-primary rotate-45 -mt-3.5" />
              </View>

              <Text
                className="text-[24px] text-[#003B73] text-center mb-1.5"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                Service Completed!
              </Text>
              <Text
                className="text-[13.5px] text-[#5B7C99] text-center px-6 mb-5"
                style={{ fontFamily: "Poppins-Regular", lineHeight: 20 }}
              >
                Your booking with {completedBookingForRating.artisanName} has
                been successfully completed.
              </Text>

              {/* Summary Receipt Card */}
              <View
                style={styles.cardShadow}
                className="bg-white rounded-2xl p-4 mb-4 border border-[#DCEFFB]"
              >
                {/* Artisan Row */}
                <View className="flex-row items-center pb-3.5 mb-3.5 border-b border-[#EDF6FC]">
                  <Image
                    source={completedBookingForRating.avatar}
                    className="w-11 h-11 rounded-full bg-primary-50"
                    resizeMode="cover"
                  />
                  <View className="ml-3">
                    <Text
                      className="text-[11.5px] text-[#5B7C99]"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      {completedBookingForRating.service === "Plumbing"
                        ? "Plumber"
                        : completedBookingForRating.service}
                    </Text>
                    <Text
                      className="text-[14.5px] text-[#003B73]"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      {completedBookingForRating.artisanName}
                    </Text>
                  </View>
                </View>

                {/* Date & Time */}
                <View className="flex-row items-center pb-3.5 mb-3.5 border-b border-[#EDF6FC]">
                  <View className="w-10 h-10 rounded-full bg-[#F0F9FF] items-center justify-center mr-3">
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#003B73"
                    />
                  </View>
                  <View>
                    <Text
                      className="text-[11.5px] text-[#5B7C99]"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      Date & Time
                    </Text>
                    <Text
                      className="text-[13.5px] text-[#003B73]"
                      style={{ fontFamily: "Poppins-Medium" }}
                    >
                      {completedBookingForRating.dateTime}
                    </Text>
                  </View>
                </View>

                {/* Location */}
                <View className="flex-row items-center pb-3.5 mb-3.5 border-b border-[#EDF6FC]">
                  <View className="w-10 h-10 rounded-full bg-[#F0F9FF] items-center justify-center mr-3">
                    <Ionicons name="location" size={18} color="#0099DF" />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-[11.5px] text-[#5B7C99]"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      Location
                    </Text>
                    <Text
                      className="text-[13.5px] text-[#003B73]"
                      style={{ fontFamily: "Poppins-Medium" }}
                    >
                      {completedBookingForRating.address}
                    </Text>
                  </View>
                </View>

                {/* Amount Paid */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-[#F0F9FF] items-center justify-center mr-3">
                      <MaterialCommunityIcons
                        name="cash-check"
                        size={18}
                        color="#003B73"
                      />
                    </View>
                    <View>
                      <Text
                        className="text-[11.5px] text-[#5B7C99]"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        Amount Paid
                      </Text>
                      <Text
                        className="text-[16px] text-[#003B73]"
                        style={{ fontFamily: "Poppins-Bold" }}
                      >
                        {completedBookingForRating.price}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      Toast.show({
                        type: "info",
                        text1: "Receipt Downloaded",
                        text2: `Paid ${completedBookingForRating.price} to ${completedBookingForRating.artisanName}`,
                      })
                    }
                  >
                    <Text
                      className="text-[12.5px] text-[#00A8E8]"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      View Receipt
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Star Rating Card */}
              <View
                style={styles.cardShadow}
                className="bg-white rounded-2xl p-5 border border-[#DCEFFB] items-center"
              >
                <Text
                  className="text-[14.5px] text-[#003B73] mb-3"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  How was your experience?
                </Text>

                <View className="flex-row items-center justify-center mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRatingStars(star)}
                      className="mx-1.5"
                    >
                      <Ionicons
                        name={star <= ratingStars ? "star" : "star-outline"}
                        size={30}
                        color="#00A8E8"
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    setCompletedBookingForRating(null);
                    Toast.show({
                      type: "success",
                      text1: "Thank you for your review!",
                      text2: `You rated ${completedBookingForRating.artisanName} ${ratingStars} stars.`,
                    });
                  }}
                  style={styles.confirmBtnShadow}
                  className="w-full bg-primary py-3.5 rounded-full items-center mb-3"
                >
                  <Text
                    className="text-[15px] text-white"
                    style={{ fontFamily: "Poppins-SemiBold" }}
                  >
                    Submit Review
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setCompletedBookingForRating(null)}
                >
                  <Text
                    className="text-[13.5px] text-[#5B7C99]"
                    style={{ fontFamily: "Poppins-Medium" }}
                  >
                    Skip
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* ============================================================
          NEW MODULAR INTERACTION MODALS
          1. Cancel Booking Modal (Customer)
          2. Job Status Action Sheet (Artisan)
          3. Job Completion & PIN Verification Modal (Artisan)
         ============================================================ */}
      <CancelBookingModal
        visible={!!cancellingBookingId}
        bookingId={cancellingBookingId || undefined}
        artisanName={cancellingArtisanName}
        onClose={() => setCancellingBookingId(null)}
        onConfirmCancel={(reason) => {
          if (cancellingBookingId) {
            setCustomerBookings((prev) =>
              prev.map((b) =>
                b.id === cancellingBookingId
                  ? {
                      ...b,
                      status: "Cancelled",
                      tab: "Cancelled" as BookingStatusTab,
                    }
                  : b
              )
            );
            Toast.show({
              type: "success",
              text1: "Booking Cancelled",
              text2: `Reason: ${reason}`,
            });
            setTrackingBooking(null);
            setCancellingBookingId(null);
          }
        }}
      />

      <JobStatusActionModal
        visible={!!selectedArtisanJobForAction}
        jobTitle={selectedArtisanJobForAction?.title}
        clientName={selectedArtisanJobForAction?.clientName}
        currentStatus={
          (selectedArtisanJobForAction?.status as any) || "Confirmed"
        }
        onClose={() => setSelectedArtisanJobForAction(null)}
        onUpdateStatus={(newStatus) => {
          if (selectedArtisanJobForAction) {
            setArtisanBookingsList((prev) =>
              prev.map((b) =>
                b.id === selectedArtisanJobForAction.id
                  ? { ...b, status: newStatus as any }
                  : b
              )
            );
            Toast.show({
              type: "success",
              text1: "Status Updated",
              text2: `Job marked as "${newStatus}".`,
            });
            setSelectedArtisanJobForAction(null);
          }
        }}
        onRequestCompletionCode={() => {
          const job = selectedArtisanJobForAction;
          setSelectedArtisanJobForAction(null);
          setCompletingArtisanJob(job);
        }}
        onCallClient={() => {
          Toast.show({
            type: "info",
            text1: "Calling Client",
            text2: `Dialing ${selectedArtisanJobForAction?.clientName}...`,
          });
        }}
        onChatClient={() => {
          const job = selectedArtisanJobForAction;
          setSelectedArtisanJobForAction(null);
          router.push({
            pathname: "/(tabs)/support",
            params: {
              artisanName: job?.clientName,
              artisanTrade: job?.title,
            },
          });
        }}
      />

      <JobCompletionModal
        visible={!!completingArtisanJob}
        jobTitle={completingArtisanJob?.title}
        clientName={completingArtisanJob?.clientName}
        expectedPin="5842"
        onClose={() => setCompletingArtisanJob(null)}
        onSuccessCompletion={() => {
          if (completingArtisanJob) {
            setArtisanBookingsList((prev) =>
              prev.map((b) =>
                b.id === completingArtisanJob.id
                  ? {
                      ...b,
                      status: "Completed",
                      tab: "Completed" as BookingStatusTab,
                    }
                  : b
              )
            );
            setCompletingArtisanJob(null);
          }
        }}
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
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  tabPill: {
    width: "31.5%",
  },
  trackingMap: {
    width: "100%",
    height: 175,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#E6F4FC",
    alignItems: "center",
    justifyContent: "center",
  },
  routeLineSegment: {
    position: "absolute",
    width: 95,
    height: 4,
    backgroundColor: "#00A8E8",
    borderRadius: 2,
    top: "56%",
    left: "26%",
    transform: [{ rotate: "-26deg" }],
  },
  artisanVehicleBadge: {
    position: "absolute",
    top: "58%",
    left: "20%",
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
  confirmBtnShadow: {
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
