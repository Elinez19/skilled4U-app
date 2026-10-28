import "../../global.css";
import { images } from "@/constants/images";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, Platform, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { store } from "../store/store";

if (typeof setImmediate === "undefined") {
  (globalThis as any).setImmediate = (fn: any, ...args: any[]) =>
    setTimeout(fn, 0, ...args);
}

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance spring + continuous pulse + progress bar
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    return () => pulseLoop.stop();
  }, [logoScale, progressAnim, pulseAnim]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});

      const timer = setTimeout(() => {
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 420,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start(() => {
          setShowCustomSplash(false);
        });
      }, 1700);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError, splashOpacity]);

  const ringScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.08],
  });

  const ringOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.75],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["12%", "100%"],
  });

  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <View className="flex-1 bg-[#F4FAFF]">
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade_from_bottom",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
        </Stack>

        {showCustomSplash ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.splashOverlay, { opacity: splashOpacity }]}
          >
            {/* Seamless Cityscape & Network Backdrop */}
            <Image
              source={images.onboardingBg}
              style={styles.splashBgImage}
              resizeMode="cover"
            />

            <View className="flex-1 items-center justify-center px-8">
              {/* Animated Pulse Aura + Custom Skilled4U Pin Emblem */}
              <View className="items-center justify-center mb-5">
                <Animated.View
                  style={[
                    styles.pulseRingOuter,
                    {
                      transform: [{ scale: ringScale }],
                      opacity: ringOpacity,
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.logoContainer,
                    { transform: [{ scale: logoScale }] },
                  ]}
                >
                  <Image
                    source={images.logoIcon}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </Animated.View>
              </View>

              {/* Brand Name Wordmark */}
              <View className="flex-row items-center justify-center mb-1.5">
                <Text
                  className="text-[36px] text-[#003B73] tracking-tight"
                  style={{ fontFamily: "Poppins-Bold", lineHeight: 44 }}
                >
                  Skilled
                </Text>
                <Text
                  className="text-[36px] text-[#00A8E8] tracking-tight"
                  style={{ fontFamily: "Poppins-Bold", lineHeight: 44 }}
                >
                  4U
                </Text>
              </View>

              <Text
                className="text-[14px] text-[#4A6F96] text-center mb-8"
                style={{ fontFamily: "Poppins-Medium" }}
              >
                Skilled Hands. Closer to You.
              </Text>

              {/* Smooth Loading Progress Pill */}
              <View className="w-44 h-1.5 rounded-full bg-[#D6ECFA] overflow-hidden">
                <Animated.View
                  style={[styles.progressBarFill, { width: progressWidth }]}
                />
              </View>
            </View>

            {/* Bottom Trust Tag */}
            <View className="pb-10 items-center">
              <Text
                className="text-[12px] text-[#5B7C99]"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                Verified Local Professionals • Real-Time Tracking
              </Text>
            </View>
          </Animated.View>
        ) : null}

        <Toast />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F4FAFF",
    zIndex: 999,
  },
  splashBgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0.65,
  },
  pulseRingOuter: {
    position: "absolute",
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: "rgba(0, 168, 232, 0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(0, 168, 232, 0.28)",
  },
  logoContainer: {
    width: 142,
    height: 142,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#0088CC",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoImage: {
    width: 136,
    height: 136,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#00A8E8",
  },
});