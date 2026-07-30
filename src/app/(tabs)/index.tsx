import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { HomeHeader } from "../../components/home/HomeHeader";
import { HomeBanner } from "../../components/home/HomeBanner";
import { SearchAndWallet } from "../../components/home/SearchAndWallet";
import { ServiceCategoryCard } from "../../components/home/ServiceCategoryCard";
import { SectionHeader } from "../../components/home/SectionHeader";
import { ProductDeals } from "../../components/home/ProductDeals";
import { SpecialPromos } from "../../components/home/SpecialPromos";
import { TrendingProducts } from "../../components/home/TrendingProducts";
import { EliteProviders } from "../../components/home/EliteProviders";
import { OurPartners } from "../../components/home/OurPartners";
import { POPULAR_CATEGORIES, Category } from "../../data/categories";
import { ServiceSelectionModal } from "../../components/home/ServiceSelectionModal";

export default function TabsIndex() {
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category);
    setIsModalVisible(true);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "left", "right"]}>
      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader 
          locationTitle="968 Idris Gidado St, Abuja"
          onEditLocation={() => console.log("Edit location")}
          onNotificationPress={() => console.log("Notifications")}
        />

        <HomeBanner />
        <SearchAndWallet />

        <SectionHeader title="Popular" onSeeAll={() => router.push('/all-services')} />
        <View className="flex-row flex-wrap justify-between mb-2">
          {POPULAR_CATEGORIES.map((category) => (
            <ServiceCategoryCard
              key={category.id}
              title={category.title}
              iconName={category.iconName}
              iconFamily={category.iconFamily}
              onPress={() => handleCategoryPress(category)}
            />
          ))}
        </View>

        <SectionHeader title="Deals of the Week" onSeeAll={() => console.log("See All Deals")} />
        <ProductDeals />

        <SectionHeader title="Special Promos" onSeeAll={() => console.log("See All Promos")} />
        <SpecialPromos />

        <SectionHeader title="Trending Products" onSeeAll={() => console.log("See All Trending")} />
        <TrendingProducts />

        <SectionHeader title="Elite Providers" onSeeAll={() => console.log("See All Providers")} />
        <EliteProviders />

        <SectionHeader title="Our Partners" showSeeAll={false} />
        <OurPartners />

      </ScrollView>

      <ServiceSelectionModal
        isVisible={isModalVisible}
        category={selectedCategory}
        onClose={() => setIsModalVisible(false)}
        onGoPress={(services) => {
          console.log(`Selected services for ${selectedCategory?.title}:`, services);
        }}
      />
    </SafeAreaView>
  );
}
