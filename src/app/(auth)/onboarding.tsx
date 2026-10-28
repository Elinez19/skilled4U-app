import { Button } from "@/components/Button";
import { OnboardingSlide } from "@/components/OnboardingSlide";
import { images } from "@/constants/images";
import { CUSTOMER_ONBOARDING_SERVICES, OnboardingServiceItem } from "@/data/categories";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

const AUTOPLAY_DURATION_MS = 4200;

const CUSTOMER_SLIDES = [
  {
    id: "slide-1",
    stepLabel: "Discover Nearby Pros",
    heading: "Skilled Hands.\nCloser to You.",
    description: "Find trusted artisans near you\nfor all your home and business needs.",
    imageSource: images.onboardingHeroArtisan,
    badgeText: "4.9 ★ Verified Local Artisans",
  },
  {
    id: "slide-2",
    stepLabel: "Vetted & Insured",
    heading: "Verified & Vetted\nProfessionals.",
    description: "Every artisan is background-checked, rated\nby real clients, and insured for your peace of mind.",
    imageSource: images.onboardingHeroVerified,
    badgeText: "100% Background Checked",
  },
  {
    id: "slide-3",
    stepLabel: "Instant Dispatch",
    heading: "Book & Track\nin Real Time.",
    description: "Schedule services at your convenience and\ntrack your artisan's arrival right to your door.",
    imageSource: images.onboardingHeroTools,
    badgeText: "Live GPS Arrival Tracking",
  },
];

export default function OnboardingScreen() {
  const params = useLocalSearchParams<{ role?: string }>();
  const [role, setRole] = useState<"customer" | "artisan">(
    params.role === "artisan" ? "artisan" : "customer"
  );

  // Customer flow state: 3 auto-playing welcome slides (indices 0, 1, 2) + step 4 (Choose Service screen)
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [showChooseService, setShowChooseService] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>(["plumbing"]);

  const slideProgress = useRef(new Animated.Value(0)).current;

  // Seamless auto-play with animated pill progress bar
  useEffect(() => {
    if (role !== "customer" || showChooseService || isAutoPlayPaused) {
      slideProgress.stopAnimation();
      return;
    }

    slideProgress.setValue(0);
    const anim = Animated.timing(slideProgress, {
      toValue: 1,
      duration: AUTOPLAY_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    anim.start(({ finished }) => {
      if (finished) {
        if (activeIndex < CUSTOMER_SLIDES.length - 1) {
          swiperRef.current?.scrollBy(1, true);
        } else {
          // Loop smoothly back to slide 0 so the showcase continues auto-playing
          swiperRef.current?.scrollBy(-(CUSTOMER_SLIDES.length - 1), true);
        }
      }
    });

    return () => {
      anim.stop();
    };
  }, [activeIndex, role, showChooseService, isAutoPlayPaused, slideProgress]);

  const progressFillWidth = slideProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCustomerSlideNext = () => {
    if (activeIndex < CUSTOMER_SLIDES.length - 1) {
      swiperRef.current?.scrollBy(1, true);
    } else {
      setShowChooseService(true);
    }
  };

  const jumpToSlide = (targetIdx: number) => {
    const delta = targetIdx - activeIndex;
    if (delta !== 0) {
      swiperRef.current?.scrollBy(delta, true);
    }
  };

  const handleCustomerServiceContinue = async () => {
    try {
      await AsyncStorage.setItem(
        "selectedCustomerServices",
        JSON.stringify(selectedServices)
      );
    } catch {
      // ignore storage errors
    }
    router.push("/(auth)/sign-in?role=customer");
  };

  const renderServiceIcon = (item: OnboardingServiceItem) => {
    if (item.iconFamily === "MaterialCommunityIcons") {
      return (
        <MaterialCommunityIcons
          name={item.iconName as any}
          size={24}
          color="#0099DF"
        />
      );
    }
    return <Ionicons name={item.iconName as any} size={23} color="#0099DF" />;
  };

  // ==========================================================
  // ARTISAN WELCOME SCREEN (Matches skilled4-Artisan-Onboarding-hero-screen.png)
  // ==========================================================
  if (role === "artisan") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Image
          source={images.onboardingBg}
          style={styles.bgOverlay}
          resizeMode="cover"
        />
        <View className="flex-1 justify-between pb-6">
          {/* Top Role Switch / Back Bar */}
          <View className="flex-row items-center justify-between px-6 pt-2">
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  setRole("customer");
                }
              }}
              className="w-10 h-10 rounded-full bg-white border border-[#D6ECFA] items-center justify-center"
            >
              <Ionicons name="arrow-back" size={20} color="#003B73" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRole("customer")}
              className="px-3.5 py-1.5 rounded-full bg-[#E6F7FF] border border-[#B8E2F8]"
            >
              <Text
                className="text-[12px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Medium" }}
              >
                Switch to Customer
              </Text>
            </TouchableOpacity>
          </View>

          <OnboardingSlide
            heading={"Turn Your\nSkills Into Income"}
            description={
              "Join Skilled4U and get matched with\nnearby clients who need your expertise."
            }
            imageSource={images.onboardingHeroArtisan}
            badgeText="Earn More • Flexible Schedule"
            align="left"
            showBrandHeader={true}
            brandSubtitle="Skilled Hands. Closer to You."
          />

          <View className="px-6 pt-2">
            <Button
              title="Get Started"
              onPress={() => router.push("/(auth)/profile-setup?role=artisan")}
              className="mb-4"
            />

            <View className="flex-row items-center justify-center">
              <Text
                className="text-[14px] text-[#5B7C99]"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                Already have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/sign-in?role=artisan")}
              >
                <Text
                  className="text-[14px] text-[#00A8E8]"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  Log In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // CUSTOMER STEP 4: CHOOSE SERVICE (Matches skilled4-onboarding-choose-service.png)
  // ==========================================================
  if (showChooseService) {
    const filteredServices = CUSTOMER_ONBOARDING_SERVICES.filter((s) =>
      s.title.toLowerCase().includes(serviceSearch.toLowerCase())
    );
    const gridServices = filteredServices.filter((s) => s.id !== "more");
    const moreItem = filteredServices.find((s) => s.id === "more");

    return (
      <SafeAreaView style={styles.safeArea}>
        <Image
          source={images.onboardingBg}
          style={styles.bgOverlay}
          resizeMode="cover"
        />
        <View className="flex-1 px-6 pt-2 pb-6 justify-between">
          {/* Header Bar */}
          <View>
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => setShowChooseService(false)}
                  className="mr-2 p-1"
                >
                  <Ionicons name="arrow-back" size={22} color="#003B73" />
                </TouchableOpacity>
                <Image
                  source={images.logoIcon}
                  style={styles.smallLogoIcon}
                  resizeMode="contain"
                />
                <View className="flex-row items-center ml-1">
                  <Text
                    className="text-[20px] text-[#003B73]"
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    Skilled
                  </Text>
                  <Text
                    className="text-[20px] text-[#00A8E8]"
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    4U
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/(auth)/sign-in?role=customer")}
              >
                <Ionicons name="search-outline" size={24} color="#4A6F96" />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <Text
              className="text-[22px] text-[#003B73] mb-3"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              What service do you need?
            </Text>

            {/* Search Input */}
            <View className="flex-row items-center bg-white border border-[#D6ECFA] rounded-full px-4 h-12 mb-4">
              <Ionicons name="search-outline" size={19} color="#7A9BB8" />
              <TextInput
                value={serviceSearch}
                onChangeText={setServiceSearch}
                placeholder="Search for a service..."
                placeholderTextColor="#8AA8C4"
                className="flex-1 ml-2.5 text-[14px] text-[#003B73] h-full"
                style={{ fontFamily: "Poppins-Regular" }}
              />
            </View>
          </View>

          {/* 3-Column Service Grid + Centered "More" Card */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.serviceGridScroll}
          >
            <View className="flex-row flex-wrap justify-between">
              {gridServices.map((item) => {
                const isSelected = selectedServices.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() => toggleService(item.id)}
                    style={[styles.serviceCard, styles.serviceCardShadow]}
                    className={`mb-3 p-3 rounded-2xl items-center justify-center border ${
                      isSelected
                        ? "bg-[#EAF7FF] border-[#00A8E8]"
                        : "bg-white border-[#D8EEFC]"
                    }`}
                  >
                    <View className="w-12 h-12 rounded-full bg-[#E6F7FF] items-center justify-center mb-2">
                      {renderServiceIcon(item)}
                    </View>
                    <Text
                      className="text-[12px] text-[#003B73] text-center"
                      style={{ fontFamily: "Poppins-SemiBold", lineHeight: 16 }}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {moreItem ? (
              <View className="items-center mt-0.5 mb-2">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleService(moreItem.id)}
                  style={[styles.serviceCard, styles.serviceCardShadow]}
                  className={`p-3 rounded-2xl items-center justify-center border ${
                    selectedServices.includes(moreItem.id)
                      ? "bg-[#EAF7FF] border-[#00A8E8]"
                      : "bg-white border-[#D8EEFC]"
                  }`}
                >
                  <View className="w-12 h-12 rounded-full bg-[#E6F7FF] items-center justify-center mb-2">
                    {renderServiceIcon(moreItem)}
                  </View>
                  <Text
                    className="text-[12px] text-[#003B73] text-center"
                    style={{ fontFamily: "Poppins-SemiBold" }}
                  >
                    {moreItem.title}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </ScrollView>

          {/* Bottom Continue CTA & 4th Dot Indicator */}
          <View className="pt-2">
            <Button
              title="Continue"
              onPress={handleCustomerServiceContinue}
              className="mb-4"
            />

            <View className="flex-row items-center justify-center">
              {[0, 1, 2, 3].map((dotIdx) => {
                const isActive = dotIdx === 3;
                return (
                  <TouchableOpacity
                    key={dotIdx}
                    onPress={() => {
                      if (dotIdx < 3) {
                        setShowChooseService(false);
                        setActiveIndex(dotIdx);
                      }
                    }}
                    className={`h-2.5 rounded-full mx-1.5 ${
                      isActive ? "w-7 bg-[#0099DF]" : "w-2.5 bg-[#C7E6FA]"
                    }`}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // CUSTOMER MULTI-SLIDE AUTO-PLAYING WELCOME (Matches skilled4-onboarding-01.png)
  // ==========================================================
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Seamless Full-Screen Cityscape & Network Backdrop */}
      <Image
        source={images.onboardingBg}
        style={styles.bgOverlay}
        resizeMode="cover"
      />

      {/* Top Role Switch / Auto-Play Toggle / Skip Bar */}
      <View className="flex-row items-center justify-between px-6 pt-2">
        <TouchableOpacity
          onPress={() => setRole("artisan")}
          className="px-3.5 py-1.5 rounded-full bg-white/95 border border-[#D6ECFA] flex-row items-center"
        >
          <Ionicons name="construct-outline" size={13} color="#00A8E8" />
          <Text
            className="text-[12px] text-[#003B73] ml-1.5"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            Join as Artisan
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => setIsAutoPlayPaused((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-white/90 border border-[#D6ECFA] items-center justify-center mr-2.5"
          >
            <Ionicons
              name={isAutoPlayPaused ? "play" : "pause"}
              size={13}
              color="#003B73"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowChooseService(true)}
            className="px-2 py-1"
          >
            <Text
              className="text-[13px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Swiper
        ref={swiperRef}
        loop={false}
        onIndexChanged={(idx) => setActiveIndex(idx)}
        showsPagination={false}
        scrollEventThrottle={16}
      >
        {CUSTOMER_SLIDES.map((slide) => (
          <OnboardingSlide
            key={slide.id}
            stepLabel={slide.stepLabel}
            heading={slide.heading}
            description={slide.description}
            imageSource={slide.imageSource}
            badgeText={slide.badgeText}
          />
        ))}
      </Swiper>

      {/* Bottom CTA Button + Animated Auto-Play Pagination Dots */}
      <View className="px-6 pb-6 pt-1">
        <Button
          title={
            activeIndex === 0
              ? "Get Started"
              : activeIndex === 1
                ? "Next"
                : "Choose a Service"
          }
          onPress={handleCustomerSlideNext}
          className="mb-4"
        />

        {/* 4 Dots: 3 Auto-Playing Welcome Slides + 4th Choose Service Step */}
        <View className="flex-row items-center justify-center">
          {[0, 1, 2, 3].map((dotIdx) => {
            const isActive = activeIndex === dotIdx;
            return (
              <TouchableOpacity
                key={dotIdx}
                activeOpacity={0.8}
                onPress={() => {
                  if (dotIdx === 3) {
                    setShowChooseService(true);
                  } else {
                    jumpToSlide(dotIdx);
                  }
                }}
                className={`h-2.5 rounded-full mx-1.5 overflow-hidden ${
                  isActive ? "w-8 bg-[#CBE8FA]" : "w-2.5 bg-[#C7E6FA]"
                }`}
              >
                {isActive ? (
                  <Animated.View
                    style={[
                      styles.activeDotProgress,
                      { width: progressFillWidth },
                    ]}
                  />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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
    opacity: 0.72,
  },
  smallLogoIcon: {
    width: 34,
    height: 34,
  },
  activeDotProgress: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#0099DF",
  },
  serviceGridScroll: {
    paddingVertical: 4,
  },
  serviceCard: {
    width: "31%",
    minHeight: 108,
  },
  serviceCardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
