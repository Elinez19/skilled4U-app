import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BaseBottomSheet } from "../common/BaseBottomSheet";

interface CancelBookingModalProps {
  visible: boolean;
  bookingId?: string;
  artisanName?: string;
  onClose: () => void;
  onConfirmCancel: (reason: string) => void;
}

const CANCEL_REASONS = [
  "Artisan is taking too long to arrive",
  "Found another skilled artisan",
  "Problem has been resolved",
  "Booked by mistake / Change of plans",
  "Price or quote disagreement",
  "Other reason",
];

export function CancelBookingModal({
  visible,
  bookingId,
  artisanName = "the artisan",
  onClose,
  onConfirmCancel,
}: CancelBookingModalProps) {
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);

  const handleConfirm = () => {
    onConfirmCancel(selectedReason);
    onClose();
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Cancel Booking"
      subtitle={`Cancel appointment with ${artisanName}`}
      scrollable
      maxHeight="82%"
    >
      <Text
        className="text-[13px] text-[#5B7C99] mb-3"
        style={{ fontFamily: "Poppins-Medium" }}
      >
        Please let us know the reason for cancellation:
      </Text>

      {/* Reason List */}
      <View className="mb-4">
        {CANCEL_REASONS.map((reason, idx) => {
          const isSelected = selectedReason === reason;
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.75}
              onPress={() => setSelectedReason(reason)}
              className={`flex-row items-center p-3 rounded-2xl mb-2 border ${
                isSelected
                  ? "bg-[#FFF4F4] border-[#FCA5A5]"
                  : "bg-white border-[#E2EEF8]"
              }`}
            >
              <View
                className={`w-4.5 h-4.5 rounded-full items-center justify-center mr-3 border ${
                  isSelected
                    ? "bg-error border-error"
                    : "bg-white border-gray-300"
                }`}
              >
                {isSelected && (
                  <View className="w-2 h-2 rounded-full bg-white" />
                )}
              </View>
              <Text
                className={`text-[13px] flex-1 ${
                  isSelected ? "text-[#991B1B]" : "text-[#2C4A63]"
                }`}
                style={{
                  fontFamily: isSelected ? "Poppins-SemiBold" : "Poppins-Regular",
                }}
              >
                {reason}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Policy Disclaimer */}
      <View className="bg-[#FFFBEB] border border-[#FDE68A] p-3 rounded-2xl mb-5 flex-row items-start">
        <Ionicons
          name="warning-outline"
          size={18}
          color="#D97706"
          style={{ marginTop: 1 }}
        />
        <Text
          className="text-[11.5px] text-[#92400E] ml-2 flex-1"
          style={{ fontFamily: "Poppins-Regular", lineHeight: 17 }}
        >
          Cancellations after dispatch may affect your rating or incur a
          standard ₦1,000 compensation fee for the artisan's travel effort.
        </Text>
      </View>

      {/* Actions */}
      <View className="flex-row items-center space-x-3">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onClose}
          className="flex-1 bg-[#F0F7FC] py-3.5 rounded-full items-center border border-[#DCEFFB] mr-2"
        >
          <Text
            className="text-[13.5px] text-[#003B73]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Keep Booking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleConfirm}
          className="flex-1 bg-error py-3.5 rounded-full items-center"
        >
          <Text
            className="text-[13.5px] text-white"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Cancel Request
          </Text>
        </TouchableOpacity>
      </View>
    </BaseBottomSheet>
  );
}

