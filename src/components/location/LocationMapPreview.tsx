import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  LocationResult,
  MapLayerType,
  PRESET_PLACES,
  SelectedMapCoords,
} from "../../data/locations";
import { InteractiveMapCanvas } from "./InteractiveMapCanvas";

interface LocationMapPreviewProps {
  selectedCoords: SelectedMapCoords;
  zoom: number;
  mapLayer: MapLayerType;
  layerLabel: string;
  serviceRadius?: string;
  isReverseGeocoding: boolean;
  isLocatingGps: boolean;
  onPinMoved: (lat: number, lon: number) => void;
  onCycleMapLayer: () => void;
  onOpenFullMap: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUseCurrentLocation: () => void;
  onSelectPreset: (preset: LocationResult) => void;
}

export function LocationMapPreview({
  selectedCoords,
  zoom,
  mapLayer,
  layerLabel,
  serviceRadius,
  isReverseGeocoding,
  isLocatingGps,
  onPinMoved,
  onCycleMapLayer,
  onOpenFullMap,
  onZoomIn,
  onZoomOut,
  onUseCurrentLocation,
  onSelectPreset,
}: LocationMapPreviewProps) {
  return (
    <View className="mb-4">
      <InteractiveMapCanvas
        lat={selectedCoords.lat}
        lon={selectedCoords.lon}
        zoom={zoom}
        mapLayer={mapLayer}
        serviceRadius={serviceRadius}
        pinSize="md"
        defaultDimensions={{ width: 340, height: 220 }}
        onPinMoved={onPinMoved}
        containerStyle={[
          styles.mapContainer,
          mapLayer === "satellite"
            ? styles.mapContainerSatellite
            : styles.mapContainerStreets,
        ]}
        renderOverlays={(liveCoords) => (
          <>
            {/* Top-Left Live Area Pill */}
            <View
              pointerEvents="none"
              style={styles.topLeftBadge}
              className="bg-white/95 px-2.5 py-1.5 rounded-full flex-row items-center border border-[#D6ECFA]"
            >
              {isReverseGeocoding ? (
                <ActivityIndicator
                  size="small"
                  color="#00A8E8"
                  style={{ marginRight: 6, transform: [{ scale: 0.75 }] }}
                />
              ) : (
                <View className="w-2 h-2 rounded-full bg-[#10B981] mr-1.5" />
              )}
              <Text
                className="text-[11px] text-[#003B73]"
                style={{ fontFamily: "Poppins-SemiBold" }}
                numberOfLines={1}
              >
                {isReverseGeocoding
                  ? "Updating pin address..."
                  : selectedCoords.areaLabel}
              </Text>
            </View>

            {/* Top-Right Controls: Layer Switcher + Fullscreen Expand */}
            <View style={styles.topRightControls} className="flex-row items-center">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onCycleMapLayer}
                className="bg-white/95 px-2.5 py-1.5 rounded-full flex-row items-center border border-[#D6ECFA] mr-1.5"
              >
                <Ionicons
                  name={mapLayer === "satellite" ? "earth" : "layers-outline"}
                  size={13}
                  color="#0099DF"
                />
                <Text
                  className="text-[11px] text-[#003B73] ml-1"
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  {layerLabel}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onOpenFullMap}
                className="w-7 h-7 rounded-full bg-white/95 border border-[#D6ECFA] items-center justify-center"
              >
                <Ionicons name="expand-outline" size={14} color="#003B73" />
              </TouchableOpacity>
            </View>

            {/* Bottom-Left OpenStreetMap / Live Coordinates Badge */}
            <View
              pointerEvents="none"
              style={styles.bottomLeftBadge}
              className="bg-primary-900/90 px-2.5 py-1 rounded-md flex-row items-center"
            >
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={12}
                color="#38C8FF"
              />
              <Text
                className="text-[10px] text-white ml-1"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                OpenStreetMap
              </Text>
              <Text
                className="text-[9px] text-[#BAE6FD] ml-1.5"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                {liveCoords.lat.toFixed(4)}°N, {liveCoords.lon.toFixed(4)}°E
              </Text>
            </View>

            {/* Bottom-Right Zoom & Current GPS Controls */}
            <View
              style={styles.bottomRightControls}
              className="flex-row items-center"
            >
              <View className="flex-row bg-white/95 rounded-lg border border-[#D6ECFA] mr-2 overflow-hidden">
                <TouchableOpacity
                  onPress={onZoomOut}
                  className="px-2.5 py-1.5 border-r border-[#E6F4FC]"
                >
                  <Ionicons name="remove" size={14} color="#003B73" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onZoomIn} className="px-2.5 py-1.5">
                  <Ionicons name="add" size={14} color="#003B73" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onUseCurrentLocation}
                className="w-8 h-8 rounded-full bg-white border border-[#D6ECFA] items-center justify-center"
              >
                {isLocatingGps ? (
                  <ActivityIndicator size="small" color="#00A8E8" />
                ) : (
                  <Ionicons name="locate" size={16} color="#00A8E8" />
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      />

      {/* Interactive Hint + Quick-Select Area Chips */}
      <View className="flex-row items-center justify-between mt-1.5 mb-0.5 px-1">
        <Text
          className="text-[11px] text-[#5B7C99]"
          style={{ fontFamily: "Poppins-Regular" }}
        >
          Drag map or tap anywhere to move pin
        </Text>
        <TouchableOpacity onPress={onOpenFullMap}>
          <Text
            className="text-[11px] text-[#00A8E8]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Full Map
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.chipsScrollContent}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onUseCurrentLocation}
          className="flex-row items-center bg-primary-50 border border-[#B8E2F8] px-3 py-1.5 rounded-full mr-2"
        >
          <Ionicons name="navigate" size={13} color="#0099DF" />
          <Text
            className="text-[11px] text-[#003B73] ml-1.5"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Use Current GPS
          </Text>
        </TouchableOpacity>

        {PRESET_PLACES.slice(0, 6).map((preset) => (
          <TouchableOpacity
            key={preset.place_id}
            onPress={() => onSelectPreset(preset)}
            className="mr-2 bg-white border border-[#D6ECFA] px-3 py-1.5 rounded-full"
          >
            <Text
              className="text-[11px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Medium" }}
            >
              {preset.short_name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  mapContainerStreets: {
    backgroundColor: "#E8F1F8",
    borderColor: "#D0E8F8",
  },
  mapContainerSatellite: {
    backgroundColor: "#12263A",
    borderColor: "#294D6E",
  },
  topLeftBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    maxWidth: "56%",
  },
  topRightControls: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  bottomLeftBadge: {
    position: "absolute",
    bottom: 10,
    left: 12,
  },
  bottomRightControls: {
    position: "absolute",
    bottom: 10,
    right: 12,
  },
  chipsScrollContent: {
    paddingTop: 8,
    paddingBottom: 2,
    alignItems: "center",
  },
});

