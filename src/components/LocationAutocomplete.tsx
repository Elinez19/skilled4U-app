import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Keyboard, StyleSheet } from 'react-native';
import { InputField } from './InputField';

interface LocationResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationAutocompleteProps {
  label?: string;
  placeholder?: string;
  onSelect: (location: LocationResult) => void;
  error?: string;
  initialValue?: string;
}

export function LocationAutocomplete({ 
  label = "Location", 
  placeholder = "Search for a city or address...", 
  onSelect,
  error,
  initialValue = ""
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const searchLocations = async (text: string) => {
    if (!text.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setShowResults(true);

    try {
      // Using Nominatim API (OpenStreetMap) - Free and no API key required
      // NOTE: Ensure usage respects their policy (1 request per second max in production)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=5`,
        {
          headers: {
            'User-Agent': 'skilled4U-app', // Nominatim requires a User-Agent
          }
        }
      );
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Error fetching location data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    setQuery(text);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce the API call by 500ms to avoid spamming the free API
    debounceTimer.current = setTimeout(() => {
      searchLocations(text);
    }, 500);
  };

  const handleSelect = (item: LocationResult) => {
    Keyboard.dismiss();
    setQuery(item.display_name);
    setShowResults(false);
    onSelect(item);
  };

  return (
    <View className="w-full relative z-50 mb-4">
      <InputField
        label={label}
        placeholder={placeholder}
        value={query}
        onChangeText={handleTextChange}
        error={error}
        onFocus={() => {
          if (results.length > 0) {
            setShowResults(true);
          }
        }}
      />

      {/* Loading Indicator inside the input's absolute position would be better, but we can put it here */}
      {isLoading && (
        <View className="absolute right-4 top-10">
          <ActivityIndicator size="small" color="#4F46E5" />
        </View>
      )}

      {/* Dropdown Results */}
      {showResults && results.length > 0 && (
        <View style={styles.dropdownContainer} className="bg-white rounded-xl border border-neutral-200 mt-1 absolute w-full top-20 overflow-hidden">
          {results.map((item, index) => (
            <TouchableOpacity
              key={item.place_id}
              className={`p-4 ${index !== results.length - 1 ? 'border-b border-neutral-100' : ''}`}
              onPress={() => handleSelect(item)}
            >
              <Text className="text-neutral-800 body-md" numberOfLines={2}>
                {item.display_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 9999,
  }
});
