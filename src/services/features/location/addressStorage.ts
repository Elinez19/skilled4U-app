import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SavedAddress {
  id: string;
  label: string; // e.g. "Wuye", "Home", "Workshop", "Office", "Site"
  address: string; // Full formatted address string
  latitude: number;
  longitude: number;
  isCurrentLocation?: boolean;
  isDefault?: boolean;
  role?: "customer" | "artisan" | "both";
  createdAt: number;
}

const STORAGE_KEY = "@skilled4u_saved_addresses_v2";
const ACTIVE_LOCATION_KEY = "skilled4u_selected_location";

export const DEFAULT_PRESET_ADDRESSES: SavedAddress[] = [
  {
    id: "addr_wuye_preset",
    label: "Wuye",
    address:
      "Wuye Ultra Modern Market, Plot 697, Ngozi Okonjo-Iweala, Wuye, Abuja, Municipal Area Council, Federal Capital Territory, 900108, Nigeria",
    latitude: 9.0563,
    longitude: 7.4298,
    isCurrentLocation: true,
    isDefault: true,
    role: "both",
    createdAt: Date.now() - 3600000,
  },
];

/**
 * Fetch all saved addresses, optionally filtered by user role.
 */
export async function getSavedAddresses(
  role?: "customer" | "artisan"
): Promise<SavedAddress[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const list: SavedAddress[] = JSON.parse(raw);
    if (!role) return list;
    return list.filter((item) => !item.role || item.role === "both" || item.role === role);
  } catch {
    return [];
  }
}

/**
 * Save a new address to storage. If isDefault is true or it's the first address,
 * it is set as the active address.
 */
export async function saveAddress(
  item: Omit<SavedAddress, "id" | "createdAt">
): Promise<SavedAddress> {
  const existing = await getSavedAddresses();
  const id = `addr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const isFirst = existing.length === 0;

  const newAddress: SavedAddress = {
    ...item,
    id,
    isDefault: item.isDefault ?? isFirst,
    isCurrentLocation: item.isCurrentLocation ?? true,
    createdAt: Date.now(),
  };

  // If new address is current, update others
  const updatedList: SavedAddress[] = existing.map((addr) => ({
    ...addr,
    isCurrentLocation: item.isCurrentLocation ? false : addr.isCurrentLocation,
    isDefault: item.isDefault ? false : addr.isDefault,
  }));

  updatedList.unshift(newAddress);

  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    // Also update active location in storage
    await AsyncStorage.setItem(
      ACTIVE_LOCATION_KEY,
      JSON.stringify({
        address: newAddress.address,
        latitude: newAddress.latitude,
        longitude: newAddress.longitude,
        label: newAddress.label,
      })
    );
  } catch {
    // Ignore storage errors
  }

  return newAddress;
}

/**
 * Delete a saved address by ID.
 */
export async function deleteAddress(id: string): Promise<SavedAddress[]> {
  try {
    const existing = await getSavedAddresses();
    const filtered = existing.filter((a) => a.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    // If remaining list is not empty, ensure one is default
    if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
      filtered[0].isDefault = true;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      await AsyncStorage.setItem(
        ACTIVE_LOCATION_KEY,
        JSON.stringify({
          address: filtered[0].address,
          latitude: filtered[0].latitude,
          longitude: filtered[0].longitude,
          label: filtered[0].label,
        })
      );
    }
    return filtered;
  } catch {
    return [];
  }
}

/**
 * Mark an address as active / selected.
 */
export async function selectActiveAddress(address: SavedAddress): Promise<void> {
  try {
    const existing = await getSavedAddresses();
    const updated = existing.map((a) => ({
      ...a,
      isCurrentLocation: a.id === address.id,
    }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    await AsyncStorage.setItem(
      ACTIVE_LOCATION_KEY,
      JSON.stringify({
        address: address.address,
        latitude: address.latitude,
        longitude: address.longitude,
        label: address.label,
      })
    );
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get active selected location.
 */
export async function getActiveAddress(): Promise<SavedAddress | null> {
  try {
    const raw = await AsyncStorage.getItem(ACTIVE_LOCATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      id: "active",
      label: parsed.label || "Current",
      address: parsed.address,
      latitude: parsed.latitude ?? 9.0765,
      longitude: parsed.longitude ?? 7.4765,
      isCurrentLocation: true,
      createdAt: Date.now(),
    };
  } catch {
    return null;
  }
}
