import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#00A8E8",
        tabBarInactiveTintColor: "#7A9BB8",
        tabBarStyle: {
          height: (Platform.OS === "ios" ? 60 : 70) + insets.bottom,
          paddingBottom: (Platform.OS === "ios" ? 10 : 12) + insets.bottom,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "#DCEFFB",
          elevation: 12,
          shadowColor: "#003B73",
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: -4 },
          shadowRadius: 12,
          backgroundColor: "#FFFFFF",
        },
        tabBarLabelStyle: {
          fontFamily: "Poppins-Medium",
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={22}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              size={22}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "chatbubble-ellipses"
                  : "chatbubble-ellipses-outline"
              }
              size={22}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color as string}
            />
          ),
        }}
      />
    </Tabs>
  );
}
