import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Artisan } from "../../../data/artisans";
import { BookingCalendar, formatCalendarDate } from "../../ui/BookingCalendar";
import { BaseBottomSheet } from "../common/BaseBottomSheet";
import { AddressSelectionModal } from "../common/AddressSelectionModal";

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

const SCHEDULE_TIMES = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

export function ScheduleBookingModal({
  visible,
  artisan,
  defaultAddress = "12 Freedom Street, Abuja",
  onClose,
  onProceedToSummary,
}: ScheduleBookingModalProps) {
  const [selectedDateString, setSelectedDateString] = useState("2025-05-14");
  const [formattedDate, setFormattedDate] = useState("Wed, 14 May 2025");
  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [serviceAddress, setServiceAddress] = useState(defaultAddress);
  const [notes, setNotes] = useState("");
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  if (!artisan) return null;

  const handleNext = () => {
    onProceedToSummary({
      artisan,
      selectedDate: formattedDate,
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

      {/* Select Date via Interactive Calendar Component */}
      <Text
        className="text-[13.5px] text-[#003B73] mb-2"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Select Date & Time
      </Text>

      <BookingCalendar
        selectedDate={selectedDateString}
        onSelectDate={(iso, formatted) => {
          setSelectedDateString(iso);
          setFormattedDate(formatted);
        }}
        initialMode="strip"
      />

      {/* Select Time Slot */}
      <Text
        className="text-[13.5px] text-[#003B73] mb-2 mt-2"
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
              className={`px-3.5 py-2.5 rounded-xl mr-2 mb-2 border ${
                isSelected
                  ? "bg-primary border-primary"
                  : "bg-white border-[#D6ECFA]"
              }`}
            >
              <Text
                className={`text-[12.5px] ${
                  isSelected ? "text-white" : "text-[#5B7C99]"
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
      <View className="flex-row items-center justify-between mb-1.5">
        <Text
          className="text-[13.5px] text-[#003B73]"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Service Address
        </Text>
        <TouchableOpacity
          onPress={() => setShowAddressPicker(true)}
          className="flex-row items-center bg-primary-50 px-2.5 py-0.5 rounded-full border border-[#B8E2F8]"
        >
          <Ionicons name="map-outline" size={12} color="#00A8E8" />
          <Text
            className="text-[11px] text-[#003B73] ml-1"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Select on Map
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setShowAddressPicker(true)}
        className="flex-row items-center bg-[#F8FCFF] border border-[#D6ECFA] rounded-2xl px-3.5 py-3 mb-4"
      >
        <Ionicons name="location" size={18} color="#00A8E8" />
        <Text
          className="flex-1 ml-2 text-[13px] text-[#003B73]"
          style={{ fontFamily: "Poppins-Regular" }}
          numberOfLines={2}
        >
          {serviceAddress || "Tap to select address"}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#8AA8C4" />
      </TouchableOpacity>

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
        placeholder="e.g. broken pipe, kitchen sink, etc."
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
        className="w-full bg-primary py-3.5 rounded-full items-center shadow-sm"
      >
        <Text
          className="text-[14.5px] text-white"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Review Booking & Price
        </Text>
      </TouchableOpacity>

      <AddressSelectionModal
        visible={showAddressPicker}
        role="customer"
        titleOverride="Select Booking Address"
        primaryButtonLabel="Use This Address"
        onClose={() => setShowAddressPicker(false)}
        onAddressConfirmed={(addr) => {
          setServiceAddress(addr.address);
          setShowAddressPicker(false);
        }}
      />
    </BaseBottomSheet>
  );
}
