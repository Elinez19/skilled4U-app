import { Button } from "@/components/Button";
import { images } from "@/constants/images";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const HERO_SLIDES = [
  {
    id: "artisan",
    image: images.onboardingHeroArtisan,
    title: "Trusted Artisans Near You",
    subtitle: "Plumbers, Electricians, Cleaners & more",
    pill: "4.9 ★ (12K+ Reviews)",
  },
  {
    id: "verified",
    image: images.onboardingHeroVerified,
    title: "100% Background Checked",
    subtitle: "Vetted, rated & insured local professionals",
    pill: "Verified Pros",
  },
  {
    id: "tracking",
    image: images.onboardingHeroTools,
    title: "Real-Time GPS Arrival Tracking",
    subtitle: "Book in seconds and track right to your door",
    pill: "Live Dispatch",
  },
];

const TRUST_FEATURES = [
  { id: "nearby", label: "Nearby\nArtisans", icon: "location-outline" as const },
  { id: "verified", label: "Verified\nPros", icon: "shield-checkmark-outline" as const },
  { id: "tracking", label: "Real-Time\nTracking", icon: "navigate-outline" as const },
  { id: "support", label: "Secure\nPayments", icon: "lock-closed-outline" as const },
];

export default function AppLauncherScreen() {
  const router = useRouter();
  const [heroIndex, setHeroIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const transitionToSlide = useCallback(
    (nextIndex: number) => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 240,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.97,
          duration: 240,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setHeroIndex(nextIndex);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [fadeAnim, scaleAnim]
  );

  // Smoothly crossfade the hero showcase slides every 4.2s
  useEffect(() => {
    const timer = setInterval(() => {
      transitionToSlide((heroIndex + 1) % HERO_SLIDES.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [heroIndex, transitionToSlide]);

  const currentHero = HERO_SLIDES[heroIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Brand Header with Custom Skilled4U Logo Icon */}
        <View className="flex-row items-center justify-between pt-2 mb-3">
          <View className="flex-row items-center flex-1 mr-2">
            <Image
              source={images.logoIcon}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <View className="ml-1.5 flex-1">
              <Text
                className="w-full text-[23px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Bold", lineHeight: 28 }}
              >
                Skilled<Text className="text-[#00A8E8]">4U</Text>
              </Text>
              <Text
                className="w-full text-[11px] text-[#5B7C99]"
                style={{ fontFamily: "Poppins-Medium", lineHeight: 15 }}
              >
                Skilled Hands. Closer to You.
              </Text>
            </View>
          </View>

          <View className="flex-row items-center bg-[#E6F7FF] border border-[#B8E2F8] px-3 py-1.5 rounded-full shrink-0">
            <Ionicons name="shield-checkmark" size={14} color="#00A8E8" />
            <Text
              className="text-[11px] text-[#003B73] ml-1 pr-1"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Vetted{"\u00A0"}Pros
            </Text>
          </View>
        </View>

        {/* Minimalist, Background-Free Hero Image with Smooth Crossfade */}
        <View className="w-full items-center justify-center mb-3">
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              width: width * 0.86,
              height: width * 0.65,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={currentHero.image}
              style={{ width: width * 0.86, height: width * 0.65 }}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Minimal Slide Dots Below Image (No Overlays on Image) */}
          <View className="flex-row items-center justify-center mt-1.5">
            {HERO_SLIDES.map((s, idx) => (
              <TouchableOpacity
                key={s.id}
                onPress={() => {
                  if (idx !== heroIndex) {
                    transitionToSlide(idx);
                  }
                }}
                className={`h-2 rounded-full mx-1 ${
                  idx === heroIndex ? "w-5 bg-[#00A8E8]" : "w-2 bg-[#D6ECFA]"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Main Value Proposition */}
        <View className="w-full items-center mb-5">
          <Text
            className="w-full text-[28px] text-[#003B73] text-center mb-2"
            style={{ fontFamily: "Poppins-Bold", lineHeight: 36 }}
          >
            Skilled Hands.{"\n"}Closer to You.
          </Text>
          <Text
            className="w-full text-[14px] text-[#5B7C99] text-center px-1"
            style={{ fontFamily: "Poppins-Regular", lineHeight: 21 }}
          >
            Connect with vetted local artisans on Skilled4U for fast, reliable home and business services.
          </Text>
        </View>

        {/* 4 Feature Badges matching Design System */}
        <View className="flex-row justify-between mb-6 bg-white/95 px-1.5 py-3 rounded-2xl border border-[#D6ECFA]">
          {TRUST_FEATURES.map((item) => (
            <View key={item.id} className="items-center flex-1 px-0.5">
              <View className="w-10 h-10 rounded-full bg-[#E6F7FF] items-center justify-center mb-1.5">
                <Ionicons name={item.icon} size={19} color="#00A8E8" />
              </View>
              <Text
                className="w-full text-[10.5px] text-[#003B73] text-center"
                style={{ fontFamily: "Poppins-Medium", lineHeight: 14 }}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Primary CTA: Customer Flow -> Goes directly to Choose Service (no duplicate slides!) */}
        <Button
          title="Find a Skilled Artisan"
          onPress={() => router.push("/(auth)/onboarding?role=customer&step=services")}
          className="mb-3.5"
        />

        {/* Secondary Role Card: Artisan Flow -> Goes directly to Artisan Account Creation */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/(auth)/sign-up?role=artisan")}
          style={styles.cardShadow}
          className="flex-row items-center bg-white border border-[#B8E2F8] rounded-2xl p-3.5 mb-5"
        >
          <View className="w-11 h-11 rounded-full bg-[#E6F7FF] items-center justify-center mr-3">
            <MaterialCommunityIcons name="briefcase-check-outline" size={22} color="#00A8E8" />
          </View>
          <View className="flex-1 pr-1">
            <Text
              className="w-full text-[14px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Are you a Skilled Artisan?
            </Text>
            <Text
              className="w-full text-[12px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Turn your skills into income • Join Skilled4U
            </Text>
          </View>
          <View className="w-8 h-8 rounded-full bg-[#F0F9FF] items-center justify-center">
            <Ionicons name="chevron-forward" size={18} color="#00A8E8" />
          </View>
        </TouchableOpacity>

        {/* Single Footer Sign In Link */}
        <View className="flex-row items-center justify-center mt-auto pt-1 pb-2">
          <Text
            className="text-[14px] text-[#5B7C99]"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
            <Text
              className="text-[14px] text-[#00A8E8] px-1"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Log{"\u00A0"}In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  bgOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0.65,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  brandLogo: {
    width: 46,
    height: 46,
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  pillShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
