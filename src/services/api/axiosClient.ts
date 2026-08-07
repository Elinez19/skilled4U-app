// import { Logout } from "@/services/features/auth/authService";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Ensure `Returned` can be any type, but provide a more specific type for the result
export const createAsyncThunkWithHandler = <Returned = any, ThunkArg = void>(
  name: string,
  thunkFunction: (arg: ThunkArg, thunkAPI: any) => Promise<Returned>
) =>
  createAsyncThunk<Returned, ThunkArg>(name, async (arg, thunkAPI) => {
    try {
      const result = await thunkFunction(arg, thunkAPI);

      // Check if result has a `message` property
      if (result && typeof result === "object" && "message" in result) {
        if (result.message === false) {
          return thunkAPI.rejectWithValue(result.message);
        }
      }

      return result;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          (error.response.data.message || error.response.data.error)) ||
        error.message ||
        error.toString();

      // Handle authentication errors that weren't resolved by axios interceptor
      // This means the interceptor couldn't refresh tokens and the user should be logged out
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        // Only logout if we're not already on the auth page
        if (!window.location.pathname.includes("auth")) {
          // Logout();
        }
      }

      return thunkAPI.rejectWithValue(message);
    }
  });