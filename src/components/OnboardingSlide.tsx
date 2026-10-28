import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Image, ImageSourcePropType, Platform, StyleSheet, Text, View } from "react-native";

interface OnboardingSlideProps {
  heading: string;
  description: string;
  imageSource: ImageSourcePropType;
  badgeText?: string;
  stepLabel?: string;
  align?: "center" | "left";
  showBrandHeader?: boolean;
  brandSubtitle?: string;
}

const { width } = Dimensions.get("window");

export function OnboardingSlide({
  heading,
  description,
  imageSource,
  badgeText,
  stepLabel,
  align = "center",
  showBrandHeader = true,
  brandSubtitle,
}: OnboardingSlideProps) {
  const isLeft = align === "left";

  return (
    <View className="flex-1 px-6 pt-1 pb-3 justify-between">
      {/* Top Brand Logo Header with Custom Skilled4U Emblem */}
      {showBrandHeader ? (
        <View className="flex-row items-center justify-center mt-1 mb-1">
          <Image
            source={images.logoIcon}
            style={styles.brandLogoIcon}
            resizeMode="contain"
          />
          <View className="ml-1.5">
            <View className="flex-row items-center">
              <Text
                className="text-[27px] text-[#003B73] tracking-tight"
                style={{ fontFamily: "Poppins-Bold", lineHeight: 33 }}
              >
                Skilled
              </Text>
              <Text
                className="text-[27px] text-[#00A8E8] tracking-tight"
                style={{ fontFamily: "Poppins-Bold", lineHeight: 33 }}
              >
                4U
              </Text>
            </View>
            {brandSubtitle ? (
              <Text
                className="text-[11px] text-[#4A6F96]"
                style={{ fontFamily: "Poppins-Medium" }}
              >
                {brandSubtitle}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {/* Seamless Hero Artwork Stage */}
      <View className="items-center justify-center my-1 relative">
        <View
          style={[styles.heroCardShadow, { width: width * 0.88, height: width * 0.78 }]}
          className="rounded-[28px] bg-[#E8F6FF] items-center justify-center overflow-hidden border border-white/90"
        >
          <Image
            source={imageSource}
            style={{ width: width * 0.88, height: width * 0.78 }}
            resizeMode="cover"
          />

          {/* Top Floating Step Pill */}
          {stepLabel ? (
            <View
              style={styles.pillShadow}
              className="absolute top-3 left-3 flex-row items-center bg-white/92 px-3 py-1 rounded-full border border-[#D6ECFA]"
            >
              <View className="w-2 h-2 rounded-full bg-[#00A8E8] mr-1.5" />
              <Text
                className="text-[11px] text-[#003B73]"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                {stepLabel}
              </Text>
            </View>
          ) : null}

          {/* Soft bottom mist blend */}
          <View className="absolute bottom-0 left-0 right-0 h-8 bg-[#F4FAFF]/45" />
        </View>

        {badgeText ? (
          <View
            style={styles.pillShadow}
            className="flex-row items-center bg-white px-4 py-1.5 rounded-full border border-[#CBE7FA] -mt-4"
          >
            <Ionicons name="shield-checkmark" size={15} color="#00A8E8" />
            <Text
              className="text-[12px] text-[#003B73] ml-1.5"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              {badgeText}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Typography Block */}
      <View className={`mt-2 mb-1 ${isLeft ? "items-start" : "items-center"}`}>
        <Text
          className={`text-[28px] text-[#003B73] mb-2 ${
            isLeft ? "text-left" : "text-center"
          }`}
          style={{ fontFamily: "Poppins-Bold", lineHeight: 35 }}
        >
          {heading}
        </Text>

        <Text
          className={`text-[14px] text-[#5B7C99] ${
            isLeft ? "text-left pr-2" : "text-center px-2"
          }`}
          style={{ fontFamily: "Poppins-Regular", lineHeight: 22 }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  brandLogoIcon: {
    width: 50,
    height: 50,
  },
  heroCardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#00589C",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  pillShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
