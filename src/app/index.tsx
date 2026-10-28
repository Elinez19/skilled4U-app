import { Button } from "@/components/Button";
import { images } from "@/constants/images";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
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

  // Auto-play the hero showcase slides every 3.8s
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const currentHero = HERO_SLIDES[heroIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Image
        source={images.onboardingBg}
        style={styles.bgOverlay}
        resizeMode="cover"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Brand Header with Custom Skilled4U Logo Icon */}
        <View className="flex-row items-center justify-between pt-2 mb-4">
          <View className="flex-row items-center">
            <Image
              source={images.logoIcon}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <View className="ml-1.5">
              <View className="flex-row items-center">
                <Text
                  className="text-[23px] text-[#003B73]"
                  style={{ fontFamily: "Poppins-Bold", lineHeight: 27 }}
                >
                  Skilled
                </Text>
                <Text
                  className="text-[23px] text-[#00A8E8]"
                  style={{ fontFamily: "Poppins-Bold", lineHeight: 27 }}
                >
                  4U
                </Text>
              </View>
              <Text
                className="text-[11px] text-[#5B7C99]"
                style={{ fontFamily: "Poppins-Medium" }}
              >
                Skilled Hands. Closer to You.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.push("/(auth)/sign-in")}
            className="px-4 py-2 rounded-full bg-white border border-[#D0E8F8]"
          >
            <Text
              className="text-[13px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Auto-Playing Hero Visual Banner */}
        <View
          style={[styles.cardShadow, { height: width * 0.72 }]}
          className="w-full rounded-3xl bg-[#E6F5FF] border border-white/95 overflow-hidden mb-5 relative items-center justify-center"
        >
          <Image
            source={currentHero.image}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />

          {/* Floating Verified Pill */}
          <View
            style={styles.pillShadow}
            className="absolute top-3 right-3 flex-row items-center bg-white/95 px-3 py-1.5 rounded-full border border-[#D6ECFA]"
          >
            <Ionicons name="checkmark-circle" size={15} color="#00A8E8" />
            <Text
              className="text-[11px] text-[#003B73] ml-1"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              {currentHero.pill}
            </Text>
          </View>

          {/* Slide Dots on Top-Left */}
          <View className="absolute top-3.5 left-3.5 flex-row items-center bg-white/90 px-2.5 py-1.5 rounded-full border border-[#D6ECFA]">
            {HERO_SLIDES.map((s, idx) => (
              <TouchableOpacity
                key={s.id}
                onPress={() => setHeroIndex(idx)}
                className={`h-2 rounded-full mx-0.5 ${
                  idx === heroIndex ? "w-5 bg-[#00A8E8]" : "w-2 bg-[#BEE3F8]"
                }`}
              />
            ))}
          </View>

          {/* Bottom Frosted Social Proof Strip */}
          <View className="absolute bottom-3 left-3 right-3 bg-white/95 rounded-2xl px-3.5 py-2.5 flex-row items-center justify-between border border-[#D6ECFA]">
            <View className="flex-row items-center flex-1">
              <View className="w-8 h-8 rounded-full bg-[#E6F7FF] items-center justify-center mr-2.5">
                <Ionicons name="flash" size={16} color="#00A8E8" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-[12px] text-[#003B73]"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {currentHero.title}
                </Text>
                <Text
                  className="text-[11px] text-[#5B7C99]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  {currentHero.subtitle}
                </Text>
              </View>
            </View>
            <View className="bg-[#E8FBF2] px-2.5 py-1 rounded-full">
              <Text
                className="text-[10px] text-[#10B981]"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                ● Live Now
              </Text>
            </View>
          </View>
        </View>

        {/* Main Value Proposition */}
        <View className="items-center mb-5">
          <Text
            className="text-[28px] text-[#003B73] text-center mb-2"
            style={{ fontFamily: "Poppins-Bold", lineHeight: 35 }}
          >
            Skilled Hands.{"\n"}Closer to You.
          </Text>
          <Text
            className="text-[14px] text-[#5B7C99] text-center px-2"
            style={{ fontFamily: "Poppins-Regular", lineHeight: 21 }}
          >
            Connect with vetted local artisans on Skilled4U for fast, reliable home and business services.
          </Text>
        </View>

        {/* 4 Feature Badges matching Design System */}
        <View className="flex-row justify-between mb-6 bg-white/95 p-3 rounded-2xl border border-[#D6ECFA]">
          {TRUST_FEATURES.map((item) => (
            <View key={item.id} className="items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-[#E6F7FF] items-center justify-center mb-1.5">
                <Ionicons name={item.icon} size={19} color="#00A8E8" />
              </View>
              <Text
                className="text-[11px] text-[#003B73] text-center"
                style={{ fontFamily: "Poppins-Medium", lineHeight: 14 }}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Primary CTA: Customer Flow */}
        <Button
          title="Find a Skilled Artisan"
          onPress={() => router.push("/(auth)/onboarding?role=customer")}
          className="mb-3.5"
        />

        {/* Secondary Role Card: Artisan Flow */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/(auth)/onboarding?role=artisan")}
          style={styles.cardShadow}
          className="flex-row items-center bg-white border border-[#B8E2F8] rounded-2xl p-3.5 mb-5"
        >
          <View className="w-11 h-11 rounded-full bg-[#E6F7FF] items-center justify-center mr-3">
            <MaterialCommunityIcons name="briefcase-check-outline" size={22} color="#00A8E8" />
          </View>
          <View className="flex-1">
            <Text
              className="text-[14px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Are you a Skilled Artisan?
            </Text>
            <Text
              className="text-[12px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Turn your skills into income • Join Skilled4U
            </Text>
          </View>
          <View className="w-8 h-8 rounded-full bg-[#F0F9FF] items-center justify-center">
            <Ionicons name="chevron-forward" size={18} color="#00A8E8" />
          </View>
        </TouchableOpacity>

        {/* Footer Sign In Link */}
        <View className="flex-row items-center justify-center mt-auto pt-1 pb-2">
          <Text
            className="text-[14px] text-[#5B7C99]"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
            <Text
              className="text-[14px] text-[#00A8E8]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Log In
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
    backgroundColor: "#F4FAFF",
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
