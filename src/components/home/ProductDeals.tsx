import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { PRODUCT_DEALS } from "../../data/homeSections";

export function ProductDeals() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 pl-1 pt-1 pb-2">
      {PRODUCT_DEALS.map((deal) => (
        <TouchableOpacity
          key={deal.id}
          className="mr-4 bg-white rounded-2xl"
          style={{
            width: 200,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            zIndex: 10,
          }}
        >
          <View className="rounded-t-2xl overflow-hidden">
            <Image source={deal.image} style={{ width: "100%", height: 120 }} resizeMode="cover" />
          </View>
          <View className="p-3">
            <Text className="text-sm font-bold text-neutral-800" style={{ fontFamily: "Poppins-SemiBold" }}>
              {deal.title}
            </Text>
            <View className="flex-row items-center justify-between mt-2">
              <Text className="text-primary font-bold text-base">{deal.price}</Text>
              <View className="bg-red-100 px-2 py-1 rounded">
                <Text className="text-red-500 text-xs font-bold">{deal.discount}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
