import { images } from "@/constants/images";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface OnboardingSlideProps {
  heading: string;
  description: string;
  imageSource: ImageSourcePropType;
  badgeText?: string;
  stepLabel?: string;
  align?: "center" | "left";
  showBrandHeader?: boolean;
  brandSubtitle?: string;
  isActive?: boolean;
}

const { width, height } = Dimensions.get("window");

export function OnboardingSlide({
  heading,
  description,
  imageSource,
  align = "center",
  showBrandHeader = true,
  brandSubtitle,
  isActive = true,
}: OnboardingSlideProps) {
  const isLeft = align === "left";
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      fadeAnim.setValue(0.35);
      translateYAnim.setValue(8);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive, fadeAnim, translateYAnim]);

  return (
    <View className="flex-1 px-6 pt-1 pb-2 justify-between">
      {/* Top Brand Logo Header with Custom Skilled4U Emblem */}
      {showBrandHeader ? (
        <View className="flex-row items-center justify-center mt-1">
          <Image
            source={images.logoIcon}
            style={styles.brandLogoIcon}
            resizeMode="contain"
          />
          <View className="ml-1.5">
            <Text
              className="text-[26px] text-[#003B73] pr-1"
              style={{ fontFamily: "Poppins-Bold", lineHeight: 32 }}
            >
              Skilled<Text className="text-[#00A8E8]">4U</Text>
            </Text>
            {brandSubtitle ? (
              <Text
                className="text-[11px] text-[#4A6F96] pr-1"
                style={{ fontFamily: "Poppins-Medium", lineHeight: 15 }}
              >
                {brandSubtitle}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {/* Minimalist, Responsive Hero Image Stage (Explicit pixel dimensions for Android) */}
      <Animated.View
        style={[
          styles.heroStage,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          },
        ]}
      >
        <Image
          source={imageSource}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Typography Block */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
        }}
        className={`w-full mt-1 mb-1 ${isLeft ? "items-start" : "items-center"}`}
      >
        <Text
          className={`w-full text-[26px] text-[#003B73] mb-1.5 ${
            isLeft ? "text-left" : "text-center"
          }`}
          style={{ fontFamily: "Poppins-Bold", lineHeight: 34 }}
        >
          {heading}
        </Text>

        <Text
          className={`w-full text-[14px] text-[#5B7C99] ${
            isLeft ? "text-left pr-2" : "text-center px-1"
          }`}
          style={{ fontFamily: "Poppins-Regular", lineHeight: 21 }}
        >
          {description}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  brandLogoIcon: {
    width: 46,
    height: 46,
  },
  heroStage: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  heroImage: {
    width: width * 0.84,
    height: Math.min(width * 0.68, height * 0.38),
  },
});
