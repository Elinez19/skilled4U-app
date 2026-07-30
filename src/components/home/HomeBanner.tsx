import React, { useRef, useState, useEffect } from "react";
import { Image, Text, View, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { images } from "@/constants/images";

const { width } = Dimensions.get("window");
// Assuming padding of 20 on each side (from TabsIndex ScrollView padding)
const CARD_WIDTH = width - 40; 

export function HomeBanner() {
  const slides = [
    { title: "Top Rated Artisans Near You", subtitle: "Book verified professionals today" },
    { title: "Get 20% Off Your First Booking!", subtitle: "Use code: FIRST20" },
    { title: "Need Emergency Repairs?", subtitle: "24/7 service available now" }
  ];

  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= slides.length) {
        nextIndex = 0;
      }
      scrollViewRef.current?.scrollTo({ x: nextIndex * CARD_WIDTH, animated: true });
      setActiveIndex(nextIndex);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeIndex, slides.length]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex && roundIndex >= 0 && roundIndex < slides.length) {
      setActiveIndex(roundIndex);
    }
  };

  return (
    <View className="mb-6">
      <View className="h-40 rounded-2xl overflow-hidden">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          scrollEventThrottle={16}
        >
          {slides.map((slide, index) => (
            <View key={index} style={{ width: CARD_WIDTH, height: 160 }} className="relative">
              <Image 
                source={images.banner} 
                className="w-full h-full rounded-2xl" 
                resizeMode="cover" 
              />
              {/* Dark blue overlay to make text readable */}
              <View className="absolute inset-0 bg-[#001328]/60 rounded-2xl p-5 justify-center">
                <Text className="text-white font-bold text-2xl mb-1" style={{ fontFamily: "Poppins-Bold" }}>
                  {slide.title}
                </Text>
                <Text className="text-white text-sm" style={{ fontFamily: "Poppins-Medium" }}>
                  {slide.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      
      {/* Pagination Dots */}
      <View className="flex-row justify-center mt-3">
        {slides.map((_, i) => (
          <View
            key={i}
            className={`h-2 w-2 rounded-full mx-1 ${
              i === activeIndex ? "bg-[#001328]" : "bg-neutral-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
