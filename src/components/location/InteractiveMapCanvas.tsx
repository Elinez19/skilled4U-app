import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import React, { useMemo, useRef, useState } from "react";
import {
  Keyboard,
  LayoutChangeEvent,
  PanResponder,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { MapLayerType } from "../../data/locations";
import {
  getFreeTileUrl,
  getServiceRadiusPixelSize,
  latLonToTileFloat,
  pixelDeltaToLatLon,
  TILE_OFFSETS,
} from "../../utils/locationUtils";

interface InteractiveMapCanvasProps {
  lat: number;
  lon: number;
  zoom: number;
  mapLayer: MapLayerType;
  serviceRadius?: string;
  pinSize?: "md" | "lg";
  defaultDimensions?: { width: number; height: number };
  containerStyle?: StyleProp<ViewStyle>;
  onPinMoved: (lat: number, lon: number) => void;
  renderOverlays?: (liveCoords: { lat: number; lon: number }) => React.ReactNode;
  children?: React.ReactNode;
}

export function InteractiveMapCanvas({
  lat,
  lon,
  zoom,
  mapLayer,
  serviceRadius,
  pinSize = "md",
  defaultDimensions = { width: 340, height: 220 },
  containerStyle,
  onPinMoved,
  renderOverlays,
  children,
}: InteractiveMapCanvasProps) {
  const [dimensions, setDimensions] = useState(defaultDimensions);
  const [panDelta, setPanDelta] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const latestRef = useRef({
    lat,
    lon,
    zoom,
    width: dimensions.width,
    height: dimensions.height,
    onPinMoved,
  });

  latestRef.current = {
    lat,
    lon,
    zoom,
    width: dimensions.width,
    height: dimensions.height,
    onPinMoved,
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          Keyboard.dismiss();
          setIsDragging(true);
        },
        onPanResponderMove: (_, gestureState) => {
          setPanDelta({
            x: gestureState.dx,
            y: gestureState.dy,
          });
        },
        onPanResponderRelease: (evt, gestureState) => {
          setIsDragging(false);
          const {
            lat: baseLat,
            lon: baseLon,
            zoom: currentZoom,
            width: viewW,
            height: viewH,
            onPinMoved: notifyMoved,
          } = latestRef.current;

          const isTap =
            Math.abs(gestureState.dx) < 6 && Math.abs(gestureState.dy) < 6;

          let nextCoords = { lat: baseLat, lon: baseLon };
          if (isTap) {
            const tapX = evt.nativeEvent.locationX ?? viewW / 2;
            const tapY = evt.nativeEvent.locationY ?? viewH / 2;
            const deltaX = tapX - viewW / 2;
            const deltaY = tapY - viewH / 2;
            if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
              nextCoords = pixelDeltaToLatLon(
                baseLat,
                baseLon,
                currentZoom,
                deltaX,
                deltaY
              );
            }
          } else {
            nextCoords = pixelDeltaToLatLon(
              baseLat,
              baseLon,
              currentZoom,
              -gestureState.dx,
              -gestureState.dy
            );
          }

          setPanDelta({ x: 0, y: 0 });
          notifyMoved(nextCoords.lat, nextCoords.lon);
        },
        onPanResponderTerminate: () => {
          setIsDragging(false);
          setPanDelta({ x: 0, y: 0 });
        },
      }),
    []
  );

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setDimensions({ width, height });
    }
  };

  const liveCoords = isDragging
    ? pixelDeltaToLatLon(lat, lon, zoom, -panDelta.x, -panDelta.y)
    : { lat, lon };

  const { tileXFloat, tileYFloat } = latLonToTileFloat(lat, lon, zoom);
  const centerTileX = Math.floor(tileXFloat);
  const centerTileY = Math.floor(tileYFloat);
  const offsetX = (tileXFloat - centerTileX) * 256;
  const offsetY = (tileYFloat - centerTileY) * 256;
  const radiusCircleSize = getServiceRadiusPixelSize(serviceRadius);
  const isLargePin = pinSize === "lg";

  return (
    <View onLayout={handleLayout} style={containerStyle}>
      {/* Interactive Touch & Drag Surface + Slippy Map Tiles */}
      <View {...panResponder.panHandlers} style={StyleSheet.absoluteFill}>
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: 1280,
            height: 1280,
            left: dimensions.width / 2 - (512 + offsetX) + panDelta.x,
            top: dimensions.height / 2 - (512 + offsetY) + panDelta.y,
          }}
        >
          {TILE_OFFSETS.map((dy) =>
            TILE_OFFSETS.map((dx) => {
              const tx = centerTileX + dx;
              const ty = centerTileY + dy;
              const uri = getFreeTileUrl(tx, ty, zoom, mapLayer);
              return (
                <ExpoImage
                  key={`${zoom}_${tx}_${ty}_${mapLayer}`}
                  source={{ uri }}
                  cachePolicy="memory-disk"
                  transition={120}
                  contentFit="cover"
                  style={{
                    position: "absolute",
                    left: (dx + 2) * 256,
                    top: (dy + 2) * 256,
                    width: 256,
                    height: 256,
                  }}
                />
              );
            })
          )}
        </View>
      </View>

      {/* Optional Artisan Service Radius Ring */}
      {radiusCircleSize > 0 && (
        <View
          pointerEvents="none"
          style={{
            width: radiusCircleSize,
            height: radiusCircleSize,
            borderRadius: radiusCircleSize / 2,
          }}
          className="absolute bg-primary/15 border border-primary/70 items-center justify-center"
        />
      )}

      {/* Center Interactive Pin Marker */}
      <View
        pointerEvents="none"
        style={{
          transform: [{ translateY: isDragging ? (isLargePin ? -12 : -10) : 0 }],
        }}
        className="items-center justify-center"
      >
        <View
          style={styles.pinShadow}
          className={`${
            isLargePin ? "w-12 h-12" : "w-11 h-11"
          } rounded-full bg-primary items-center justify-center border-2 border-white`}
        >
          <Ionicons
            name="location"
            size={isLargePin ? 22 : 20}
            color="#FFFFFF"
          />
        </View>
        <View
          className={`${
            isLargePin ? "w-3.5 h-3.5" : "w-3 h-3"
          } bg-primary rotate-45 -mt-1.5`}
        />
        <View
          className={`${
            isLargePin ? "w-5 h-2" : "w-4 h-1.5"
          } rounded-full bg-primary-900/40 mt-1`}
        />
      </View>

      {renderOverlays?.(liveCoords)}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  pinShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#0088CC",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.32,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});

