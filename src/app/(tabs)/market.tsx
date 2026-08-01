import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/images";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_WIDTH = SCREEN_WIDTH - 32; // 16 padding on each side

const CATEGORIES = [
  { id: 1, title: "Washing Machines", bgColor: "bg-[#F4F9FD]", borderColor: "border-[#D1E8F7]", image: images.washingMachine },
  { id: 2, title: "Refrigerators", bgColor: "bg-white", borderColor: "border-[#D1E8F7]", image: images.refrigerator },
  { id: 3, title: "Air Conditioners", bgColor: "bg-white", borderColor: "border-[#D1E8F7]", image: images.airConditioner },
  { id: 4, title: "Inverters/ Generators", bgColor: "bg-[#F4F9FD]", borderColor: "border-[#D1E8F7]", image: images.generator },
  { id: 5, title: "Small Appliances", bgColor: "bg-[#F4F9FD]", borderColor: "border-[#D1E8F7]", image: images.smallAppliances },
  { id: 6, title: "Cooking Appliances", bgColor: "bg-white", borderColor: "border-[#D1E8F7]", image: images.cookingAppliances },
  { id: 7, title: "Internet/ Phone", bgColor: "bg-white", borderColor: "border-[#D1E8F7]", image: images.internetRouter },
];

const BANNERS = [
  {
    id: 1,
    title: "Ship your interstate or international packages on Skilled4U",
    buttonText: "Click here to start",
    image: images.deliveryTrucks,
    bgColor: "bg-[#0A58FF]",
    buttonColor: "bg-[#030950]"
  },
  {
    id: 2,
    title: "Get 20% off on all AC installations this weekend!",
    buttonText: "Book now",
    image: images.airConditioner,
    bgColor: "bg-[#0F2846]",
    buttonColor: "bg-[#00B7FF]"
  }
];

export default function MarketScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndexRef.current + 1;
      if (nextIndex >= BANNERS.length) {
        nextIndex = 0;
      }
      currentIndexRef.current = nextIndex;
      
      scrollViewRef.current?.scrollTo({
        x: nextIndex * (BANNER_WIDTH + 16),
        animated: true,
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    currentIndexRef.current = Math.round(contentOffsetX / (BANNER_WIDTH + 16));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "left", "right"]}>
      {/* Header Banner */}
      <View className="bg-[#0F2846] w-full pt-8 pb-6 px-4">
        <Text className="text-white text-xl font-bold text-center">
          Welcome to <Text className="text-[#00B7FF]">Skilled4U</Text> marketplace!
        </Text>
      </View>
      {/* Small blue line under banner */}
      <View className="bg-[#00B7FF] h-1 w-full" />

      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xl font-bold text-[#0F2846] mb-4">Categories</Text>
        
        <View className="flex-row flex-wrap justify-between">
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              className={`w-[48%] h-36 rounded-xl border ${cat.borderColor} ${cat.bgColor} p-3 mb-4 flex-col justify-between overflow-hidden`}
              activeOpacity={0.7}
            >
              <Text className="text-[#0F2846] font-semibold text-sm">{cat.title}</Text>
              
              <Image 
                source={cat.image} 
                className="w-16 h-16 self-end mt-auto rounded-md" 
                resizeMode="contain" 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Banners Slider */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={BANNER_WIDTH + 16} // Width + margin
          decelerationRate="fast"
          onMomentumScrollEnd={handleScrollEnd}
          className="mt-2 -mx-4 px-4"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {BANNERS.map((banner) => (
            <TouchableOpacity 
              key={banner.id}
              style={{ width: BANNER_WIDTH }}
              className={`rounded-xl p-4 flex-row items-center justify-between overflow-hidden mr-4 ${banner.bgColor}`}
              activeOpacity={0.9}
            >
              <View className="flex-1 mr-2 z-10">
                <Text className="text-white font-bold text-base mb-4 leading-5">
                  {banner.title}
                </Text>
                <View className={`rounded-full px-4 py-2 self-start ${banner.buttonColor}`}>
                  <Text className="text-white text-xs font-semibold">{banner.buttonText}</Text>
                </View>
              </View>
              
              <Image 
                source={banner.image} 
                className="w-32 h-24 absolute right-0 bottom-0 z-0" 
                resizeMode="cover" 
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
