import { createAsyncThunk, AsyncThunkPayloadCreator, AsyncThunkOptions } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '../store/store';

type ThunkApiConfig = {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
};

export const createAsyncThunkWithHandler = <Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>,
  options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>
) => {
  return createAsyncThunk<Returned, ThunkArg, ThunkApiConfig>(
    typePrefix,
    async (arg, thunkAPI) => {
      try {
        return (await payloadCreator(arg, thunkAPI)) as any;
      } catch (error: any) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        return thunkAPI.rejectWithValue(message) as any;
      }
    },
    options
  );
};
