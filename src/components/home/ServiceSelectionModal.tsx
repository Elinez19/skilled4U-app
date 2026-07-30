import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "../../data/categories";

interface ServiceSelectionModalProps {
  isVisible: boolean;
  category: Category | null;
  onClose: () => void;
  onGoPress: (selectedServices: string[]) => void;
}

export function ServiceSelectionModal({
  isVisible,
  category,
  onClose,
  onGoPress,
}: ServiceSelectionModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Reset selected services when category changes or modal opens
  useEffect(() => {
    if (isVisible) {
      setSelectedServices([]);
    }
  }, [isVisible, category]);

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleGo = () => {
    onGoPress(selectedServices);
    onClose();
  };

  if (!category) return null;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      style={{ margin: 0, justifyContent: "flex-end" }}
      propagateSwipe
      avoidKeyboard
      useNativeDriver
      hideModalContentWhileAnimating
    >
      <View className="bg-white rounded-t-3xl p-6 pb-10" style={{ maxHeight: "80%" }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-xl font-bold text-[#1e3a5f]">
            What Service do you need?
          </Text>
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="close-circle-outline" size={28} color="#1e3a5f" />
          </TouchableOpacity>
        </View>

        {/* Selected Category Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center flex-1">
            <Ionicons name="person" size={24} color="#00B4FF" />
            <Text className="text-base font-bold text-[#1e3a5f] ml-3 flex-1">
              {category.title}
            </Text>
          </View>
          <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
        </View>

        {/* Services List */}
        <ScrollView className="mb-6" showsVerticalScrollIndicator={false}>
          {category.subServices?.map((service, index) => {
            const isSelected = selectedServices.includes(service);
            return (
              <TouchableOpacity
                key={index}
                className="flex-row items-center py-3"
                onPress={() => toggleService(service)}
                activeOpacity={0.7}
              >
                <View 
                  className={`w-5 h-5 rounded border items-center justify-center mr-4 ${
                    isSelected ? "bg-blue-600 border-blue-600" : "border-slate-400"
                  }`}
                >
                  {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                <Text className={`text-[15px] ${isSelected ? "text-[#1e3a5f] font-medium" : "text-[#475569]"}`}>
                  {service}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Go Button */}
        <TouchableOpacity
          className="bg-[#00B4FF] w-full py-4 rounded-xl items-center"
          onPress={handleGo}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-bold">Go</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
