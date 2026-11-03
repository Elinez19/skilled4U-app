import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Artisan } from "../../../data/artisans";
import { BaseBottomSheet } from "../common/BaseBottomSheet";

export interface BookingScheduleData {
  artisan: Artisan;
  selectedDate: string;
  selectedTime: string;
  address: string;
  notes: string;
}

interface ScheduleBookingModalProps {
  visible: boolean;
  artisan: Artisan | null;
  defaultAddress?: string;
  onClose: () => void;
  onProceedToSummary: (data: BookingScheduleData) => void;
}

const SCHEDULE_DAYS = [
  { day: "Mon", date: "12", fullDate: "Mon, 12 May" },
  { day: "Tue", date: "13", fullDate: "Tue, 13 May" },
  { day: "Wed", date: "14", fullDate: "Wed, 14 May" },
  { day: "Thu", date: "15", fullDate: "Thu, 15 May" },
  { day: "Fri", date: "16", fullDate: "Fri, 16 May" },
  { day: "Sat", date: "17", fullDate: "Sat, 17 May" },
];

const SCHEDULE_TIMES = [
  "09:00 AM",
  "11:00 AM",
  "01:00 PM",
  "03:00 PM",
  "05:00 PM",
];

export function ScheduleBookingModal({
  visible,
  artisan,
  defaultAddress = "12 Freedom Street, Abuja",
  onClose,
  onProceedToSummary,
}: ScheduleBookingModalProps) {
  const [selectedDay, setSelectedDay] = useState("14");
  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [serviceAddress, setServiceAddress] = useState(defaultAddress);
  const [notes, setNotes] = useState("");

  if (!artisan) return null;

  const handleNext = () => {
    const chosenDay =
      SCHEDULE_DAYS.find((d) => d.date === selectedDay) || SCHEDULE_DAYS[2];
    onProceedToSummary({
      artisan,
      selectedDate: chosenDay.fullDate,
      selectedTime,
      address: serviceAddress,
      notes,
    });
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Book Service"
      subtitle={`Schedule with ${artisan.name}`}
      scrollable
      maxHeight="88%"
    >
      {/* Artisan Mini Bar */}
      <View className="flex-row items-center bg-[#F4FAFF] border border-[#DCEFFB] p-3 rounded-2xl mb-4">
        <View className="w-10 h-10 rounded-xl bg-[#00A8E8]/10 items-center justify-center mr-3">
          <Ionicons name="calendar-outline" size={20} color="#00A8E8" />
        </View>
        <View className="flex-1">
          <Text
            className="text-[14px] text-[#003B73]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            {artisan.name} • {artisan.trade}
          </Text>
          <Text
            className="text-[12px] text-[#5B7C99]"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Hourly Rate: {artisan.hourlyRate}
          </Text>
        </View>
      </View>

      {/* Select Day */}
      <Text
        className="text-[13.5px] text-[#003B73] mb-2"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Select Date
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        {SCHEDULE_DAYS.map((d) => {
          const isSelected = selectedDay === d.date;
          return (
            <TouchableOpacity
              key={d.date}
              activeOpacity={0.8}
              onPress={() => setSelectedDay(d.date)}
              className={`w-14 py-3 rounded-2xl items-center mr-2.5 border ${
                isSelected
                  ? "bg-[#00A8E8] border-[#00A8E8]"
                  : "bg-white border-[#D6ECFA]"
              }`}
            >
              <Text
                className={`text-[11.5px] mb-1 ${
                  isSelected ? "text-white/80" : "text-[#7A9BB8]"
                }`}
                style={{ fontFamily: "Poppins-Regular" }}
              >
                {d.day}
              </Text>
              <Text
                className={`text-[16px] ${
                  isSelected ? "text-white" : "text-[#003B73]"
                }`}
                style={{ fontFamily: "Poppins-Bold" }}
              >
                {d.date}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Select Time Slot */}
      <Text
        className="text-[13.5px] text-[#003B73] mb-2"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Select Time Slot
      </Text>
      <View className="flex-row flex-wrap mb-4">
        {SCHEDULE_TIMES.map((time) => {
          const isSelected = selectedTime === time;
          return (
            <TouchableOpacity
              key={time}
              activeOpacity={0.8}
              onPress={() => setSelectedTime(time)}
              className={`px-3.5 py-2 rounded-xl mr-2 mb-2 border ${
                isSelected
                  ? "bg-[#E6F7FF] border-[#00A8E8]"
                  : "bg-white border-[#D6ECFA]"
              }`}
            >
              <Text
                className={`text-[12.5px] ${
                  isSelected ? "text-[#00A8E8]" : "text-[#5B7C99]"
                }`}
                style={{
                  fontFamily: isSelected ? "Poppins-SemiBold" : "Poppins-Regular",
                }}
              >
                {time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Location / Address */}
      <Text
        className="text-[13.5px] text-[#003B73] mb-1.5"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Service Address
      </Text>
      <View className="flex-row items-center bg-[#F8FCFF] border border-[#D6ECFA] rounded-2xl px-3.5 py-2.5 mb-4">
        <Ionicons name="location" size={18} color="#00A8E8" />
        <TextInput
          value={serviceAddress}
          onChangeText={setServiceAddress}
          placeholder="Enter address"
          placeholderTextColor="#8AA8C4"
          className="flex-1 ml-2 text-[13px] text-[#003B73]"
          style={{ fontFamily: "Poppins-Regular" }}
        />
      </View>

      {/* Special Instructions Note */}
      <Text
        className="text-[13.5px] text-[#003B73] mb-1.5"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Additional Instructions <Text className="text-[#9BB7CF]">(Optional)</Text>
      </Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Any gate code, landmark, or specific tool needs..."
        placeholderTextColor="#9BB7CF"
        multiline
        numberOfLines={2}
        className="bg-[#F8FCFF] border border-[#D6ECFA] rounded-2xl p-3 text-[13px] text-[#003B73] mb-6"
        style={{ fontFamily: "Poppins-Regular", height: 60, textAlignVertical: "top" }}
      />

      {/* Primary CTA */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleNext}
        className="w-full bg-[#00A8E8] py-3.5 rounded-full items-center shadow-sm"
      >
        <Text
          className="text-[14.5px] text-white"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Review Booking & Price
        </Text>
      </TouchableOpacity>
    </BaseBottomSheet>
  );
}

