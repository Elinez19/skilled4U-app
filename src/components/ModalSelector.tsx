import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface Option {
  label: string;
  value: string;
  subLabel?: string; // For country codes, e.g., "+234"
}

interface ModalSelectorProps {
  visible: boolean;
  onClose: () => void;
  options: Option[];
  onSelect: (value: string) => void;
  title: string;
  searchPlaceholder?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export function ModalSelector({ 
  visible, 
  onClose, 
  options, 
  onSelect, 
  title,
  searchPlaceholder = "Search",
  iconName = "location-outline"
}: ModalSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (option.subLabel && option.subLabel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center px-6 py-4 border-b border-neutral-100">
            <TouchableOpacity onPress={onClose} className="mr-4 p-2 -ml-2">
              <Ionicons name="chevron-back" size={24} color="#001328" />
            </TouchableOpacity>
            <Text className="h3 flex-1">{title}</Text>
          </View>

          {/* Search */}
          <View className="px-6 py-4">
            <View className="flex-row items-center border border-neutral-200 rounded-xl px-4 h-12 bg-neutral-50">
              <Ionicons name="search" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 ml-2 text-base text-neutral-900 h-full"
                placeholder={searchPlaceholder}
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ fontFamily: "Poppins-Regular" }}
              />
            </View>
          </View>

          {/* List */}
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                  setSearchQuery(""); // reset search
                }}
                className="flex-row items-center py-4 border-b border-neutral-100"
              >
                <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center mr-4">
                  <Ionicons name={iconName} size={20} color="#00B7FF" />
                </View>
                <Text className="body-md flex-1 text-neutral-900">{item.label}</Text>
                {item.subLabel && (
                  <Text className="body-md text-neutral-900 font-medium">{item.subLabel}</Text>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View className="py-8 items-center">
                <Text className="body-md text-neutral-500">No results found</Text>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
