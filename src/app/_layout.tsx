import "../../global.css";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store/store";

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
        </Provider>
    );
}