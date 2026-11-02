import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapLayerType, SelectedMapCoords } from "../../data/locations";
import { InteractiveMapCanvas } from "./InteractiveMapCanvas";

interface FullScreenMapModalProps {
  visible: boolean;
  query: string;
  selectedCoords: SelectedMapCoords;
  zoom: number;
  mapLayer: MapLayerType;
  layerLabel: string;
  serviceRadius?: string;
  isReverseGeocoding: boolean;
  isLocatingGps: boolean;
  onClose: () => void;
  onPinMoved: (lat: number, lon: number) => void;
  onCycleMapLayer: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUseCurrentLocation: () => void;
}

export function FullScreenMapModal({
  visible,
  query,
  selectedCoords,
  zoom,
  mapLayer,
  layerLabel,
  serviceRadius,
  isReverseGeocoding,
  isLocatingGps,
  onClose,
  onPinMoved,
  onCycleMapLayer,
  onZoomIn,
  onZoomOut,
  onUseCurrentLocation,
}: FullScreenMapModalProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F4FAFF" }}>
        {/* Modal Header */}
        <View className="flex-row items-center justify-between px-5 py-3.5 bg-white border-b border-[#D6ECFA]">
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 rounded-full bg-[#F4FAFF] border border-[#D6ECFA] items-center justify-center"
          >
            <Ionicons name="close" size={20} color="#003B73" />
          </TouchableOpacity>
          <View className="items-center flex-1 mx-3">
            <Text
              className="text-[16px] text-[#003B73]"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Move Pin to Exact Location
            </Text>
            <Text
              className="text-[11px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular" }}
              numberOfLines={1}
            >
              {selectedCoords.areaLabel}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onCycleMapLayer}
            className="px-3 py-2 rounded-full bg-primary-50 border border-[#B8E2F8] flex-row items-center"
          >
            <Ionicons name="layers-outline" size={14} color="#0099DF" />
            <Text
              className="text-[11px] text-[#003B73] ml-1"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              {layerLabel}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fullscreen Interactive Map Viewport */}
        <InteractiveMapCanvas
          lat={selectedCoords.lat}
          lon={selectedCoords.lon}
          zoom={zoom}
          mapLayer={mapLayer}
          serviceRadius={serviceRadius}
          pinSize="lg"
          defaultDimensions={{ width: 380, height: 520 }}
          onPinMoved={onPinMoved}
          containerStyle={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: mapLayer === "satellite" ? "#12263A" : "#E8F1F8",
          }}
        >
          {/* Floating Zoom + GPS Controls */}
          <View
            style={{ position: "absolute", right: 16, bottom: 24 }}
            className="items-center"
          >
            <TouchableOpacity
              onPress={onUseCurrentLocation}
              className="w-11 h-11 rounded-full bg-white border border-[#D6ECFA] items-center justify-center mb-3"
            >
              {isLocatingGps ? (
                <ActivityIndicator size="small" color="#00A8E8" />
              ) : (
                <Ionicons name="locate" size={20} color="#00A8E8" />
              )}
            </TouchableOpacity>

            <View className="bg-white rounded-2xl border border-[#D6ECFA] overflow-hidden">
              <TouchableOpacity
                onPress={onZoomIn}
                className="w-11 h-11 items-center justify-center border-b border-[#E6F4FC]"
              >
                <Ionicons name="add" size={20} color="#003B73" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onZoomOut}
                className="w-11 h-11 items-center justify-center"
              >
                <Ionicons name="remove" size={20} color="#003B73" />
              </TouchableOpacity>
            </View>
          </View>
        </InteractiveMapCanvas>

        {/* Bottom Address Confirmation Card */}
        <View className="p-5 bg-white border-t border-[#D6ECFA]">
          <View className="flex-row items-center mb-3.5">
            <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center mr-3">
              <Ionicons name="location" size={20} color="#00A8E8" />
            </View>
            <View className="flex-1">
              <Text
                className="text-[12px] text-[#5B7C99]"
                style={{ fontFamily: "Poppins-Medium" }}
              >
                Selected Pin Address
              </Text>
              <Text
                className="text-[14px] text-[#003B73]"
                style={{ fontFamily: "Poppins-SemiBold" }}
                numberOfLines={2}
              >
                {isReverseGeocoding
                  ? "Fetching street address..."
                  : query || selectedCoords.areaLabel}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onClose}
            className="w-full py-4 rounded-full bg-primary items-center justify-center"
          >
            <Text
              className="text-white text-[15px]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Confirm Pin Location
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

