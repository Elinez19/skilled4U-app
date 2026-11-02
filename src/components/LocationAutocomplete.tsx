import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LocationResult } from "../data/locations";
import { useLocationAutocomplete } from "../hooks/useLocationAutocomplete";
import { FullScreenMapModal } from "./location/FullScreenMapModal";
import { LocationMapPreview } from "./location/LocationMapPreview";
import { LocationSearchDropdown } from "./location/LocationSearchDropdown";

export type { LocationResult } from "../data/locations";

interface LocationAutocompleteProps {
  label?: string;
  placeholder?: string;
  onSelect: (location: LocationResult) => void;
  onChangeText?: (text: string) => void;
  error?: string;
  initialValue?: string;
  showMapPreview?: boolean;
  serviceRadius?: string;
}

export function LocationAutocomplete({
  label = "Address",
  placeholder = "Search street, neighborhood or city...",
  onSelect,
  onChangeText,
  error,
  initialValue = "",
  showMapPreview = true,
  serviceRadius,
}: LocationAutocompleteProps) {
  const {
    query,
    results,
    isLoading,
    isLocatingGps,
    isReverseGeocoding,
    showResults,
    isFocused,
    mapLayer,
    layerLabel,
    zoom,
    isFullMapOpen,
    selectedCoords,
    setShowResults,
    setIsFullMapOpen,
    handleTextChange,
    handleSelect,
    handleClearQuery,
    handleInputFocus,
    handleInputBlur,
    handleInputSubmit,
    handleUseCurrentLocation,
    handleMapPinMoved,
    cycleMapLayer,
    zoomIn,
    zoomOut,
  } = useLocationAutocomplete({
    initialValue,
    onSelect,
    onChangeText,
  });

  return (
    <View className="w-full relative z-50 mb-4">
      {showMapPreview && (
        <LocationMapPreview
          selectedCoords={selectedCoords}
          zoom={zoom}
          mapLayer={mapLayer}
          layerLabel={layerLabel}
          serviceRadius={serviceRadius}
          isReverseGeocoding={isReverseGeocoding}
          isLocatingGps={isLocatingGps}
          onPinMoved={handleMapPinMoved}
          onCycleMapLayer={cycleMapLayer}
          onOpenFullMap={() => setIsFullMapOpen(true)}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onUseCurrentLocation={handleUseCurrentLocation}
          onSelectPreset={handleSelect}
        />
      )}

      {label ? (
        <Text
          className="text-[14px] text-[#003B73] mb-1.5"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          {label}
        </Text>
      ) : null}

      <View
        className={`flex-row items-center border rounded-2xl bg-white px-4 h-14 ${
          error
            ? "border-error bg-red-50/20"
            : isFocused
              ? "border-primary bg-[#F8FDFF]"
              : "border-[#D0E8F8]"
        }`}
      >
        <Ionicons
          name="location-outline"
          size={20}
          color={isFocused ? "#00A8E8" : "#0099DF"}
          style={{ marginRight: 10 }}
        />

        <TextInput
          className="flex-1 text-[15px] text-[#003B73] h-full"
          style={{ fontFamily: "Poppins-Regular" }}
          placeholder={placeholder}
          placeholderTextColor="#7A9BB8"
          value={query}
          onChangeText={handleTextChange}
          returnKeyType="search"
          onSubmitEditing={handleInputSubmit}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />

        {isLoading ? (
          <ActivityIndicator size="small" color="#00A8E8" />
        ) : query.length > 0 ? (
          <TouchableOpacity onPress={handleClearQuery} className="p-1">
            <Ionicons name="close-circle" size={18} color="#8AA8C4" />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? <Text className="text-error body-sm mt-1">{error}</Text> : null}

      {showResults && results.length > 0 && (
        <LocationSearchDropdown
          results={results}
          onSelect={handleSelect}
          onDismiss={() => setShowResults(false)}
        />
      )}

      <FullScreenMapModal
        visible={isFullMapOpen}
        query={query}
        selectedCoords={selectedCoords}
        zoom={zoom}
        mapLayer={mapLayer}
        layerLabel={layerLabel}
        serviceRadius={serviceRadius}
        isReverseGeocoding={isReverseGeocoding}
        isLocatingGps={isLocatingGps}
        onClose={() => setIsFullMapOpen(false)}
        onPinMoved={handleMapPinMoved}
        onCycleMapLayer={cycleMapLayer}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onUseCurrentLocation={handleUseCurrentLocation}
      />
    </View>
  );
}
