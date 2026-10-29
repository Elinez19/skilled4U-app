import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as Location from "expo-location";

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  status: "idle" | "loading" | "success" | "error" | "permission_denied";
  error: string | null;
}

const initialState: LocationState = {
  latitude: 9.0765,
  longitude: 7.4765,
  address: "Wuse 2, Abuja",
  status: "idle",
  error: null,
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Location timeout")), ms);
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

export const fetchUserLocation = createAsyncThunk(
  "location/fetchUserLocation",
  async (_, thunkAPI) => {
    try {
      const { status } = await withTimeout(
        Location.requestForegroundPermissionsAsync(),
        3500
      );

      if (status !== "granted") {
        return thunkAPI.rejectWithValue("Permission to access location was denied");
      }

      let location = await withTimeout(
        Location.getLastKnownPositionAsync(),
        1500
      ).catch(() => null);

      if (!location) {
        location = await withTimeout(
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }),
          3500
        );
      }

      const { latitude, longitude } = location.coords;

      const geocode = await withTimeout(
        Location.reverseGeocodeAsync({ latitude, longitude }),
        2500
      ).catch(() => null);

      let address = "Wuse 2, Abuja";

      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        const formatted = `${
          place.city || place.district || place.subregion || place.name || ""
        }, ${place.region || place.country || ""}`.replace(/^, |, $/g, "");
        if (formatted) {
          address = formatted;
        }
      }

      return { latitude, longitude, address };
    } catch {
      // Fallback to default Abuja coordinates if emulator GPS is unconfigured
      return {
        latitude: 9.0765,
        longitude: 7.4765,
        address: "Wuse 2, Abuja",
      };
    }
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<Partial<LocationState>>) => {
      if (action.payload.latitude !== undefined) state.latitude = action.payload.latitude;
      if (action.payload.longitude !== undefined) state.longitude = action.payload.longitude;
      if (action.payload.address !== undefined) state.address = action.payload.address;
      if (action.payload.status !== undefined) {
        state.status = action.payload.status;
      } else if (action.payload.address) {
        state.status = "success";
      }
    },
    clearLocation: (state) => {
      state.latitude = null;
      state.longitude = null;
      state.address = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLocation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserLocation.fulfilled, (state, action) => {
        state.status = "success";
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
        state.address = action.payload.address;
      })
      .addCase(fetchUserLocation.rejected, (state, action) => {
        if (action.payload === "Permission to access location was denied") {
          state.status = "permission_denied";
        } else {
          state.status = "error";
        }
        state.error = action.payload as string;
      });
  },
});

export const { setLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
