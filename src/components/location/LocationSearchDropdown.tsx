import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LocationResult } from "../../data/locations";

interface LocationSearchDropdownProps {
  results: LocationResult[];
  onSelect: (item: LocationResult) => void;
  onDismiss: () => void;
}

export function LocationSearchDropdown({
  results,
  onSelect,
  onDismiss,
}: LocationSearchDropdownProps) {
  if (results.length === 0) return null;

  return (
    <View
      style={styles.dropdownContainer}
      className="bg-white rounded-2xl border border-[#D0E8F8] mt-1.5 overflow-hidden"
    >
      {results.map((item, index) => (
        <TouchableOpacity
          key={String(item.place_id)}
          activeOpacity={0.75}
          className={`flex-row items-center px-4 py-3 ${
            index !== results.length - 1 ? "border-b border-[#EDF7FC]" : ""
          }`}
          onPress={() => onSelect(item)}
        >
          <View className="w-8 h-8 rounded-full bg-primary-50 items-center justify-center mr-3">
            <Ionicons name="location" size={16} color="#0099DF" />
          </View>
          <View className="flex-1">
            <Text
              className="text-[13px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
              numberOfLines={1}
            >
              {item.short_name || item.display_name}
            </Text>
            <Text
              className="text-[11px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular" }}
              numberOfLines={1}
            >
              {item.context_label || item.display_name}
            </Text>
          </View>
          <Ionicons
            name="arrow-up-outline"
            size={14}
            color="#8AA8C4"
            style={{ transform: [{ rotate: "-45deg" }] }}
          />
        </TouchableOpacity>
      ))}

      <View className="bg-[#F4FAFF] px-4 py-1.5 flex-row items-center justify-between border-t border-[#E1F2FC]">
        <Text
          className="text-[10px] text-[#6889A8]"
          style={{ fontFamily: "Poppins-Medium" }}
        >
          Powered by OpenStreetMap & ArcGIS
        </Text>
        <TouchableOpacity onPress={onDismiss}>
          <Text
            className="text-[11px] text-[#00A8E8]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    shadowColor: "#003B73",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
    zIndex: 9999,
  },
});

