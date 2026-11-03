import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { BaseBottomSheet } from "../common/BaseBottomSheet";
import { BookingScheduleData } from "./ScheduleBookingModal";

interface BookingSummaryModalProps {
  visible: boolean;
  data: BookingScheduleData | null;
  onClose: () => void;
  onBookingConfirmed: (createdBookingId: string) => void;
}

type PaymentMethodType = "wallet" | "card" | "cash";

export function BookingSummaryModal({
  visible,
  data,
  onClose,
  onBookingConfirmed,
}: BookingSummaryModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("wallet");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!data) return null;

  const basePriceNum = 15000;
  const diagnosticFee = 2000;
  const platformFee = 500;
  const totalAmount = Math.max(0, basePriceNum + diagnosticFee + platformFee - promoDiscount);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    setTimeout(() => {
      setIsApplyingPromo(false);
      if (promoCode.trim().toUpperCase() === "SKILLED20") {
        setPromoDiscount(3000);
        Toast.show({
          type: "success",
          text1: "Promo Applied!",
          text2: "₦3,000 discount applied to this order.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Invalid Code",
          text2: "Try using promo code 'SKILLED20'.",
        });
      }
    }, 600);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const newBooking = {
        id: `bk-${Date.now()}`,
        service: data.artisan.trade,
        artisanName: data.artisan.name,
        artisanTrade: data.artisan.trade,
        dateTime: `${data.selectedDate} • ${data.selectedTime}`,
        price: `₦${totalAmount.toLocaleString()}`,
        address: data.address,
        notes: data.notes,
        status: "On the Way",
        paymentMethod,
        avatar: data.artisan.avatarSource,
        tab: "Upcoming",
      };

      const existingRaw = await AsyncStorage.getItem("skilled4u_bookings");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [newBooking, ...existing];
      await AsyncStorage.setItem("skilled4u_bookings", JSON.stringify(updated));

      Toast.show({
        type: "success",
        text1: "Booking Confirmed! 🎉",
        text2: `${data.artisan.name} has been notified and is preparing.`,
      });

      onBookingConfirmed(newBooking.id);
      onClose();
    } catch {
      Toast.show({
        type: "error",
        text1: "Booking Failed",
        text2: "Could not save your booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Order Summary"
      subtitle="Review details and payment"
      scrollable
      maxHeight="90%"
    >
      {/* Appointment Detail Box */}
      <View className="bg-[#F4FAFF] border border-[#DCEFFB] p-4 rounded-2xl mb-4">
        <View className="flex-row items-center justify-between mb-2 pb-2 border-b border-[#E6F3FC]">
          <Text
            className="text-[13px] text-[#5B7C99]"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            Artisan & Service
          </Text>
          <Text
            className="text-[13.5px] text-[#003B73]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            {data.artisan.name} ({data.artisan.trade})
          </Text>
        </View>

        <View className="flex-row items-center justify-between mb-2 pb-2 border-b border-[#E6F3FC]">
          <Text
            className="text-[13px] text-[#5B7C99]"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            Scheduled Date
          </Text>
          <Text
            className="text-[13px] text-[#003B73]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            {data.selectedDate} • {data.selectedTime}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text
            className="text-[13px] text-[#5B7C99]"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            Location
          </Text>
          <Text
            className="text-[12.5px] text-[#003B73] max-w-[60%]"
            style={{ fontFamily: "Poppins-Regular" }}
            numberOfLines={1}
          >
            {data.address}
          </Text>
        </View>
      </View>

      {/* Promo Code Input */}
      <Text
        className="text-[13px] text-[#003B73] mb-1.5"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Promo Code
      </Text>
      <View className="flex-row items-center mb-4">
        <TextInput
          value={promoCode}
          onChangeText={setPromoCode}
          placeholder="Enter promo code (e.g. SKILLED20)"
          placeholderTextColor="#8AA8C4"
          autoCapitalize="characters"
          className="flex-1 bg-[#F8FCFF] border border-[#D6ECFA] rounded-xl px-3.5 py-2.5 text-[13px] text-[#003B73] mr-2"
          style={{ fontFamily: "Poppins-Regular" }}
        />
        <TouchableOpacity
          onPress={handleApplyPromo}
          className="bg-primary-50 border border-[#B8E2F8] px-4 py-2.5 rounded-xl items-center justify-center"
        >
          {isApplyingPromo ? (
            <ActivityIndicator size="small" color="#00A8E8" />
          ) : (
            <Text
              className="text-[12.5px] text-[#00A8E8]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Apply
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Payment Method Selector */}
      <Text
        className="text-[13px] text-[#003B73] mb-2"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Payment Method
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setPaymentMethod("wallet")}
        className={`flex-row items-center justify-between p-3 rounded-2xl mb-2 border ${
          paymentMethod === "wallet"
            ? "bg-[#EBF7FF] border-primary"
            : "bg-white border-[#E2EEF8]"
        }`}
      >
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
            <Ionicons name="wallet-outline" size={17} color="#00A8E8" />
          </View>
          <View>
            <Text
              className="text-[13px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Skilled4U Wallet
            </Text>
            <Text
              className="text-[11.5px] text-[#10B981]"
              style={{ fontFamily: "Poppins-Medium" }}
            >
              Balance: ₦45,000
            </Text>
          </View>
        </View>
        <Ionicons
          name={
            paymentMethod === "wallet"
              ? "radio-button-on"
              : "radio-button-off"
          }
          size={20}
          color="#00A8E8"
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setPaymentMethod("card")}
        className={`flex-row items-center justify-between p-3 rounded-2xl mb-2 border ${
          paymentMethod === "card"
            ? "bg-[#EBF7FF] border-primary"
            : "bg-white border-[#E2EEF8]"
        }`}
      >
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
            <Ionicons name="card-outline" size={17} color="#00A8E8" />
          </View>
          <View>
            <Text
              className="text-[13px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Debit Card
            </Text>
            <Text
              className="text-[11.5px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Mastercard ending in •••• 4022
            </Text>
          </View>
        </View>
        <Ionicons
          name={
            paymentMethod === "card"
              ? "radio-button-on"
              : "radio-button-off"
          }
          size={20}
          color="#00A8E8"
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setPaymentMethod("cash")}
        className={`flex-row items-center justify-between p-3 rounded-2xl mb-4 border ${
          paymentMethod === "cash"
            ? "bg-[#EBF7FF] border-primary"
            : "bg-white border-[#E2EEF8]"
        }`}
      >
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
            <Ionicons name="cash-outline" size={17} color="#00A8E8" />
          </View>
          <View>
            <Text
              className="text-[13px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Cash Payment
            </Text>
            <Text
              className="text-[11.5px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Pay directly after service is inspected
            </Text>
          </View>
        </View>
        <Ionicons
          name={
            paymentMethod === "cash"
              ? "radio-button-on"
              : "radio-button-off"
          }
          size={20}
          color="#00A8E8"
        />
      </TouchableOpacity>

      {/* Price Breakdown */}
      <View className="bg-[#FAFDFE] border border-[#E6F3FC] rounded-2xl p-3.5 mb-5">
        <View className="flex-row justify-between mb-1.5">
          <Text
            className="text-[12.5px] text-[#5B7C99]"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Estimated Service Labor
          </Text>
          <Text
            className="text-[12.5px] text-[#003B73]"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            ₦{basePriceNum.toLocaleString()}
          </Text>
        </View>

        <View className="flex-row justify-between mb-1.5">
          <Text
            className="text-[12.5px] text-[#5B7C99]"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Inspection & Call-out Fee
          </Text>
          <Text
            className="text-[12.5px] text-[#003B73]"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            ₦{diagnosticFee.toLocaleString()}
          </Text>
        </View>

        <View className="flex-row justify-between mb-1.5">
          <Text
            className="text-[12.5px] text-[#5B7C99]"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Platform Protection Fee
          </Text>
          <Text
            className="text-[12.5px] text-[#003B73]"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            ₦{platformFee.toLocaleString()}
          </Text>
        </View>

        {promoDiscount > 0 && (
          <View className="flex-row justify-between mb-1.5">
            <Text
              className="text-[12.5px] text-[#10B981]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Promo Discount
            </Text>
            <Text
              className="text-[12.5px] text-[#10B981]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              - ₦{promoDiscount.toLocaleString()}
            </Text>
          </View>
        )}

        <View className="h-px bg-[#E2EEF8] my-2" />

        <View className="flex-row justify-between items-center">
          <Text
            className="text-[14px] text-[#003B73]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Total Amount
          </Text>
          <Text
            className="text-[17px] text-[#00A8E8]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            ₦{totalAmount.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Confirm CTA */}
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isSubmitting}
        onPress={handleConfirm}
        className="w-full bg-primary py-3.5 rounded-full items-center shadow-sm"
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            className="text-[14.5px] text-white"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Confirm & Pay Escrow
          </Text>
        )}
      </TouchableOpacity>
    </BaseBottomSheet>
  );
}

