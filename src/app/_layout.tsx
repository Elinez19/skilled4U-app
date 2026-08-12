import "../../global.css";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store/store";
import Toast from "react-native-toast-message";

if (typeof setImmediate === 'undefined') {
    (global as any).setImmediate = (fn: any, ...args: any[]) => setTimeout(fn, 0, ...args);
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
            </Stack>
            <Toast />
        </Provider>
    );
}