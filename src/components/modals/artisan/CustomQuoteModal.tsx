import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ArtisanJobRequest } from "../../../data/artisans";
import { BaseBottomSheet } from "../common/BaseBottomSheet";

export interface CustomQuoteData {
  jobId: string;
  laborFee: number;
  materialsFee: number;
  duration: string;
  note: string;
}

interface CustomQuoteModalProps {
  visible: boolean;
  job: ArtisanJobRequest | null;
  onClose: () => void;
  onSubmitQuote: (quote: CustomQuoteData) => void;
}

const DURATIONS = ["1-2 Hours", "3-5 Hours", "Full Day", "Multi-day"];

export function CustomQuoteModal({
  visible,
  job,
  onClose,
  onSubmitQuote,
}: CustomQuoteModalProps) {
  const [laborFee, setLaborFee] = useState("18000");
  const [materialsFee, setMaterialsFee] = useState("5000");
  const [selectedDuration, setSelectedDuration] = useState("1-2 Hours");
  const [note, setNote] = useState("");

  if (!job) return null;

  const totalQuote =
    (parseInt(laborFee, 10) || 0) + (parseInt(materialsFee, 10) || 0);

  const handleSubmit = () => {
    onSubmitQuote({
      jobId: job.id,
      laborFee: parseInt(laborFee, 10) || 0,
      materialsFee: parseInt(materialsFee, 10) || 0,
      duration: selectedDuration,
      note,
    });
    onClose();
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Custom Quote"
      subtitle={`Quote for ${job.title}`}
      scrollable
      maxHeight="88%"
    >
      {/* Current Client Budget Reference */}
      <View className="flex-row items-center justify-between bg-[#F4FAFF] border border-[#DCEFFB] p-3 rounded-2xl mb-4">
        <Text
          className="text-[12.5px] text-[#5B7C99]"
          style={{ fontFamily: "Poppins-Medium" }}
        >
          Client's Suggested Budget:
        </Text>
        <Text
          className="text-[13.5px] text-[#003B73]"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          {job.budget}
        </Text>
      </View>

      {/* Labor Cost Input */}
      <Text
        className="text-[13px] text-[#003B73] mb-1.5"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Labor & Service Fee (₦)
      </Text>
      <View className="flex-row items-center bg-[#F8FCFF] border border-[#D6ECFA] rounded-2xl px-3.5 py-2.5 mb-3.5">
        <Text
          className="text-[14px] text-[#00A8E8] mr-2"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          ₦
        </Text>
        <TextInput
          value={laborFee}
          onChangeText={setLaborFee}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#8AA8C4"
          className="flex-1 text-[13.5px] text-[#003B73]"
          style={{ fontFamily: "Poppins-SemiBold" }}
        />
      </View>

      {/* Estimated Materials Cost */}
      <Text
        className="text-[13px] text-[#003B73] mb-1.5"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Estimated Materials / Spare Parts (₦)
      </Text>
      <View className="flex-row items-center bg-[#F8FCFF] border border-[#D6ECFA] rounded-2xl px-3.5 py-2.5 mb-3.5">
        <Text
          className="text-[14px] text-[#00A8E8] mr-2"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          ₦
        </Text>
        <TextInput
          value={materialsFee}
          onChangeText={setMaterialsFee}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#8AA8C4"
          className="flex-1 text-[13.5px] text-[#003B73]"
          style={{ fontFamily: "Poppins-SemiBold" }}
        />
      </View>

      {/* Estimated Duration Selector */}
      <Text
        className="text-[13px] text-[#003B73] mb-2"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Estimated Completion Time
      </Text>
      <View className="flex-row flex-wrap mb-3.5">
        {DURATIONS.map((dur) => {
          const isSelected = selectedDuration === dur;
          return (
            <TouchableOpacity
              key={dur}
              activeOpacity={0.8}
              onPress={() => setSelectedDuration(dur)}
              className={`px-3 py-1.5 rounded-xl mr-2 mb-2 border ${
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
                  fontFamily: isSelected ? "Poppins-SemiBold" : "Poppins-Regular",
                }}
              >
                {dur}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quote Note */}
      <Text
        className="text-[13px] text-[#003B73] mb-1.5"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Note to Client <Text className="text-[#9BB7CF]">(Explain what's included)</Text>
      </Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="E.g., Includes replacement gasket, sealant, and pressure testing..."
        placeholderTextColor="#9BB7CF"
        multiline
        numberOfLines={3}
        className="bg-[#F8FCFF] border border-[#D6ECFA] rounded-2xl p-3 text-[13px] text-[#003B73] mb-4"
        style={{ fontFamily: "Poppins-Regular", height: 68, textAlignVertical: "top" }}
      />

      {/* Total Quote Box */}
      <View className="bg-[#FAFDFE] border border-[#E6F3FC] rounded-2xl p-3.5 mb-5 flex-row items-center justify-between">
        <Text
          className="text-[13.5px] text-[#003B73]"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          Total Proposed Quote
        </Text>
        <Text
          className="text-[17px] text-[#00A8E8]"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          ₦{totalQuote.toLocaleString()}
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSubmit}
        className="w-full bg-primary py-3.5 rounded-full items-center shadow-sm"
      >
        <Text
          className="text-[14.5px] text-white"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Submit Quote to Client
        </Text>
      </TouchableOpacity>
    </BaseBottomSheet>
  );
}

