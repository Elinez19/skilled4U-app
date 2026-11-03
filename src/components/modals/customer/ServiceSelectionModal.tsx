import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Category } from "../../../data/categories";
import { BaseBottomSheet } from "../common/BaseBottomSheet";

interface ServiceSelectionModalProps {
  visible: boolean;
  category: Category | null;
  onClose: () => void;
  onProceed: (selectedSubServices: string[], notes: string) => void;
}

export function ServiceSelectionModal({
  visible,
  category,
  onClose,
  onProceed,
}: ServiceSelectionModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (visible) {
      setSelectedServices([]);
      setNotes("");
    }
  }, [visible, category]);

  if (!category) return null;

  const toggleService = (subService: string) => {
    setSelectedServices((prev) =>
      prev.includes(subService)
        ? prev.filter((s) => s !== subService)
        : [...prev, subService]
    );
  };

  const handleProceed = () => {
    onProceed(selectedServices, notes);
    onClose();
  };

  const subServices = category.subServices || [];

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="What Service do you need?"
      subtitle="Choose the specific issue or task"
      scrollable
      maxHeight="86%"
    >
      {/* Category Banner Badge */}
      <View className="flex-row items-center justify-between bg-[#E6F7FF] border border-[#B8E2F8] px-3.5 py-2.5 rounded-2xl mb-4">
        <View className="flex-row items-center flex-1">
          <View className="w-8 h-8 rounded-xl bg-[#00A8E8] items-center justify-center mr-2.5">
            <Ionicons name="construct" size={16} color="white" />
          </View>
          <Text
            className="text-[14px] text-[#003B73] flex-1"
            style={{ fontFamily: "Poppins-SemiBold" }}
            numberOfLines={1}
          >
            {category.title}
          </Text>
        </View>
        <View className="bg-white/80 px-2 py-0.5 rounded-full border border-[#D6ECFA]">
          <Text
            className="text-[11px] text-[#00A8E8]"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            {subServices.length} types
          </Text>
        </View>
      </View>

      {/* Sub-Services Checklist */}
      <Text
        className="text-[13px] text-[#5B7C99] mb-2"
        style={{ fontFamily: "Poppins-Medium" }}
      >
        Select sub-service (choose one or more)
      </Text>

      <View className="mb-4">
        {subServices.map((sub, idx) => {
          const isSelected = selectedServices.includes(sub);
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={() => toggleService(sub)}
              className={`flex-row items-center p-3 rounded-2xl mb-2 border ${
                isSelected
                  ? "bg-[#F0F9FF] border-[#00A8E8]"
                  : "bg-white border-[#E2EEF8]"
              }`}
            >
              <View
                className={`w-5 h-5 rounded-md items-center justify-center mr-3 border ${
                  isSelected
                    ? "bg-[#00A8E8] border-[#00A8E8]"
                    : "bg-white border-[#B4D0E5]"
                }`}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text
                className={`text-[13.5px] flex-1 ${
                  isSelected ? "text-[#003B73]" : "text-[#2C4A63]"
                }`}
                style={{
                  fontFamily: isSelected ? "Poppins-SemiBold" : "Poppins-Regular",
                }}
              >
                {sub}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Optional Note */}
      <Text
        className="text-[13px] text-[#5B7C99] mb-1.5"
        style={{ fontFamily: "Poppins-Medium" }}
      >
        Additional description <Text className="text-[#9BB7CF]">(Optional)</Text>
      </Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="E.g., The leak is under the kitchen sink, water is dripping quickly..."
        placeholderTextColor="#9BB7CF"
        multiline
        numberOfLines={3}
        className="bg-[#F8FCFF] border border-[#D6ECFA] rounded-2xl p-3.5 text-[13px] text-[#003B73] mb-5"
        style={{ fontFamily: "Poppins-Regular", height: 78, textAlignVertical: "top" }}
      />

      {/* Primary CTA */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleProceed}
        className="w-full bg-[#00A8E8] py-3.5 rounded-full items-center shadow-sm"
      >
        <Text
          className="text-[14.5px] text-white"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          {selectedServices.length > 0
            ? `Find Artisans (${selectedServices.length} selected)`
            : "Find Nearby Artisans"}
        </Text>
      </TouchableOpacity>
    </BaseBottomSheet>
  );
}

