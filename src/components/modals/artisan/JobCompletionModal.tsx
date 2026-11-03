import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { BaseBottomSheet } from "../common/BaseBottomSheet";

interface JobCompletionModalProps {
  visible: boolean;
  jobTitle?: string;
  clientName?: string;
  expectedPin?: string;
  onClose: () => void;
  onSuccessCompletion: () => void;
}

export function JobCompletionModal({
  visible,
  jobTitle = "Plumbing Service",
  clientName = "Aisha Bello",
  expectedPin = "5842",
  onClose,
  onSuccessCompletion,
}: JobCompletionModalProps) {
  const [pin, setPin] = useState("");
  const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const handleVerify = () => {
    if (pin.length < 4) {
      Toast.show({
        type: "error",
        text1: "Incomplete Code",
        text2: "Please enter all 4 digits from the client.",
      });
      return;
    }

    // For demo/teaching, accept either expectedPin or any 4 digit code
    Toast.show({
      type: "success",
      text1: "Job Completed! 🎉",
      text2: "₦15,000 has been released to your Artisan Wallet.",
    });
    onSuccessCompletion();
    onClose();
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Verify Job Completion"
      subtitle={`Service for ${clientName}`}
      scrollable
      maxHeight="80%"
    >
      <View className="items-center my-3">
        <View className="w-16 h-16 rounded-full bg-[#E8F8F0] items-center justify-center mb-2 border-2 border-[#10B981]">
          <Ionicons name="shield-checkmark" size={32} color="#10B981" />
        </View>
        <Text
          className="text-[16px] text-[#003B73] text-center"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          Enter Client Completion Code
        </Text>
        <Text
          className="text-[12.5px] text-[#5B7C99] text-center max-w-[85%] mt-1"
          style={{ fontFamily: "Poppins-Regular" }}
        >
          Ask {clientName} for the 4-digit security code displayed on their live
          booking tracking screen.
        </Text>
      </View>

      {/* Hidden/Direct Input + 4 Digit Boxes */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        className="flex-row justify-center space-x-3 my-4"
      >
        {[0, 1, 2, 3].map((idx) => {
          const digit = pin[idx] || "";
          const isCurrent = pin.length === idx;
          return (
            <View
              key={idx}
              className={`w-14 h-14 rounded-2xl items-center justify-center border-2 mx-1.5 ${
                digit
                  ? "bg-[#F0F9FF] border-primary"
                  : isCurrent
                  ? "bg-white border-primary"
                  : "bg-[#F8FCFF] border-[#D6ECFA]"
              }`}
            >
              <Text
                className="text-[24px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                {digit}
              </Text>
            </View>
          );
        })}
      </TouchableOpacity>

      <TextInput
        ref={inputRef}
        value={pin}
        onChangeText={(text) => {
          if (text.length <= 4) setPin(text);
        }}
        keyboardType="number-pad"
        maxLength={4}
        className="opacity-0 h-0 w-0"
      />

      <View className="bg-[#FAFDFE] border border-[#DCEFFB] p-3 rounded-2xl mb-5 flex-row items-center">
        <Ionicons name="information-circle-outline" size={18} color="#00A8E8" />
        <Text
          className="text-[11.5px] text-[#5B7C99] ml-2 flex-1"
          style={{ fontFamily: "Poppins-Regular" }}
        >
          Entering this code confirms the client has inspected and approved the
          workmanship.
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleVerify}
        className="w-full bg-[#10B981] py-3.5 rounded-full items-center shadow-sm"
      >
        <Text
          className="text-[14.5px] text-white"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Verify & Release Payment
        </Text>
      </TouchableOpacity>
    </BaseBottomSheet>
  );
}
