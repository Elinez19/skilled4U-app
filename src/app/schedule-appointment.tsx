import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
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
import { ARTISANS } from "../data/artisans";

const WEEK_DAYS = [
  { dayLabel: "Mon", dateNum: "12", fullDate: "Mon, 12 May 2025" },
  { dayLabel: "Tue", dateNum: "13", fullDate: "Tue, 13 May 2025" },
  { dayLabel: "Wed", dateNum: "14", fullDate: "Wed, 14 May 2025" },
  { dayLabel: "Thu", dateNum: "15", fullDate: "Thu, 15 May 2025" },
  { dayLabel: "Fri", dateNum: "17", fullDate: "Fri, 17 May 2025" },
  { dayLabel: "Sat", dateNum: "18", fullDate: "Sat, 18 May 2025" },
];

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

export default function BookServiceScreen() {
  const params = useLocalSearchParams<{
    artisanId?: string;
    artisanName?: string;
    artisanTrade?: string;
  }>();

  const matchedArtisan =
    ARTISANS.find(
      (a) =>
        a.id === params.artisanId ||
        a.name.toLowerCase() === (params.artisanName || "").toLowerCase()
    ) || ARTISANS[0];

  const [selectedDay, setSelectedDay] = useState("14");
  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [serviceAddress, setServiceAddress] = useState(
    "12 Freedom Street, Abuja"
  );
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadSavedAddress = async () => {
        try {
          const raw = await AsyncStorage.getItem("skilled4u_selected_location");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.address) {
              setServiceAddress(parsed.address);
            }
          }
        } catch {
          // ignore
        }
      };
      loadSavedAddress();
    }, [])
  );

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    const chosenDayObj =
      WEEK_DAYS.find((d) => d.dateNum === selectedDay) || WEEK_DAYS[2];

    try {
      const existingRaw = await AsyncStorage.getItem("skilled4u_bookings");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const newBooking = {
        id: `bk-${Date.now()}`,
        service: matchedArtisan.trade === "Plumber" ? "Plumbing" : matchedArtisan.trade,
        artisanName: matchedArtisan.name,
        artisanTrade: matchedArtisan.trade,
        dateTime: `${chosenDayObj.fullDate} • ${selectedTime}`,
        price: matchedArtisan.hourlyRate || "₦15,000",
        address: serviceAddress,
        notes: additionalDetails,
        status: "On the Way",
      };
      await AsyncStorage.setItem(
        "skilled4u_bookings",
        JSON.stringify([newBooking, ...existing])
      );
    } catch {
      // ignore storage errors
    } finally {
      setIsSubmitting(false);
    }

    Toast.show({
      type: "success",
      text1: "Booking Confirmed!",
      text2: `${matchedArtisan.name} is scheduled for ${chosenDayObj.fullDate} at ${selectedTime}.`,
    });

    router.replace("/(tabs)/jobs?view=tracking");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <Image
        source={images.onboardingBg}
        style={styles.bgOverlay}
        resizeMode="cover"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Top Header */}
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
            Book Service
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Artisan Card */}
          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-3.5 mb-5 border border-[#DCEFFB] flex-row items-center"
          >
            <View className="w-14 h-14 rounded-full overflow-hidden bg-[#E6F7FF] border border-[#B8E2F8]">
              <Image
                source={matchedArtisan.avatarSource}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="ml-3.5 flex-1">
              <Text
                className="text-[16px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                {matchedArtisan.name}
              </Text>
              <Text
                className="text-[13px] text-[#5B7C99] mt-0.5"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                {matchedArtisan.trade}
              </Text>
            </View>
          </View>

          {/* Select Date & Time */}
          <Text
            className="text-[15.5px] text-[#003B73] mb-2.5"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Select Date & Time
          </Text>

          {/* Calendar Strip Card */}
          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-4 mb-3.5 border border-[#DCEFFB]"
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text
                className="text-[14.5px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                May 2025
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#5B7C99" />
            </View>

            <View className="flex-row justify-between">
              {WEEK_DAYS.map((item) => {
                const isSelected = selectedDay === item.dateNum;
                return (
                  <TouchableOpacity
                    key={item.dateNum}
                    activeOpacity={0.8}
                    onPress={() => setSelectedDay(item.dateNum)}
                    className={`w-[15%] py-2.5 rounded-2xl items-center justify-center ${
                      isSelected ? "bg-[#00A8E8]" : "bg-transparent"
                    }`}
                  >
                    <Text
                      className={`text-[11px] mb-1 ${
                        isSelected ? "text-white/90" : "text-[#5B7C99]"
                      }`}
                      style={{ fontFamily: "Poppins-Medium" }}
                    >
                      {item.dayLabel}
                    </Text>
                    <Text
                      className={`text-[15px] ${
                        isSelected ? "text-white" : "text-[#003B73]"
                      }`}
                      style={{ fontFamily: "Poppins-Bold" }}
                    >
                      {item.dateNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Time Slots Grid */}
          <View className="flex-row flex-wrap justify-between mb-4">
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedTime === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTime(slot)}
                  style={styles.timePill}
                  className={`py-2.5 rounded-xl items-center justify-center mb-2.5 border ${
                    isSelected
                      ? "bg-[#00A8E8] border-[#00A8E8]"
                      : "bg-white border-[#DCEFFB]"
                  }`}
                >
                  <Text
                    className={`text-[12.5px] ${
                      isSelected ? "text-white" : "text-[#003B73]"
                    }`}
                    style={{
                      fontFamily: isSelected
                        ? "Poppins-SemiBold"
                        : "Poppins-Medium",
                    }}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Service Address */}
          <Text
            className="text-[15.5px] text-[#003B73] mb-2"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Service Address
          </Text>

          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl px-4 py-3.5 mb-4 border border-[#DCEFFB] flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1 mr-3">
              <Ionicons name="location" size={18} color="#0099DF" />
              <Text
                className="text-[13.5px] text-[#003B73] ml-2.5 flex-1"
                style={{ fontFamily: "Poppins-Medium" }}
                numberOfLines={1}
              >
                {serviceAddress}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/address-book/add")}>
              <Text
                className="text-[13px] text-[#00A8E8]"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                Change
              </Text>
            </TouchableOpacity>
          </View>

          {/* Additional Details (Optional) */}
          <Text
            className="text-[15px] text-[#003B73] mb-2"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Additional Details{" "}
            <Text
              className="text-[13px] text-[#7A9BB8]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              (Optional)
            </Text>
          </Text>

          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-3.5 mb-5 border border-[#DCEFFB]"
          >
            <TextInput
              value={additionalDetails}
              onChangeText={setAdditionalDetails}
              placeholder="e.g. broken pipe, kitchen sink, etc."
              placeholderTextColor="#94B2CC"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="text-[13.5px] text-[#003B73] min-h-[72px]"
              style={{ fontFamily: "Poppins-Regular" }}
            />
          </View>

          {/* Bottom Total Estimate & Confirm Booking Card */}
          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-4 border border-[#DCEFFB]"
          >
            <Text
              className="text-[12px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Total Estimate
            </Text>
            <Text
              className="text-[22px] text-[#003B73] mb-3.5"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              {matchedArtisan.hourlyRate || "₦15,000"}
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isSubmitting}
              onPress={handleConfirmBooking}
              style={styles.confirmBtnShadow}
              className="w-full bg-[#00A8E8] py-3.5 rounded-full items-center"
            >
              <Text
                className="text-[15px] text-white"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                {isSubmitting ? "Confirming..." : "Confirm Booking"}
              </Text>
            </TouchableOpacity>
          </View>
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
  timePill: {
    width: "31.5%",
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
        shadowOpacity: 0.28,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
