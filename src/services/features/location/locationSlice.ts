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
  latitude: null,
  longitude: null,
  address: "Lagos, Nigeria", // Defaulting as requested by the initial static UI
  status: "idle",
  error: null,
};

export const fetchUserLocation = createAsyncThunk(
  "location/fetchUserLocation",
  async (_, thunkAPI) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        return thunkAPI.rejectWithValue("Permission to access location was denied");
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      let address = "Unknown Location";
      
      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        // e.g. "Lagos, Nigeria" or "San Francisco, CA"
        address = `${place.city || place.subregion || place.name || ""}, ${place.region || place.country || ""}`.replace(/^, |, $/g, '');
      }

      return { latitude, longitude, address };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch location");
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
    },
    clearLocation: (state) => {
      state.latitude = null;
      state.longitude = null;
      state.address = null;
      state.status = "idle";
      state.error = null;
    }
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
