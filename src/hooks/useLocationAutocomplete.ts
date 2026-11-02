import { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";
import {
  DEFAULT_MAP_COORDS,
  LocationResult,
  MapLayerType,
  PRESET_PLACES,
  SelectedMapCoords,
} from "../data/locations";
import {
  getDeviceGpsCoordinates,
  getMapLayerLabel,
  getNextMapLayer,
  matchPresetPlaces,
  reverseGeocodeCoordinates,
  searchFreeLocationsApi,
} from "../utils/locationUtils";

interface UseLocationAutocompleteOptions {
  initialValue?: string;
  onSelect: (location: LocationResult) => void;
  onChangeText?: (text: string) => void;
}

export function useLocationAutocomplete({
  initialValue = "",
  onSelect,
  onChangeText,
}: UseLocationAutocompleteOptions) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [mapLayer, setMapLayer] = useState<MapLayerType>("streets");
  const [zoom, setZoom] = useState<number>(15);
  const [isFullMapOpen, setIsFullMapOpen] = useState(false);

  const [selectedCoords, setSelectedCoords] = useState<SelectedMapCoords>({
    ...DEFAULT_MAP_COORDS,
    areaLabel: initialValue || DEFAULT_MAP_COORDS.areaLabel,
  });

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initialValue && initialValue !== query) {
      setQuery(initialValue);
      const matchedPreset = PRESET_PLACES.find(
        (p) =>
          p.display_name.toLowerCase().includes(initialValue.toLowerCase()) ||
          (p.short_name &&
            p.short_name.toLowerCase().includes(initialValue.toLowerCase()))
      );
      if (matchedPreset) {
        setSelectedCoords({
          lat: parseFloat(matchedPreset.lat),
          lon: parseFloat(matchedPreset.lon),
          areaLabel: matchedPreset.short_name || initialValue,
        });
      } else {
        setSelectedCoords((prev) => ({
          ...prev,
          areaLabel: initialValue,
        }));
      }
    }
  }, [initialValue]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSelect = useCallback(
    (item: LocationResult) => {
      Keyboard.dismiss();
      setQuery(item.display_name);
      setShowResults(false);
      setIsFocused(false);
      setSelectedCoords({
        lat: parseFloat(item.lat) || DEFAULT_MAP_COORDS.lat,
        lon: parseFloat(item.lon) || DEFAULT_MAP_COORDS.lon,
        areaLabel: item.short_name || item.display_name.split(",")[0],
      });
      onChangeText?.(item.display_name);
      onSelect(item);
    },
    [onChangeText, onSelect]
  );

  const handleMapPinMoved = useCallback(
    async (lat: number, lon: number) => {
      setSelectedCoords((prev) => ({
        ...prev,
        lat,
        lon,
      }));
      setIsReverseGeocoding(true);
      const resolvedItem = await reverseGeocodeCoordinates(lat, lon, query);
      setQuery(resolvedItem.display_name);
      setSelectedCoords({
        lat,
        lon,
        areaLabel: resolvedItem.short_name || "Pinned Map Location",
      });
      onChangeText?.(resolvedItem.display_name);
      onSelect(resolvedItem);
      setIsReverseGeocoding(false);
    },
    [onChangeText, onSelect, query]
  );

  const performSearch = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      setShowResults(true);

      const localMatches = matchPresetPlaces(trimmed);
      if (localMatches.length > 0) {
        const firstLocal = localMatches[0];
        setSelectedCoords({
          lat: parseFloat(firstLocal.lat) || DEFAULT_MAP_COORDS.lat,
          lon: parseFloat(firstLocal.lon) || DEFAULT_MAP_COORDS.lon,
          areaLabel:
            firstLocal.short_name || firstLocal.display_name.split(",")[0],
        });
      }

      const foundResults = await searchFreeLocationsApi(
        trimmed,
        { lat: selectedCoords.lat, lon: selectedCoords.lon },
        localMatches
      );

      setResults(foundResults);
      if (foundResults.length > 0) {
        const top = foundResults[0];
        setSelectedCoords({
          lat: parseFloat(top.lat) || DEFAULT_MAP_COORDS.lat,
          lon: parseFloat(top.lon) || DEFAULT_MAP_COORDS.lon,
          areaLabel: top.short_name || top.display_name.split(",")[0],
        });
      }
      setIsLoading(false);
    },
    [selectedCoords.lat, selectedCoords.lon]
  );

  const handleTextChange = useCallback(
    (text: string) => {
      setQuery(text);
      onChangeText?.(text);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        performSearch(text);
      }, 250);
    },
    [onChangeText, performSearch]
  );

  const handleClearQuery = useCallback(() => {
    setQuery("");
    onChangeText?.("");
    setResults(PRESET_PLACES.slice(0, 5));
  }, [onChangeText]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    if (results.length > 0) {
      setShowResults(true);
    } else {
      setResults(PRESET_PLACES.slice(0, 5));
      setShowResults(true);
    }
  }, [results.length]);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleInputSubmit = useCallback(() => {
    if (results.length > 0) {
      handleSelect(results[0]);
    } else {
      setShowResults(false);
    }
  }, [handleSelect, results]);

  const handleUseCurrentLocation = useCallback(async () => {
    Keyboard.dismiss();
    setIsLocatingGps(true);
    setShowResults(false);

    const coords = await getDeviceGpsCoordinates();
    if (coords) {
      await handleMapPinMoved(coords.latitude, coords.longitude);
      setIsLocatingGps(false);
      return;
    }

    setIsLocatingGps(false);
    handleSelect(PRESET_PLACES[0]);
  }, [handleMapPinMoved, handleSelect]);

  const cycleMapLayer = useCallback(() => {
    setMapLayer((prev) => getNextMapLayer(prev));
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(18, z + 1));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(10, z - 1));
  }, []);

  return {
    query,
    results,
    isLoading,
    isLocatingGps,
    isReverseGeocoding,
    showResults,
    isFocused,
    mapLayer,
    layerLabel: getMapLayerLabel(mapLayer),
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
  };
}

