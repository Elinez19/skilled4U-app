import { Button } from "@/components/Button";
import { OnboardingSlide } from "@/components/OnboardingSlide";
import { images } from "@/constants/images";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import Swiper from "react-native-swiper";

export default function OnboardingScreen() {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === 2;

  const handleNext = () => {
    if (isLastSlide) {
      // Navigate to Sign In / Sign Up, or Main App
      router.replace("/(auth)/sign-in");
    } else {
      swiperRef.current?.scrollBy(1);
    }
  };

  const handleSkip = () => {
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Swiper
        ref={swiperRef}
        loop={false}
        onIndexChanged={(index) => setActiveIndex(index)}
        dot={<View className="w-2 h-2 rounded-full bg-neutral-200 mx-1" />}
        activeDot={<View className="w-8 h-2 rounded-full bg-primary mx-1" />}
        showsPagination={true}
        paginationStyle={{ bottom: 10 }}
      >
        <OnboardingSlide
          heading="Find Trusted Artisans"
          description="Easily browse and hire skilled professionals for your home projects, repairs, and daily needs."
          imageSource={images.onboardingPainter}
        />
        <OnboardingSlide
          heading="Verified Professionals"
          description="Every artisan is vetted to ensure high-quality service, reliability, and safety for your peace of mind."
          imageSource={images.onboardingCleaner}
        />
        <OnboardingSlide
          heading="Easy Booking & Payments"
          description="Schedule appointments and make secure payments directly through the app without any hassle."
          imageSource={images.onboardingPlumber}
        />
      </Swiper>

      <View className="px-6 pb-8 pt-4 gap-4">
        <Button 
          title={isLastSlide ? "Get Started" : "Next"} 
          onPress={handleNext} 
        />
        {isLastSlide ? null : (
          <Button 
            title="Skip" 
            variant="text" 
            onPress={handleSkip} 
          />
        )}
      </View>
    </SafeAreaView>
  );
}
