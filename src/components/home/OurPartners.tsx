import React from "react";
import { View, Image, Text } from "react-native";
import Swiper from "react-native-swiper";
import { images } from "../../constants/images";

export function OurPartners() {
  const partnerSlides = [
    { title: "Trusted by Google", subtitle: "Official service partner 2026" },
    { title: "AWS Certified", subtitle: "Secure and reliable infrastructure" }
  ];

  return (
    <View className="h-32 rounded-2xl overflow-hidden mb-6">
      <Swiper 
        autoplay 
        autoplayTimeout={4}
        dotColor="#d1d5db" // neutral-300
        activeDotColor="#00B7FF" // primary
        paginationStyle={{ bottom: 10 }}
      >
        {partnerSlides.map((slide, index) => (
          <View key={index} className="flex-1 relative">
            <Image 
              source={images.banner} 
              className="w-full h-full rounded-2xl" 
              resizeMode="cover" 
            />
            {/* Dark overlay to make text readable */}
            <View className="absolute inset-0 bg-black/50 rounded-2xl p-5 justify-center items-center">
              <Text className="text-white font-bold text-xl mb-1 text-center" style={{ fontFamily: "Poppins-Bold" }}>
                {slide.title}
              </Text>
              <Text className="text-gray-200 text-xs text-center" style={{ fontFamily: "Poppins-Medium" }}>
                {slide.subtitle}
              </Text>
            </View>
          </View>
        ))}
      </Swiper>
    </View>
  );
}
