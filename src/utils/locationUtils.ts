import * as Location from "expo-location";
import { LocationResult, MapLayerType, PRESET_PLACES } from "../data/locations";

export const TILE_OFFSETS = [-2, -1, 0, 1, 2]; // 5x5 tile grid (1280x1280px) for seamless panning

interface ArcGisReverseResponse {
  address?: {
    PlaceName?: string;
    Address?: string;
    Neighborhood?: string;
    District?: string;
    ShortLabel?: string;
    City?: string;
    Region?: string;
    LongLabel?: string;
    Match_addr?: string;
  };
}

interface ArcGisCandidate {
  address?: string;
  location?: { x?: number; y?: number };
  attributes?: {
    PlaceName?: string;
    Place_addr?: string;
    Match_addr?: string;
    City?: string;
    Region?: string;
  };
}

interface ArcGisFindResponse {
  candidates?: ArcGisCandidate[];
}

interface NominatimItem {
  place_id?: string | number;
  name?: string;
  display_name?: string;
  lat?: string | number;
  lon?: string | number;
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Request timed out")), ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export function latLonToTileFloat(lat: number, lon: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const clampedLat = Math.max(-85.0511, Math.min(85.0511, lat));
  const latRad = (clampedLat * Math.PI) / 180;
  const tileXFloat = ((lon + 180) / 360) * n;
  const tileYFloat =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { tileXFloat, tileYFloat, n };
}

export function pixelDeltaToLatLon(
  baseLat: number,
  baseLon: number,
  zoom: number,
  deltaPixelX: number,
  deltaPixelY: number
) {
  const { tileXFloat, tileYFloat, n } = latLonToTileFloat(baseLat, baseLon, zoom);
  const newTileX = tileXFloat + deltaPixelX / 256;
  const newTileY = Math.max(0.001, Math.min(n - 0.001, tileYFloat + deltaPixelY / 256));

  let newLon = (newTileX / n) * 360 - 180;
  if (newLon > 180) newLon -= 360;
  if (newLon < -180) newLon += 360;

  const mercN = Math.PI - (2 * Math.PI * newTileY) / n;
  const newLat =
    (180 / Math.PI) * Math.atan(0.5 * (Math.exp(mercN) - Math.exp(-mercN)));

  return {
    lat: Math.max(-85, Math.min(85, newLat)),
    lon: newLon,
  };
}

export function getFreeTileUrl(x: number, y: number, z: number, layer: MapLayerType) {
  const n = Math.pow(2, z);
  const wrappedX = ((x % n) + n) % n;
  const clampedY = Math.max(0, Math.min(n - 1, y));

  if (layer === "satellite") {
    return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${clampedY}/${wrappedX}`;
  }
  if (layer === "detailed") {
    return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${z}/${clampedY}/${wrappedX}`;
  }
  const subdomains = ["a", "b", "c"];
  const sub = subdomains[Math.abs(wrappedX + clampedY) % subdomains.length];
  return `https://${sub}.basemaps.cartocdn.com/rastertiles/voyager/${z}/${wrappedX}/${clampedY}.png`;
}

export function getNextMapLayer(current: MapLayerType): MapLayerType {
  if (current === "streets") return "detailed";
  if (current === "detailed") return "satellite";
  return "streets";
}

export function getMapLayerLabel(layer: MapLayerType): string {
  if (layer === "satellite") return "Satellite";
  if (layer === "detailed") return "Esri Map";
  return "OSM Streets";
}

export function getServiceRadiusPixelSize(serviceRadius?: string): number {
  if (!serviceRadius) return 0;
  const km = parseInt(serviceRadius, 10) || 5;
  if (km <= 3) return 88;
  if (km <= 5) return 118;
  if (km <= 10) return 148;
  return 176;
}

export function matchPresetPlaces(text: string): LocationResult[] {
  const tokens = text
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);
  if (tokens.length === 0) return [];

  return PRESET_PLACES.filter((item) => {
    const hay = `${item.short_name || ""} ${item.display_name} ${
      item.context_label || ""
    }`.toLowerCase();
    return tokens.every((tok) => hay.includes(tok));
  });
}

export async function reverseGeocodeCoordinates(
  lat: number,
  lon: number,
  fallbackText?: string
): Promise<LocationResult> {
  try {
    // 1. Free ArcGIS World Reverse Geocoder (Fast, no API key required)
    const arcgisRevUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${lon},${lat}&f=json`;
    const arcRes = await withTimeout(fetch(arcgisRevUrl), 3200).catch(() => null);
    if (arcRes && arcRes.ok) {
      const arcData = (await arcRes.json()) as ArcGisReverseResponse;
      const addr = arcData?.address;
      if (addr?.Match_addr || addr?.LongLabel) {
        const shortName =
          addr.PlaceName ||
          addr.Address ||
          addr.Neighborhood ||
          addr.District ||
          addr.ShortLabel ||
          addr.City ||
          "Pinned Location";
        const display = (addr.LongLabel || addr.Match_addr || shortName)
          .replace(/, NGA$/i, ", Nigeria")
          .trim();
        return {
          place_id: `arcgis.pin.${Date.now()}`,
          short_name: shortName,
          display_name: display,
          context_label: [addr.District, addr.City, addr.Region, "Nigeria"]
            .filter(Boolean)
            .join(", "),
          lat: String(lat),
          lon: String(lon),
        };
      }
    }

    // 2. Free OpenStreetMap Nominatim Reverse Geocoder fallback
    const osmRevUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const osmRes = await withTimeout(
      fetch(osmRevUrl, {
        headers: {
          "User-Agent": "Skilled4U-App/1.0",
          "Accept-Language": "en",
        },
      }),
      3200
    ).catch(() => null);

    if (osmRes && osmRes.ok) {
      const osmData = (await osmRes.json()) as NominatimItem;
      if (osmData?.display_name) {
        const parts = String(osmData.display_name)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const shortName = osmData.name || parts[0] || "Pinned Location";
        const cleanAddress = parts.slice(0, 4).join(", ");
        return {
          place_id: `osm.pin.${Date.now()}`,
          short_name: shortName,
          display_name: cleanAddress || osmData.display_name,
          lat: String(lat),
          lon: String(lon),
        };
      }
    }
  } catch {
    // Fallback to coordinate label below
  }

  const fallbackLabel = `Pinned Location (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`;
  return {
    place_id: `pin.${Date.now()}`,
    short_name: "Pinned Map Location",
    display_name: fallbackText?.trim() || fallbackLabel,
    lat: String(lat),
    lon: String(lon),
  };
}

export async function searchFreeLocationsApi(
  trimmedQuery: string,
  fallbackCoords: { lat: number; lon: number },
  localMatches: LocationResult[]
): Promise<LocationResult[]> {
  try {
    // 1. Live ArcGIS World Geocoding Service
    const arcgisUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${encodeURIComponent(
      trimmedQuery
    )}&CountryCode=NGA&maxLocations=6&outFields=PlaceName,Place_addr,Match_addr,City,Region&f=json`;

    const arcResponse = await withTimeout(fetch(arcgisUrl), 3500).catch(() => null);
    const liveCandidates: LocationResult[] = [];

    if (arcResponse && arcResponse.ok) {
      const arcData = (await arcResponse.json()) as ArcGisFindResponse;
      if (Array.isArray(arcData?.candidates) && arcData.candidates.length > 0) {
        arcData.candidates.forEach((cand, idx) => {
          const lon = cand?.location?.x;
          const lat = cand?.location?.y;
          if (typeof lat === "number" && typeof lon === "number") {
            const attrs = cand.attributes || {};
            const shortName =
              attrs.PlaceName ||
              String(cand.address || "").split(",")[0] ||
              trimmedQuery;
            const fullAddr =
              attrs.Place_addr && attrs.Place_addr !== attrs.PlaceName
                ? `${shortName}, ${attrs.Place_addr}`
                : cand.address || attrs.Match_addr || shortName;
            const contextStr =
              [attrs.City, attrs.Region, "Nigeria"].filter(Boolean).join(", ") ||
              "Nigeria";

            liveCandidates.push({
              place_id: `arcgis.${idx}.${lat.toFixed(4)}.${lon.toFixed(4)}`,
              short_name: shortName,
              display_name: fullAddr,
              place_name: fullAddr,
              context_label: contextStr,
              lat: String(lat),
              lon: String(lon),
            });
          }
        });
      }
    }

    // 2. Supplement with OpenStreetMap Nominatim if needed
    if (liveCandidates.length < 3) {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        trimmedQuery
      )}&format=json&addressdetails=1&limit=5&countrycodes=ng`;
      const osmResponse = await withTimeout(
        fetch(nominatimUrl, {
          headers: {
            "User-Agent": "Skilled4U-App/1.0",
            "Accept-Language": "en",
          },
        }),
        3200
      ).catch(() => null);

      if (osmResponse && osmResponse.ok) {
        const osmData = (await osmResponse.json()) as NominatimItem[];
        if (Array.isArray(osmData)) {
          osmData.forEach((item) => {
            const parts = String(item.display_name || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            const shortName = item.name || parts[0] || trimmedQuery;
            const cleanDisplay = parts.slice(0, 4).join(", ");
            const contextStr = parts.slice(1, 5).join(", ") || "Nigeria";
            liveCandidates.push({
              place_id: `osm.${item.place_id}`,
              short_name: shortName,
              display_name: cleanDisplay || String(item.display_name || ""),
              place_name: cleanDisplay || String(item.display_name || ""),
              context_label: contextStr,
              lat: String(item.lat),
              lon: String(item.lon),
            });
          });
        }
      }
    }

    const combined = [...localMatches, ...liveCandidates].filter(
      (v, idx, arr) =>
        arr.findIndex(
          (x) => x.display_name.toLowerCase() === v.display_name.toLowerCase()
        ) === idx
    );

    if (combined.length > 0) {
      return combined.slice(0, 6);
    }
  } catch {
    // Fall through to offline / custom fallback below
  }

  // 3. Offline / Custom address fallback
  const customSuggestion: LocationResult = {
    place_id: `custom.${Date.now()}`,
    short_name: trimmedQuery,
    display_name: trimmedQuery.includes(",")
      ? trimmedQuery
      : `${trimmedQuery}, Abuja, FCT`,
    context_label: "Custom Street Address • Nigeria",
    lat: localMatches[0]?.lat || String(fallbackCoords.lat),
    lon: localMatches[0]?.lon || String(fallbackCoords.lon),
  };

  return localMatches.length > 0
    ? [...localMatches, customSuggestion].slice(0, 5)
    : [customSuggestion, ...PRESET_PLACES.slice(0, 4)];
}

export async function getDeviceGpsCoordinates(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  try {
    const { status } = await withTimeout(
      Location.requestForegroundPermissionsAsync(),
      3500
    );

    if (status === "granted") {
      let loc = await withTimeout(
        Location.getLastKnownPositionAsync(),
        1500
      ).catch(() => null);

      if (!loc) {
        loc = await withTimeout(
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }),
          3500
        );
      }

      if (loc?.coords) {
        return {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
      }
    }
  } catch {
    // Emulator without GPS fix -> return null
  }
  return null;
}

